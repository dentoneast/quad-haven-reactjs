const { Pool } = require('pg');
const SERVER_CONFIG = require('./config');
require('dotenv').config();

const pool = new Pool(SERVER_CONFIG.DB_CONFIG);

const fakeOrganizations = [
  {
    name: 'Sunset Property Management',
    slug: 'sunset-properties',
    description: 'Professional property management company specializing in residential properties in Los Angeles',
    website: 'https://sunsetproperties.com',
    phone: '+1-555-0100',
    email: 'info@sunsetproperties.com',
    address: '1000 Sunset Blvd, Los Angeles, CA 90210',
    city: 'Los Angeles',
    state: 'CA',
    zip_code: '90210',
    subscription_plan: 'premium',
    max_users: 25,
    max_properties: 100
  },
  {
    name: 'Downtown Real Estate Group',
    slug: 'downtown-real-estate',
    description: 'Luxury real estate management in downtown Chicago',
    website: 'https://downtownrealestate.com',
    phone: '+1-555-0200',
    email: 'contact@downtownrealestate.com',
    address: '500 Main Street, Chicago, IL 60601',
    city: 'Chicago',
    state: 'IL',
    zip_code: '60601',
    subscription_plan: 'basic',
    max_users: 10,
    max_properties: 50
  },
  {
    name: 'Riverside Property Solutions',
    slug: 'riverside-properties',
    description: 'Comprehensive property management for Houston area',
    website: 'https://riversideproperties.com',
    phone: '+1-555-0300',
    email: 'info@riversideproperties.com',
    address: '200 River Road, Houston, TX 77001',
    city: 'Houston',
    state: 'TX',
    zip_code: '77001',
    subscription_plan: 'standard',
    max_users: 15,
    max_properties: 75
  }
];

const fakeUsers = [
  {
    email: 'john.doe@example.com',
    password: 'password123',
    first_name: 'John',
    last_name: 'Doe',
    phone: '+1-555-0101',
    date_of_birth: '1990-05-15',
    address: '123 Main St, New York, NY 10001',
    user_type: 'tenant'
  },
  {
    email: 'jane.smith@example.com',
    password: 'password123',
    first_name: 'Jane',
    last_name: 'Smith',
    phone: '+1-555-0102',
    date_of_birth: '1988-12-03',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    user_type: 'landlord'
  },
  {
    email: 'mike.johnson@example.com',
    password: 'password123',
    first_name: 'Mike',
    last_name: 'Johnson',
    phone: '+1-555-0103',
    date_of_birth: '1985-08-22',
    address: '789 Pine St, Chicago, IL 60601',
    user_type: 'tenant'
  },
  {
    email: 'sarah.wilson@example.com',
    password: 'password123',
    first_name: 'Sarah',
    last_name: 'Wilson',
    phone: '+1-555-0104',
    date_of_birth: '1992-03-10',
    address: '321 Elm St, Houston, TX 77001',
    user_type: 'landlord'
  },
  {
    email: 'david.brown@example.com',
    password: 'password123',
    first_name: 'David',
    last_name: 'Brown',
    phone: '+1-555-0105',
    date_of_birth: '1987-11-18',
    address: '654 Maple Ave, Phoenix, AZ 85001',
    user_type: 'tenant'
  },
  {
    email: 'emma.davis@example.com',
    password: 'password123',
    first_name: 'Emma',
    last_name: 'Davis',
    phone: '+1-555-0106',
    date_of_birth: '1991-07-25',
    address: '987 Cedar Ln, Philadelphia, PA 19101',
    user_type: 'landlord'
  },
  {
    email: 'alex.garcia@example.com',
    password: 'password123',
    first_name: 'Alex',
    last_name: 'Garcia',
    phone: '+1-555-0107',
    date_of_birth: '1989-01-30',
    address: '147 Birch Dr, San Antonio, TX 78201',
    user_type: 'tenant'
  },
  {
    email: 'lisa.martinez@example.com',
    password: 'password123',
    first_name: 'Lisa',
    last_name: 'Martinez',
    phone: '+1-555-0108',
    date_of_birth: '1986-09-14',
    address: '258 Willow Way, San Diego, CA 92101',
    user_type: 'landlord'
  },
  {
    email: 'tom.anderson@example.com',
    password: 'password123',
    first_name: 'Tom',
    last_name: 'Anderson',
    phone: '+1-555-0109',
    date_of_birth: '1984-04-05',
    address: '369 Spruce St, Dallas, TX 75201',
    user_type: 'tenant'
  },
  {
    email: 'rachel.taylor@example.com',
    password: 'password123',
    first_name: 'Rachel',
    last_name: 'Taylor',
    phone: '+1-555-0110',
    date_of_birth: '1993-12-20',
    address: '741 Poplar Ave, San Jose, CA 95101',
    user_type: 'landlord'
  }
];

