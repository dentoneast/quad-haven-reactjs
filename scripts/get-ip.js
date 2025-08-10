const os = require('os');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  
  console.log('🌐 Network Interfaces:');
  console.log('=====================\n');
  
  for (const name of Object.keys(interfaces)) {
    const networkInterface = interfaces[name];
    
    for (const alias of networkInterface) {
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        console.log(`✅ ${name}: ${alias.address}`);
        console.log(`   Use this IP in your mobile app configuration`);
        console.log(`   API URL: http://${alias.address}:3000/api\n`);
      }
    }
  }
  
  console.log('📱 Configuration Steps:');
  console.log('1. Copy one of the IP addresses above');
  console.log('2. Update src/config/api.ts with your IP');
  console.log('3. Restart your mobile app');
  console.log('4. Ensure your phone and computer are on the same WiFi network');
}

getLocalIPAddress(); 