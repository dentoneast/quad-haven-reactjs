const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add path mapping for the shared package
config.resolver.alias = {
  '@rently/shared': path.resolve(__dirname, '../shared/dist'),
  react: path.resolve(__dirname, 'node_modules/react'),
  'react-native': path.resolve(__dirname, 'node_modules/react-native'),
};

// Ensure Metro can resolve TypeScript files
config.resolver.sourceExts.push('ts', 'tsx');

config.watchFolders = [
  path.resolve(__dirname, '..'),
  path.resolve(__dirname, '../shared/node_modules'),
];

module.exports = config;
