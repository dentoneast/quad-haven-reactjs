#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Homely Quad monorepo...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js 18 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed');

// Install root dependencies
console.log('\n📦 Installing root dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Root dependencies installed');
} catch (error) {
  console.error('❌ Failed to install root dependencies:', error.message);
  process.exit(1);
}

// Install package dependencies
const packages = ['shared', 'mobile', 'web', 'server'];

for (const packageName of packages) {
  console.log(`\n📦 Installing ${packageName} dependencies...`);
  try {
    execSync(`cd packages/${packageName} && npm install`, { stdio: 'inherit' });
    console.log(`✅ ${packageName} dependencies installed`);
  } catch (error) {
    console.error(`❌ Failed to install ${packageName} dependencies:`, error.message);
    process.exit(1);
  }
}

// Build shared package
console.log('\n🔨 Building shared package...');
try {
  execSync('npm run build:shared', { stdio: 'inherit' });
  console.log('✅ Shared package built');
} catch (error) {
  console.error('❌ Failed to build shared package:', error.message);
  process.exit(1);
}

// Create environment files
console.log('\n⚙️  Setting up environment files...');

const envFiles = [
  {
    source: 'packages/server/env.example',
    target: 'packages/server/.env',
  },
  {
    source: 'packages/web/env.example',
    target: 'packages/web/.env.local',
  },
  {
    source: 'packages/mobile/env.example',
    target: 'packages/mobile/.env',
  },
];

for (const envFile of envFiles) {
  if (fs.existsSync(envFile.source)) {
    if (!fs.existsSync(envFile.target)) {
      fs.copyFileSync(envFile.source, envFile.target);
      console.log(`✅ Created ${envFile.target}`);
    } else {
      console.log(`⚠️  ${envFile.target} already exists, skipping`);
    }
  }
}

// Create logs directory for server
const logsDir = path.join(__dirname, '..', 'packages', 'server', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('✅ Created logs directory');
}

console.log('\n🎉 Setup complete!');
console.log('\nNext steps:');
console.log('1. Update environment files with your configuration');
console.log('2. Run "npm run dev" to start all applications');
console.log('3. Visit http://localhost:3000 for the web app');
console.log('4. Visit http://localhost:3001 for the API');
console.log('5. Use Expo Go app to scan QR code for mobile app');
console.log('\nHappy coding! 🚀');
