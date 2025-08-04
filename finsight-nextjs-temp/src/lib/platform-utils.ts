// Platform-specific utilities

/**
 * Gets the appropriate API base URL based on the platform
 * For Android emulator, we need to use 10.0.2.2 instead of localhost
 * to access the host machine's localhost
 */
export function getPlatformApiUrl(defaultUrl: string): string {
  // Check if we're running in a Capacitor environment (mobile)
  const isCapacitorApp = typeof (window as any)?.Capacitor !== 'undefined';
  
  if (isCapacitorApp) {
    // Check if we're on Android
    const isAndroid = (window as any)?.Capacitor?.getPlatform() === 'android';
    
    if (isAndroid) {
      // Replace localhost or 127.0.0.1 with 10.0.2.2 for Android emulator
      return defaultUrl
        .replace('http://localhost', 'http://10.0.2.2')
        .replace('http://127.0.0.1', 'http://10.0.2.2');
    }
  }
  
  // Return the default URL for all other platforms
  return defaultUrl;
}