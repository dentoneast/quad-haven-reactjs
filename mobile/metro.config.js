const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add path mapping for the shared package
config.resolver.alias = {
  '@rently/shared': path.resolve(__dirname, '../shared/dist'),
};

// Ensure Metro can resolve TypeScript files
config.resolver.sourceExts.push('ts', 'tsx');

module.exports = config;
