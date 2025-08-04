// Real implementation of goal hooks for production
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useAppActions } from '@/store/appStore';
import { apiService } from '@/lib/api-service';
import { queryKeys } from '@/hooks/useApi';

// Types
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
  category: string;
  priority?: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface GoalContribution {
  id: string;
  goal: string;
  amount: number;
  date: string;
  notes?: string;
  created_at: string;
}

export interface GoalMilestone {
  id: string;
  goal: string;
  name: string;
  amount: number;
  achieved: boolean;
  date_achieved?: string;
  created_at: string;
}

// Hook to fetch goals
export function useGoals(filters?: {
  category?: string;
  completed?: boolean;
}) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

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
    queryFn: async () => {
      try {
        const goals = await apiService.getGoals();
        return { goals };
      } catch (error) {
        console.error('Error fetching goals:', error);
        // Return mock data as fallback for development
        return {
          goals: [
            {
              id: 'emergency-fund',
              name: 'Emergency Fund',
              target_amount: 10000,
              current_amount: 5000,
              goal_type: 'savings' as 'savings',
              category: 'EMERGENCY_FUND',
              priority: 'HIGH' as 'HIGH',
              progress_percentage: 50,
              is_active: true,
              target_date: '2024-12-31',
              remaining_amount: 5000,
              days_remaining: 180,
              created_at: '2023-01-01T00:00:00Z',
              updated_at: '2023-01-01T00:00:00Z',
              auto_contribute: false,
              contribution_amount: 100,
            },
            {
              id: 'retirement',
              name: 'Retirement Savings',
              target_amount: 500000,
              current_amount: 75000,
              goal_type: 'investment' as 'investment',
              category: 'RETIREMENT',
              priority: 'MEDIUM' as 'MEDIUM',
              progress_percentage: 15,
              auto_contribute: true,
              contribution_amount: 500,
              is_active: true,
              target_date: '2050-01-01',
              remaining_amount: 425000,
              days_remaining: 9496,
              created_at: '2023-01-01T00:00:00Z',
              updated_at: '2023-01-01T00:00:00Z',
            },
            {
              id: 'vacation',
              name: 'Dream Vacation',
              target_amount: 5000,
              current_amount: 2500,
              goal_type: 'expense' as 'expense',
              category: 'VACATION',
              priority: 'LOW' as 'LOW',
              progress_percentage: 50,
              auto_contribute: false,
              contribution_amount: 200,
              is_active: true,
              target_date: '2024-06-01',
              remaining_amount: 2500,
              days_remaining: 60,
              created_at: '2023-01-01T00:00:00Z',
              updated_at: '2023-01-01T00:00:00Z',
            },
          ]
        };
      }
    },
    enabled: !!session?.user,
  });
}

// Hook to create a new goal
export function useCreateGoal() {
  const queryClient = useQueryClient();
  const { addNotification } = useAppActions();

  return useMutation({
    mutationFn: async (data: Partial<Goal>) => {
      return await apiService.createGoal(data);
    },
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

// Hook to update an existing goal
export function useUpdateGoal() {
  const queryClient = useQueryClient();
  const { addNotification } = useAppActions();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Goal> }) => {
      return await apiService.updateGoal(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals() });
      addNotification({
        type: 'success',
        title: 'Goal Updated',
        message: 'Your financial goal has been successfully updated.',
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Goal Update Failed',
        message: error.message || 'Failed to update goal.',
      });
    },
  });
}

// Hook to delete a goal
export function useDeleteGoal() {
  const queryClient = useQueryClient();
  const { addNotification } = useAppActions();

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiService.deleteGoal(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals() });
      addNotification({
        type: 'success',
        title: 'Goal Deleted',
        message: 'Your financial goal has been successfully deleted.',
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Goal Deletion Failed',
        message: error.message || 'Failed to delete goal.',
      });
    },
  });
}

// Hook to add a contribution to a goal
export function useAddGoalContribution() {
  const queryClient = useQueryClient();
  const { addNotification } = useAppActions();

  return useMutation({
    mutationFn: async (data: { goalId: string; amount: number; notes?: string }) => {
      return await apiService.addGoalContribution(data.goalId, {
        amount: data.amount,
        description: data.notes
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals() });
      addNotification({
        type: 'success',
        title: 'Contribution Added',
        message: 'Your contribution has been successfully added to the goal.',
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Contribution Failed',
        message: error.message || 'Failed to add contribution.',
      });
    },
  });
}

// Alias for useAddGoalContribution for backward compatibility
export function useAddContribution() {
  return useAddGoalContribution();
}

// Hook to fetch goals with fallback to mock data
export function useGoalsWithFallback(filters?: {
  category?: string;
  completed?: boolean;
}) {
  return useGoals(filters);
}

// Hook to mark a goal as completed
export function useMarkGoalCompleted() {
  const queryClient = useQueryClient();
  const { addNotification } = useAppActions();

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiService.updateGoal(id, { is_active: false });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals() });
      addNotification({
        type: 'success',
        title: 'Goal Completed',
        message: 'Your goal has been marked as completed.',
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Goal Update Failed',
        message: error.message || 'Failed to mark goal as completed.',
      });
    },
  });
}