import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
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

async function seedDatabase() {
  try {
    const client = await pool.connect();
    
    console.log('Seeding database with sample data...');

    // Create sample users
    const passwordHash = await bcrypt.hash('password123', 12);

    const users = [
      {
        email: 'john.doe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1-555-0101',
        user_type: 'tenant'
      },
      {
        email: 'jane.smith@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '+1-555-0102',
        user_type: 'landlord'
      },
      {
        email: 'mike.johnson@example.com',
        first_name: 'Mike',
        last_name: 'Johnson',
        phone: '+1-555-0103',
        user_type: 'tenant'
      },
      {
        email: 'sarah.wilson@example.com',
        first_name: 'Sarah',
        last_name: 'Wilson',
        phone: '+1-555-0104',
        user_type: 'landlord'
      },
      {
        email: 'tom.anderson@example.com',
        first_name: 'Tom',
        last_name: 'Anderson',
        phone: '+1-555-0105',
        user_type: 'workman'
      }
    ];

    const userIds = [];
    for (const user of users) {
      const result = await client.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (email) DO NOTHING
         RETURNING id`,
        [user.email, passwordHash, user.first_name, user.last_name, user.phone, user.user_type, true]
      );
      
      if (result.rows.length > 0) {
        userIds.push(result.rows[0].id);
      }
    }

    console.log(`✅ Created ${userIds.length} users`);

    // Create sample premises
    const premises = [
      {
        name: 'Sunset Apartments',
        address: '123 Sunset Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zip_code: '90210',
        property_type: 'apartment',
        total_units: 24,
        year_built: 2018,
        amenities: ['pool', 'gym', 'parking', 'laundry'],
        description: 'Modern apartment complex with great amenities',
        lessor_id: userIds[1] // Jane Smith (landlord)
      },
      {
        name: 'Downtown Lofts',
        address: '456 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip_code: '94102',
        property_type: 'condo',
        total_units: 12,
        year_built: 2020,
        amenities: ['rooftop', 'gym', 'concierge'],
        description: 'Luxury condos in the heart of downtown',
        lessor_id: userIds[3] // Sarah Wilson (landlord)
      }
    ];

    const premiseIds = [];
    for (const premise of premises) {
      const result = await client.query(
        `INSERT INTO premises (name, address, city, state, zip_code, property_type, total_units, year_built, amenities, description, lessor_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id`,
        [premise.name, premise.address, premise.city, premise.state, premise.zip_code, premise.property_type, premise.total_units, premise.year_built, premise.amenities, premise.description, premise.lessor_id]
      );
      premiseIds.push(result.rows[0].id);
    }

    console.log(`✅ Created ${premiseIds.length} premises`);

    // Create sample rental units
    const rentalUnits = [
      {
        unit_number: '101',
        premises_id: premiseIds[0],
        unit_type: '1BR',
        square_feet: 750,
        bedrooms: 1,
        bathrooms: 1,
        floor_number: 1,
        rent_amount: 2500,
        security_deposit: 2500,
        utilities_included: false,
        available_from: '2024-01-01',
        is_available: true,
        features: ['balcony', 'dishwasher', 'air_conditioning'],
        images: []
      },
      {
        unit_number: '201',
        premises_id: premiseIds[0],
        unit_type: '2BR',
        square_feet: 1100,
        bedrooms: 2,
        bathrooms: 2,
        floor_number: 2,
        rent_amount: 3500,
        security_deposit: 3500,
        utilities_included: false,
        available_from: '2024-01-01',
        is_available: true,
        features: ['balcony', 'dishwasher', 'air_conditioning', 'walk_in_closet'],
        images: []
      },
      {
        unit_number: '301',
        premises_id: premiseIds[1],
        unit_type: 'studio',
        square_feet: 500,
        bedrooms: 0,
        bathrooms: 1,
        floor_number: 3,
        rent_amount: 2000,
        security_deposit: 2000,
        utilities_included: true,
        available_from: '2024-01-01',
        is_available: true,
        features: ['high_ceilings', 'hardwood_floors'],
        images: []
      }
    ];

    const unitIds = [];
    for (const unit of rentalUnits) {
      const result = await client.query(
        `INSERT INTO rental_units (unit_number, premises_id, unit_type, square_feet, bedrooms, bathrooms, floor_number, rent_amount, security_deposit, utilities_included, available_from, is_available, features, images)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         RETURNING id`,
        [unit.unit_number, unit.premises_id, unit.unit_type, unit.square_feet, unit.bedrooms, unit.bathrooms, unit.floor_number, unit.rent_amount, unit.security_deposit, unit.utilities_included, unit.available_from, unit.is_available, unit.features, unit.images]
      );
      unitIds.push(result.rows[0].id);
    }

    console.log(`✅ Created ${unitIds.length} rental units`);

    // Create sample leases
    const leases = [
      {
        rental_unit_id: unitIds[0],
        lessor_id: userIds[1], // Jane Smith
        lessee_id: userIds[0], // John Doe
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        monthly_rent: 2500,
        security_deposit: 2500,
        lease_status: 'active',
        terms_conditions: 'Standard lease agreement'
      },
      {
        rental_unit_id: unitIds[2],
        lessor_id: userIds[3], // Sarah Wilson
        lessee_id: userIds[2], // Mike Johnson
        start_date: '2024-02-01',
        end_date: '2025-01-31',
        monthly_rent: 2000,
        security_deposit: 2000,
        lease_status: 'active',
        terms_conditions: 'Standard lease agreement'
      }
    ];

    for (const lease of leases) {
      await client.query(
        `INSERT INTO leases (rental_unit_id, lessor_id, lessee_id, start_date, end_date, monthly_rent, security_deposit, lease_status, terms_conditions)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [lease.rental_unit_id, lease.lessor_id, lease.lessee_id, lease.start_date, lease.end_date, lease.monthly_rent, lease.security_deposit, lease.lease_status, lease.terms_conditions]
      );
    }

    console.log(`✅ Created ${leases.length} leases`);

    // Create sample maintenance requests
    const maintenanceRequests = [
      {
        tenant_id: userIds[0], // John Doe
        landlord_id: userIds[1], // Jane Smith
        rental_unit_id: unitIds[0],
        request_type: 'routine',
        priority: 'medium',
        title: 'Kitchen faucet leak',
        description: 'The kitchen faucet has been dripping for a few days. Needs repair.',
        status: 'pending',
        estimated_cost: 150
      },
      {
        tenant_id: userIds[2], // Mike Johnson
        landlord_id: userIds[3], // Sarah Wilson
        rental_unit_id: unitIds[2],
        request_type: 'urgent',
        priority: 'high',
        title: 'Heating not working',
        description: 'The heating system stopped working yesterday. Very cold in the unit.',
        status: 'approved',
        estimated_cost: 300
      }
    ];

    for (const request of maintenanceRequests) {
      await client.query(
        `INSERT INTO maintenance_requests (tenant_id, landlord_id, rental_unit_id, request_type, priority, title, description, status, estimated_cost)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [request.tenant_id, request.landlord_id, request.rental_unit_id, request.request_type, request.priority, request.title, request.description, request.status, request.estimated_cost]
      );
    }

    console.log(`✅ Created ${maintenanceRequests.length} maintenance requests`);

    client.release();
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Database seeding error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Database seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
