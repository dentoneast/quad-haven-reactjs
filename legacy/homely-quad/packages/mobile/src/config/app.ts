import { Platform } from 'react-native';

// App Configuration
// Note: The app name is automatically updated by running 'npm run update-app-name'
// This script reads from app.json and updates this file
export const APP_CONFIG = {
  // App name from app.json (automatically updated)
  NAME: 'Homely Quad',
  
  // API Configuration
  BASE_URL: Platform.select({
    android: 'http://10.0.2.2:3000/api', // Android emulator
    ios: 'http://localhost:3000/api',      // iOS simulator
    default: 'http://localhost:3000/api'   // Web and fallback
  }),
  
  TIMEOUT: 10000, // 10 seconds
};

export const getApiUrl = (endpoint: string): string => {
  return `${APP_CONFIG.BASE_URL}${endpoint}`;
};

export const getAppName = (): string => {
  return APP_CONFIG.NAME;
};