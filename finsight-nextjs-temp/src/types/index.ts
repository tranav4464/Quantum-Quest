// User Management Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  avatar?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  financialProfile: FinancialProfile;
}

export interface UserPreferences {
  currency: string;
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  theme: 'light' | 'dark' | 'system';
  privacySettings: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  budgetAlerts: boolean;
  goalReminders: boolean;
  weeklyReports: boolean;
  marketingCommunications: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  shareFinancialData: boolean;
  allowAnalytics: boolean;
}

export interface FinancialProfile {
  monthlyIncome?: number;
  employmentStatus: 'student' | 'part-time' | 'full-time' | 'unemployed' | 'self-employed';
  financialGoals: string[];
  riskTolerance: 'low' | 'medium' | 'high';
  investmentExperience: 'none' | 'beginner' | 'intermediate' | 'advanced';
}

// Financial Transaction Types
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: 'income' | 'expense' | 'transfer';
  category: TransactionCategory;
  subcategory?: string;
  description: string;
  date: Date;
  merchantName?: string;
  location?: Location;
  tags: string[];
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  accountId?: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  subcategories: TransactionSubcategory[];
}

export interface TransactionSubcategory {
  id: string;
  name: string;
  icon: string;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
  nextDate: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

// Budget Management Types
export interface Budget {
  id: string;
  userId: string;
  name: string;
  description?: string;
  totalAmount: number;
  currency: string;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  categories: BudgetCategory[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetCategory {
  categoryId: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  warningThreshold: number; // Percentage (e.g., 80 for 80%)
}

// Goal Management Types
export interface FinancialGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate: Date;
  category: GoalCategory;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  milestones: GoalMilestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  targetAmount: number;
  targetDate: Date;
  isCompleted: boolean;
  completedAt?: Date;
}

// Financial Health & Analytics Types
export interface FinancialHealthScore {
  userId: string;
  overallScore: number;
  maxScore: number;
  lastCalculated: Date;
  components: HealthScoreComponent[];
  trends: HealthTrend[];
  recommendations: HealthRecommendation[];
}

export interface HealthScoreComponent {
  category: 'budgeting' | 'saving' | 'debt' | 'investing' | 'planning';
  score: number;
  maxScore: number;
  weight: number;
  description: string;
  factors: HealthFactor[];
}

export interface HealthFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  value: number;
  description: string;
}

export interface HealthTrend {
  period: string;
  score: number;
  change: number;
}

export interface HealthRecommendation {
  id: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  actionItems: string[];
  potentialImpact: number;
  timeframe: string;
}

// AI Assistant Types
export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  messages: AIMessage[];
  context: ConversationContext;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachments?: MessageAttachment[];
  actions?: MessageAction[];
}

export interface MessageAttachment {
  type: 'image' | 'document' | 'transaction' | 'goal' | 'budget';
  url: string;
  metadata?: Record<string, any>;
}

export interface MessageAction {
  type: 'create_budget' | 'set_goal' | 'categorize_transaction' | 'schedule_reminder';
  label: string;
  data: Record<string, any>;
}

export interface ConversationContext {
  topic: string;
  relatedEntities: string[];
  userIntent: string;
  confidence: number;
}

// Educational Content Types
export interface EducationalContent {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'article' | 'video' | 'quiz' | 'interactive' | 'podcast';
  category: ContentCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
  tags: string[];
  author: ContentAuthor;
  publishedAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  metadata: ContentMetadata;
}

export interface ContentCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface ContentAuthor {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  credentials: string[];
}

export interface ContentMetadata {
  views: number;
  likes: number;
  completions: number;
  averageRating: number;
  totalRatings: number;
}

// Progress Tracking Types
export interface UserProgress {
  userId: string;
  coursesCompleted: CourseProgress[];
  badgesEarned: Badge[];
  streakData: StreakData;
  skillLevels: SkillLevel[];
  totalPoints: number;
  currentLevel: number;
  updatedAt: Date;
}

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  totalLessons: number;
  progressPercentage: number;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in minutes
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
  criteria: BadgeCriteria;
}

export interface BadgeCriteria {
  type: 'completion' | 'streak' | 'score' | 'achievement';
  requirements: Record<string, any>;
}

export interface StreakData {
  current: number;
  longest: number;
  lastActiveDate: Date;
  weeklyGoal: number;
  monthlyGoal: number;
}

export interface SkillLevel {
  skill: string;
  level: number;
  experience: number;
  nextLevelExperience: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// UI Component Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  children: React.ReactNode;
}

export interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  isDisabled?: boolean;
}

export interface NavigationItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number | string;
  isActive?: boolean;
  onClick?: () => void;
}

export interface DrawerNavigationProps {
  className?: string;
  onItemClick?: () => void;
}

export interface DrawerTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

// Form Types
export interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date';
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
  helperText?: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
  isDisabled?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Chart and Data Visualization Types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

export interface MetricCard {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  color?: string;
  description?: string;
}

// Export all types for easy importing
export type {
  // Re-export React types for convenience
  ReactNode,
  ReactElement,
  ComponentProps,
} from 'react';
