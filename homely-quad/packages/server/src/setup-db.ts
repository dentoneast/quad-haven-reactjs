import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const DB_CONFIG = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'homely_quad',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
};

const pool = new Pool(DB_CONFIG);

async function setupDatabase() {
  try {
    const client = await pool.connect();
    
    console.log('Setting up database tables...');

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
        user_type VARCHAR(20) DEFAULT 'tenant' CHECK (user_type IN ('tenant', 'landlord', 'admin', 'workman')),
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

    // Create organizations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(50),
        zip_code VARCHAR(20),
        country VARCHAR(100) DEFAULT 'USA',
        phone VARCHAR(20),
        email VARCHAR(255),
        website VARCHAR(255),
        subscription_plan VARCHAR(20) DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'premium', 'enterprise')),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create maintenance_requests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS maintenance_requests (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        landlord_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rental_unit_id INTEGER REFERENCES rental_units(id) ON DELETE CASCADE,
        request_type VARCHAR(20) NOT NULL CHECK (request_type IN ('routine', 'urgent', 'emergency')),
        priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'assigned', 'in_progress', 'completed')),
        estimated_cost DECIMAL(10,2),
        actual_cost DECIMAL(10,2),
        photos TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create maintenance_work_orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS maintenance_work_orders (
        id SERIAL PRIMARY KEY,
        maintenance_request_id INTEGER REFERENCES maintenance_requests(id) ON DELETE CASCADE,
        workman_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        instructions TEXT,
        estimated_hours DECIMAL(5,2),
        actual_hours DECIMAL(5,2),
        status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'cancelled')),
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create conversations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        type VARCHAR(20) DEFAULT 'direct' CHECK (type IN ('direct', 'group')),
        created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create conversation_participants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversation_participants (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_read_at TIMESTAMP,
        UNIQUE(conversation_id, user_id)
      )
    `);

    // Create messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    client.release();
    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Database setup error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('Database setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}

export default setupDatabase;
