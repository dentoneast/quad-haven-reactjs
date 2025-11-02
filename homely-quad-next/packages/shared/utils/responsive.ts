export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export const responsive = {
  BREAKPOINTS,

  isBreakpoint(breakpoint: Breakpoint, width: number): boolean {
    return width >= BREAKPOINTS[breakpoint];
  },

  isMobile(width: number): boolean {
    return width < BREAKPOINTS.md;
  },

  isTablet(width: number): boolean {
    return width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
  },

  isDesktop(width: number): boolean {
    return width >= BREAKPOINTS.lg;
  },

  getResponsiveSpacing(width: number, mobile: number, tablet: number, desktop: number): number {
    if (this.isMobile(width)) return mobile;
    if (this.isTablet(width)) return tablet;
    return desktop;
  },

  getResponsiveFontSize(width: number, mobile: number, tablet: number, desktop: number): number {
    if (this.isMobile(width)) return mobile;
    if (this.isTablet(width)) return tablet;
    return desktop;
  },

  getContainerMaxWidth(width: number): number {
    if (this.isMobile(width)) return width - 32;
    if (this.isTablet(width)) return 720;
    if (width >= BREAKPOINTS.xl) return 1140;
    return 960;
  },

  getGridColumns(width: number): number {
    if (this.isMobile(width)) return 1;
    if (this.isTablet(width)) return 2;
    if (width >= BREAKPOINTS.xl) return 4;
    return 3;
  },

  getResponsivePadding(width: number): number {
    if (this.isMobile(width)) return 16;
    if (this.isTablet(width)) return 24;
    return 32;
  },

  getResponsiveMargin(width: number): number {
    if (this.isMobile(width)) return 16;
    if (this.isTablet(width)) return 24;
    return 32;
  },
};

export default responsive;
