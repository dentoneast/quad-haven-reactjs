import { BREAKPOINTS, Breakpoint } from '../types';

// Responsive utilities
export const isBreakpoint = (breakpoint: Breakpoint, width: number): boolean => {
  return width >= BREAKPOINTS[breakpoint];
};

export const isMobile = (width: number): boolean => width < BREAKPOINTS.md;
export const isTablet = (width: number): boolean => width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
export const isDesktop = (width: number): boolean => width >= BREAKPOINTS.lg;

// Responsive spacing
export const getResponsiveSpacing = (mobile: number, tablet: number, desktop: number, width: number): number => {
  if (isMobile(width)) return mobile;
  if (isTablet(width)) return tablet;
  return desktop;
};

// Responsive font sizes
export const getResponsiveFontSize = (mobile: number, tablet: number, desktop: number, width: number): number => {
  if (isMobile(width)) return mobile;
  if (isTablet(width)) return tablet;
  return desktop;
};

// Container max widths
export const getContainerMaxWidth = (width: number): number => {
  if (isMobile(width)) return width - 32; // 16px padding on each side
  if (isTablet(width)) return 720;
  if (width >= BREAKPOINTS.xl) return 1140;
  return 960;
};

// Grid columns based on screen size
export const getGridColumns = (width: number): number => {
  if (isMobile(width)) return 1;
  if (isTablet(width)) return 2;
  if (width >= BREAKPOINTS.xl) return 4;
  return 3;
};

// Responsive padding
export const getResponsivePadding = (width: number): number => {
  if (isMobile(width)) return 16;
  if (isTablet(width)) return 24;
  return 32;
};

// Responsive margins
export const getResponsiveMargin = (width: number): number => {
  if (isMobile(width)) return 16;
  if (isTablet(width)) return 24;
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
};
