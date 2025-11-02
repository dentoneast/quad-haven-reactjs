import { db } from '../db';
import { sql } from 'drizzle-orm';
import { seedDatabase } from './seed-database';

async function resetDatabase() {
  try {
    console.log('🔄 Resetting database...\n');

    // Environment check
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Cannot reset database in production environment!');
      process.exit(1);
    }

    // Drop all tables in reverse dependency order
    console.log('🗑️  Dropping all tables...');

    await db.execute(sql`DROP TABLE IF EXISTS messages CASCADE`);
    console.log('   ✓ Dropped messages');

    await db.execute(sql`DROP TABLE IF EXISTS payments CASCADE`);
    console.log('   ✓ Dropped payments');

    await db.execute(sql`DROP TABLE IF EXISTS maintenance_requests CASCADE`);
    console.log('   ✓ Dropped maintenance_requests');

    await db.execute(sql`DROP TABLE IF EXISTS leases CASCADE`);
    console.log('   ✓ Dropped leases');

    await db.execute(sql`DROP TABLE IF EXISTS units CASCADE`);
    console.log('   ✓ Dropped units');

    await db.execute(sql`DROP TABLE IF EXISTS properties CASCADE`);
    console.log('   ✓ Dropped properties');

    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
    console.log('   ✓ Dropped users');

    console.log('\n✅ All tables dropped successfully\n');

    // Ask if user wants to recreate tables and seed
    console.log('📝 Running database push to recreate tables...');
    console.log('   Please run: npm run db:push\n');
    console.log('   Then run: npm run db:seed\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  }
}

async function resetAndSeed() {
  try {
    console.log('🔄 Resetting and seeding database...\n');

    // Environment check
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Cannot reset database in production environment!');
      process.exit(1);
    }

    // Drop all tables in reverse dependency order
    console.log('🗑️  Dropping all tables...');

    await db.execute(sql`DROP TABLE IF EXISTS messages CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS payments CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS maintenance_requests CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS leases CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS units CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS properties CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);

    console.log('✅ All tables dropped successfully\n');

    console.log('📝 Note: Run "npm run db:push" to recreate tables');
    console.log('         Then this script will seed the database\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  }
}

// Run reset if this file is executed directly
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--seed')) {
    resetAndSeed();
  } else {
    resetDatabase();
  }
}

export { resetDatabase, resetAndSeed };
