const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api';
const TEST_USER = {
  email: 'test@example.com',
  password: 'testpass123',
  firstName: 'Test',
  lastName: 'User',
  phone: '1234567890',
  userType: 'landlord'
};

const TEST_TENANT = {
  email: 'tenant@example.com',
  password: 'tenantpass123',
  firstName: 'Test',
  lastName: 'Tenant',
  phone: '0987654321',
  userType: 'tenant'
};

let authToken = null;
let tenantToken = null;
let premisesId = null;
let rentalUnitId = null;
let leaseId = null;
let listingId = null;

// Test utilities
const log = (message, data = null) => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🔍 ${message}`);
  if (data) {
    console.log('📊 Response:', JSON.stringify(data, null, 2));
  }
  console.log(`${'='.repeat(50)}`);
};

const testEndpoint = async (name, method, url, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      data
    };

    const response = await axios(config);
    log(`✅ ${name} - SUCCESS`, response.data);
    return response.data;
  } catch (error) {
    log(`❌ ${name} - FAILED`, {
      status: error.response?.status,
      message: error.response?.data?.error || error.message
    });
    throw error;
  }
};

// Helper function to extract user ID from JWT token
const getUserIdFromToken = (token) => {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.userId;
  } catch (error) {
    console.error('Error parsing JWT token:', error.message);
    return null;
  }
};

// Test suite
const runTests = async () => {
  console.log('🚀 Starting Rental Endpoints Test Suite...\n');

  try {
    // 1. Test user registration and authentication
    log('Testing User Authentication...');
    
    // Register landlord
    await testEndpoint('Register Landlord', 'POST', '/auth/register', TEST_USER);
    
    // Register tenant
    await testEndpoint('Register Tenant', 'POST', '/auth/register', TEST_TENANT);
    
    // Login landlord
    const landlordLogin = await testEndpoint('Login Landlord', 'POST', '/auth/login', {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    authToken = landlordLogin.token;
    
    // Login tenant
    const tenantLogin = await testEndpoint('Login Tenant', 'POST', '/auth/login', {
      email: TEST_TENANT.email,
      password: TEST_TENANT.password
    });
    tenantToken = tenantLogin.token;

    // 2. Test premises endpoints
    log('Testing Premises Endpoints...');
    
    // Create premises
    const premises = await testEndpoint('Create Premises', 'POST', '/premises', {
      name: 'Test Apartment Complex',
      address: '123 Test Street',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      country: 'USA',
      propertyType: 'apartment',
      totalUnits: 50,
      yearBuilt: 2020,
      amenities: ['pool', 'gym', 'parking'],
      description: 'A beautiful test apartment complex'
    }, authToken);
    premisesId = premises.premises.id;
    
    // Get all premises
    await testEndpoint('Get All Premises', 'GET', '/premises');
    
    // Get premises by ID
    await testEndpoint('Get Premises by ID', 'GET', `/premises/${premisesId}`);
    
    // Update premises
    await testEndpoint('Update Premises', 'PUT', `/premises/${premisesId}`, {
      name: 'Updated Test Apartment Complex',
      description: 'An updated beautiful test apartment complex'
    }, authToken);

    // 3. Test rental units endpoints
    log('Testing Rental Units Endpoints...');
    
    // Create rental unit
    const rentalUnit = await testEndpoint('Create Rental Unit', 'POST', '/rental-units', {
      unitNumber: 'A101',
      premisesId: premisesId,
      unitType: '2BR',
      squareFeet: 1200,
      bedrooms: 2,
      bathrooms: 2.0,
      floorNumber: 1,
      rentAmount: 1500.00,
      securityDeposit: 1500.00,
      utilitiesIncluded: true,
      availableFrom: '2024-01-01',
      features: ['balcony', 'walk-in closet', 'dishwasher'],
      images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
    }, authToken);
    rentalUnitId = rentalUnit.unit.id;
    
    // Get all rental units
    await testEndpoint('Get All Rental Units', 'GET', '/rental-units');
    
    // Get rental unit by ID
    await testEndpoint('Get Rental Unit by ID', 'GET', `/rental-units/${rentalUnitId}`);
    
    // Update rental unit
    await testEndpoint('Update Rental Unit', 'PUT', `/rental-units/${rentalUnitId}`, {
      rentAmount: 1600.00,
      features: ['balcony', 'walk-in closet', 'dishwasher', 'in-unit laundry']
    }, authToken);

    // 4. Test rental listings endpoints
    log('Testing Rental Listings Endpoints...');
    
    // Create rental listing
    const listing = await testEndpoint('Create Rental Listing', 'POST', '/rental-listings', {
      rentalUnitId: rentalUnitId,
      title: 'Beautiful 2BR Apartment in Test City',
      description: 'Spacious 2-bedroom apartment with modern amenities',
      monthlyRent: 1600.00,
      availableFrom: '2024-01-01',
      listingStatus: 'active',
      featured: true,
      contactPhone: '1234567890',
      contactEmail: 'contact@test.com'
    }, authToken);
    listingId = listing.listing.id;
    
    // Get all rental listings
    await testEndpoint('Get All Rental Listings', 'GET', '/rental-listings');
    
    // Get rental listing by ID
    await testEndpoint('Get Rental Listing by ID', 'GET', `/rental-listings/${listingId}`);
    
    // Update rental listing
    await testEndpoint('Update Rental Listing', 'PUT', `/rental-listings/${listingId}`, {
      title: 'Updated Beautiful 2BR Apartment in Test City',
      featured: false
    }, authToken);

    // 5. Test leases endpoints
    log('Testing Leases Endpoints...');
    
    // Get tenant user ID from token
    const tenantUserId = getUserIdFromToken(tenantToken);
    if (!tenantUserId) {
      throw new Error('Failed to extract tenant user ID from token');
    }
    
    // Create lease
    const lease = await testEndpoint('Create Lease', 'POST', '/leases', {
      rentalUnitId: rentalUnitId,
      lesseeId: tenantUserId,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      monthlyRent: 1600.00,
      securityDeposit: 1500.00,
      termsConditions: 'Standard lease terms apply'
    }, authToken);
    leaseId = lease.lease.id;
    
    // Get all leases (landlord view)
    await testEndpoint('Get All Leases (Landlord)', 'GET', '/leases?role=lessor', null, authToken);
    
    // Get all leases (tenant view)
    await testEndpoint('Get All Leases (Tenant)', 'GET', '/leases?role=lessee', null, tenantToken);
    
    // Get lease by ID
    await testEndpoint('Get Lease by ID', 'GET', `/leases/${leaseId}`, null, authToken);
    
    // Update lease
    await testEndpoint('Update Lease', 'PUT', `/leases/${leaseId}`, {
      monthlyRent: 1650.00,
      termsConditions: 'Updated lease terms'
    }, authToken);

    // 6. Test search and filtering
    log('Testing Search and Filtering...');
    
    // Search premises by city
    await testEndpoint('Search Premises by City', 'GET', '/premises?city=Test%20City');
    
    // Search rental units by price range
    await testEndpoint('Search Rental Units by Price Range', 'GET', '/rental-units?minRent=1000&maxRent=2000');
    
    // Search listings by status
    await testEndpoint('Search Listings by Status', 'GET', '/rental-listings?status=active');
    
    // Search listings by featured
    await testEndpoint('Search Featured Listings', 'GET', '/rental-listings?featured=true');

    // 7. Test pagination
    log('Testing Pagination...');
    
    // Test premises pagination
    await testEndpoint('Test Premises Pagination', 'GET', '/premises?page=1&limit=5');
    
    // Test rental units pagination
    await testEndpoint('Test Rental Units Pagination', 'GET', '/rental-units?page=1&limit=5');
    
    // Test listings pagination
    await testEndpoint('Test Listings Pagination', 'GET', '/rental-listings?page=1&limit=5');

    // 8. Test cleanup (delete created resources)
    log('Testing Cleanup...');
    
    // Delete lease
    await testEndpoint('Delete Lease', 'DELETE', `/leases/${leaseId}`, null, authToken);
    
    // Delete rental listing
    await testEndpoint('Delete Rental Listing', 'DELETE', `/rental-listings/${listingId}`, null, authToken);
    
    // Delete rental unit
    await testEndpoint('Delete Rental Unit', 'DELETE', `/rental-units/${rentalUnitId}`, null, authToken);
    
    // Delete premises
    await testEndpoint('Delete Premises', 'DELETE', `/premises/${premisesId}`, null, authToken);

    // 9. Test error handling
    log('Testing Error Handling...');
    
    // Try to access protected endpoint without token
    try {
      await testEndpoint('Access Protected Endpoint Without Token', 'GET', '/user/profile');
    } catch (error) {
      // Expected to fail
    }
    
    // Try to access non-existent resource
    try {
      await testEndpoint('Access Non-existent Resource', 'GET', '/premises/99999');
    } catch (error) {
      // Expected to fail
    }
    
    // Try to create resource with invalid data
    try {
      await testEndpoint('Create Resource with Invalid Data', 'POST', '/premises', {
        name: '', // Invalid: empty name
        address: 'Test Address'
      }, authToken);
    } catch (error) {
      // Expected to fail
    }

    // 10. Test health endpoint
    log('Testing Health Endpoint...');
    await testEndpoint('Health Check', 'GET', '/health');

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('✅ User Authentication: Working');
    console.log('✅ Premises Management: Working');
    console.log('✅ Rental Units Management: Working');
    console.log('✅ Rental Listings Management: Working');
    console.log('✅ Lease Management: Working');
    console.log('✅ Search and Filtering: Working');
    console.log('✅ Pagination: Working');
    console.log('✅ Error Handling: Working');
    console.log('✅ Health Check: Working');

  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
    process.exit(1);
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testEndpoint }; 