const fakePremises = [
  {
    name: 'Sunset Gardens Apartments',
    address: '123 Sunset Blvd',
    city: 'Los Angeles',
    state: 'CA',
    zip_code: '90210',
    property_type: 'apartment',
    total_units: 24,
    year_built: 2015,
    amenities: ['pool', 'gym', 'parking', 'laundry'],
    description: 'Modern apartment complex with great amenities and city views',
    lessor_id: 2 // Jane Smith
  },
  {
    name: 'Downtown Lofts',
    address: '456 Main Street',
    city: 'Chicago',
    state: 'IL',
    zip_code: '60601',
    property_type: 'condo',
    total_units: 12,
    year_built: 2018,
    amenities: ['doorman', 'elevator', 'parking'],
    description: 'Luxury downtown condos with modern finishes',
    lessor_id: 4 // Sarah Wilson
  },
  {
    name: 'Riverside Townhomes',
    address: '789 River Road',
    city: 'Houston',
    state: 'TX',
    zip_code: '77001',
    property_type: 'townhouse',
    total_units: 8,
    year_built: 2016,
    amenities: ['garage', 'backyard', 'patio'],
    description: 'Spacious townhomes with private outdoor space',
    lessor_id: 6 // Emma Davis
  },
  {
    name: 'Mountain View Estates',
    address: '321 Mountain Drive',
    city: 'Phoenix',
    state: 'AZ',
    zip_code: '85001',
    property_type: 'house',
    total_units: 1,
    year_built: 2019,
    amenities: ['pool', 'garden', 'garage'],
    description: 'Beautiful single-family home with mountain views',
    lessor_id: 8 // Lisa Martinez
  },
  {
    name: 'Oceanfront Condos',
    address: '654 Beach Boulevard',
    city: 'San Diego',
    state: 'CA',
    zip_code: '92101',
    property_type: 'condo',
    total_units: 16,
    year_built: 2017,
    amenities: ['beach access', 'pool', 'gym', 'parking'],
    description: 'Premium oceanfront condos with stunning views',
    lessor_id: 10 // Rachel Taylor
  }
];

const fakeRentalUnits = [
  {
    unit_number: '101',
    premises_id: 1,
    unit_type: '1BR',
    square_feet: 750,
    bedrooms: 1,
    bathrooms: 1.0,
    floor_number: 1,
    rent_amount: 1800.00,
    security_deposit: 1800.00,
    utilities_included: false,
    available_from: '2024-01-01',
    is_available: true,
    features: ['balcony', 'walk-in closet', 'dishwasher'],
    images: ['unit101_1.jpg', 'unit101_2.jpg']
  },
  {
    unit_number: '202',
    premises_id: 1,
    unit_type: '2BR',
    square_feet: 950,
    bedrooms: 2,
    bathrooms: 1.5,
    floor_number: 2,
    rent_amount: 2200.00,
    security_deposit: 2200.00,
    utilities_included: false,
    available_from: '2024-01-15',
    is_available: true,
    features: ['balcony', 'walk-in closet', 'dishwasher', 'in-unit laundry'],
    images: ['unit202_1.jpg', 'unit202_2.jpg']
  },
  {
    unit_number: 'A1',
    premises_id: 2,
    unit_type: 'studio',
    square_feet: 550,
    bedrooms: 0,
    bathrooms: 1.0,
    floor_number: 1,
    rent_amount: 1500.00,
    security_deposit: 1500.00,
    utilities_included: true,
    available_from: '2024-01-01',
    is_available: true,
    features: ['high ceilings', 'modern kitchen', 'parking included'],
    images: ['loftA1_1.jpg', 'loftA1_2.jpg']
  },
  {
    unit_number: 'B2',
    premises_id: 2,
    unit_type: '1BR',
    square_feet: 700,
    bedrooms: 1,
    bathrooms: 1.0,
    floor_number: 2,
    rent_amount: 1900.00,
    security_deposit: 1900.00,
    utilities_included: true,
    available_from: '2024-02-01',
    is_available: true,
    features: ['city view', 'modern kitchen', 'parking included'],
    images: ['loftB2_1.jpg', 'loftB2_2.jpg']
  },
  {
    unit_number: '1',
    premises_id: 3,
    unit_type: '3BR',
    square_feet: 1400,
    bedrooms: 3,
    bathrooms: 2.5,
    floor_number: 1,
    rent_amount: 2800.00,
    security_deposit: 2800.00,
    utilities_included: false,
    available_from: '2024-01-01',
    is_available: true,
    features: ['garage', 'backyard', 'fireplace', 'granite countertops'],
    images: ['townhome1_1.jpg', 'townhome1_2.jpg']
  }
];

