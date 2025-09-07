const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User',
  phone: '+1234567890',
  userType: 'landlord'
};

const testPremises = {
  name: 'Test Apartments',
  address: '123 Test St',
  city: 'Test City',
  state: 'TS',
  zipCode: '12345',
  propertyType: 'apartment',
  totalUnits: 10,
  yearBuilt: 2020,
  amenities: ['pool', 'gym'],
  description: 'Test apartment complex'
};

let authToken = '';
let userId = '';
let premisesId = '';
let rentalUnitId = '';
let leaseId = '';
let listingId = '';

async function testAPI() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: User Registration
    console.log('1. Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ User registered successfully');
    authToken = registerResponse.data.token;
    userId = registerResponse.data.user.id;

    // Test 2: User Login
    console.log('\n2. Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ User logged in successfully');
    authToken = loginResponse.data.token;

    // Test 3: Create Premises
    console.log('\n3. Testing Premises Creation...');
    const premisesResponse = await axios.post(`${BASE_URL}/premises`, testPremises, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Premises created successfully');
    premisesId = premisesResponse.data.premises.id;

    // Test 4: Get Premises
    console.log('\n4. Testing Get Premises...');
    const getPremisesResponse = await axios.get(`${BASE_URL}/premises`);
    console.log(`✅ Retrieved ${getPremisesResponse.data.premises.length} premises`);

    // Test 5: Get Premises by ID
    console.log('\n5. Testing Get Premises by ID...');
    const getPremisesByIdResponse = await axios.get(`${BASE_URL}/premises/${premisesId}`);
    console.log('✅ Retrieved premises by ID successfully');

    // Test 6: Create Rental Unit
    console.log('\n6. Testing Rental Unit Creation...');
    const rentalUnitResponse = await axios.post(`${BASE_URL}/rental-units`, {
      unitNumber: 'A101',
      premisesId: premisesId,
      unitType: '2BR',
      squareFeet: 1200,
      bedrooms: 2,
      bathrooms: 2.0,
      rentAmount: 2500,
      securityDeposit: 2500,
      utilitiesIncluded: false,
      availableFrom: '2024-02-01',
      features: ['balcony', 'walk-in closet'],
      images: ['image1.jpg', 'image2.jpg']
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Rental unit created successfully');
    rentalUnitId = rentalUnitResponse.data.unit.id;

    // Test 7: Get Rental Units
    console.log('\n7. Testing Get Rental Units...');
    const getRentalUnitsResponse = await axios.get(`${BASE_URL}/rental-units`);
    console.log(`✅ Retrieved ${getRentalUnitsResponse.data.units.length} rental units`);

    // Test 8: Get Rental Unit by ID
    console.log('\n8. Testing Get Rental Unit by ID...');
    const getRentalUnitByIdResponse = await axios.get(`${BASE_URL}/rental-units/${rentalUnitId}`);
    console.log('✅ Retrieved rental unit by ID successfully');

    // Test 9: Create Lease
    console.log('\n9. Testing Lease Creation...');
    const leaseResponse = await axios.post(`${BASE_URL}/leases`, {
      rentalUnitId: rentalUnitId,
      lesseeId: userId, // Using same user as lessee for testing
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      monthlyRent: 2500,
      securityDeposit: 2500,
      termsConditions: 'Standard lease terms apply'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Lease created successfully');
    leaseId = leaseResponse.data.lease.id;

    // Test 10: Get Leases
    console.log('\n10. Testing Get Leases...');
    const getLeasesResponse = await axios.get(`${BASE_URL}/leases`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Retrieved ${getLeasesResponse.data.leases.length} leases`);

    // Test 11: Get Lease by ID
    console.log('\n11. Testing Get Lease by ID...');
    const getLeaseByIdResponse = await axios.get(`${BASE_URL}/leases/${leaseId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Retrieved lease by ID successfully');

    // Test 12: Create Rental Listing
    console.log('\n12. Testing Rental Listing Creation...');
    const listingResponse = await axios.post(`${BASE_URL}/rental-listings`, {
      rentalUnitId: rentalUnitId,
      title: 'Beautiful 2BR Apartment in Test Apartments',
      description: 'Spacious 2-bedroom apartment with modern amenities',
      monthlyRent: 2500,
      availableFrom: '2024-02-01',
      listingStatus: 'active',
      featured: true,
      contactPhone: '+1234567890',
      contactEmail: 'test@example.com'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Rental listing created successfully');
    listingId = listingResponse.data.listing.id;

    // Test 13: Get Rental Listings
    console.log('\n13. Testing Get Rental Listings...');
    const getListingsResponse = await axios.get(`${BASE_URL}/rental-listings`);
    console.log(`✅ Retrieved ${getListingsResponse.data.listings.length} rental listings`);

    // Test 14: Get Rental Listing by ID
    console.log('\n14. Testing Get Rental Listing by ID...');
    const getListingByIdResponse = await axios.get(`${BASE_URL}/rental-listings/${listingId}`);
    console.log('✅ Retrieved rental listing by ID successfully');

    // Test 15: Health Check
    console.log('\n15. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed');

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log(`   - User ID: ${userId}`);
    console.log(`   - Premises ID: ${premisesId}`);
    console.log(`   - Rental Unit ID: ${rentalUnitId}`);
    console.log(`   - Lease ID: ${leaseId}`);
    console.log(`   - Listing ID: ${listingId}`);

  } catch (error) {
    console.error('\n❌ API test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI }; 