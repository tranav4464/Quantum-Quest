// Brand Colors
export const COLORS = {
  // Primary brand colors
  primary: {
    50: '#E6FFFA',
    100: '#B3FFF0',
    500: '#00D4AA',
    600: '#00B894',
    700: '#009B7D',
    900: '#006B55',
  },
  secondary: {
    50: '#E6F3FF',
    100: '#B3DBFF',
    500: '#007AFF',
    600: '#0056CC',
    700: '#004299',
    900: '#002E66',
  },
  
  // Semantic colors
  success: {
    50: '#F0FDF4',
    500: '#22C55E',
    600: '#16A34A',
  },
  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',
    600: '#D97706',
  },
  danger: {
    50: '#FEF2F2',
    500: '#EF4444',
    600: '#DC2626',
  },
  
  // Neutral colors
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const;

// Typography System
export const TYPOGRAPHY = {
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
  },
  fontSize: {
    'large-title': '2.125rem',    // 34px
    'title-1': '1.75rem',        // 28px
    'title-2': '1.375rem',       // 22px
    'title-3': '1.125rem',       // 18px
    'headline': '1rem',          // 16px
    'body': '1rem',              // 16px
    'callout': '0.9375rem',      // 15px
    'subhead': '0.875rem',       // 14px
    'footnote': '0.8125rem',     // 13px
    'caption-1': '0.75rem',      // 12px
    'caption-2': '0.6875rem',    // 11px
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

// Spacing System (8-point grid)
export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
  '5xl': '8rem',    // 128px
} as const;

// Border Radius
export const BORDER_RADIUS = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// Shadows
export const SHADOWS = {
  soft: '0 2px 8px rgba(0, 0, 0, 0.05)',
  medium: '0 4px 12px rgba(0, 0, 0, 0.1)',
  strong: '0 8px 24px rgba(0, 0, 0, 0.15)',
} as const;

// Animation Durations
export const ANIMATIONS = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const;

// Navigation Items - Phase 1: 5 Tabs as per specification
export const NAVIGATION_ITEMS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/',
    icon: 'home',
  },
  {
    key: 'smart-budget',
    label: 'Smart Budget',
    href: '/smart-budget',
    icon: 'target',
  },
  {
    key: 'ai-companion',
    label: 'AI Companion',
    href: '/ai',
    icon: 'cpu',
  },
  {
    key: 'predict-hub',
    label: 'Predict Hub',
    href: '/predict-hub',
    icon: 'trending-up',
  },
  {
    key: 'learn-arena',
    label: 'Learn Arena',
    href: '/learn-arena',
    icon: 'book-open',
  },
] as const;

// Financial Categories
export const TRANSACTION_CATEGORIES = {
  income: [
    { id: 'salary', name: 'Salary', icon: '💰', color: COLORS.success[500] },
    { id: 'freelance', name: 'Freelance', icon: '💻', color: COLORS.success[500] },
    { id: 'investment', name: 'Investment', icon: '📈', color: COLORS.success[500] },
    { id: 'gift', name: 'Gift', icon: '🎁', color: COLORS.success[500] },
    { id: 'allowance', name: 'Allowance', icon: '👨‍👩‍👧‍👦', color: COLORS.success[500] },
    { id: 'other-income', name: 'Other Income', icon: '💵', color: COLORS.success[500] },
  ],
  expense: [
    { id: 'food', name: 'Food & Dining', icon: '🍕', color: COLORS.danger[500] },
    { id: 'transportation', name: 'Transportation', icon: '🚗', color: COLORS.warning[500] },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: COLORS.primary[500] },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: COLORS.secondary[500] },
    { id: 'education', name: 'Education', icon: '📚', color: COLORS.secondary[600] },
    { id: 'health', name: 'Health & Fitness', icon: '⚕️', color: COLORS.success[600] },
    { id: 'utilities', name: 'Utilities', icon: '💡', color: COLORS.warning[600] },
    { id: 'subscriptions', name: 'Subscriptions', icon: '📱', color: COLORS.primary[600] },
    { id: 'personal', name: 'Personal Care', icon: '🧴', color: COLORS.gray[500] },
    { id: 'other-expense', name: 'Other Expenses', icon: '📋', color: COLORS.gray[600] },
  ],
} as const;

// Goal Categories
export const GOAL_CATEGORIES = [
  { 
    id: 'emergency-fund', 
    name: 'Emergency Fund', 
    icon: '🚨', 
    color: COLORS.danger[500],
    description: 'Build a safety net for unexpected expenses'
  },
  { 
    id: 'vacation', 
    name: 'Vacation', 
    icon: '✈️', 
    color: COLORS.secondary[500],
    description: 'Save for your dream trip or getaway'
  },
  { 
    id: 'car', 
    name: 'Car Purchase', 
    icon: '🚗', 
    color: COLORS.warning[500],
    description: 'Save for a new or used vehicle'
  },
  { 
    id: 'education', 
    name: 'Education', 
    icon: '🎓', 
    color: COLORS.primary[500],
    description: 'Fund your education or skill development'
  },
  { 
    id: 'house', 
    name: 'House Down Payment', 
    icon: '🏠', 
    color: COLORS.success[500],
    description: 'Save for your first home down payment'
  },
  { 
    id: 'gadget', 
    name: 'Electronics', 
    icon: '📱', 
    color: COLORS.secondary[600],
    description: 'Save for the latest tech and gadgets'
  },
  { 
    id: 'investment', 
    name: 'Investment', 
    icon: '📈', 
    color: COLORS.success[600],
    description: 'Build your investment portfolio'
  },
  { 
    id: 'other', 
    name: 'Other Goal', 
    icon: '🎯', 
    color: COLORS.gray[500],
    description: 'Set a custom savings goal'
  },
] as const;

