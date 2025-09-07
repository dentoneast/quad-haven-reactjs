const { getDefaultConfig } = require('metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Initialize resolver if it doesn't exist
if (!config.resolver) {
  config.resolver = {};
}

// Add path mapping for the shared package
config.resolver.alias = {
  '@homely-quad/shared': path.resolve(__dirname, '../shared/dist'),
  '@': path.resolve(__dirname, 'src'),
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
