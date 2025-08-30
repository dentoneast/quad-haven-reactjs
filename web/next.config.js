/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@rently/shared'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@rently/shared': require('path').resolve(__dirname, '../shared'),
    };
    return config;
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },
};

module.exports = nextConfig;
