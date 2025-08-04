// Responsive design utilities as per Phase 1 specifications
import React, { useEffect, useState } from 'react';

// Breakpoint definitions following common patterns
export const breakpoints = {
  xs: 320,   // iPhone SE and small devices
  sm: 640,   // Small tablets and large phones
  md: 768,   // Medium tablets
  lg: 1024,  // Large tablets and small laptops
  xl: 1280,  // Laptops and desktops
  '2xl': 1536 // Large desktops
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Media query strings
export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs}px)`,
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  '2xl': `(min-width: ${breakpoints['2xl']}px)`,
  // Max width queries
  'max-xs': `(max-width: ${breakpoints.xs - 1}px)`,
  'max-sm': `(max-width: ${breakpoints.sm - 1}px)`,
  'max-md': `(max-width: ${breakpoints.md - 1}px)`,
  'max-lg': `(max-width: ${breakpoints.lg - 1}px)`,
  'max-xl': `(max-width: ${breakpoints.xl - 1}px)`,
  'max-2xl': `(max-width: ${breakpoints['2xl'] - 1}px)`,
  // Range queries
  'sm-only': `(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`,
  'md-only': `(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  'lg-only': `(min-width: ${breakpoints.lg}px) and (max-width: ${breakpoints.xl - 1}px)`,
  'xl-only': `(min-width: ${breakpoints.xl}px) and (max-width: ${breakpoints['2xl'] - 1}px)`,
} as const;

// Hook for getting current screen size
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<{
    width: number;
    height: number;
    breakpoint: Breakpoint;
  }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    breakpoint: 'lg'
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let breakpoint: Breakpoint = 'xs';
      if (width >= breakpoints['2xl']) breakpoint = '2xl';
      else if (width >= breakpoints.xl) breakpoint = 'xl';
      else if (width >= breakpoints.lg) breakpoint = 'lg';
      else if (width >= breakpoints.md) breakpoint = 'md';
      else if (width >= breakpoints.sm) breakpoint = 'sm';
      else breakpoint = 'xs';

      setScreenSize({ width, height, breakpoint });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return screenSize;
};

// Hook for media queries
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = () => setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

// Hook for breakpoint-specific values
export const useBreakpointValue = <T,>(values: Partial<Record<Breakpoint, T>>) => {
  const { breakpoint } = useScreenSize();
  
  // Find the largest breakpoint that has a value and is smaller than or equal to current
  const sortedBreakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = sortedBreakpoints.indexOf(breakpoint);
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = sortedBreakpoints[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  // Fallback to the first available value
  return values[sortedBreakpoints.find(bp => values[bp] !== undefined) || 'xs'];
};

// Utility functions for responsive design
export const getBreakpoint = (width: number): Breakpoint => {
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
};

export const isBreakpoint = (current: Breakpoint, target: Breakpoint): boolean => {
  const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  return order.indexOf(current) >= order.indexOf(target);
};

// Responsive spacing utilities
export const getResponsiveSpacing = (spacing: Partial<Record<Breakpoint, number>>) => {
  return (breakpoint: Breakpoint) => {
    const sortedBreakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = sortedBreakpoints.indexOf(breakpoint);
    
    for (let i = currentIndex; i >= 0; i--) {
      const bp = sortedBreakpoints[i];
      if (spacing[bp] !== undefined) {
        return spacing[bp];
      }
    }
    
    return spacing.xs || 16; // Default spacing
  };
};

// Device type detection
export const useDeviceType = () => {
  const { width } = useScreenSize();
  
  if (width < breakpoints.sm) return 'mobile';
  if (width < breakpoints.lg) return 'tablet';
  return 'desktop';
};

// Orientation detection
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    
    return () => window.removeEventListener('resize', updateOrientation);
  }, []);

  return orientation;
};

// Safe area detection for mobile devices
export const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateSafeArea = () => {
      const style = getComputedStyle(document.documentElement);
      setSafeArea({
        top: parseInt(style.getPropertyValue('--sat') || '0', 10),
        right: parseInt(style.getPropertyValue('--sar') || '0', 10),
        bottom: parseInt(style.getPropertyValue('--sab') || '0', 10),
        left: parseInt(style.getPropertyValue('--sal') || '0', 10)
      });
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    
    return () => window.removeEventListener('resize', updateSafeArea);
  }, []);

  return safeArea;
};

// Responsive component wrapper
interface ResponsiveProps {
  children: React.ReactNode;
  breakpoint?: Breakpoint;
  above?: boolean;
  below?: boolean;
}

export const Responsive: React.FC<ResponsiveProps> = ({ 
  children, 
  breakpoint = 'md', 
  above = false, 
  below = false 
}) => {
  const { breakpoint: currentBreakpoint } = useScreenSize();
  const sortedBreakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  
  const currentIndex = sortedBreakpoints.indexOf(currentBreakpoint);
  const targetIndex = sortedBreakpoints.indexOf(breakpoint);
  
  let shouldShow = false;
  
  if (above && currentIndex >= targetIndex) shouldShow = true;
  if (below && currentIndex < targetIndex) shouldShow = true;
  if (!above && !below && currentIndex === targetIndex) shouldShow = true;
  
  return shouldShow ? <>{children}</> : null;
};

export default {
  breakpoints,
  mediaQueries,
  useScreenSize,
  useMediaQuery,
  useBreakpointValue,
  getBreakpoint,
  isBreakpoint,
  getResponsiveSpacing,
  useDeviceType,
  useOrientation,
  useSafeArea,
  Responsive
};