const fakeLeases = [
  {
    rental_unit_id: 1,
    lessor_id: 2, // Jane Smith
    lessee_id: 1, // John Doe
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    monthly_rent: 1800.00,
    security_deposit: 1800.00,
    lease_status: 'active',
    terms_conditions: 'Standard lease agreement with 12-month term'
  },
  {
    rental_unit_id: 3,
    lessor_id: 4, // Sarah Wilson
    lessee_id: 3, // Mike Johnson
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    monthly_rent: 1500.00,
    security_deposit: 1500.00,
    lease_status: 'active',
    terms_conditions: 'Studio apartment lease with utilities included'
  }
];

const fakeRentalListings = [
  {
    rental_unit_id: 2,
    title: 'Spacious 2BR Apartment in Sunset Gardens',
    description: 'Beautiful 2-bedroom apartment with balcony and city views. Features include walk-in closet, dishwasher, and in-unit laundry.',
    monthly_rent: 2200.00,
    available_from: '2024-01-15',
    listing_status: 'active',
    featured: true,
    contact_phone: '+1-555-0102',
    contact_email: 'jane.smith@example.com'
  },
  {
    rental_unit_id: 4,
    title: 'Modern 1BR Loft in Downtown',
    description: 'Contemporary 1-bedroom loft with high ceilings and modern finishes. Includes utilities and parking.',
    monthly_rent: 1900.00,
    available_from: '2024-02-01',
    listing_status: 'active',
    featured: false,
    contact_phone: '+1-555-0104',
    contact_email: 'sarah.wilson@example.com'
  },
  {
    rental_unit_id: 5,
    title: 'Luxury 3BR Townhome with Garage',
    description: 'Spacious 3-bedroom townhome featuring garage, backyard, fireplace, and granite countertops.',
    monthly_rent: 2800.00,
    available_from: '2024-01-01',
    listing_status: 'active',
    featured: true,
    contact_phone: '+1-555-0106',
    contact_email: 'emma.davis@example.com'
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

    // Insert fake organizations
    console.log('🏢 Creating organizations...');
    const organizationIds = [];
    for (const org of fakeOrganizations) {
      const query = `
        INSERT INTO organizations (name, slug, description, website, phone, email, address, city, state, zip_code, subscription_plan, max_users, max_properties, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
        RETURNING id, name
      `;
      
      const values = [
        org.name,
        org.slug,
        org.description,
        org.website,
        org.phone,
        org.email,
        org.address,
        org.city,
        org.state,
        org.zip_code,
        org.subscription_plan,
        org.max_users,
        org.max_properties
      ];
      
      const result = await pool.query(query, values);
      organizationIds.push(result.rows[0].id);
      console.log(`✅ Created organization: ${result.rows[0].name}`);
    }

    // Insert fake users with organization assignments
    console.log('👥 Creating users...');
    for (let i = 0; i < fakeUsers.length; i++) {
      const user = fakeUsers[i];
      const hashedPassword = await require('bcryptjs').hash(user.password, 10);
      
      // Assign landlords to organizations, tenants remain without organization
      let organizationId = null;
      let isOrgAdmin = false;
      
      if (user.user_type === 'landlord') {
        // Assign landlords to organizations in round-robin fashion
        const orgIndex = Math.floor(i / 2) % organizationIds.length;
        organizationId = organizationIds[orgIndex];
        isOrgAdmin = true; // First landlord in each org is admin
      }
      
      const query = `
        INSERT INTO users (email, password_hash, first_name, last_name, phone, date_of_birth, address, user_type, organization_id, is_organization_admin, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        RETURNING id, email, first_name, last_name, user_type
      `;
      
      const values = [
        user.email,
        hashedPassword,
        user.first_name,
        user.last_name,
        user.phone,
        user.date_of_birth,
        user.address,
        user.user_type,
        organizationId,
        isOrgAdmin
      ];
      
      const result = await pool.query(query, values);
      console.log(`✅ Created user: ${result.rows[0].first_name} ${result.rows[0].last_name} (${result.rows[0].user_type})${organizationId ? ` in organization ${organizationId}` : ''}`);
    }

    // Insert fake premises with organization assignments
    console.log('\n🏢 Creating premises...');
    for (let i = 0; i < fakePremises.length; i++) {
      const premise = fakePremises[i];
      
      // Get the organization ID for this premise's lessor
      const lessorQuery = await pool.query('SELECT organization_id FROM users WHERE id = $1', [premise.lessor_id]);
      const organizationId = lessorQuery.rows[0]?.organization_id;
      
      const query = `
        INSERT INTO premises (name, address, city, state, zip_code, property_type, total_units, year_built, amenities, description, organization_id, lessor_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
        RETURNING id, name
      `;
      
      const values = [
        premise.name,
        premise.address,
        premise.city,
        premise.state,
        premise.zip_code,
        premise.property_type,
        premise.total_units,
        premise.year_built,
        premise.amenities,
        premise.description,
        organizationId,
        premise.lessor_id
      ];
      
      const result = await pool.query(query, values);
      console.log(`✅ Created premise: ${result.rows[0].name}${organizationId ? ` in organization ${organizationId}` : ''}`);
    }

    // Insert fake rental units
    console.log('\n🏠 Creating rental units...');
    for (const unit of fakeRentalUnits) {
      const query = `
        INSERT INTO rental_units (unit_number, premises_id, unit_type, square_feet, bedrooms, bathrooms, floor_number, rent_amount, security_deposit, utilities_included, available_from, is_available, features, images, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
        RETURNING id, unit_number
      `;
      
      const values = [
        unit.unit_number,
        unit.premises_id,
        unit.unit_type,
        unit.square_feet,
        unit.bedrooms,
        unit.bathrooms,
        unit.floor_number,
        unit.rent_amount,
        unit.security_deposit,
        unit.utilities_included,
        unit.available_from,
        unit.is_available,
        unit.features,
        unit.images
      ];
      
      const result = await pool.query(query, values);
      console.log(`✅ Created rental unit: ${result.rows[0].unit_number}`);
    }

    // Insert fake leases
    console.log('\n📋 Creating leases...');
    for (const lease of fakeLeases) {
      const query = `
        INSERT INTO leases (rental_unit_id, lessor_id, lessee_id, start_date, end_date, monthly_rent, security_deposit, lease_status, terms_conditions, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING id
      `;
      
      const values = [
        lease.rental_unit_id,
        lease.lessor_id,
        lease.lessee_id,
        lease.start_date,
        lease.end_date,
        lease.monthly_rent,
        lease.security_deposit,
        lease.lease_status,
        lease.terms_conditions
      ];
      
      await pool.query(query, values);
      console.log(`✅ Created lease for unit ${lease.rental_unit_id}`);
    }

    // Insert fake rental listings
    console.log('\n📢 Creating rental listings...');
    for (const listing of fakeRentalListings) {
      const query = `
        INSERT INTO rental_listings (rental_unit_id, title, description, monthly_rent, available_from, listing_status, featured, contact_phone, contact_email, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING id, title
      `;
      
      const values = [
        listing.rental_unit_id,
        listing.title,
        listing.description,
        listing.monthly_rent,
        listing.available_from,
        listing.listing_status,
        listing.featured,
        listing.contact_phone,
        listing.contact_email
      ];
      
      const result = await pool.query(query, values);
      console.log(`✅ Created listing: ${result.rows[0].title}`);
    }
    
    console.log(`\n🎉 Successfully seeded database with:`);
    console.log(`   - ${fakeOrganizations.length} organizations`);
    console.log(`   - ${fakeUsers.length} users (tenants, landlords, admins)`);
    console.log(`   - ${fakePremises.length} premises`);
    console.log(`   - ${fakeRentalUnits.length} rental units`);
    console.log(`   - ${fakeLeases.length} active leases`);
    console.log(`   - ${fakeRentalListings.length} rental listings`);
    console.log('\n📋 Test Login Credentials:');
    console.log('All users use password: password123');
    console.log('Landlords: jane.smith@example.com, sarah.wilson@example.com');
    console.log('Tenants: john.doe@example.com, mike.johnson@example.com');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the seeding function
seedDatabase(); 