const { getDefaultConfig } = require('metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Initialize resolver if it doesn't exist
if (!config.resolver) {
  config.resolver = {};
}

// Add path mapping for the shared package
config.resolver.alias = {
  '@rently/shared': path.resolve(__dirname, '../shared/dist'),
  react: path.resolve(__dirname, 'node_modules/react'),
  'react-native': path.resolve(__dirname, 'node_modules/react-native'),
};

// Ensure Metro can resolve TypeScript files
if (!config.resolver.sourceExts) {
  config.resolver.sourceExts = ['js', 'jsx', 'json'];
}
config.resolver.sourceExts.push('ts', 'tsx');

// Add node modules resolution for shared package
if (!config.resolver.nodeModulesPaths) {
  config.resolver.nodeModulesPaths = [];
}
config.resolver.nodeModulesPaths.push(path.resolve(__dirname, '../shared/node_modules'));

config.watchFolders = [
  path.resolve(__dirname, '..'),
  path.resolve(__dirname, '../shared'),
  path.resolve(__dirname, '../shared/node_modules'),
];

module.exports = config;
