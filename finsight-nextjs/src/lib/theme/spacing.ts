// 8-Point Grid Spacing System
export const Spacing = {
  // Base unit: 8px
  base: 8,
  
  // Spacing scale (in px)
  xs: 4,    // 0.5 * base
  sm: 8,    // 1 * base
  md: 16,   // 2 * base
  lg: 24,   // 3 * base
  xl: 32,   // 4 * base
  '2xl': 40, // 5 * base
  '3xl': 48, // 6 * base
  '4xl': 56, // 7 * base
  '5xl': 64, // 8 * base
  '6xl': 72, // 9 * base
  
  // Component-specific spacing
  components: {
    // Button spacing
    button: {
      paddingX: {
        sm: 16,  // 2 * base
        md: 24,  // 3 * base
        lg: 32   // 4 * base
      },
      paddingY: {
        sm: 8,   // 1 * base
        md: 12,  // 1.5 * base
        lg: 16   // 2 * base
      },
      gap: 8     // 1 * base
    },
    
    // Card spacing
    card: {
      padding: {
        sm: 16,  // 2 * base
        md: 24,  // 3 * base
        lg: 32   // 4 * base
      },
      gap: 16    // 2 * base
    },
    
    // Input spacing
    input: {
      paddingX: 16, // 2 * base
      paddingY: 12, // 1.5 * base
      gap: 8        // 1 * base
    },
    
    // Navigation spacing
    navigation: {
      height: 83,   // Tab bar height
      padding: 16,  // 2 * base
      gap: 8        // 1 * base
    },
    
    // Screen spacing
    screen: {
      paddingX: 20, // 2.5 * base
      paddingY: 16, // 2 * base
      gap: 24       // 3 * base
    }
  },
  
  // Safe area spacing
  safeArea: {
    top: 44,      // Status bar + navigation
    bottom: 34,   // Home indicator
    sides: 0      // No side safe area on most devices
  },
  
  // Grid spacing
  grid: {
    gutter: 16,   // 2 * base
    margin: 20    // 2.5 * base
  }
} as const;

// Border radius system
export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
  
  // Component-specific radius
  components: {
    button: 12,
    card: 16,
    input: 12,
    modal: 20,
    sheet: 16,
    chip: 20,
    avatar: 9999
  }
} as const;

// Shadow system
export const Shadows = {
  none: 'none',
  
  // iOS-inspired shadow system
  level1: {
    light: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    dark: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)'
  },
  
  level2: {
    light: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)',
    dark: '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.4)'
  },
  
  level3: {
    light: '0 8px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    dark: '0 8px 15px rgba(0, 0, 0, 0.4), 0 4px 6px rgba(0, 0, 0, 0.3)'
  },
  
  level4: {
    light: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
    dark: '0 20px 25px rgba(0, 0, 0, 0.4), 0 10px 10px rgba(0, 0, 0, 0.3)'
  },
  
  // Component-specific shadows
  components: {
    button: {
      light: '0 2px 4px rgba(0, 0, 0, 0.1)',
      dark: '0 2px 4px rgba(0, 0, 0, 0.3)'
    },
    card: {
      light: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)',
      dark: '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.4)'
    },
    modal: {
      light: '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1)',
      dark: '0 20px 25px rgba(0, 0, 0, 0.5), 0 10px 10px rgba(0, 0, 0, 0.4)'
    }
  }
} as const;
