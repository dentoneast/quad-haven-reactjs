#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Rently Monorepo...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the root directory of the project');
  process.exit(1);
}

// Install dependencies for shared package
console.log('📦 Installing shared package dependencies...');
try {
  execSync('cd shared && npm install', { stdio: 'inherit' });
  console.log('✅ Shared package dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install shared package dependencies');
  process.exit(1);
}

// Build shared package
console.log('🔨 Building shared package...');
try {
  execSync('cd shared && npm run build', { stdio: 'inherit' });
  console.log('✅ Shared package built successfully\n');
} catch (error) {
  console.error('❌ Failed to build shared package');
  process.exit(1);
}

// Install dependencies for web package
console.log('📦 Installing web package dependencies...');
try {
  execSync('cd web && npm install', { stdio: 'inherit' });
  console.log('✅ Web package dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install web package dependencies');
  process.exit(1);
}

// Install dependencies for mobile package
console.log('📦 Installing mobile package dependencies...');
try {
  execSync('cd mobile && npm install', { stdio: 'inherit' });
  console.log('✅ Mobile package dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install mobile package dependencies');
  process.exit(1);
}

console.log('🎉 Monorepo setup completed successfully!\n');

console.log('📋 Next steps:');
console.log('1. Set up your environment variables in .env file');
console.log('2. Start the backend server: npm run server');
console.log('3. Start the web app: npm run dev:web');
console.log('4. Start the mobile app: npm run dev:mobile');
console.log('\n🚀 Happy coding!');
