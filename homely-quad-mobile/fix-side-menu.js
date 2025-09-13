const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/SideMenu.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all remaining props.navigation with navigation
content = content.replace(/props\.navigation\.navigate/g, 'navigation.navigate');

fs.writeFileSync(filePath, content);
console.log('Fixed all props.navigation references in SideMenu.tsx');
