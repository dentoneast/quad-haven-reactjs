const jwt = require('jsonwebtoken');

// Create tokens for different users to test role-based access
const landlordToken = jwt.sign(
  { id: 2, email: 'sarah.landlord@example.com', role: 'landlord' },
  process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  { expiresIn: '1h' }
);

const tenantToken = jwt.sign(
  { id: 4, email: 'mike.tenant@example.com', role: 'tenant' },
  process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  { expiresIn: '1h' }
);

console.log('LANDLORD_TOKEN=' + landlordToken);
console.log('TENANT_TOKEN=' + tenantToken);
