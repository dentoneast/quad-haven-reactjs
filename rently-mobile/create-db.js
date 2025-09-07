const { Pool } = require('pg');
require('dotenv').config();

// Connect to default postgres database to create our database
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // Connect to default postgres database
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function createDatabase() {
  try {
    console.log('Connecting to PostgreSQL...');
    const client = await pool.connect();
    
    console.log('Creating database "rently"...');
    await client.query('CREATE DATABASE rently');
    console.log('✅ Database "rently" created successfully!');
    
    client.release();
  } catch (error) {
    if (error.code === '42P04') {
      console.log('✅ Database "rently" already exists!');
    } else {
      console.error('❌ Failed to create database:', error.message);
    }
  } finally {
    await pool.end();
  }
}

createDatabase(); 