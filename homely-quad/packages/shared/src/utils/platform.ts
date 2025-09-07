import { PlatformInfo, Platform } from '../types';

// Platform detection utilities
export const detectPlatform = (): PlatformInfo => {
  // This will be implemented differently for web vs mobile
  // For web, we can use window object
  // For mobile, we'll use React Native's Platform
  
  if (typeof window !== 'undefined') {
    // Web platform
    return {
      isWeb: true,
      isMobile: false,
      isIOS: false,
      isAndroid: false,
      platform: 'web'
    };
  }
  
  // Default fallback (will be overridden in mobile)
  return {
    isWeb: false,
    isMobile: true,
    isIOS: false,
    isAndroid: true,
    platform: 'android'
  };
};

export const getPlatformConfig = (platform: Platform) => {
  const configs = {
    web: {
      apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
      storageKey: 'homely_quad_web',
      features: {
        pushNotifications: false,
        camera: true,
        location: true,
        biometrics: false,
      },
    },
    ios: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api',
      storageKey: 'homely_quad_ios',
      features: {
        pushNotifications: true,
        camera: true,
        location: true,
        biometrics: true,
      },
    },
    android: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api',
      storageKey: 'homely_quad_android',
      features: {
        pushNotifications: true,
        camera: true,
        location: true,
        biometrics: true,
      },
    },
  };
  
  return configs[platform];
};

export default {
  detectPlatform,
  getPlatformConfig,
};