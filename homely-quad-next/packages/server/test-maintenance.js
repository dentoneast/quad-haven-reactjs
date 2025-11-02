const jwt = require('jsonwebtoken');

// Create a test token for a seeded landlord user (ID 2)
const token = jwt.sign(
  { id: 2, email: 'sarah.landlord@example.com', role: 'landlord' },
  process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  { expiresIn: '1h' }
);

console.log(token);
