// Typography System - iOS Human Interface Guidelines inspired
export const Typography = {
  // Font families
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    mono: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    display: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
  },
  
  // Font weights
  fontWeight: {
    ultraLight: 100,
    thin: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    heavy: 800,
    black: 900
  },
  
  // 11 predefined text styles as per Phase 1 requirements
  styles: {
    // Large Title - Biggest display text
    largeTitle: {
      fontSize: 34,
      lineHeight: 41,
      fontWeight: 700,
      letterSpacing: -0.4,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
    },
    
    // Title 1 - Primary section headers
    title1: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: 700,
      letterSpacing: -0.4,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
    },
    
    // Title 2 - Secondary section headers
    title2: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: 700,
      letterSpacing: -0.26,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
    },
    
    // Title 3 - Tertiary section headers
    title3: {
      fontSize: 20,
      lineHeight: 25,
      fontWeight: 600,
      letterSpacing: -0.45,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
    },
    
    // Headline - Important content
    headline: {
      fontSize: 17,
      lineHeight: 22,
      fontWeight: 600,
      letterSpacing: -0.43,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
    },
    
    // Body - Main text content
    body: {
      fontSize: 17,
      lineHeight: 22,
      fontWeight: 400,
      letterSpacing: -0.43,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
    },
    
    // Callout - Emphasized body text
    callout: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 400,
      letterSpacing: -0.32,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
    },
    
    // Subhead - Secondary information
    subhead: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: 400,
      letterSpacing: -0.24,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
    },
    
    // Footnote - Tertiary information
    footnote: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: 400,
      letterSpacing: -0.08,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
    },
    
    // Caption 1 - Image captions and small text
    caption1: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: 400,
      letterSpacing: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
    },
    
    // Caption 2 - Smallest text
    caption2: {
      fontSize: 11,
      lineHeight: 13,
      fontWeight: 400,
      letterSpacing: 0.07,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
    }
  },
  
  // Accessibility support - Dynamic Type scaling
  dynamicType: {
    // Scale factors for accessibility
    scales: {
      xSmall: 0.82,
      small: 0.88,
      medium: 1.0,  // Default
      large: 1.12,
      xLarge: 1.23,
      xxLarge: 1.35,
      xxxLarge: 1.64
    }
  },
  
  // Financial-specific typography variants
  financial: {
    currency: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: 700,
      letterSpacing: -0.4,
      fontFamily: 'SF Mono, Monaco, "Cascadia Code", monospace'
    },
    
    percentage: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 600,
      letterSpacing: -0.32,
      fontFamily: 'SF Mono, Monaco, "Cascadia Code", monospace'
    },
    
    balance: {
      fontSize: 24,
      lineHeight: 29,
      fontWeight: 600,
      letterSpacing: -0.32,
      fontFamily: 'SF Mono, Monaco, "Cascadia Code", monospace'
    }
  }
} as const;

// Type definitions for TypeScript
export type TypographyStyle = keyof typeof Typography.styles;
export type FontWeight = keyof typeof Typography.fontWeight;
export type DynamicTypeScale = keyof typeof Typography.dynamicType.scales;

// Utility function to get typography style with dynamic type support
export const getTypographyStyle = (
  style: TypographyStyle, 
  scale: DynamicTypeScale = 'medium'
) => {
  const baseStyle = Typography.styles[style];
  const scaleFactor = Typography.dynamicType.scales[scale];
  
  return {
    ...baseStyle,
    fontSize: Math.round(baseStyle.fontSize * scaleFactor),
    lineHeight: Math.round(baseStyle.lineHeight * scaleFactor)
  };
};

// CSS helper for creating typography classes
export const createTypographyCSS = (style: TypographyStyle) => {
  const typographyStyle = Typography.styles[style];
  
  return {
    fontFamily: typographyStyle.fontFamily,
    fontSize: `${typographyStyle.fontSize}px`,
    lineHeight: `${typographyStyle.lineHeight}px`,
    fontWeight: typographyStyle.fontWeight,
    letterSpacing: `${typographyStyle.letterSpacing}px`
  };
};
