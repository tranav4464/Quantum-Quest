// API Service Layer - Complete Frontend-Backend Integration
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
import { getPlatformApiUrl } from './platform-utils';

// Get the platform-specific API URL
const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_BASE_URL = getPlatformApiUrl(DEFAULT_API_URL);

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  monthly_income: number;
  currency: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  name: string;
  account_type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan' | 'other';
  balance: number;
  balance_display: string;
  credit_limit?: number;
  bank_name?: string;
  account_number_last4?: string;
  is_active: boolean;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  category_type: 'income' | 'expense' | 'transfer';
  color: string;
  icon: string;
  is_system: boolean;
  transaction_count: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  account: string;
  account_name: string;
  category?: string;
  category_name?: string;
  amount: number;
  amount_display: string;
  transaction_type: 'debit' | 'credit' | 'transfer';
  description: string;
  notes?: string;
  merchant_name?: string;
  location?: string;
  transaction_date: string;
  posted_date?: string;
  is_pending: boolean;
  is_recurring: boolean;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  category: string;
  category_name: string;
  name: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  alert_threshold: number;
  is_active: boolean;
  rollover_unused: boolean;
  spent_amount: number;
  remaining_amount: number;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  name: string;
  description?: string;
  goal_type: 'savings' | 'debt_payoff' | 'investment' | 'expense' | 'other';
  target_amount: number;
  current_amount: number;
  target_date: string;
  is_active: boolean;
  auto_contribute: boolean;
  contribution_amount: number;
  progress_percentage: number;
  remaining_amount: number;
  days_remaining: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  total_balance: number;
  account_count: number;
  monthly_income: number;
  monthly_expenses: number;
  savings_rate: number;
  recent_transactions: Transaction[];
  active_budgets: Budget[];
  active_goals: Goal[];
  financial_health_score: number;
  pending_insights: any[];
  category_spending: Record<string, number>;
  user_currency: string;
  user_timezone: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// API Service Class
class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;
  private isLoggingOut: boolean = false;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
      if (this.token) {
        this.setAuthToken(this.token);
      }
    }

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        if (this.token && !this.isLoggingOut) {
          config.headers.Authorization = `Token ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && !this.isLoggingOut) {
          // Only logout if we're not already in the process of logging out
          this.clearAuthToken();
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  setAuthToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
    this.api.defaults.headers.common['Authorization'] = `Token ${token}`;
  }

  clearAuthToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    delete this.api.defaults.headers.common['Authorization'];
  }

  // Authentication API calls
  async register(userData: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    date_of_birth?: string;
    monthly_income?: number;
    currency?: string;
    timezone?: string;
  }): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register/', userData);
    this.setAuthToken(response.data.token);
    return response.data;
  }

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login/', credentials);
    this.setAuthToken(response.data.token);
    return response.data;
  }

  async logout(): Promise<void> {
    if (this.isLoggingOut) return; // Prevent multiple logout calls
    
    this.isLoggingOut = true;
    try {
      if (this.token) {
        await this.api.post('/auth/logout/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthToken();
      this.isLoggingOut = false;
    }
  }

  // Dashboard API calls
  async getDashboardData(): Promise<DashboardData> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<DashboardData> = await this.api.get('/dashboard/');
    return response.data;
  }

  // User API calls
  async getUserProfile(): Promise<User> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<User> = await this.api.get('/users/profile/');
    return response.data;
  }

  async updateUserProfile(userData: Partial<User>): Promise<User> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<User> = await this.api.patch('/users/update_profile/', userData);
    return response.data;
  }

  // Account API calls
  async getAccounts(): Promise<Account[]> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<Account[]> = await this.api.get('/accounts/');
    return response.data;
  }

  async createAccount(accountData: Partial<Account>): Promise<Account> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<Account> = await this.api.post('/accounts/', accountData);
    return response.data;
  }

  async updateAccount(id: string, accountData: Partial<Account>): Promise<Account> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<Account> = await this.api.patch(`/accounts/${id}/`, accountData);
    return response.data;
  }

  async deleteAccount(id: string): Promise<void> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    await this.api.delete(`/accounts/${id}/`);
  }

  // Transaction API calls
  async getTransactions(params?: {
    page?: number;
    page_size?: number;
    category?: string;
    account?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<{ results: Transaction[]; count: number; next?: string; previous?: string }> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<{ results: Transaction[]; count: number; next?: string; previous?: string }> = 
      await this.api.get('/transactions/', { params });
    return response.data;
  }

  async createTransaction(transactionData: Partial<Transaction>): Promise<Transaction> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<Transaction> = await this.api.post('/transactions/', transactionData);
    return response.data;
  }

  async updateTransaction(id: string, transactionData: Partial<Transaction>): Promise<Transaction> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<Transaction> = await this.api.patch(`/transactions/${id}/`, transactionData);
    return response.data;
  }

  async deleteTransaction(id: string): Promise<void> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    await this.api.delete(`/transactions/${id}/`);
  }

  // Category API calls
  async getCategories(): Promise<Category[]> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<Category[]> = await this.api.get('/categories/');
    return response.data;
  }

  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<Category> = await this.api.post('/categories/', categoryData);
    return response.data;
  }

  async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<Category> = await this.api.patch(`/categories/${id}/`, categoryData);
    return response.data;
  }

  async deleteCategory(id: string): Promise<void> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    await this.api.delete(`/categories/${id}/`);
  }

  // Budget API calls
  async getBudgets(): Promise<Budget[]> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<Budget[]> = await this.api.get('/budgets/');
    return response.data;
  }

  async createBudget(budgetData: Partial<Budget>): Promise<Budget> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<Budget> = await this.api.post('/budgets/', budgetData);
    return response.data;
  }

  async updateBudget(id: string, budgetData: Partial<Budget>): Promise<Budget> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<Budget> = await this.api.patch(`/budgets/${id}/`, budgetData);
    return response.data;
  }

  async deleteBudget(id: string): Promise<void> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    await this.api.delete(`/budgets/${id}/`);
  }

  // Goal API calls
  async getGoals(): Promise<Goal[]> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<Goal[]> = await this.api.get('/goals/');
    return response.data;
  }

  async createGoal(goalData: Partial<Goal>): Promise<Goal> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<Goal> = await this.api.post('/goals/', goalData);
    return response.data;
  }

  async updateGoal(id: string, goalData: Partial<Goal>): Promise<Goal> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<Goal> = await this.api.patch(`/goals/${id}/`, goalData);
    return response.data;
  }

  async deleteGoal(id: string): Promise<void> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    await this.api.delete(`/goals/${id}/`);
  }

  async addGoalContribution(goalId: string, contributionData: { amount: number; description?: string }): Promise<Goal> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<Goal> = await this.api.post(`/goals/${goalId}/add-contribution/`, contributionData);
    return response.data;
  }

  // HTTP Methods
  async get<T>(endpoint: string): Promise<T> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<T> = await this.api.get(endpoint);
    return response.data;
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<T> = await this.api.put(endpoint, data);
    return response.data;
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    if (!this.token) {
      throw new Error('Authentication required');
    }
    const response: AxiosResponse<T> = await this.api.post(endpoint, data);
    return response.data;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getAuthToken(): string | null {
    return this.token;
  }
}

// Export singleton instance
export const apiService = new ApiService();