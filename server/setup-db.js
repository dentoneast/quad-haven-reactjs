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
        user_type VARCHAR(20) DEFAULT 'tenant' CHECK (user_type IN ('tenant', 'landlord', 'admin')),
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