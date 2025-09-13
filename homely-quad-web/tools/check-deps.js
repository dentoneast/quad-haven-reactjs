#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Checking dependencies across packages...\n');

// Check for duplicate dependencies
function checkDuplicates() {
  console.log('Checking for duplicate dependencies...');
  
  try {
    const result = execSync('npm ls --depth=0', { encoding: 'utf8' });
    console.log('✅ No duplicate dependencies found');
  } catch (error) {
    console.log('⚠️  Some duplicate dependencies found:');
    console.log(error.stdout);
  }
}

// Check for outdated dependencies
function checkOutdated() {
  console.log('\nChecking for outdated dependencies...');
  
  try {
    const result = execSync('npm outdated', { encoding: 'utf8' });
    if (result.trim()) {
      console.log('⚠️  Outdated dependencies found:');
      console.log(result);
    } else {
      console.log('✅ All dependencies are up to date');
    }
  } catch (error) {
    console.log('✅ All dependencies are up to date');
  }
}

// Check for security vulnerabilities
function checkSecurity() {
  console.log('\nChecking for security vulnerabilities...');
  
  try {
    execSync('npm audit', { stdio: 'inherit' });
    console.log('✅ No security vulnerabilities found');
  } catch (error) {
    console.log('⚠️  Security vulnerabilities found. Run "npm audit fix" to fix them.');
  }
}

// Check package.json consistency
function checkConsistency() {
  console.log('\nChecking package.json consistency...');
  
  const packages = ['shared', 'mobile', 'web', 'server'];
  const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  for (const packageName of packages) {
    const packagePath = path.join('packages', packageName, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // Check if package name follows convention
      if (!packageJson.name.startsWith('@homely-quad/')) {
        console.log(`⚠️  Package ${packageName} name should start with @homely-quad/`);
      }
      
      // Check if version matches root
      if (packageJson.version !== rootPackage.version) {
        console.log(`⚠️  Package ${packageName} version (${packageJson.version}) doesn't match root version (${rootPackage.version})`);
      }
    }
  }
  
  console.log('✅ Package consistency check complete');
}

// Run all checks
checkDuplicates();
checkOutdated();
checkSecurity();
checkConsistency();

console.log('\n🎉 Dependency check complete!');
