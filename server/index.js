const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const SERVER_CONFIG = require('./config');
require('dotenv').config();

const app = express();
const PORT = SERVER_CONFIG.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool(SERVER_CONFIG.DB_CONFIG);

// JWT secret
const JWT_SECRET = SERVER_CONFIG.JWT_SECRET;

// Database initialization
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        date_of_birth DATE,
        address TEXT,
        profile_image_url TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        user_type VARCHAR(20) DEFAULT 'tenant' CHECK (user_type IN ('tenant', 'landlord', 'admin')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create user_sessions table for JWT blacklisting
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create premises table
    await client.query(`
      CREATE TABLE IF NOT EXISTS premises (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(50) NOT NULL,
        zip_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) DEFAULT 'USA',
        property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('apartment', 'house', 'condo', 'townhouse', 'duplex', 'studio')),
        total_units INTEGER,
        year_built INTEGER,
        amenities TEXT[],
        description TEXT,
        lessor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create rental_units table
    await client.query(`
      CREATE TABLE IF NOT EXISTS rental_units (
        id SERIAL PRIMARY KEY,
        unit_number VARCHAR(50) NOT NULL,
        premises_id INTEGER REFERENCES premises(id) ON DELETE CASCADE,
        unit_type VARCHAR(50) NOT NULL CHECK (unit_type IN ('studio', '1BR', '2BR', '3BR', '4BR+')),
        square_feet INTEGER,
        bedrooms INTEGER,
        bathrooms DECIMAL(3,1),
        floor_number INTEGER,
        rent_amount DECIMAL(10,2) NOT NULL,
        security_deposit DECIMAL(10,2),
        utilities_included BOOLEAN DEFAULT FALSE,
        available_from DATE,
        is_available BOOLEAN DEFAULT TRUE,
        features TEXT[],
        images TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(premises_id, unit_number)
      )
    `);

    // Create leases table
    await client.query(`
      CREATE TABLE IF NOT EXISTS leases (
        id SERIAL PRIMARY KEY,
        rental_unit_id INTEGER REFERENCES rental_units(id) ON DELETE CASCADE,
        lessor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        lessee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        monthly_rent DECIMAL(10,2) NOT NULL,
        security_deposit DECIMAL(10,2),
        lease_status VARCHAR(20) DEFAULT 'active' CHECK (lease_status IN ('draft', 'active', 'expired', 'terminated')),
        terms_conditions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CHECK (end_date > start_date)
      )
    `);

    // Create rental_listings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS rental_listings (
        id SERIAL PRIMARY KEY,
        rental_unit_id INTEGER REFERENCES rental_units(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        monthly_rent DECIMAL(10,2) NOT NULL,
        available_from DATE,
        listing_status VARCHAR(20) DEFAULT 'active' CHECK (listing_status IN ('draft', 'active', 'pending', 'rented', 'inactive')),
        featured BOOLEAN DEFAULT FALSE,
        views_count INTEGER DEFAULT 0,
        contact_phone VARCHAR(20),
        contact_email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    client.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // Check if token is blacklisted
    const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex');
    const sessionCheck = await pool.query(
      'SELECT * FROM user_sessions WHERE token_hash = $1 AND expires_at > NOW()',
      [tokenHash]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Routes

// User registration
app.post('/api/auth/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('phone').optional().isMobilePhone(),
  body('dateOfBirth').optional().isISO8601(),
  body('address').optional().trim(),
  body('userType').optional().isIn(['tenant', 'landlord', 'admin']),
  body('organizationName').optional().trim(),
  body('organizationSlug').optional().trim(),
  body('organizationEmail').optional().isEmail(),
  body('organizationPhone').optional(),
  body('organizationAddress').optional().trim(),
  body('organizationCity').optional().trim(),
  body('organizationState').optional().trim(),
  body('organizationZipCode').optional().trim(),
  body('organizationWebsite').optional().isURL(),
  body('organizationDescription').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      email, password, firstName, lastName, phone, dateOfBirth, address, userType,
      organizationName, organizationSlug, organizationEmail, organizationPhone,
      organizationAddress, organizationCity, organizationState, organizationZipCode,
      organizationWebsite, organizationDescription
    } = req.body;

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // If landlord is creating an organization, validate organization data
    if (userType === 'landlord' && organizationName && organizationSlug) {
      // Check if organization slug already exists
      const existingOrg = await pool.query(
        'SELECT id FROM organizations WHERE slug = $1',
        [organizationSlug]
      );

      if (existingOrg.rows.length > 0) {
        return res.status(400).json({ error: 'Organization slug already exists' });
      }
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    let organizationId = null;
    let isOrgAdmin = false;

    // Create organization if landlord is registering with organization
    if (userType === 'landlord' && organizationName && organizationSlug) {
      const newOrg = await pool.query(`
        INSERT INTO organizations (name, slug, email, phone, address, city, state, zip_code, website, description, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        RETURNING id
      `, [
        organizationName, organizationSlug, organizationEmail || email, organizationPhone,
        organizationAddress, organizationCity, organizationState, organizationZipCode,
        organizationWebsite, organizationDescription
      ]);
      
      organizationId = newOrg.rows[0].id;
      isOrgAdmin = true; // First landlord in organization is admin
    }

    // Insert new user
    const newUser = await pool.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, date_of_birth, address, user_type, organization_id, is_organization_admin)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, email, first_name, last_name, phone, date_of_birth, address, user_type, organization_id, is_organization_admin, created_at
    `, [email, passwordHash, firstName, lastName, phone, dateOfBirth, address, userType || 'tenant', organizationId, isOrgAdmin]);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.rows[0].id, email: newUser.rows[0].email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.rows[0],
      organization: organizationId ? { id: organizationId, name: organizationName, slug: organizationSlug } : null,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.rows[0].id, email: user.rows[0].email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Store token hash in sessions
    const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex');
    await pool.query(
      'INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.rows[0].id, tokenHash, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    );

    const { password_hash, ...userWithoutPassword } = user.rows[0];
    
    // Get organization information if user belongs to one
    let organization = null;
    if (userWithoutPassword.organization_id) {
      const orgResult = await pool.query(
        'SELECT id, name, slug, subscription_plan FROM organizations WHERE id = $1',
        [userWithoutPassword.organization_id]
      );
      if (orgResult.rows.length > 0) {
        organization = orgResult.rows[0];
      }
    }
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      organization,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User logout
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    const tokenHash = require('crypto').createHash('sha256').update(req.headers['authorization'].split(' ')[1]).digest('hex');
    
    await pool.query(
      'DELETE FROM user_sessions WHERE token_hash = $1',
      [tokenHash]
    );

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, email, first_name, last_name, phone, date_of_birth, address, profile_image_url, is_verified, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: user.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, [
  body('firstName').optional().notEmpty().trim(),
  body('lastName').optional().notEmpty().trim(),
  body('phone').optional().isMobilePhone(),
  body('dateOfBirth').optional().isISO8601(),
  body('address').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, phone, dateOfBirth, address } = req.body;
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (firstName) {
      updateFields.push(`first_name = $${paramCount}`);
      values.push(firstName);
      paramCount++;
    }
    if (lastName) {
      updateFields.push(`last_name = $${paramCount}`);
      values.push(lastName);
      paramCount++;
    }
    if (phone) {
      updateFields.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
    }
    if (dateOfBirth) {
      updateFields.push(`date_of_birth = $${paramCount}`);
      values.push(dateOfBirth);
      paramCount++;
    }
    if (address) {
      updateFields.push(`address = $${paramCount}`);
      values.push(address);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.user.userId);

    const updatedUser = await pool.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING id, email, first_name, last_name, phone, date_of_birth, address, profile_image_url, is_verified, updated_at`,
      values
    );

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
app.put('/api/user/change-password', authenticateToken, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // Get current user
    const user = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.rows[0].password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, req.user.userId]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Organization endpoints
app.post('/api/organizations', [
  body('name').notEmpty().withMessage('Organization name is required'),
  body('slug').notEmpty().withMessage('Organization slug is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional(),
  body('address').optional(),
  body('city').optional(),
  body('state').optional(),
  body('zip_code').optional(),
  body('website').optional().isURL().withMessage('Valid website URL is required'),
  body('description').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: 'Request failed with status code 400',
        errors: errors.array()
      });
    }

    const {
      name, slug, email, phone, address, city, state, zip_code, website, description
    } = req.body;

    // Check if organization slug already exists
    const existingOrg = await pool.query(
      'SELECT id FROM organizations WHERE slug = $1',
      [slug]
    );

    if (existingOrg.rows.length > 0) {
      return res.status(400).json({
        status: 400,
        message: 'Organization slug already exists'
      });
    }

    // Create organization
    const result = await pool.query(`
      INSERT INTO organizations (name, slug, email, phone, address, city, state, zip_code, website, description, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *
    `, [name, slug, email, phone, address, city, state, zip_code, website, description]);

    res.status(201).json({
      status: 201,
      message: 'Organization created successfully',
      organization: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

app.get('/api/organizations/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(`
      SELECT * FROM organizations WHERE slug = $1 AND is_active = true
    `, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Organization not found'
      });
    }

    res.json({
      status: 200,
      organization: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

app.put('/api/organizations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if user is organization admin
    const userCheck = await pool.query(`
      SELECT organization_id, is_organization_admin FROM users WHERE id = $1
    `, [userId]);

    if (userCheck.rows.length === 0 || !userCheck.rows[0].is_organization_admin) {
      return res.status(403).json({
        status: 403,
        message: 'Access denied. Only organization admins can update organization details.'
      });
    }

    const {
      name, description, phone, address, city, state, zip_code, website
    } = req.body;

    const result = await pool.query(`
      UPDATE organizations 
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          phone = COALESCE($3, phone),
          address = COALESCE($4, address),
          city = COALESCE($5, city),
          state = COALESCE($6, state),
          zip_code = COALESCE($7, zip_code),
          website = COALESCE($8, website),
          updated_at = NOW()
      WHERE id = $9 AND is_active = true
      RETURNING *
    `, [name, description, phone, address, city, state, zip_code, website, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 400,
        message: 'Organization not found'
      });
    }
    res.json({
      status: 200,
      message: 'Organization updated successfully',
      organization: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

// Messaging endpoints
app.get('/api/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get all conversations where user is a participant
    const conversations = await pool.query(`
      SELECT 
        c.id, c.conversation_type, c.title, c.created_at, c.updated_at,
        COUNT(m.id) as message_count,
        MAX(m.created_at) as last_message_at,
        CASE 
          WHEN MAX(m.created_at) IS NOT NULL THEN (
            SELECT content FROM messages 
            WHERE conversation_id = c.id 
            ORDER BY created_at DESC 
            LIMIT 1
          )
          ELSE NULL
        END as last_message_content,
        CASE 
          WHEN MAX(m.created_at) IS NOT NULL THEN (
            SELECT first_name FROM users 
            WHERE id = (
              SELECT sender_id FROM messages 
              WHERE conversation_id = c.id 
              ORDER BY created_at DESC 
              LIMIT 1
            )
          )
          ELSE NULL
        END as last_message_sender
      FROM conversations c
      INNER JOIN conversation_participants cp ON c.id = cp.conversation_id
      LEFT JOIN messages m ON c.id = m.conversation_id
      WHERE cp.user_id = $1 AND cp.is_active = true
      GROUP BY c.id, c.conversation_type, c.title, c.created_at, c.updated_at
      ORDER BY c.updated_at DESC
    `, [userId]);

    res.json({
      status: 200,
      conversations: conversations.rows
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

app.post('/api/conversations', authenticateToken, [
  body('conversation_type').isIn(['general', 'lease_related', 'maintenance', 'payment']),
  body('title').notEmpty().trim(),
  body('participant_ids').isArray({ min: 1 }),
  body('initial_message').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: 'Request failed with status code 400',
        errors: errors.array()
      });
    }

    const { conversation_type, title, participant_ids, initial_message } = req.body;
    const userId = req.user.userId;

    // Check if user is authorized to create conversations
    const userCheck = await pool.query(`
      SELECT user_type FROM users WHERE id = $1
    `, [userId]);

    if (userCheck.rows.length === 0) {
      return res.status(403).json({
        status: 403,
        message: 'User not found'
      });
    }

    // Create conversation
    const conversation = await pool.query(`
      INSERT INTO conversations (conversation_type, title, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING *
    `, [conversation_type, title]);

    const conversationId = conversation.rows[0].id;

    // Add participants (including the creator)
    const allParticipantIds = [...new Set([userId, ...participant_ids])];
    
    for (const participantId of allParticipantIds) {
      // Get user type for role
      const participantUser = await pool.query(`
        SELECT user_type FROM users WHERE id = $1
      `, [participantId]);

      if (participantUser.rows.length > 0) {
        await pool.query(`
          INSERT INTO conversation_participants (conversation_id, user_id, role, created_at)
          VALUES ($1, $2, $3, NOW())
        `, [conversationId, participantId, participantUser.rows[0].user_type]);
      }
    }

    // Add initial message if provided
    if (initial_message) {
      await pool.query(`
        INSERT INTO messages (conversation_id, sender_id, message_type, content, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
      `, [conversationId, userId, 'text', initial_message]);
    }

    res.status(201).json({
      status: 201,
      message: 'Conversation created successfully',
      conversation: {
        ...conversation.rows[0],
        participant_count: allParticipantIds.length
      }
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

app.get('/api/conversations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if user is a participant in this conversation
    const participantCheck = await pool.query(`
      SELECT cp.*, c.* FROM conversation_participants cp
      INNER JOIN conversations c ON cp.conversation_id = c.id
      WHERE cp.conversation_id = $1 AND cp.user_id = $2 AND cp.is_active = true
    `, [id, userId]);

    if (participantCheck.rows.length === 0) {
      return res.status(403).json({
        status: 403,
        message: 'Access denied. You are not a participant in this conversation.'
      });
    }

    // Get conversation details with participants
    const participants = await pool.query(`
      SELECT cp.*, u.first_name, u.last_name, u.email, u.user_type
      FROM conversation_participants cp
      INNER JOIN users u ON cp.user_id = u.id
      WHERE cp.conversation_id = $1 AND cp.is_active = true
      ORDER BY cp.joined_at
    `, [id]);

    res.json({
      status: 200,
      conversation: participantCheck.rows[0],
      participants: participants.rows
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

app.get('/api/conversations/:id/messages', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.userId;
    const offset = (page - 1) * limit;

    // Check if user is a participant in this conversation
    const participantCheck = await pool.query(`
      SELECT id FROM conversation_participants 
      WHERE conversation_id = $1 AND user_id = $2 AND is_active = true
    `, [id, userId]);

    if (participantCheck.rows.length === 0) {
      return res.status(403).json({
        status: 403,
        message: 'Access denied. You are not a participant in this conversation.'
      });
    }

    // Get messages
    const messages = await pool.query(`
      SELECT m.*, u.first_name, u.last_name, u.user_type
      FROM messages m
      INNER JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at DESC
      LIMIT $2 OFFSET $3
    `, [id, limit, offset]);

    // Get total message count
    const totalCount = await pool.query(`
      SELECT COUNT(*) FROM messages WHERE conversation_id = $1
    `, [id]);

    // Mark messages as read for this user
    await pool.query(`
      UPDATE messages 
      SET is_read = true 
      WHERE conversation_id = $1 AND sender_id != $2 AND is_read = false
    `, [id, userId]);

    res.json({
      status: 200,
      messages: messages.rows.reverse(), // Show oldest first
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.rows[0].count),
        pages: Math.ceil(totalCount.rows[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

app.post('/api/conversations/:id/messages', authenticateToken, [
  body('content').notEmpty().trim(),
  body('message_type').optional().isIn(['text', 'image', 'document', 'system']),
  body('attachment_url').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: 'Request failed with status code 400',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { content, message_type = 'text', attachment_url } = req.body;
    const userId = req.user.userId;

    // Check if user is a participant in this conversation
    const participantCheck = await pool.query(`
      SELECT id FROM conversation_participants 
      WHERE conversation_id = $1 AND user_id = $2 AND is_active = true
    `, [id, userId]);

    if (participantCheck.rows.length === 0) {
      return res.status(403).json({
        status: 403,
        message: 'Access denied. You are not a participant in this conversation.'
      });
    }

    // Create message
    const message = await pool.query(`
      INSERT INTO messages (conversation_id, sender_id, message_type, content, attachment_url, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `, [id, userId, message_type, content, attachment_url]);

    // Update conversation timestamp
    await pool.query(`
      UPDATE conversations 
      SET updated_at = NOW() 
      WHERE id = $1
    `, [id]);

    // Get sender info
    const sender = await pool.query(`
      SELECT first_name, last_name, user_type FROM users WHERE id = $1
    `, [userId]);

    res.status(201).json({
      status: 201,
      message: 'Message sent successfully',
      message: {
        ...message.rows[0],
        sender_first_name: sender.rows[0].first_name,
        sender_last_name: sender.rows[0].last_name,
        sender_user_type: sender.rows[0].user_type
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

// Maintenance Request endpoints
app.post('/api/maintenance-requests', authenticateToken, [
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('request_type').isIn(['urgent', 'routine', 'emergency', 'preventive']),
  body('priority').isIn(['low', 'medium', 'high', 'critical']),
  body('premises_id').isInt({ min: 1 }),
  body('rental_unit_id').optional().isInt({ min: 1 }),
  body('estimated_cost').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: 'Request failed with status code 400',
        errors: errors.array()
      });
    }

    const {
      title, description, request_type, priority, premises_id, rental_unit_id, estimated_cost
    } = req.body;
    const userId = req.user.userId;

    // Verify user is a tenant or landlord and has access to the premises
    const userCheck = await pool.query(`
      SELECT user_type, organization_id FROM users WHERE id = $1
    `, [userId]);

    if (userCheck.rows.length === 0 || !['tenant', 'landlord'].includes(userCheck.rows[0].user_type)) {
      return res.status(403).json({
        status: 403,
        message: 'Only tenants and landlords can create maintenance requests'
      });
    }

    const userType = userCheck.rows[0].user_type;
    const userOrganizationId = userCheck.rows[0].organization_id;

    // Get premises details and verify access
    const premisesCheck = await pool.query(`
      SELECT p.lessor_id, p.organization_id, p.name as premises_name
      FROM premises p
      WHERE p.id = $1
    `, [premises_id]);

    if (premisesCheck.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Premises not found'
      });
    }

    const premises = premisesCheck.rows[0];
    const landlordId = premises.lessor_id;
    const premisesOrganizationId = premises.organization_id;

    // Verify user has access to this premises
    if (userType === 'landlord') {
      if (userOrganizationId !== premisesOrganizationId) {
        return res.status(403).json({
          status: 403,
          message: 'You can only create maintenance requests for properties in your organization'
        });
      }
      // For landlord-created requests, set tenant_id to null initially
      // They can assign a tenant later if needed
    } else if (userType === 'tenant') {
      // For tenant-created requests, verify they have access to the premises
      // This could be enhanced with lease verification in the future
    }

    // Create maintenance request
    const result = await pool.query(`
      INSERT INTO maintenance_requests (
        title, description, request_type, priority, status, premises_id, rental_unit_id,
        tenant_id, landlord_id, estimated_cost, requested_date, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7, $8, $9, NOW(), NOW(), NOW())
      RETURNING *
    `, [
      title, 
      description, 
      request_type, 
      priority, 
      premises_id, 
      rental_unit_id, 
      userType === 'tenant' ? userId : null, // tenant_id
      userType === 'landlord' ? userId : landlordId, // landlord_id
      estimated_cost
    ]);

    res.status(201).json({
      status: 201,
      message: 'Maintenance request created successfully',
      maintenance_request: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating maintenance request:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

app.get('/api/maintenance-requests', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, request_type, priority, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get user type to determine what requests they can see
    const userCheck = await pool.query(`
      SELECT user_type, organization_id FROM users WHERE id = $1
    `, [userId]);

    if (userCheck.rows.length === 0) {
      return res.status(403).json({
        status: 403,
        message: 'User not found'
      });
    }

    const userType = userCheck.rows[0].user_type;
    const organizationId = userCheck.rows[0].organization_id;

    let whereClause = '';
    const values = [];
    let paramCount = 1;

    if (userType === 'tenant') {
      whereClause = 'WHERE mr.tenant_id = $1';
      values.push(userId);
      paramCount++;
    } else if (userType === 'landlord') {
      // Landlords can see all requests for properties in their organization
      whereClause = 'WHERE p.organization_id = $1';
      values.push(organizationId);
      paramCount++;
    } else if (userType === 'workman') {
      whereClause = 'WHERE mwo.workman_id = $1';
      values.push(userId);
      paramCount++;
    }

    if (status) {
      whereClause += whereClause ? ' AND' : 'WHERE';
      whereClause += ` mr.status = $${paramCount}`;
      values.push(status);
      paramCount++;
    }

    if (request_type) {
      whereClause += whereClause ? ' AND' : 'WHERE';
      whereClause += ` mr.request_type = $${paramCount}`;
      values.push(request_type);
      paramCount++;
    }

    if (priority) {
      whereClause += whereClause ? ' AND' : 'WHERE';
      whereClause += ` mr.priority = $${paramCount}`;
      values.push(priority);
      paramCount++;
    }

    const query = `
      SELECT 
        mr.*,
        p.name as premises_name,
        p.address as premises_address,
        ru.unit_number,
        t.first_name as tenant_first_name,
        t.last_name as tenant_last_name,
        l.first_name as landlord_first_name,
        l.last_name as landlord_last_name,
        mwo.work_order_number,
        mwo.status as work_order_status,
        mwo.workman_id,
        w.first_name as workman_first_name,
        w.last_name as workman_last_name
      FROM maintenance_requests mr
      INNER JOIN premises p ON mr.premises_id = p.id
      LEFT JOIN rental_units ru ON mr.rental_unit_id = ru.id
      LEFT JOIN users t ON mr.tenant_id = t.id
      LEFT JOIN users l ON mr.landlord_id = l.id
      LEFT JOIN maintenance_work_orders mwo ON mr.id = mwo.maintenance_request_id
      LEFT JOIN users w ON mwo.workman_id = w.id
      ${whereClause}
      ORDER BY 
        CASE 
          WHEN mr.priority = 'critical' THEN 1
          WHEN mr.priority = 'high' THEN 2
          WHEN mr.priority = 'medium' THEN 3
          WHEN mr.priority = 'low' THEN 4
        END,
        mr.requested_date DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const maintenanceRequests = await pool.query(query, [...values, limit, offset]);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) FROM maintenance_requests mr
      INNER JOIN premises p ON mr.premises_id = p.id
      LEFT JOIN maintenance_work_orders mwo ON mr.id = mwo.maintenance_request_id
      ${whereClause}
    `;
    const totalCount = await pool.query(countQuery, values);

    res.json({
      status: 200,
      maintenance_requests: maintenanceRequests.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.rows[0].count),
        pages: Math.ceil(totalCount.rows[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

app.get('/api/maintenance-requests/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Get maintenance request with all related data
    const result = await pool.query(`
      SELECT 
        mr.*,
        p.name as premises_name,
        p.address as premises_address,
        ru.unit_number,
        t.first_name as tenant_first_name,
        t.last_name as tenant_last_name,
        t.email as tenant_email,
        t.phone as tenant_phone,
        l.first_name as landlord_first_name,
        l.last_name as landlord_last_name,
        l.email as landlord_email,
        l.phone as landlord_phone
      FROM maintenance_requests mr
      INNER JOIN premises p ON mr.premises_id = p.id
      LEFT JOIN rental_units ru ON mr.rental_unit_id = ru.id
      INNER JOIN users t ON mr.tenant_id = t.id
      INNER JOIN users l ON mr.landlord_id = l.id
      WHERE mr.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Maintenance request not found'
      });
    }

    const maintenanceRequest = result.rows[0];

    // Check if user has access to this request
    const userCheck = await pool.query(`
      SELECT user_type FROM users WHERE id = $1
    `, [userId]);

    if (userCheck.rows.length === 0) {
      return res.status(403).json({
        status: 403,
        message: 'User not found'
      });
    }

    const userType = userCheck.rows[0].user_type;
    const hasAccess = 
      userType === 'admin' ||
      maintenanceRequest.tenant_id === userId ||
      maintenanceRequest.landlord_id === userId ||
      (userType === 'workman' && await pool.query(`
        SELECT id FROM maintenance_work_orders 
        WHERE maintenance_request_id = $1 AND workman_id = $2
      `, [id, userId]).then(r => r.rows.length > 0));

    if (!hasAccess) {
      return res.status(403).json({
        status: 403,
        message: 'Access denied to this maintenance request'
      });
    }

    // Get work orders
    const workOrders = await pool.query(`
      SELECT 
        mwo.*,
        w.first_name as workman_first_name,
        w.last_name as workman_last_name,
        w.email as workman_email,
        w.phone as workman_phone
      FROM maintenance_work_orders mwo
      INNER JOIN users w ON mwo.workman_id = w.id
      WHERE mwo.maintenance_request_id = $1
      ORDER BY mwo.created_at DESC
    `, [id]);

    // Get approvals
    const approvals = await pool.query(`
      SELECT 
        ma.*,
        u.first_name as approver_first_name,
        u.last_name as approver_last_name
      FROM maintenance_approvals ma
      INNER JOIN users u ON ma.approver_id = u.id
      WHERE ma.maintenance_request_id = $1
      ORDER BY ma.created_at DESC
    `, [id]);

    res.json({
      status: 200,
      maintenance_request: maintenanceRequest,
      work_orders: workOrders.rows,
      approvals: approvals.rows
    });
  } catch (error) {
    console.error('Error fetching maintenance request:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

app.put('/api/maintenance-requests/:id/approve', authenticateToken, [
  body('status').isIn(['approved', 'rejected']),
  body('comments').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: 'Request failed with status code 400',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status, comments } = req.body;
    const userId = req.user.userId;

    // Check if user is landlord or admin
    const userCheck = await pool.query(`
      SELECT user_type FROM users WHERE id = $1
    `, [userId]);

    if (userCheck.rows.length === 0 || !['landlord', 'admin'].includes(userCheck.rows[0].user_type)) {
      return res.status(403).json({
        status: 403,
        message: 'Only landlords and admins can approve maintenance requests'
      });
    }

    // Get maintenance request
    const requestCheck = await pool.query(`
      SELECT landlord_id, status FROM maintenance_requests WHERE id = $1
    `, [id]);

    if (requestCheck.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Maintenance request not found'
      });
    }

    const request = requestCheck.rows[0];

    // Check if user is the landlord for this request
    if (userCheck.rows[0].user_type === 'landlord' && request.landlord_id !== userId) {
      return res.status(403).json({
        status: 403,
        message: 'You can only approve maintenance requests for your properties'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        status: 400,
        message: 'Can only approve pending maintenance requests'
      });
    }

    // Update maintenance request status
    const newStatus = status === 'approved' ? 'approved' : 'rejected';
    await pool.query(`
      UPDATE maintenance_requests 
      SET status = $1, approved_date = $2, updated_at = NOW()
      WHERE id = $3
    `, [newStatus, status === 'approved' ? new Date() : null, id]);

    // Create approval record
    await pool.query(`
      INSERT INTO maintenance_approvals (
        maintenance_request_id, approver_id, approval_type, status, comments, approved_at, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `, [id, userId, userCheck.rows[0].user_type, status, comments, status === 'approved' ? new Date() : null]);

    res.json({
      status: 200,
      message: `Maintenance request ${status} successfully`,
      new_status: newStatus
    });
  } catch (error) {
    console.error('Error approving maintenance request:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

app.post('/api/maintenance-requests/:id/assign', authenticateToken, [
  body('workman_id').isInt({ min: 1 }),
  body('work_description').notEmpty().trim(),
  body('estimated_hours').isFloat({ min: 0.1 }),
  body('materials_required').optional().isArray(),
  body('special_instructions').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: 'Request failed with status code 400',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { workman_id, work_description, estimated_hours, materials_required, special_instructions } = req.body;
    const userId = req.user.userId;

    // Check if user is landlord or admin
    const userCheck = await pool.query(`
      SELECT user_type FROM users WHERE id = $1
    `, [userId]);

    if (userCheck.rows.length === 0 || !['landlord', 'admin'].includes(userCheck.rows[0].user_type)) {
      return res.status(403).json({
        status: 403,
        message: 'Only landlords and admins can assign work orders'
      });
    }

    // Get maintenance request
    const requestCheck = await pool.query(`
      SELECT landlord_id, status FROM maintenance_requests WHERE id = $1
    `, [id]);

    if (requestCheck.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Maintenance request not found'
      });
    }

    const request = requestCheck.rows[0];

    if (request.status !== 'approved') {
      return res.status(400).json({
        status: 400,
        message: 'Can only assign approved maintenance requests'
      });
    }

    // Check if workman exists and is a workman
    const workmanCheck = await pool.query(`
      SELECT user_type FROM users WHERE id = $1
    `, [workman_id]);

    if (workmanCheck.rows.length === 0 || workmanCheck.rows[0].user_type !== 'workman') {
      return res.status(400).json({
        status: 400,
        message: 'Invalid workman selected'
      });
    }

    // Generate work order number
    const workOrderNumber = `WO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    // Create work order
    const workOrder = await pool.query(`
      INSERT INTO maintenance_work_orders (
        maintenance_request_id, workman_id, work_order_number, work_description,
        estimated_hours, materials_required, special_instructions, status,
        assigned_date, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'assigned', NOW(), NOW(), NOW())
      RETURNING *
    `, [id, workman_id, workOrderNumber, work_description, estimated_hours, materials_required || [], special_instructions]);

    // Update maintenance request status
    await pool.query(`
      UPDATE maintenance_requests 
      SET status = 'assigned', assigned_date = NOW(), updated_at = NOW()
      WHERE id = $1
    `, [id]);

    res.status(201).json({
      status: 201,
      message: 'Work order assigned successfully',
      work_order: workOrder.rows[0]
    });
  } catch (error) {
    console.error('Error assigning work order:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

app.put('/api/work-orders/:id/status', authenticateToken, [
  body('status').isIn(['in_progress', 'on_hold', 'completed', 'cancelled']),
  body('notes').optional().trim(),
  body('actual_hours').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: 'Request failed with status code 400',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status, notes, actual_hours } = req.body;
    const userId = req.user.userId;

    // Get work order
    const workOrderCheck = await pool.query(`
      SELECT mwo.*, mr.status as request_status, mr.id as request_id
      FROM maintenance_work_orders mwo
      INNER JOIN maintenance_requests mr ON mwo.maintenance_request_id = mr.id
      WHERE mwo.id = $1
    `, [id]);

    if (workOrderCheck.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Work order not found'
      });
    }

    const workOrder = workOrderCheck.rows[0];

    // Check if user is the assigned workman
    if (workOrder.workman_id !== userId) {
      return res.status(403).json({
        status: 403,
        message: 'Only the assigned workman can update work order status'
      });
    }

    // Update work order
    const updateData = {
      status,
      notes: notes || workOrder.notes,
      actual_hours: actual_hours || workOrder.actual_hours,
      updated_at: new Date()
    };

    if (status === 'in_progress' && !workOrder.started_date) {
      updateData.started_date = new Date();
    } else if (status === 'completed' && !workOrder.completed_date) {
      updateData.completed_date = new Date();
    }

    const result = await pool.query(`
      UPDATE maintenance_work_orders 
      SET status = $1, notes = $2, actual_hours = $3, started_date = $4, completed_date = $5, updated_at = $6
      WHERE id = $7
      RETURNING *
    `, [updateData.status, updateData.notes, updateData.actual_hours, updateData.started_date, updateData.completed_date, updateData.updated_at, id]);

    // Update maintenance request status if work order is completed
    if (status === 'completed') {
      await pool.query(`
        UPDATE maintenance_requests 
        SET status = 'completed', completed_date = NOW(), updated_at = NOW()
        WHERE id = $1
      `, [workOrder.request_id]);
    } else if (status === 'in_progress') {
      await pool.query(`
        UPDATE maintenance_requests 
        SET status = 'in_progress', started_date = NOW(), updated_at = NOW()
        WHERE id = $1
      `, [workOrder.request_id]);
    }

    res.json({
      status: 200,
      message: 'Work order status updated successfully',
      work_order: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating work order status:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

app.post('/api/maintenance-requests/:id/rate', authenticateToken, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('feedback').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: 'Request failed with status code 400',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { rating, feedback } = req.body;
    const userId = req.user.userId;

    // Get maintenance request
    const requestCheck = await pool.query(`
      SELECT tenant_id, status FROM maintenance_requests WHERE id = $1
    `, [id]);

    if (requestCheck.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Maintenance request not found'
      });
    }

    const request = requestCheck.rows[0];

    // Check if user is the tenant who made the request
    if (request.tenant_id !== userId) {
      return res.status(403).json({
        status: 403,
        message: 'Only the tenant who made the request can rate it'
      });
    }

    if (request.status !== 'completed') {
      return res.status(400).json({
        status: 400,
        message: 'Can only rate completed maintenance requests'
      });
    }

    // Update maintenance request with rating
    await pool.query(`
      UPDATE maintenance_requests 
      SET tenant_rating = $1, tenant_feedback = $2, updated_at = NOW()
      WHERE id = $3
    `, [rating, feedback, id]);

    res.json({
      status: 200,
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

// Get premises for landlord's organization
app.get('/api/landlord/premises', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Verify user is a landlord
    const userCheck = await pool.query(`
      SELECT user_type, organization_id FROM users WHERE id = $1
    `, [userId]);

    if (userCheck.rows.length === 0 || userCheck.rows[0].user_type !== 'landlord') {
      return res.status(403).json({
        status: 403,
        message: 'Only landlords can access this endpoint'
      });
    }

    const userOrganizationId = userCheck.rows[0].organization_id;

    // Get all premises for the landlord's organization
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.address,
        p.city,
        p.state,
        p.zip_code,
        p.property_type,
        p.total_units,
        p.is_active,
        COUNT(ru.id) as total_rental_units,
        COUNT(CASE WHEN ru.is_available = true THEN 1 END) as available_units
      FROM premises p
      LEFT JOIN rental_units ru ON p.id = ru.premises_id
      WHERE p.organization_id = $1
      GROUP BY p.id, p.name, p.address, p.city, p.state, p.zip_code, p.property_type, p.total_units, p.is_active
      ORDER BY p.name
    `, [userOrganizationId]);

    res.json({
      status: 200,
      premises: result.rows
    });
  } catch (error) {
    console.error('Error fetching landlord premises:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

// Get tenants for landlord's organization
app.get('/api/landlord/tenants', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Verify user is a landlord
    const userCheck = await pool.query(`
      SELECT user_type, organization_id FROM users WHERE id = $1
    `, [userId]);

    if (userCheck.rows.length === 0 || userCheck.rows[0].user_type !== 'landlord') {
      return res.status(403).json({
        status: 403,
        message: 'Only landlords can access this endpoint'
      });
    }

    const userOrganizationId = userCheck.rows[0].organization_id;

    // Get all tenants for the landlord's organization
    const result = await pool.query(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.is_verified
      FROM users u
      WHERE u.organization_id = $1 AND u.user_type = 'tenant'
      ORDER BY u.last_name, u.first_name
    `, [userOrganizationId]);

    res.json({
      status: 200,
      tenants: result.rows
    });
  } catch (error) {
    console.error('Error fetching landlord tenants:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

// Landlord-specific maintenance request creation endpoint
app.post('/api/landlord/maintenance-requests', authenticateToken, [
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('request_type').isIn(['urgent', 'routine', 'emergency', 'preventive']),
  body('priority').isIn(['low', 'medium', 'high', 'critical']),
  body('premises_id').isInt({ min: 1 }),
  body('rental_unit_id').optional().isInt({ min: 1 }),
  body('estimated_cost').optional().isFloat({ min: 0 }),
  body('tenant_id').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: 'Request failed with status code 400',
        errors: errors.array()
      });
    }

    const {
      title, description, request_type, priority, premises_id, rental_unit_id, estimated_cost, tenant_id
    } = req.body;
    const userId = req.user.userId;

    // Verify user is a landlord
    const userCheck = await pool.query(`
      SELECT user_type, organization_id FROM users WHERE id = $1
    `, [userId]);

    if (userCheck.rows.length === 0 || userCheck.rows[0].user_type !== 'landlord') {
      return res.status(403).json({
        status: 403,
        message: 'Only landlords can create maintenance requests through this endpoint'
      });
    }

    const userOrganizationId = userCheck.rows[0].organization_id;

    // Verify premises belongs to landlord's organization
    const premisesCheck = await pool.query(`
      SELECT p.lessor_id, p.organization_id, p.name as premises_name
      FROM premises p
      WHERE p.id = $1
    `, [premises_id]);

    if (premisesCheck.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Premises not found'
      });
    }

    const premises = premisesCheck.rows[0];
    
    if (premises.organization_id !== userOrganizationId) {
      return res.status(403).json({
        status: 403,
        message: 'You can only create maintenance requests for properties in your organization'
      });
    }

    // Verify tenant belongs to the same organization if specified
    if (tenant_id) {
      const tenantCheck = await pool.query(`
        SELECT organization_id FROM users WHERE id = $1 AND user_type = 'tenant'
      `, [tenant_id]);

      if (tenantCheck.rows.length === 0) {
        return res.status(400).json({
          status: 400,
          message: 'Invalid tenant specified'
        });
      }
    }

    // Create maintenance request
    const result = await pool.query(`
      INSERT INTO maintenance_requests (
        title, description, request_type, priority, status, premises_id, rental_unit_id,
        tenant_id, landlord_id, estimated_cost, requested_date, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7, $8, $9, NOW(), NOW(), NOW())
      RETURNING *
    `, [
      title, 
      description, 
      request_type, 
      priority, 
      premises_id, 
      rental_unit_id, 
      tenant_id, // Can be null for landlord-created requests
      userId, // landlord_id
      estimated_cost
    ]);

    res.status(201).json({
      status: 201,
      message: 'Maintenance request created successfully',
      maintenance_request: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating landlord maintenance request:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Premises endpoints
app.post('/api/premises', authenticateToken, [
  body('name').notEmpty().trim(),
  body('address').notEmpty().trim(),
  body('city').notEmpty().trim(),
  body('state').notEmpty().trim(),
  body('zipCode').notEmpty().trim(),
  body('country').optional().trim(),
  body('propertyType').isIn(['apartment', 'house', 'condo', 'townhouse', 'duplex', 'studio']),
  body('totalUnits').optional().isInt({ min: 1 }),
  body('yearBuilt').optional().isInt({ min: 1800, max: new Date().getFullYear() }),
  body('amenities').optional().isArray(),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, address, city, state, zipCode, country, propertyType, totalUnits, yearBuilt, amenities, description } = req.body;

    // Get user's organization ID
    const userOrg = await pool.query(`
      SELECT organization_id FROM users WHERE id = $1
    `, [req.user.userId]);

    const organizationId = userOrg.rows[0]?.organization_id;

    const newPremises = await pool.query(`
      INSERT INTO premises (name, address, city, state, zip_code, country, property_type, total_units, year_built, amenities, description, organization_id, lessor_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [name, address, city, state, zipCode, country || 'USA', propertyType, totalUnits, yearBuilt, amenities || [], description, organizationId, req.user.userId]);

    res.status(201).json({
      message: 'Premises created successfully',
      premises: newPremises.rows[0]
    });
  } catch (error) {
    console.error('Create premises error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/premises', async (req, res) => {
  try {
    const { page = 1, limit = 10, city, state, propertyType, minPrice, maxPrice } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE p.is_active = TRUE';
    const values = [];
    let paramCount = 1;

    if (city) {
      whereClause += ` AND p.city ILIKE $${paramCount}`;
      values.push(`%${city}%`);
      paramCount++;
    }
    if (state) {
      whereClause += ` AND p.state ILIKE $${paramCount}`;
      values.push(`%${state}%`);
      paramCount++;
    }
    if (propertyType) {
      whereClause += ` AND p.property_type = $${paramCount}`;
      values.push(propertyType);
      paramCount++;
    }

    const premises = await pool.query(`
      SELECT p.*, u.first_name as lessor_name, u.email as lessor_email,
             COUNT(ru.id) as total_units,
             COUNT(CASE WHEN ru.is_available = TRUE THEN 1 END) as available_units,
             MIN(ru.rent_amount) as min_rent,
             MAX(ru.rent_amount) as max_rent
      FROM premises p
      LEFT JOIN users u ON p.lessor_id = u.id
      LEFT JOIN rental_units ru ON p.id = ru.premises_id
      ${whereClause}
      GROUP BY p.id, u.first_name, u.email
      ORDER BY p.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `, [...values, limit, offset]);

    const totalCount = await pool.query(`
      SELECT COUNT(DISTINCT p.id) FROM premises p ${whereClause}
    `, values);

    res.json({
      premises: premises.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.rows[0].count),
        pages: Math.ceil(totalCount.rows[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Get premises error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get premises for a specific organization (landlord view)
app.get('/api/organizations/:orgId/premises', authenticateToken, async (req, res) => {
  try {
    const { orgId } = req.params;
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Check if user belongs to this organization
    const userCheck = await pool.query(`
      SELECT organization_id, user_type FROM users WHERE id = $1
    `, [userId]);

    if (userCheck.rows.length === 0 || userCheck.rows[0].organization_id !== parseInt(orgId)) {
      return res.status(403).json({ error: 'Access denied. You can only view premises in your organization.' });
    }

    const premises = await pool.query(`
      SELECT p.*, u.first_name as lessor_name, u.email as lessor_email,
             COUNT(ru.id) as total_units,
             COUNT(CASE WHEN ru.is_available = TRUE THEN 1 END) as available_units,
             MIN(ru.rent_amount) as min_rent,
             MAX(ru.rent_amount) as max_rent
      FROM premises p
      LEFT JOIN users u ON p.lessor_id = u.id
      LEFT JOIN rental_units ru ON p.id = ru.premises_id
      WHERE p.organization_id = $1 AND p.is_active = TRUE
      GROUP BY p.id, u.first_name, u.email
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `, [orgId, limit, offset]);

    const totalCount = await pool.query(`
      SELECT COUNT(DISTINCT p.id) FROM premises p 
      WHERE p.organization_id = $1 AND p.is_active = TRUE
    `, [orgId]);

    res.json({
      premises: premises.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.rows[0].count),
        pages: Math.ceil(totalCount.rows[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Get organization premises error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/premises/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const premises = await pool.query(`
      SELECT p.*, u.first_name as lessor_name, u.email as lessor_email, u.phone as lessor_phone
      FROM premises p
      LEFT JOIN users u ON p.lessor_id = u.id
      WHERE p.id = $1 AND p.is_active = TRUE
    `, [id]);

    if (premises.rows.length === 0) {
      return res.status(404).json({ error: 'Premises not found' });
    }

    res.json({ premises: premises.rows[0] });
  } catch (error) {
    console.error('Get premises by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/premises/:id', authenticateToken, [
  body('name').optional().notEmpty().trim(),
  body('address').optional().notEmpty().trim(),
  body('city').optional().notEmpty().trim(),
  body('state').optional().notEmpty().trim(),
  body('zipCode').optional().notEmpty().trim(),
  body('country').optional().trim(),
  body('propertyType').optional().isIn(['apartment', 'house', 'condo', 'townhouse', 'duplex', 'studio']),
  body('totalUnits').optional().isInt({ min: 1 }),
  body('yearBuilt').optional().isInt({ min: 1800, max: new Date().getFullYear() }),
  body('amenities').optional().isArray(),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Check if user owns the premises
    const ownershipCheck = await pool.query(
      'SELECT id FROM premises WHERE id = $1 AND lessor_id = $2',
      [id, req.user.userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        const dbKey = key === 'zipCode' ? 'zip_code' : 
                     key === 'propertyType' ? 'property_type' : 
                     key === 'totalUnits' ? 'total_units' : 
                     key === 'yearBuilt' ? 'year_built' : key;
        updateFields.push(`${dbKey} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const updatedPremises = await pool.query(
      `UPDATE premises SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.json({
      message: 'Premises updated successfully',
      premises: updatedPremises.rows[0]
    });
  } catch (error) {
    console.error('Update premises error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/premises/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user owns the premises
    const ownershipCheck = await pool.query(
      'SELECT id FROM premises WHERE id = $1 AND lessor_id = $2',
      [id, req.user.userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Soft delete by setting is_active to false
    await pool.query(
      'UPDATE premises SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );

    res.json({ message: 'Premises deleted successfully' });
  } catch (error) {
    console.error('Delete premises error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rental Units endpoints
app.post('/api/rental-units', authenticateToken, [
  body('unitNumber').notEmpty().trim(),
  body('premisesId').isInt({ min: 1 }),
  body('unitType').isIn(['studio', '1BR', '2BR', '3BR', '4BR+']),
  body('squareFeet').optional().isInt({ min: 1 }),
  body('bedrooms').optional().isInt({ min: 0 }),
  body('bathrooms').optional().isFloat({ min: 0 }),
  body('floorNumber').optional().isInt({ min: 0 }),
  body('rentAmount').isFloat({ min: 0 }),
  body('securityDeposit').optional().isFloat({ min: 0 }),
  body('utilitiesIncluded').optional().isBoolean(),
  body('availableFrom').optional().isISO8601(),
  body('features').optional().isArray(),
  body('images').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { unitNumber, premisesId, unitType, squareFeet, bedrooms, bathrooms, floorNumber, rentAmount, securityDeposit, utilitiesIncluded, availableFrom, features, images } = req.body;

    // Check if user owns the premises
    const ownershipCheck = await pool.query(
      'SELECT id FROM premises WHERE id = $1 AND lessor_id = $2',
      [premisesId, req.user.userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const newUnit = await pool.query(`
      INSERT INTO rental_units (unit_number, premises_id, unit_type, square_feet, bedrooms, bathrooms, floor_number, rent_amount, security_deposit, utilities_included, available_from, features, images)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [unitNumber, premisesId, unitType, squareFeet, bedrooms, bathrooms, floorNumber, rentAmount, securityDeposit, utilitiesIncluded || false, availableFrom, features || [], images || []]);

    res.status(201).json({
      message: 'Rental unit created successfully',
      unit: newUnit.rows[0]
    });
  } catch (error) {
    console.error('Create rental unit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/rental-units', async (req, res) => {
  try {
    const { page = 1, limit = 10, premisesId, unitType, minRent, maxRent, available, city, state } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE ru.id IS NOT NULL';
    const values = [];
    let paramCount = 1;

    if (premisesId) {
      whereClause += ` AND ru.premises_id = $${paramCount}`;
      values.push(premisesId);
      paramCount++;
    }
    if (unitType) {
      whereClause += ` AND ru.unit_type = $${paramCount}`;
      values.push(unitType);
      paramCount++;
    }
    if (minRent) {
      whereClause += ` AND ru.rent_amount >= $${paramCount}`;
      values.push(parseFloat(minRent));
      paramCount++;
    }
    if (maxRent) {
      whereClause += ` AND ru.rent_amount <= $${paramCount}`;
      values.push(parseFloat(maxRent));
      paramCount++;
    }
    if (available === 'true') {
      whereClause += ` AND ru.is_available = TRUE`;
    }
    if (city) {
      whereClause += ` AND p.city ILIKE $${paramCount}`;
      values.push(`%${city}%`);
      paramCount++;
    }
    if (state) {
      whereClause += ` AND p.state ILIKE $${paramCount}`;
      values.push(`%${state}%`);
      paramCount++;
    }

    const units = await pool.query(`
      SELECT ru.*, p.name as premises_name, p.address as premises_address, p.city, p.state, p.zip_code,
             u.first_name as lessor_name, u.email as lessor_email
      FROM rental_units ru
      JOIN premises p ON ru.premises_id = p.id
      JOIN users u ON p.lessor_id = u.id
      ${whereClause}
      ORDER BY ru.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `, [...values, limit, offset]);

    const totalCount = await pool.query(`
      SELECT COUNT(*) FROM rental_units ru
      JOIN premises p ON ru.premises_id = p.id
      ${whereClause}
    `, values);

    res.json({
      units: units.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.rows[0].count),
        pages: Math.ceil(totalCount.rows[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Get rental units error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/rental-units/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const unit = await pool.query(`
      SELECT ru.*, p.name as premises_name, p.address as premises_address, p.city, p.state, p.zip_code,
             u.first_name as lessor_name, u.email as lessor_email, u.phone as lessor_phone
      FROM rental_units ru
      JOIN premises p ON ru.premises_id = p.id
      JOIN users u ON p.lessor_id = u.id
      WHERE ru.id = $1
    `, [id]);

    if (unit.rows.length === 0) {
      return res.status(404).json({ error: 'Rental unit not found' });
    }

    res.json({ unit: unit.rows[0] });
  } catch (error) {
    console.error('Get rental unit by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/rental-units/:id', authenticateToken, [
  body('unitNumber').optional().notEmpty().trim(),
  body('unitType').optional().isIn(['studio', '1BR', '2BR', '3BR', '4BR+']),
  body('squareFeet').optional().isInt({ min: 1 }),
  body('bedrooms').optional().isInt({ min: 0 }),
  body('bathrooms').optional().isFloat({ min: 0 }),
  body('floorNumber').optional().isInt({ min: 0 }),
  body('rentAmount').optional().isFloat({ min: 0 }),
  body('securityDeposit').optional().isFloat({ min: 0 }),
  body('utilitiesIncluded').optional().isBoolean(),
  body('availableFrom').optional().isISO8601(),
  body('isAvailable').optional().isBoolean(),
  body('features').optional().isArray(),
  body('images').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Check if user owns the rental unit
    const ownershipCheck = await pool.query(`
      SELECT ru.id FROM rental_units ru
      JOIN premises p ON ru.premises_id = p.id
      WHERE ru.id = $1 AND p.lessor_id = $2
    `, [id, req.user.userId]);

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        const dbKey = key === 'unitNumber' ? 'unit_number' : 
                     key === 'unitType' ? 'unit_type' : 
                     key === 'squareFeet' ? 'square_feet' : 
                     key === 'rentAmount' ? 'rent_amount' : 
                     key === 'securityDeposit' ? 'security_deposit' : 
                     key === 'utilitiesIncluded' ? 'utilities_included' : 
                     key === 'availableFrom' ? 'available_from' : 
                     key === 'isAvailable' ? 'is_available' : key;
        updateFields.push(`${dbKey} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const updatedUnit = await pool.query(
      `UPDATE rental_units SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.json({
      message: 'Rental unit updated successfully',
      unit: updatedUnit.rows[0]
    });
  } catch (error) {
    console.error('Update rental unit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/rental-units/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user owns the rental unit
    const ownershipCheck = await pool.query(`
      SELECT ru.id FROM rental_units ru
      JOIN premises p ON ru.premises_id = p.id
      WHERE ru.id = $1 AND p.lessor_id = $2
    `, [id, req.user.userId]);

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await pool.query('DELETE FROM rental_units WHERE id = $1', [id]);

    res.json({ message: 'Rental unit deleted successfully' });
  } catch (error) {
    console.error('Delete rental unit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Leases endpoints
app.post('/api/leases', authenticateToken, [
  body('rentalUnitId').isInt({ min: 1 }),
  body('lesseeId').isInt({ min: 1 }),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  body('monthlyRent').isFloat({ min: 0 }),
  body('securityDeposit').optional().isFloat({ min: 0 }),
  body('termsConditions').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rentalUnitId, lesseeId, startDate, endDate, monthlyRent, securityDeposit, termsConditions } = req.body;

    // Check if user owns the rental unit
    const ownershipCheck = await pool.query(`
      SELECT ru.id FROM rental_units ru
      JOIN premises p ON ru.premises_id = p.id
      WHERE ru.id = $1 AND p.lessor_id = $2
    `, [rentalUnitId, req.user.userId]);

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if rental unit is available
    const availabilityCheck = await pool.query(
      'SELECT is_available FROM rental_units WHERE id = $1',
      [rentalUnitId]
    );

    if (availabilityCheck.rows.length === 0 || !availabilityCheck.rows[0].is_available) {
      return res.status(400).json({ error: 'Rental unit is not available' });
    }

    // Check if dates are valid
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    const newLease = await pool.query(`
      INSERT INTO leases (rental_unit_id, lessor_id, lessee_id, start_date, end_date, monthly_rent, security_deposit, terms_conditions)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [rentalUnitId, req.user.userId, lesseeId, startDate, endDate, monthlyRent, securityDeposit, termsConditions]);

    // Update rental unit availability
    await pool.query(
      'UPDATE rental_units SET is_available = FALSE WHERE id = $1',
      [rentalUnitId]
    );

    res.status(201).json({
      message: 'Lease created successfully',
      lease: newLease.rows[0]
    });
  } catch (error) {
    console.error('Create lease error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/leases', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, role } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (status) {
      whereClause += ` AND l.lease_status = $${paramCount}`;
      values.push(status);
      paramCount++;
    }

    // Filter by user role (lessor or lessee)
    if (role === 'lessor') {
      whereClause += ` AND l.lessor_id = $${paramCount}`;
      values.push(req.user.userId);
      paramCount++;
    } else if (role === 'lessee') {
      whereClause += ` AND l.lessee_id = $${paramCount}`;
      values.push(req.user.userId);
      paramCount++;
    } else {
      // Show all leases where user is involved
      whereClause += ` AND (l.lessor_id = $${paramCount} OR l.lessee_id = $${paramCount})`;
      values.push(req.user.userId);
      paramCount++;
    }

    const leases = await pool.query(`
      SELECT l.*, 
             ru.unit_number, ru.unit_type, ru.square_feet, ru.bedrooms, ru.bathrooms,
             p.name as premises_name, p.address as premises_address, p.city, p.state,
             lessor.first_name as lessor_first_name, lessor.last_name as lessor_last_name, lessor.email as lessor_email,
             lessee.first_name as lessee_first_name, lessee.last_name as lessee_last_name, lessee.email as lessee_email
      FROM leases l
      JOIN rental_units ru ON l.rental_unit_id = ru.id
      JOIN premises p ON ru.premises_id = p.id
      JOIN users lessor ON l.lessor_id = lessor.id
      JOIN users lessee ON l.lessee_id = lessee.id
      ${whereClause}
      ORDER BY l.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `, [...values, limit, offset]);

    const totalCount = await pool.query(`
      SELECT COUNT(*) FROM leases l ${whereClause}
    `, values);

    res.json({
      leases: leases.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.rows[0].count),
        pages: Math.ceil(totalCount.rows[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Get leases error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/leases/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const lease = await pool.query(`
      SELECT l.*, 
             ru.unit_number, ru.unit_type, ru.square_feet, ru.bedrooms, ru.bathrooms,
             p.name as premises_name, p.address as premises_address, p.city, p.state,
             lessor.first_name as lessor_first_name, lessor.last_name as lessor_last_name, lessor.email as lessor_email, lessor.phone as lessor_phone,
             lessee.first_name as lessee_first_name, lessee.last_name as lessee_last_name, lessee.email as lessee_email, lessee.phone as lessee_phone
      FROM leases l
      JOIN rental_units ru ON l.rental_unit_id = ru.id
      JOIN premises p ON ru.premises_id = p.id
      JOIN users lessor ON l.lessor_id = lessor.id
      JOIN users lessee ON l.lessee_id = lessee.id
      WHERE l.id = $1
    `, [id]);

    if (lease.rows.length === 0) {
      return res.status(404).json({ error: 'Lease not found' });
    }

    // Check if user has access to this lease
    const leaseData = lease.rows[0];
    if (leaseData.lessor_id !== req.user.userId && leaseData.lessee_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ lease: leaseData });
  } catch (error) {
    console.error('Get lease by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/leases/:id', authenticateToken, [
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('monthlyRent').optional().isFloat({ min: 0 }),
  body('securityDeposit').optional().isFloat({ min: 0 }),
  body('leaseStatus').optional().isIn(['draft', 'active', 'expired', 'terminated']),
  body('termsConditions').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Check if user owns the lease
    const ownershipCheck = await pool.query(
      'SELECT id FROM leases WHERE id = $1 AND lessor_id = $2',
      [id, req.user.userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if dates are valid
    if (updateData.startDate && updateData.endDate && new Date(updateData.startDate) >= new Date(updateData.endDate)) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        const dbKey = key === 'startDate' ? 'start_date' : 
                     key === 'endDate' ? 'end_date' : 
                     key === 'monthlyRent' ? 'monthly_rent' : 
                     key === 'securityDeposit' ? 'security_deposit' : 
                     key === 'leaseStatus' ? 'lease_status' : 
                     key === 'termsConditions' ? 'terms_conditions' : key;
        updateFields.push(`${dbKey} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const updatedLease = await pool.query(
      `UPDATE leases SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.json({
      message: 'Lease updated successfully',
      lease: updatedLease.rows[0]
    });
  } catch (error) {
    console.error('Update lease error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/leases/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user owns the lease
    const ownershipCheck = await pool.query(
      'SELECT id, rental_unit_id FROM leases WHERE id = $1 AND lessor_id = $2',
      [id, req.user.userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update rental unit availability
    await pool.query(
      'UPDATE rental_units SET is_available = TRUE WHERE id = $1',
      [ownershipCheck.rows[0].rental_unit_id]
    );

    await pool.query('DELETE FROM leases WHERE id = $1', [id]);

    res.json({ message: 'Lease deleted successfully' });
  } catch (error) {
    console.error('Delete lease error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rental Listings endpoints
app.post('/api/rental-listings', authenticateToken, [
  body('rentalUnitId').isInt({ min: 1 }),
  body('title').notEmpty().trim(),
  body('description').optional().trim(),
  body('monthlyRent').isFloat({ min: 0 }),
  body('availableFrom').optional().isISO8601(),
  body('listingStatus').optional().isIn(['draft', 'active', 'pending', 'rented', 'inactive']),
  body('featured').optional().isBoolean(),
  body('contactPhone').optional().trim(),
  body('contactEmail').optional().isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rentalUnitId, title, description, monthlyRent, availableFrom, listingStatus, featured, contactPhone, contactEmail } = req.body;

    // Check if user owns the rental unit
    const ownershipCheck = await pool.query(`
      SELECT ru.id FROM rental_units ru
      JOIN premises p ON ru.premises_id = p.id
      WHERE ru.id = $1 AND p.lessor_id = $2
    `, [rentalUnitId, req.user.userId]);

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const newListing = await pool.query(`
      INSERT INTO rental_listings (rental_unit_id, title, description, monthly_rent, available_from, listing_status, featured, contact_phone, contact_email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [rentalUnitId, title, description, monthlyRent, availableFrom, listingStatus || 'draft', featured || false, contactPhone, contactEmail]);

    res.status(201).json({
      message: 'Rental listing created successfully',
      listing: newListing.rows[0]
    });
  } catch (error) {
    console.error('Create rental listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/rental-listings', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, featured, minRent, maxRent, city, state, unitType, available } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE rl.listing_status = \'active\'';
    const values = [];
    let paramCount = 1;

    if (status) {
      whereClause = whereClause.replace('rl.listing_status = \'active\'', `rl.listing_status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }
    if (featured === 'true') {
      whereClause += ` AND rl.featured = TRUE`;
    }
    if (minRent) {
      whereClause += ` AND rl.monthly_rent >= $${paramCount}`;
      values.push(parseFloat(minRent));
      paramCount++;
    }
    if (maxRent) {
      whereClause += ` AND rl.monthly_rent <= $${paramCount}`;
      values.push(parseFloat(maxRent));
      paramCount++;
    }
    if (city) {
      whereClause += ` AND p.city ILIKE $${paramCount}`;
      values.push(`%${city}%`);
      paramCount++;
    }
    if (state) {
      whereClause += ` AND p.state ILIKE $${paramCount}`;
      values.push(`%${state}%`);
      paramCount++;
    }
    if (unitType) {
      whereClause += ` AND ru.unit_type = $${paramCount}`;
      values.push(unitType);
      paramCount++;
    }
    if (available === 'true') {
      whereClause += ` AND ru.is_available = TRUE`;
    }

    const listings = await pool.query(`
      SELECT rl.*, 
             ru.unit_number, ru.unit_type, ru.square_feet, ru.bedrooms, ru.bathrooms, ru.features, ru.images,
             p.name as premises_name, p.address as premises_address, p.city, p.state, p.zip_code, p.property_type, p.amenities,
             u.first_name as lessor_name, u.email as lessor_email
      FROM rental_listings rl
      JOIN rental_units ru ON rl.rental_unit_id = ru.id
      JOIN premises p ON ru.premises_id = p.id
      JOIN users u ON p.lessor_id = u.id
      ${whereClause}
      ORDER BY rl.featured DESC, rl.views_count DESC, rl.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `, [...values, limit, offset]);

    const totalCount = await pool.query(`
      SELECT COUNT(*) FROM rental_listings rl
      JOIN rental_units ru ON rl.rental_unit_id = ru.id
      JOIN premises p ON ru.premises_id = p.id
      ${whereClause}
    `, values);

    res.json({
      listings: listings.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.rows[0].count),
        pages: Math.ceil(totalCount.rows[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Get rental listings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/rental-listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const listing = await pool.query(`
      SELECT rl.*, 
             ru.unit_number, ru.unit_type, ru.square_feet, ru.bedrooms, ru.bathrooms, ru.features, ru.images,
             p.name as premises_name, p.address as premises_address, p.city, p.state, p.zip_code, p.property_type, p.amenities,
             u.first_name as lessor_name, u.email as lessor_email, u.phone as lessor_phone
      FROM rental_listings rl
      JOIN rental_units ru ON rl.rental_unit_id = ru.id
      JOIN premises p ON ru.premises_id = p.id
      JOIN users u ON p.lessor_id = u.id
      WHERE rl.id = $1
    `, [id]);

    if (listing.rows.length === 0) {
      return res.status(404).json({ error: 'Rental listing not found' });
    }

    // Increment view count
    await pool.query(
      'UPDATE rental_listings SET views_count = views_count + 1 WHERE id = $1',
      [id]
    );

    res.json({ listing: listing.rows[0] });
  } catch (error) {
    console.error('Get rental listing by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/rental-listings/:id', authenticateToken, [
  body('title').optional().notEmpty().trim(),
  body('description').optional().trim(),
  body('monthlyRent').optional().isFloat({ min: 0 }),
  body('availableFrom').optional().isISO8601(),
  body('listingStatus').optional().isIn(['draft', 'active', 'pending', 'rented', 'inactive']),
  body('featured').optional().isBoolean(),
  body('contactPhone').optional().trim(),
  body('contactEmail').optional().isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Check if user owns the rental listing
    const ownershipCheck = await pool.query(`
      SELECT rl.id FROM rental_listings rl
      JOIN rental_units ru ON rl.rental_unit_id = ru.id
      JOIN premises p ON ru.premises_id = p.id
      WHERE rl.id = $1 AND p.lessor_id = $2
    `, [id, req.user.userId]);

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        const dbKey = key === 'monthlyRent' ? 'monthly_rent' : 
                     key === 'availableFrom' ? 'available_from' : 
                     key === 'listingStatus' ? 'listing_status' : 
                     key === 'contactPhone' ? 'contact_phone' : 
                     key === 'contactEmail' ? 'contact_email' : key;
        updateFields.push(`${dbKey} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const updatedListing = await pool.query(
      `UPDATE rental_listings SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.json({
      message: 'Rental listing updated successfully',
      listing: updatedListing.rows[0]
    });
  } catch (error) {
    console.error('Update rental listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/rental-listings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user owns the rental listing
    const ownershipCheck = await pool.query(`
      SELECT rl.id FROM rental_listings rl
      JOIN rental_units ru ON rl.rental_unit_id = ru.id
      JOIN premises p ON ru.premises_id = p.id
      WHERE rl.id = $1 AND p.lessor_id = $2
    `, [id, req.user.userId]);

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await pool.query('DELETE FROM rental_listings WHERE id = $1', [id]);

    res.json({ message: 'Rental listing deleted successfully' });
  } catch (error) {
    console.error('Delete rental listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, SERVER_CONFIG.HOST, () => {
    console.log(`🚀 ${SERVER_CONFIG.APP_NAME} Server running on port ${PORT}`);
    console.log(`📱 API available at http://localhost:${PORT}/api`);
    console.log(`🌐 Network accessible at http://0.0.0.0:${PORT}/api`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`\n📱 For mobile devices:`);
    console.log(`   - Android Emulator: http://10.0.2.2:${PORT}/api`);
    console.log(`   - iOS Simulator: http://localhost:${PORT}/api`);
    console.log(`   - Physical Device: Use your computer's IP address`);
  });
});

module.exports = app; 