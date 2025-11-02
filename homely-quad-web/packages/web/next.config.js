/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@homely-quad/shared'],
  allowedDevOrigins: process.env.REPLIT_DEV_DOMAIN 
    ? [process.env.REPLIT_DEV_DOMAIN, `https://${process.env.REPLIT_DEV_DOMAIN}`, `http://${process.env.REPLIT_DEV_DOMAIN}`]
    : ['*'],
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
