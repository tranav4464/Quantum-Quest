// Mock implementation of goal hooks for development
import { useState, useEffect } from 'react';

// Mock data for goals
const mockGoals = [
  {
    id: 'emergency-fund',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 5000,
    category: 'EMERGENCY_FUND',
    priority: 'HIGH',
    progress: 50,
    isCompleted: false,
  },
  {
    id: 'retirement',
    name: 'Retirement Savings',
    targetAmount: 500000,
    currentAmount: 75000,
    category: 'RETIREMENT',
    priority: 'MEDIUM',
    progress: 15,
    isCompleted: false,
  },
  {
    id: 'vacation',
    name: 'Dream Vacation',
    targetAmount: 5000,
    currentAmount: 2500,
    category: 'VACATION',
    priority: 'LOW',
    progress: 50,
    isCompleted: false,
  },
];

// Mock useGoals hook
export function useGoals() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate API loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Mock refetch function
  const refetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  return {
    data: { goals: mockGoals },
    isLoading,
    error: null,
    refetch,
  };
}

// Mock useCreateGoal hook
export function useCreateGoal() {
  const [isPending, setIsPending] = useState(false);
  
  const mutate = (data: any, options?: { onSuccess?: () => void }) => {
    setIsPending(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsPending(false);
      // Add the new goal to our mock data
      mockGoals.push({
        id: `goal-${Date.now()}`,
        name: data.name,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount || 0,
        category: data.category,
        priority: data.priority,
        progress: data.currentAmount ? (data.currentAmount / data.targetAmount) * 100 : 0,
        isCompleted: false,
      });
      
      // Call onSuccess callback if provided
      if (options?.onSuccess) {
        options.onSuccess();
      }
    }, 1000);
  };
  
  return {
    mutate,
    isPending,
  };
}