const fs = require('fs');
const path = require('path');

function updateAppName() {
  try {
    // Read app.json
    const appJsonPath = path.join(__dirname, '..', 'app.json');
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    const appName = appJson.expo.name;
    
    console.log(`📱 Updating app name to: ${appName}`);
    
    // Update server config
    const serverConfigPath = path.join(__dirname, '..', 'server', 'config.js');
    let serverConfig = fs.readFileSync(serverConfigPath, 'utf8');
    serverConfig = serverConfig.replace(
      /APP_NAME:\s*['"][^'"]*['"]/,
      `APP_NAME: '${appName}'`
    );
    fs.writeFileSync(serverConfigPath, serverConfig);
    console.log('✅ Updated server/config.js');
    
    // Update frontend config
    const frontendConfigPath = path.join(__dirname, '..', 'src', 'config', 'app.ts');
    let frontendConfig = fs.readFileSync(frontendConfigPath, 'utf8');
    frontendConfig = frontendConfig.replace(
      /NAME:\s*['"][^'"]*['"]/,
      `NAME: '${appName}'`
    );
    fs.writeFileSync(frontendConfigPath, frontendConfig);
    console.log('✅ Updated src/config/app.ts');
    
    console.log(`\n🎉 App name updated to "${appName}" in all configuration files!`);
    console.log('\nNote: You may need to restart your development server for changes to take effect.');
    
  } catch (error) {
    console.error('❌ Error updating app name:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  updateAppName();
}

module.exports = { updateAppName }; 