import { Platform as RNPlatform } from 'react-native';

export type Platform = 'web' | 'ios' | 'android';

// Platform detection
export function getPlatform(): Platform {
  if (typeof window !== 'undefined') {
    return 'web';
  }
  
  if (RNPlatform.OS === 'ios') {
    return 'ios';
  }
  
  if (RNPlatform.OS === 'android') {
    return 'android';
  }
  
  return 'web';
}

export const isWeb = getPlatform() === 'web';
export const isMobile = !isWeb;
export const isIOS = getPlatform() === 'ios';
export const isAndroid = getPlatform() === 'android';

// Platform-specific utilities
export function getPlatformConfig() {
  const platform = getPlatform();
  
  switch (platform) {
    case 'web':
      return {
        platform: 'web' as const,
        apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
        storageKey: 'homely_quad_web',
        features: {
          pushNotifications: false,
          camera: true,
          location: true,
          biometrics: false,
        },
      };
    
    case 'ios':
      return {
        platform: 'ios' as const,
        apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api',
        storageKey: 'homely_quad_ios',
        features: {
          pushNotifications: true,
          camera: true,
          location: true,
          biometrics: true,
        },
      };
    
    case 'android':
      return {
        platform: 'android' as const,
        apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api',
        storageKey: 'homely_quad_android',
        features: {
          pushNotifications: true,
          camera: true,
          location: true,
          biometrics: true,
        },
      };
    
    default:
      return {
        platform: 'web' as const,
        apiBaseUrl: 'http://localhost:3001/api',
        storageKey: 'homely_quad_web',
        features: {
          pushNotifications: false,
          camera: true,
          location: true,
          biometrics: false,
        },
      };
  }
}

// Platform-specific imports
export function requirePlatform<T>(
  web: () => T,
  mobile: () => T
): T {
  return isWeb ? web() : mobile();
}

// Platform-specific components
export function PlatformComponent<T extends Record<string, any>>(props: {
  web: React.ComponentType<T>;
  mobile: React.ComponentType<T>;
} & T) {
  const { web: WebComponent, mobile: MobileComponent, ...rest } = props;
  
  if (isWeb) {
    return <WebComponent {...(rest as T)} />;
  }
  
  return <MobileComponent {...(rest as T)} />;
}

// Device info
export function getDeviceInfo() {
  if (isWeb) {
    return {
      platform: 'web',
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    };
  }
  
  return {
    platform: getPlatform(),
    version: RNPlatform.Version,
    isPad: RNPlatform.isPad,
    isTVOS: RNPlatform.isTVOS,
  };
}

// Responsive breakpoints
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
} as const;

export function getBreakpoint(): keyof typeof BREAKPOINTS {
  if (isWeb && typeof window !== 'undefined') {
    const width = window.innerWidth;
    
    if (width >= BREAKPOINTS.xxl) return 'xxl';
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    return 'xs';
  }
  
  return 'xs';
}

export function isBreakpoint(breakpoint: keyof typeof BREAKPOINTS): boolean {
  if (isWeb && typeof window !== 'undefined') {
    return window.innerWidth >= BREAKPOINTS[breakpoint];
  }
  
  return breakpoint === 'xs';
}
