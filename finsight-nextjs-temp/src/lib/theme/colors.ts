// Color palette implementation as per Phase 1 specifications
export const Colors = {
  primary: {
    finsightGreen: '#00D4AA',
    premiumBlue: '#007AFF',
    warningOrange: '#FF9500',
    errorRed: '#FF3B30'
  },
  semantic: {
    income: '#34C759',
    expense: '#FF6B6B',
    investment: '#5856D6',
    savings: '#FFCC02',
    debt: '#FF6347'
  },
  system: {
    background: {
      primary: { light: '#FFFFFF', dark: '#000000' },
      secondary: { light: '#F2F2F7', dark: '#1C1C1E' },
      tertiary: { light: '#FFFFFF', dark: '#2C2C2E' },
      grouped: { light: '#F2F2F7', dark: '#000000' }
    },
    text: {
      primary: { light: '#000000', dark: '#FFFFFF' },
      secondary: { light: '#3C3C43', dark: '#EBEBF5' },
      tertiary: { light: '#3C3C4399', dark: '#EBEBF599' },
      quaternary: { light: '#3C3C4366', dark: '#EBEBF54D' }
    },
    label: {
      primary: { light: '#000000', dark: '#FFFFFF' },
      secondary: { light: '#3C3C43', dark: '#EBEBF5' },
      tertiary: { light: '#3C3C4399', dark: '#EBEBF599' },
      quaternary: { light: '#3C3C4366', dark: '#EBEBF54D' }
    },
    fill: {
      primary: { light: '#787880', dark: '#787880' },
      secondary: { light: '#78788033', dark: '#78788028' },
      tertiary: { light: '#7878801F', dark: '#78788018' },
      quaternary: { light: '#78788014', dark: '#7878800F' }
    },
    separator: {
      primary: { light: '#3C3C4349', dark: '#54545899' },
      secondary: { light: '#3C3C431F', dark: '#54545849' }
    }
  },
  gradients: {
    finsightPrimary: 'linear-gradient(135deg, #00D4AA 0%, #007AFF 100%)',
    income: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
    expense: 'linear-gradient(135deg, #FF6B6B 0%, #FF453A 100%)',
    investment: 'linear-gradient(135deg, #5856D6 0%, #5E5CE6 100%)',
    savings: 'linear-gradient(135deg, #FFCC02 0%, #FFD60A 100%)',
    mesh: {
      light: 'linear-gradient(135deg, #F2F2F7 0%, #FFFFFF 50%, #F2F2F7 100%)',
      dark: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 50%, #1C1C1E 100%)'
    }
  }
} as const;

// Color scheme type definitions
export type ColorScheme = 'light' | 'dark' | 'system' | 'high-contrast';
export type ColorValue = { light: string; dark: string; 'high-contrast'?: string };

// Utility function to get theme-aware color
export const getColor = (colorValue: string | ColorValue, scheme: ColorScheme = 'light'): string => {
  if (typeof colorValue === 'string') return colorValue;
  
  if (scheme === 'system') {
    // In a real app, this would check system preference
    scheme = 'light';
  }
  
  if (scheme === 'high-contrast') {
    return colorValue['high-contrast'] || colorValue.dark;
  }
  
  return colorValue[scheme as 'light' | 'dark'];
};

// Semantic color mapping for financial contexts
export const FinancialColors = {
  positive: Colors.semantic.income,
  negative: Colors.semantic.expense,
  neutral: Colors.system.text.secondary,
  warning: Colors.primary.warningOrange,
  danger: Colors.primary.errorRed,
  success: Colors.semantic.income,
  info: Colors.primary.premiumBlue
} as const;
