#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Cleaning Homely Quad monorepo...\n');

// Clean function
function cleanDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ Cleaned ${dirPath}`);
    } catch (error) {
      console.error(`❌ Failed to clean ${dirPath}:`, error.message);
    }
  }
}

// Clean build outputs
const buildDirs = [
  'packages/shared/dist',
  'packages/web/.next',
  'packages/web/out',
  'packages/mobile/.expo',
  'packages/mobile/dist',
  'packages/server/dist',
  'packages/server/logs',
  'coverage',
  'node_modules',
];

for (const dir of buildDirs) {
  cleanDirectory(dir);
}

// Clean package-specific node_modules
const packages = ['shared', 'mobile', 'web', 'server'];

for (const packageName of packages) {
  const nodeModulesPath = path.join('packages', packageName, 'node_modules');
  cleanDirectory(nodeModulesPath);
}

// Clean lock files
const lockFiles = [
  'package-lock.json',
  'packages/shared/package-lock.json',
  'packages/mobile/package-lock.json',
  'packages/web/package-lock.json',
  'packages/server/package-lock.json',
];

for (const lockFile of lockFiles) {
  if (fs.existsSync(lockFile)) {
    try {
      fs.unlinkSync(lockFile);
      console.log(`✅ Removed ${lockFile}`);
    } catch (error) {
      console.error(`❌ Failed to remove ${lockFile}:`, error.message);
    }
  }
}

console.log('\n🎉 Cleanup complete!');
console.log('\nTo reinstall dependencies, run:');
console.log('npm install');
console.log('npm run build:shared');
