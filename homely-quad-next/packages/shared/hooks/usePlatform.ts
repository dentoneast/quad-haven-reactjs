export interface PlatformInfo {
  isWeb: boolean;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  platform: 'web' | 'ios' | 'android' | 'unknown';
}

export const usePlatform = (): PlatformInfo => {
  if (typeof window === 'undefined') {
    return {
      isWeb: false,
      isMobile: false,
      isIOS: false,
      isAndroid: false,
      platform: 'unknown',
    };
  }

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
  const isAndroid = /android/i.test(userAgent);
  const isMobile = isIOS || isAndroid;
  const isWeb = !isMobile;
  
  let platform: 'web' | 'ios' | 'android' | 'unknown' = 'unknown';
  if (isWeb) platform = 'web';
  else if (isIOS) platform = 'ios';
  else if (isAndroid) platform = 'android';

  return {
    isWeb,
    isMobile,
    isIOS,
    isAndroid,
    platform,
  };
};

export default usePlatform;
