import { Platform } from 'react-native';
import { PlatformInfo } from '@homely-quad/shared';

export const usePlatform = (): PlatformInfo => {
  const isWeb = Platform.OS === 'web';
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
  const isIOS = Platform.OS === 'ios';
  const isAndroid = Platform.OS === 'android';
  
  const platform: 'web' | 'ios' | 'android' = isWeb ? 'web' : isIOS ? 'ios' : 'android';

  return {
    isWeb,
    isMobile,
    isIOS,
    isAndroid,
    platform,
  };
};

export default usePlatform;
