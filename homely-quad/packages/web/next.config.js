/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@homely-quad/shared'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@homely-quad/shared': require('path').resolve(__dirname, '../shared/src'),
    };
    return config;
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || '',
  },
}

module.exports = nextConfig
