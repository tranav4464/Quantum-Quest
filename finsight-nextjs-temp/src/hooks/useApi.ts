// FinSight Phase 3 API Hooks
// React Query hooks for efficient data fetching and mutations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useAppActions } from '@/store/appStore';

// API Base Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://finsight.app/api' 
  : 'http://localhost:3000/api';

// Query Keys
export const queryKeys = {
  user: ['user'] as const,
  accounts: ['accounts'] as const,
  transactions: (filters?: any) => ['transactions', filters] as const,
  goals: (filters?: any) => ['goals', filters] as const,
  insights: (filters?: any) => ['insights', filters] as const,
  debts: ['debts'] as const,
  budgets: ['budgets'] as const,
  investments: ['investments'] as const,
  reports: (type?: string) => ['reports', type] as const,
};

// API Client
class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: `HTTP ${response.status}: ${response.statusText}` 
      }));
      throw new Error(error.error || 'An error occurred');
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient();

// User Profile Hooks
export function useUserProfile() {
  const { data: session } = useSession();
  const { setProfile, setLoading } = useAppActions();

  const query = useQuery({
    queryKey: queryKeys.user,
    queryFn: () => apiClient.get<any>('/users'),
    enabled: !!session?.user,
  });

  // Handle loading state
  useEffect(() => {
    setLoading('profile', query.isLoading);
  }, [query.isLoading, setLoading]);

  // Handle data
  useEffect(() => {
    if (query.data?.user?.profile) {
      setProfile(query.data.user.profile);
    }
  }, [query.data, setProfile]);

  return query;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { addNotification } = useAppActions();

  return useMutation({
    mutationFn: (data: any) => apiClient.put('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated.',
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update profile.',
      });
    },
  });
}

// Bank Accounts Hooks
export function useBankAccounts() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: queryKeys.accounts,
    queryFn: () => apiClient.get('/accounts'),
    enabled: !!session?.user,
  });
}

export function useAddBankAccount() {
  const queryClient = useQueryClient();
  const { addNotification } = useAppActions();

  return useMutation({
    mutationFn: (data: any) => apiClient.post('/accounts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      addNotification({
        type: 'success',
        title: 'Account Connected',
        message: 'Your bank account has been successfully connected.',
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Connection Failed',
        message: error.message || 'Failed to connect bank account.',
      });
    },
  });
}

// Transactions Hooks
export function useTransactions(filters?: {
  page?: number;
  limit?: number;
  category?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}) {
  const { data: session } = useSession();

  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
  }

  return useQuery({
    queryKey: queryKeys.transactions(filters),
    queryFn: () => apiClient.get(`/transactions?${queryParams.toString()}`),
    enabled: !!session?.user,
  });
}

// Goals Hooks
export function useGoals(filters?: {
  category?: string;
  completed?: boolean;
}) {
  const { data: session } = useSession();

  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
  }

  return useQuery({
    queryKey: queryKeys.goals(filters),
    queryFn: () => apiClient.get(`/goals?${queryParams.toString()}`),
    enabled: !!session?.user,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  const { addNotification } = useAppActions();

  return useMutation({
    mutationFn: (data: any) => apiClient.post('/goals', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals() });
      addNotification({
        type: 'success',
        title: 'Goal Created',
        message: 'Your financial goal has been successfully created.',
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Goal Creation Failed',
        message: error.message || 'Failed to create goal.',
      });
    },
  });
}

// AI Insights Hooks
export function useInsights(filters?: {
  type?: string;
  unread?: boolean;
}) {
  const { data: session } = useSession();

  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
  }

  return useQuery({
    queryKey: queryKeys.insights(filters),
    queryFn: () => apiClient.get(`/insights?${queryParams.toString()}`),
    enabled: !!session?.user,
  });
}

export function useGenerateInsights() {
  const queryClient = useQueryClient();
  const { addNotification } = useAppActions();

  return useMutation({
    mutationFn: () => apiClient.post('/insights'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.insights() });
      addNotification({
        type: 'success',
        title: 'Insights Generated',
        message: 'New AI insights have been generated for your financial data.',
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Generation Failed',
        message: error.message || 'Failed to generate insights.',
      });
    },
  });
}
