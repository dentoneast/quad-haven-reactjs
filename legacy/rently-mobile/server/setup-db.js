const { Pool } = require('pg');
const SERVER_CONFIG = require('./config');
require('dotenv').config();

const pool = new Pool(SERVER_CONFIG.DB_CONFIG);

async function setupDatabase() {
  try {
    console.log('Connecting to PostgreSQL...');
    const client = await pool.connect();
    
    console.log('Creating database tables...');
    
    // Create organizations table for multi-tenancy
    await client.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        logo_url TEXT,
        website VARCHAR(255),
        phone VARCHAR(20),
        email VARCHAR(255),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(50),
        zip_code VARCHAR(20),
        country VARCHAR(100) DEFAULT 'USA',
        subscription_plan VARCHAR(50) DEFAULT 'basic',
        subscription_status VARCHAR(20) DEFAULT 'active',
        max_users INTEGER DEFAULT 10,
        max_properties INTEGER DEFAULT 50,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Organizations table created');

    // Create users table with organization support
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        date_of_birth DATE,
        address TEXT,
        profile_image_url TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
                      user_type VARCHAR(20) DEFAULT 'tenant' CHECK (user_type IN ('tenant', 'landlord', 'admin', 'workman')),
        organization_id INTEGER REFERENCES organizations(id) ON DELETE SET NULL,
        is_organization_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(organization_id, email)
      )
    `);
    console.log('✓ Users table created');

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
    console.log('✓ User sessions table created');

    // Create premises table with organization support
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
        organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
        lessor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Premises table created');

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
    console.log('✓ Rental units table created');

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
    console.log('✓ Leases table created');

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
    console.log('✓ Rental listings table created');

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);
    console.log('✓ Email index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id)
    `);
    console.log('✓ Users organization index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug)
    `);
    console.log('✓ Organizations slug index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token_hash)
    `);
    console.log('✓ Token index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at)
    `);
    console.log('✓ Expires index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_premises_organization ON premises(organization_id)
    `);
    console.log('✓ Premises organization index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_premises_lessor ON premises(lessor_id)
    `);
    console.log('✓ Premises lessor index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_rental_units_premises ON rental_units(premises_id)
    `);
    console.log('✓ Rental units premises index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_rental_units_available ON rental_units(is_available)
    `);
    console.log('✓ Rental units availability index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_leases_lessee ON leases(lessee_id)
    `);
    console.log('✓ Leases lessee index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_leases_lessor ON leases(lessor_id)
    `);
    console.log('✓ Leases lessor index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_rental_listings_status ON rental_listings(listing_status)
    `);
    console.log('✓ Rental listings status index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_rental_listings_featured ON rental_listings(featured)
    `);
    console.log('✓ Rental listings featured index created');

    // Create conversations table for chat functionality
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        conversation_type VARCHAR(20) NOT NULL CHECK (conversation_type IN ('general', 'lease_related', 'maintenance', 'payment')),
        title VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Conversations table created');

    // Create conversation_participants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversation_participants (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(20) NOT NULL CHECK (role IN ('landlord', 'tenant', 'admin')),
        is_active BOOLEAN DEFAULT TRUE,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(conversation_id, user_id)
      )
    `);
    console.log('✓ Conversation participants table created');

    // Create messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'document', 'system')),
        content TEXT NOT NULL,
        attachment_url TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Messages table created');

    // Create indexes for messaging
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation ON conversation_participants(conversation_id)
    `);
    console.log('✓ Conversation participants index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON conversation_participants(user_id)
    `);
    console.log('✓ Conversation participants user index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id)
    `);
    console.log('✓ Messages conversation index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id)
    `);
    console.log('✓ Messages sender index created');

        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at)
    `);
    console.log('✓ Messages created index created');

    // Create maintenance_requests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS maintenance_requests (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('urgent', 'routine', 'emergency', 'preventive')),
        priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'assigned', 'in_progress', 'completed', 'rejected', 'cancelled')),
        premises_id INTEGER REFERENCES premises(id) ON DELETE CASCADE,
        rental_unit_id INTEGER REFERENCES rental_units(id) ON DELETE SET NULL,
        tenant_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        landlord_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        assigned_workman_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        estimated_cost DECIMAL(10,2),
        actual_cost DECIMAL(10,2),
        requested_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved_date TIMESTAMP,
        assigned_date TIMESTAMP,
        started_date TIMESTAMP,
        completed_date TIMESTAMP,
        tenant_rating INTEGER CHECK (tenant_rating >= 1 AND tenant_rating <= 5),
        tenant_feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Maintenance requests table created');

    // Create maintenance_work_orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS maintenance_work_orders (
        id SERIAL PRIMARY KEY,
        maintenance_request_id INTEGER REFERENCES maintenance_requests(id) ON DELETE CASCADE,
        workman_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        work_order_number VARCHAR(50) UNIQUE NOT NULL,
        work_description TEXT NOT NULL,
        estimated_hours DECIMAL(5,2),
        materials_required TEXT[],
        special_instructions TEXT,
        status VARCHAR(30) NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'on_hold', 'completed', 'cancelled')),
        assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        started_date TIMESTAMP,
        completed_date TIMESTAMP,
        actual_hours DECIMAL(5,2),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Maintenance work orders table created');

    // Create maintenance_approvals table for workflow tracking
    await client.query(`
      CREATE TABLE IF NOT EXISTS maintenance_approvals (
        id SERIAL PRIMARY KEY,
        maintenance_request_id INTEGER REFERENCES maintenance_requests(id) ON DELETE CASCADE,
        approver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        approval_type VARCHAR(30) NOT NULL CHECK (approval_type IN ('landlord', 'property_manager', 'workman', 'tenant')),
        status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
        comments TEXT,
        approved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Maintenance approvals table created');

    // Create maintenance_photos table for before/after photos
    await client.query(`
      CREATE TABLE IF NOT EXISTS maintenance_photos (
        id SERIAL PRIMARY KEY,
        maintenance_request_id INTEGER REFERENCES maintenance_requests(id) ON DELETE CASCADE,
        photo_type VARCHAR(20) NOT NULL CHECK (photo_type IN ('before', 'after', 'during', 'other')),
        photo_url TEXT NOT NULL,
        caption TEXT,
        uploaded_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Maintenance photos table created');

    // Create maintenance_notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS maintenance_notifications (
        id SERIAL PRIMARY KEY,
        maintenance_request_id INTEGER REFERENCES maintenance_requests(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('request_created', 'request_approved', 'request_assigned', 'work_started', 'work_completed', 'request_rejected')),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Maintenance notifications table created');

    // Create indexes for maintenance tables
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_maintenance_requests_tenant ON maintenance_requests(tenant_id)
    `);
    console.log('✓ Maintenance requests tenant index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_maintenance_requests_landlord ON maintenance_requests(landlord_id)
    `);
    console.log('✓ Maintenance requests landlord index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status ON maintenance_requests(status)
    `);
    console.log('✓ Maintenance requests status index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_maintenance_requests_premises ON maintenance_requests(premises_id)
    `);
    console.log('✓ Maintenance requests premises index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_maintenance_work_orders_request ON maintenance_work_orders(maintenance_request_id)
    `);
    console.log('✓ Maintenance work orders request index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_maintenance_work_orders_workman ON maintenance_work_orders(workman_id)
    `);
    console.log('✓ Maintenance work orders workman index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_maintenance_approvals_request ON maintenance_approvals(maintenance_request_id)
    `);
    console.log('✓ Maintenance approvals request index created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_maintenance_notifications_user ON maintenance_notifications(user_id)
    `);
    console.log('✓ Maintenance notifications user index created');

    client.release();
    console.log('\n🎉 Rently Database setup completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Start the Rently server with: npm run server');
    console.log('2. Run the Rently mobile app with: npm start');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 