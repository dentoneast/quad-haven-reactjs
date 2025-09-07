// Server Configuration
// Note: The app name is automatically updated by running 'npm run update-app-name'
// This script reads from app.json and updates this file
const SERVER_CONFIG = {
  // App name from app.json (automatically updated)
  APP_NAME: 'Rently',
  
  // Server settings
  PORT: process.env.PORT || 3000,
  HOST: '0.0.0.0',
  
  // Database settings
  DB_CONFIG: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'rently',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
  },
  
  // JWT settings
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
};

module.exports = SERVER_CONFIG; 