'use client';

import { useState, useEffect } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';
type Orientation = 'portrait' | 'landscape';

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}

export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>('portrait');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight > window.innerWidth) {
        setOrientation('portrait');
      } else {
        setOrientation('landscape');
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return orientation;
}

export function useBreakpoint(breakpoint: number): boolean {
  const [isAboveBreakpoint, setIsAboveBreakpoint] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsAboveBreakpoint(window.innerWidth >= breakpoint);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isAboveBreakpoint;
}