const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const fakeUsers = [
  {
    email: 'john.doe@example.com',
    password: 'password123',
    first_name: 'John',
    last_name: 'Doe',
    phone: '+1-555-0101',
    date_of_birth: '1990-05-15',
    address: '123 Main St, New York, NY 10001'
  },
  {
    email: 'jane.smith@example.com',
    password: 'password123',
    first_name: 'Jane',
    last_name: 'Smith',
    phone: '+1-555-0102',
    date_of_birth: '1988-12-03',
    address: '456 Oak Ave, Los Angeles, CA 90210'
  },
  {
    email: 'mike.johnson@example.com',
    password: 'password123',
    first_name: 'Mike',
    last_name: 'Johnson',
    phone: '+1-555-0103',
    date_of_birth: '1992-08-22',
    address: '789 Pine Rd, Chicago, IL 60601'
  },
  {
    email: 'sarah.wilson@example.com',
    password: 'password123',
    first_name: 'Sarah',
    last_name: 'Wilson',
    phone: '+1-555-0104',
    date_of_birth: '1985-03-10',
    address: '321 Elm St, Houston, TX 77001'
  },
  {
    email: 'david.brown@example.com',
    password: 'password123',
    first_name: 'David',
    last_name: 'Brown',
    phone: '+1-555-0105',
    date_of_birth: '1995-11-18',
    address: '654 Maple Dr, Phoenix, AZ 85001'
  },
  {
    email: 'emma.davis@example.com',
    password: 'password123',
    first_name: 'Emma',
    last_name: 'Davis',
    phone: '+1-555-0106',
    date_of_birth: '1987-07-25',
    address: '987 Cedar Ln, Philadelphia, PA 19101'
  },
  {
    email: 'alex.garcia@example.com',
    password: 'password123',
    first_name: 'Alex',
    last_name: 'Garcia',
    phone: '+1-555-0107',
    date_of_birth: '1993-01-30',
    address: '147 Birch Way, San Antonio, TX 78201'
  },
  {
    email: 'lisa.martinez@example.com',
    password: 'password123',
    first_name: 'Lisa',
    last_name: 'Martinez',
    phone: '+1-555-0108',
    date_of_birth: '1989-09-14',
    address: '258 Spruce Ct, San Diego, CA 92101'
  },
  {
    email: 'tom.anderson@example.com',
    password: 'password123',
    first_name: 'Tom',
    last_name: 'Anderson',
    phone: '+1-555-0109',
    date_of_birth: '1991-04-07',
    address: '369 Willow Blvd, Dallas, TX 75201'
  },
  {
    email: 'rachel.taylor@example.com',
    password: 'password123',
    first_name: 'Rachel',
    last_name: 'Taylor',
    phone: '+1-555-0110',
    date_of_birth: '1986-06-20',
    address: '741 Aspen St, San Jose, CA 95101'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Check if users already exist
    const existingUsers = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(existingUsers.rows[0].count) > 0) {
      console.log('⚠️  Users already exist in database. Skipping seeding.');
      return;
    }

    // Insert fake users
    for (const user of fakeUsers) {
      const hashedPassword = await require('bcryptjs').hash(user.password, 10);
      
      const query = `
        INSERT INTO users (email, password_hash, first_name, last_name, phone, date_of_birth, address, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING id, email, first_name, last_name
      `;
      
      const values = [
        user.email,
        hashedPassword,
        user.first_name,
        user.last_name,
        user.phone,
        user.date_of_birth,
        user.address
      ];
      
      const result = await pool.query(query, values);
      console.log(`✅ Created user: ${result.rows[0].first_name} ${result.rows[0].last_name} (${result.rows[0].email})`);
    }
    
    console.log(`🎉 Successfully seeded ${fakeUsers.length} users!`);
    console.log('\n📋 Test Login Credentials:');
    console.log('All users use password: password123');
    console.log('Example: john.doe@example.com / password123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the seeding function
seedDatabase(); 