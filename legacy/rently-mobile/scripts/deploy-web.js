#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting web deployment...');

try {
  // Build the web version
  console.log('📦 Building web version...');
  execSync('npm run web:build', { stdio: 'inherit' });

  // Check if build was successful
  const buildPath = path.join(__dirname, '..', 'web-build');
  if (!fs.existsSync(buildPath)) {
    throw new Error('Web build failed - web-build directory not found');
  }

  console.log('✅ Web build completed successfully!');
  console.log('📁 Build output:', buildPath);
  
  // Optional: Start local server to test
  console.log('🌐 Starting local server for testing...');
  console.log('💡 Run "npm run web:serve" to test the build locally');
  console.log('💡 Or deploy the "web-build" folder to your hosting service');

} catch (error) {
  console.error('❌ Web deployment failed:', error.message);
  process.exit(1);
}
