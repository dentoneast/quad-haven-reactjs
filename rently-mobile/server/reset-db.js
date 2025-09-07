const { Pool } = require('pg');
const SERVER_CONFIG = require('./config');
require('dotenv').config();

const pool = new Pool(SERVER_CONFIG.DB_CONFIG);

async function resetDatabase() {
  try {
    console.log('🔄 Resetting database...');
    
    const client = await pool.connect();
    
    // Drop existing tables in reverse dependency order
    console.log('🗑️  Dropping existing tables...');
    
    await client.query('DROP TABLE IF EXISTS maintenance_notifications CASCADE');
    await client.query('DROP TABLE IF EXISTS maintenance_photos CASCADE');
    await client.query('DROP TABLE IF EXISTS maintenance_approvals CASCADE');
    await client.query('DROP TABLE IF EXISTS maintenance_work_orders CASCADE');
    await client.query('DROP TABLE IF EXISTS maintenance_requests CASCADE');
    await client.query('DROP TABLE IF EXISTS messages CASCADE');
    await client.query('DROP TABLE IF EXISTS conversation_participants CASCADE');
    await client.query('DROP TABLE IF EXISTS conversations CASCADE');
    await client.query('DROP TABLE IF EXISTS rental_listings CASCADE');
    await client.query('DROP TABLE IF EXISTS leases CASCADE');
    await client.query('DROP TABLE IF EXISTS rental_units CASCADE');
    await client.query('DROP TABLE IF EXISTS premises CASCADE');
    await client.query('DROP TABLE IF EXISTS user_sessions CASCADE');
    await client.query('DROP TABLE IF EXISTS users CASCADE');
    await client.query('DROP TABLE IF EXISTS organizations CASCADE');
    
    console.log('✅ All tables dropped successfully');
    
    client.release();
    await pool.end();
    
    console.log('🔄 Database reset complete. Run "npm run db:push" to recreate tables and seed data.');

  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  }
}

// Run reset if this file is executed directly
if (require.main === module) {
  resetDatabase();
}

module.exports = { resetDatabase }; 