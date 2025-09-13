import { Dimensions } from 'react-native';
import { BREAKPOINTS, Breakpoint } from '@homely-quad/shared';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive utilities
export const isBreakpoint = (breakpoint: Breakpoint): boolean => {
  return screenWidth >= BREAKPOINTS[breakpoint];
};

export const isMobile = (): boolean => screenWidth < BREAKPOINTS.md;
export const isTablet = (): boolean => screenWidth >= BREAKPOINTS.md && screenWidth < BREAKPOINTS.lg;
export const isDesktop = (): boolean => screenWidth >= BREAKPOINTS.lg;

// Responsive spacing
export const getResponsiveSpacing = (mobile: number, tablet: number, desktop: number): number => {
  if (isMobile()) return mobile;
  if (isTablet()) return tablet;
  return desktop;
};

// Responsive font sizes
export const getResponsiveFontSize = (mobile: number, tablet: number, desktop: number): number => {
  if (isMobile()) return mobile;
  if (isTablet()) return tablet;
  return desktop;
};

// Container max widths
export const getContainerMaxWidth = (): number => {
  if (isMobile()) return screenWidth - 32; // 16px padding on each side
  if (isTablet()) return 720;
  if (screenWidth >= BREAKPOINTS.xl) return 1140;
  return 960;
};

// Grid columns based on screen size
export const getGridColumns = (): number => {
  if (isMobile()) return 1;
  if (isTablet()) return 2;
  if (screenWidth >= BREAKPOINTS.xl) return 4;
  return 3;
};

// Responsive padding
export const getResponsivePadding = (): number => {
  if (isMobile()) return 16;
  if (isTablet()) return 24;
  return 32;
};

// Responsive margins
export const getResponsiveMargin = (): number => {
  if (isMobile()) return 16;
  if (isTablet()) return 24;
  return 32;
};

export default {
  BREAKPOINTS,
  isBreakpoint,
  isMobile,
  isTablet,
  isDesktop,
  getResponsiveSpacing,
  getResponsiveFontSize,
  getContainerMaxWidth,
  getGridColumns,
  getResponsivePadding,
  getResponsiveMargin,
  screenWidth,
  screenHeight,
};
