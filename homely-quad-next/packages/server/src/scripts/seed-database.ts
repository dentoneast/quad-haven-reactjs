import { db } from '../db';
import { users, properties, units, leases, maintenanceRequests, payments, messages } from '../../../shared/schema';
import { getUsersData } from './data/users';
import { propertiesData } from './data/properties';
import { unitsData } from './data/units';
import { leasesData } from './data/leases';
import { maintenanceRequestsData } from './data/maintenance';
import { paymentsData } from './data/payments';
import { messagesData } from './data/messages';
import { sql } from 'drizzle-orm';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Environment check
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Cannot seed database in production environment!');
      process.exit(1);
    }

    // Check if database already has data
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log('⚠️  Database already contains data.');
      console.log('   Run "npm run db:reset" first to clear existing data.\n');
      process.exit(0);
    }

    // Seed users
    console.log('👥 Seeding users...');
    const usersData = await getUsersData();
    const insertedUsers = await db.insert(users).values(usersData).returning();
    console.log(`✅ Created ${insertedUsers.length} users\n`);

    // Map users by role for easy reference
    const landlords = insertedUsers.filter(u => u.role === 'landlord');
    const tenants = insertedUsers.filter(u => u.role === 'tenant');
    const workmen = insertedUsers.filter(u => u.role === 'workman');

    console.log(`   - ${landlords.length} landlords`);
    console.log(`   - ${tenants.length} tenants`);
    console.log(`   - ${workmen.length} workmen`);
    console.log(`   - ${insertedUsers.filter(u => u.role === 'admin').length} admin\n`);

    // Seed properties
    console.log('🏢 Seeding properties...');
    const propertiesWithOwners = propertiesData.map((prop, index) => ({
      ...prop,
      ownerId: index < 3 ? landlords[0].id : landlords[1]?.id || landlords[0].id,
    }));
    const insertedProperties = await db.insert(properties).values(propertiesWithOwners).returning();
    console.log(`✅ Created ${insertedProperties.length} properties\n`);

    // Seed units
    console.log('🏠 Seeding units...');
    const unitsWithProperties = unitsData.map((unit, index) => {
      let propertyIndex = 0;
      if (index < 3) propertyIndex = 0; // Sunset Gardens
      else if (index < 5) propertyIndex = 1; // Downtown Lofts
      else if (index < 7) propertyIndex = 2; // Riverside Townhomes
      else if (index < 8) propertyIndex = 3; // Mountain View Estates
      else propertyIndex = 4; // Oceanfront Condos

      return {
        ...unit,
        propertyId: insertedProperties[propertyIndex].id,
      };
    });
    const insertedUnits = await db.insert(units).values(unitsWithProperties).returning();
    console.log(`✅ Created ${insertedUnits.length} units\n`);

    // Seed leases
    console.log('📋 Seeding leases...');
    const leasesWithReferences = [
      {
        ...leasesData[0],
        unitId: insertedUnits[0].id, // Unit 101
        tenantId: tenants[0].id, // Mike Johnson
      },
      {
        ...leasesData[1],
        unitId: insertedUnits[1].id, // Unit 202
        tenantId: tenants[1].id, // Emma Davis
      },
      {
        ...leasesData[2],
        unitId: insertedUnits[3].id, // Unit A1
        tenantId: tenants[2].id, // Alex Garcia
      },
      {
        ...leasesData[3],
        unitId: insertedUnits[5].id, // Townhome 1
        tenantId: tenants[3].id, // Lisa Martinez
      },
      {
        ...leasesData[4],
        unitId: insertedUnits[5].id, // Townhome 1 (renewal)
        tenantId: tenants[3].id, // Lisa Martinez
      },
    ];
    const insertedLeases = await db.insert(leases).values(leasesWithReferences).returning();
    console.log(`✅ Created ${insertedLeases.length} leases`);
    console.log(`   - ${insertedLeases.filter(l => l.status === 'active').length} active`);
    console.log(`   - ${insertedLeases.filter(l => l.status === 'expired').length} expired\n`);

    // Seed maintenance requests
    console.log('🔧 Seeding maintenance requests...');
    const maintenanceWithReferences = [
      {
        ...maintenanceRequestsData[0],
        unitId: insertedUnits[0].id,
        tenantId: tenants[0].id,
        assignedTo: workmen[0].id,
      },
      {
        ...maintenanceRequestsData[1],
        unitId: insertedUnits[1].id,
        tenantId: tenants[1].id,
        assignedTo: workmen[0].id,
      },
      {
        ...maintenanceRequestsData[2],
        unitId: insertedUnits[3].id,
        tenantId: tenants[2].id,
        assignedTo: workmen[1]?.id || workmen[0].id,
      },
      {
        ...maintenanceRequestsData[3],
        unitId: insertedUnits[5].id,
        tenantId: tenants[3].id,
        assignedTo: null,
      },
      {
        ...maintenanceRequestsData[4],
        unitId: insertedUnits[0].id,
        tenantId: tenants[0].id,
        assignedTo: workmen[0].id,
      },
      {
        ...maintenanceRequestsData[5],
        unitId: insertedUnits[1].id,
        tenantId: tenants[1].id,
        assignedTo: null,
      },
    ];
    const insertedMaintenance = await db.insert(maintenanceRequests).values(maintenanceWithReferences).returning();
    console.log(`✅ Created ${insertedMaintenance.length} maintenance requests`);
    console.log(`   - ${insertedMaintenance.filter(m => m.status === 'pending').length} pending`);
    console.log(`   - ${insertedMaintenance.filter(m => m.status === 'approved').length} approved`);
    console.log(`   - ${insertedMaintenance.filter(m => m.status === 'in_progress').length} in progress`);
    console.log(`   - ${insertedMaintenance.filter(m => m.status === 'completed').length} completed\n`);

    // Seed payments
    console.log('💳 Seeding payments...');
    const paymentsWithReferences = [
      { ...paymentsData[0], leaseId: insertedLeases[0].id },
      { ...paymentsData[1], leaseId: insertedLeases[0].id },
      { ...paymentsData[2], leaseId: insertedLeases[0].id },
      { ...paymentsData[3], leaseId: insertedLeases[1].id },
      { ...paymentsData[4], leaseId: insertedLeases[1].id },
      { ...paymentsData[5], leaseId: insertedLeases[2].id },
      { ...paymentsData[6], leaseId: insertedLeases[2].id },
      { ...paymentsData[7], leaseId: insertedLeases[2].id },
      { ...paymentsData[8], leaseId: insertedLeases[4].id },
      { ...paymentsData[9], leaseId: insertedLeases[4].id },
      { ...paymentsData[10], leaseId: insertedLeases[4].id },
      { ...paymentsData[11], leaseId: insertedLeases[4].id },
    ];
    const insertedPayments = await db.insert(payments).values(paymentsWithReferences).returning();
    console.log(`✅ Created ${insertedPayments.length} payments`);
    console.log(`   - ${insertedPayments.filter(p => p.status === 'paid').length} paid`);
    console.log(`   - ${insertedPayments.filter(p => p.status === 'pending').length} pending`);
    console.log(`   - ${insertedPayments.filter(p => p.status === 'overdue').length} overdue\n`);

    // Seed messages
    console.log('💬 Seeding messages...');
    const messagesWithReferences = [
      {
        ...messagesData[0],
        senderId: tenants[0].id,
        recipientId: landlords[0].id,
        propertyId: insertedProperties[0].id,
      },
      {
        ...messagesData[1],
        senderId: landlords[0].id,
        recipientId: tenants[0].id,
        propertyId: insertedProperties[0].id,
      },
      {
        ...messagesData[2],
        senderId: tenants[0].id,
        recipientId: landlords[0].id,
        propertyId: insertedProperties[0].id,
      },
      {
        ...messagesData[3],
        senderId: landlords[0].id,
        recipientId: tenants[0].id,
        propertyId: insertedProperties[0].id,
      },
      {
        ...messagesData[4],
        senderId: tenants[1].id,
        recipientId: landlords[0].id,
        propertyId: insertedProperties[0].id,
      },
      {
        ...messagesData[5],
        senderId: landlords[0].id,
        recipientId: tenants[1].id,
        propertyId: insertedProperties[0].id,
      },
      {
        ...messagesData[6],
        senderId: tenants[2].id,
        recipientId: landlords[0].id,
        propertyId: insertedProperties[1].id,
      },
      {
        ...messagesData[7],
        senderId: tenants[0].id,
        recipientId: tenants[1].id,
        propertyId: insertedProperties[0].id,
      },
      {
        ...messagesData[8],
        senderId: tenants[1].id,
        recipientId: tenants[0].id,
        propertyId: insertedProperties[0].id,
      },
      {
        ...messagesData[9],
        senderId: workmen[0].id,
        recipientId: tenants[0].id,
        propertyId: insertedProperties[0].id,
      },
      {
        ...messagesData[10],
        senderId: tenants[0].id,
        recipientId: workmen[0].id,
        propertyId: insertedProperties[0].id,
      },
    ];
    const insertedMessages = await db.insert(messages).values(messagesWithReferences).returning();
    console.log(`✅ Created ${insertedMessages.length} messages\n`);

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   👥 Users: ${insertedUsers.length}`);
    console.log(`   🏢 Properties: ${insertedProperties.length}`);
    console.log(`   🏠 Units: ${insertedUnits.length}`);
    console.log(`   📋 Leases: ${insertedLeases.length}`);
    console.log(`   🔧 Maintenance Requests: ${insertedMaintenance.length}`);
    console.log(`   💳 Payments: ${insertedPayments.length}`);
    console.log(`   💬 Messages: ${insertedMessages.length}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('🔐 Test User Credentials:');
    console.log('   All users password: password123\n');
    console.log('   Admin:    admin@homelyquad.com');
    console.log('   Landlord: john.landlord@example.com');
    console.log('   Tenant:   mike.tenant@example.com');
    console.log('   Workman:  tom.workman@example.com\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
