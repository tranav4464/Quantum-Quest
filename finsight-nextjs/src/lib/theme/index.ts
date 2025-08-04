import { Colors, getColor, ColorScheme } from './colors';
export { Colors, getColor } from './colors';
export type { ColorScheme } from './colors';
import { Spacing, BorderRadius, Shadows } from './spacing';
import { Typography, TypographyStyle, getTypographyStyle } from './typography';
import { SpringConfig, AnimationDuration, Easing, MicroInteractions } from './animations';

// Theme context structure as per Phase 1 specifications
export interface ThemeContextType {
  theme: ColorScheme;
  colors: any; // Allow dynamic theme colors
  spacing: typeof Spacing;
  typography: typeof Typography;
  borderRadius: typeof BorderRadius;
  shadows: typeof Shadows;
  animations: {
    spring: typeof SpringConfig;
    duration: typeof AnimationDuration;
    easing: typeof Easing;
    microInteractions: typeof MicroInteractions;
  };
  updateTheme: (theme: ColorScheme) => void;
}

// Base theme configuration
export const BaseTheme = {
  colors: Colors,
  spacing: Spacing,
  typography: Typography,
  borderRadius: BorderRadius,
  shadows: Shadows,
  animations: {
    spring: SpringConfig,
    duration: AnimationDuration,
    easing: Easing,
    microInteractions: MicroInteractions
  }
} as const;

// Light theme configuration
export const LightTheme = {
  ...BaseTheme,
  scheme: 'light' as const,
  colors: {
    ...BaseTheme.colors,
    current: {
      background: Colors.system.background.primary.light,
      backgroundSecondary: Colors.system.background.secondary.light,
      backgroundTertiary: Colors.system.background.tertiary.light,
      text: Colors.system.text.primary.light,
      textSecondary: Colors.system.text.secondary.light,
      textTertiary: Colors.system.text.tertiary.light,
      separator: Colors.system.separator.primary.light,
      fill: Colors.system.fill.primary.light
    }
  }
};

// Dark theme configuration
export const DarkTheme = {
  ...BaseTheme,
  scheme: 'dark' as const,
  colors: {
    ...BaseTheme.colors,
    current: {
      background: Colors.system.background.primary.dark,
      backgroundSecondary: Colors.system.background.secondary.dark,
      backgroundTertiary: Colors.system.background.tertiary.dark,
      text: Colors.system.text.primary.dark,
      textSecondary: Colors.system.text.secondary.dark,
      textTertiary: Colors.system.text.tertiary.dark,
      separator: Colors.system.separator.primary.dark,
      fill: Colors.system.fill.primary.dark
    }
  }
};

// High contrast theme for accessibility
export const HighContrastTheme = {
  ...BaseTheme,
  scheme: 'light' as const,
  colors: {
    ...BaseTheme.colors,
    primary: {
      ...BaseTheme.colors.primary,
      finsightGreen: '#008B5C', // Darker green for better contrast
      premiumBlue: '#0051D0'     // Darker blue for better contrast
    },
    current: {
      background: '#FFFFFF',
      backgroundSecondary: '#F0F0F0',
      backgroundTertiary: '#FFFFFF',
      text: '#000000',
      textSecondary: '#1C1C1C',
      textTertiary: '#3C3C3C',
      separator: '#000000',
      fill: '#000000'
    }
  }
};

// Colorblind friendly theme
export const ColorblindFriendlyTheme = {
  ...BaseTheme,
  scheme: 'light' as const,
  colors: {
    ...BaseTheme.colors,
    semantic: {
      income: '#0173B2',      // Blue instead of green
      expense: '#DE8F05',     // Orange instead of red
      investment: '#029E73',   // Teal
      savings: '#CC78BC',     // Pink
      debt: '#D55E00'         // Dark orange
    }
  }
};

// Theme variants
export const ThemeVariants = {
  light: LightTheme,
  dark: DarkTheme,
  highContrast: HighContrastTheme,
  colorblindFriendly: ColorblindFriendlyTheme
} as const;

export type ThemeVariant = keyof typeof ThemeVariants;

// Utility functions for theme management
export const getThemeColors = (scheme: ColorScheme) => {
  switch (scheme) {
    case 'dark':
      return DarkTheme.colors;
    case 'light':
    case 'system':
    default:
      return LightTheme.colors;
  }
};

export const getThemeShadow = (shadowKey: keyof typeof Shadows.components, scheme: ColorScheme) => {
  const shadow = Shadows.components[shadowKey];
  if (typeof shadow === 'string') return shadow;
  
  // Handle theme-aware shadows
  const themeAwareShadow = shadow as { light: string; dark: string };
  return scheme === 'dark' ? themeAwareShadow.dark : themeAwareShadow.light;
};

// Responsive breakpoints
export const Breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
} as const;

// Device-specific theme adjustments
export const DeviceTheme = {
  mobile: {
    spacing: {
      ...Spacing,
      components: {
        ...Spacing.components,
        navigation: {
          ...Spacing.components.navigation,
          height: 83 // Standard mobile tab bar height
        }
      }
    }
  },
  
  tablet: {
    spacing: {
      ...Spacing,
      components: {
        ...Spacing.components,
        navigation: {
          ...Spacing.components.navigation,
          height: 96 // Larger tab bar for tablets
        }
      }
    }
  },
  
  desktop: {
    spacing: {
      ...Spacing,
      components: {
        ...Spacing.components,
        screen: {
          ...Spacing.components.screen,
          paddingX: 40, // More padding on desktop
          paddingY: 32
        }
      }
    }
  }
} as const;

export type DeviceType = keyof typeof DeviceTheme;
