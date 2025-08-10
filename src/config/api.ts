import { Platform } from 'react-native';

// API Configuration
export const API_CONFIG = {
  // For Android emulator, use 10.0.2.2 instead of localhost
  // For iOS simulator, localhost works fine
  // For physical devices, use your computer's local IP address
  BASE_URL: Platform.select({
    android: 'http://10.0.2.2:3000/api', // Android emulator
    ios: 'http://localhost:3000/api',      // iOS simulator
    default: 'http://localhost:3000/api'   // Web and fallback
  }),
  
  // Alternative: Use your computer's local IP address for physical devices
  // Replace with your actual local IP address
  // BASE_URL: 'http://192.168.1.100:3000/api',
  
  TIMEOUT: 10000, // 10 seconds
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 