// Quick Actions
export const QUICK_ACTIONS = [
  {
    id: 'add-income',
    title: 'Add Income',
    icon: '💰',
    color: COLORS.success[500],
    bgColor: COLORS.success[50],
    description: 'Record money earned',
  },
  {
    id: 'track-expense',
    title: 'Track Expense',
    icon: '💸',
    color: COLORS.danger[500],
    bgColor: COLORS.danger[50],
    description: 'Log money spent',
  },
  {
    id: 'set-goal',
    title: 'Set Goal',
    icon: '🎯',
    color: COLORS.primary[500],
    bgColor: COLORS.primary[50],
    description: 'Create savings target',
  },
  {
    id: 'create-budget',
    title: 'Create Budget',
    icon: '📊',
    color: COLORS.secondary[500],
    bgColor: COLORS.secondary[50],
    description: 'Plan your spending',
  },
  {
    id: 'ask-ai',
    title: 'Ask AI',
    icon: '🤖',
    color: COLORS.primary[600],
    bgColor: COLORS.primary[50],
    description: 'Get financial advice',
  },
  {
    id: 'learn',
    title: 'Learn',
    icon: '📚',
    color: COLORS.secondary[600],
    bgColor: COLORS.secondary[50],
    description: 'Explore finance topics',
  },
] as const;

// Financial Health Score Ranges
export const HEALTH_SCORE_RANGES = {
  excellent: { min: 800, max: 850, color: COLORS.success[500], label: 'Excellent' },
  good: { min: 700, max: 799, color: COLORS.primary[500], label: 'Good' },
  fair: { min: 600, max: 699, color: COLORS.warning[500], label: 'Fair' },
  poor: { min: 300, max: 599, color: COLORS.danger[500], label: 'Poor' },
} as const;

// Budget Alert Thresholds
export const BUDGET_THRESHOLDS = {
  warning: 75,    // 75% of budget used
  danger: 90,     // 90% of budget used
  exceeded: 100,  // 100% of budget used
} as const;

// Currency Options
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
] as const;

// Recurring Patterns
export const RECURRING_PATTERNS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
] as const;

// Time Periods
export const TIME_PERIODS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 3 months' },
  { value: '1y', label: 'Last year' },
  { value: 'all', label: 'All time' },
] as const;

// API Configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  retries: 3,
  endpoints: {
    auth: '/auth',
    users: '/users',
    transactions: '/transactions',
    budgets: '/budgets',
    goals: '/goals',
    health: '/health',
    ai: '/ai',
    education: '/education',
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  authToken: 'finsight_auth_token',
  refreshToken: 'finsight_refresh_token',
  userPreferences: 'finsight_user_preferences',
  onboardingCompleted: 'finsight_onboarding_completed',
  lastSyncTime: 'finsight_last_sync',
  draftTransactions: 'finsight_draft_transactions',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  aiAssistant: true,
  socialFeatures: false,
  investmentTracking: true,
  darkMode: true,
  notifications: true,
  analytics: true,
  exportData: true,
  multiCurrency: false,
} as const;

// Educational Content Categories
export const EDUCATION_CATEGORIES = [
  { 
    id: 'basics', 
    name: 'Financial Basics', 
    icon: '📘', 
    color: COLORS.primary[500],
    description: 'Learn fundamental financial concepts'
  },
  { 
    id: 'budgeting', 
    name: 'Budgeting', 
    icon: '📊', 
    color: COLORS.secondary[500],
    description: 'Master the art of budgeting and planning'
  },
  { 
    id: 'saving', 
    name: 'Saving Money', 
    icon: '🏦', 
    color: COLORS.success[500],
    description: 'Effective strategies to save money'
  },
  { 
    id: 'investing', 
    name: 'Investing', 
    icon: '📈', 
    color: COLORS.warning[500],
    description: 'Introduction to investing and growing wealth'
  },
  { 
    id: 'debt', 
    name: 'Debt Management', 
    icon: '💳', 
    color: COLORS.danger[500],
    description: 'Learn to manage and eliminate debt'
  },
  { 
    id: 'career', 
    name: 'Career & Income', 
    icon: '💼', 
    color: COLORS.gray[600],
    description: 'Maximize your earning potential'
  },
] as const;

// App Metadata
export const APP_METADATA = {
  name: 'FinSight',
  description: 'Your Personal Finance Companion for Smart Money Management',
  version: '1.0.0',
  author: 'FinSight Team',
  website: 'https://finsight.app',
  support: 'support@finsight.app',
  privacy: 'https://finsight.app/privacy',
  terms: 'https://finsight.app/terms',
} as const;

// Export all constants
export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  ANIMATIONS,
  NAVIGATION_ITEMS,
  TRANSACTION_CATEGORIES,
  GOAL_CATEGORIES,
  QUICK_ACTIONS,
  HEALTH_SCORE_RANGES,
  BUDGET_THRESHOLDS,
  CURRENCIES,
  RECURRING_PATTERNS,
  TIME_PERIODS,
  API_CONFIG,
  STORAGE_KEYS,
  FEATURE_FLAGS,
  EDUCATION_CATEGORIES,
  APP_METADATA,
};
