'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import BottomTabNavigation from '@/components/molecules/BottomTabNavigation';
import CreateGoalModal from '@/components/modals/CreateGoalModal';
import { useGoalsWithFallback, useAddContribution, useMarkGoalCompleted } from '@/hooks/useGoals';

const GoalsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [contributionModal, setContributionModal] = useState<{
    isOpen: boolean;
    goalId?: string;
    amount: string;
  }>({
    isOpen: false,
    amount: '',
  });

  // API hooks
  const { data: goalsData, isLoading, error, refetch } = useGoalsWithFallback();
  const addContribution = useAddContribution();
  const markCompleted = useMarkGoalCompleted();

  // Transform API data to component format
  const goals = goalsData?.goals?.map((goal: any) => ({
    id: goal.id,
    title: goal.name,
    targetAmount: goal.target_amount,
    currentAmount: goal.current_amount,
    deadline: goal.target_date,
    category: goal.goal_type,
    icon: getGoalIcon(goal.goal_type),
    color: getGoalColor(goal.priority),
    priority: goal.priority,
    progress: goal.completion_percentage || 0,
    isCompleted: goal.is_completed,
    daysRemaining: goal.days_remaining,
  })) || [];

  // Helper functions
  function getGoalIcon(goalType: string): string {
    const iconMap: Record<string, string> = {
      emergency_fund: '🛡️',
      retirement: '🏖️',
      vacation: '✈️',
      purchase: '🏠',
      education: '📚',
      debt_payoff: '💳',
      investment: '📈',
      other: '🎯',
    };
    return iconMap[goalType] || '🎯';
  }

  function getGoalColor(priority: string): string {
    const colorMap: Record<string, string> = {
      critical: '#FF6B6B',
      high: '#FF6B6B', 
      medium: '#4ECDC4',
      low: '#45B7D1',
    };
    return colorMap[priority] || '#95A5A6';
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day left';
    if (diffDays < 30) return `${diffDays} days left`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months left`;
    return `${Math.ceil(diffDays / 365)} years left`;
  }

  // Filter goals
  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    return goal.priority === filter;
  });

  // Calculate summary stats
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const averageProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  // Handle add contribution
  const handleAddContribution = async () => {
    if (!contributionModal.goalId || !contributionModal.amount) return;
    
    try {
      await addContribution.mutateAsync({
        goalId: contributionModal.goalId,
        amount: parseFloat(contributionModal.amount),
        notes: `Manual contribution of $${contributionModal.amount}`,
      });
      
      setContributionModal({ isOpen: false, amount: '' });
      refetch();
    } catch (error) {
      console.error('Failed to add contribution:', error);
    }
  };

  // Handle mark completed
  const handleMarkCompleted = async (goalId: string) => {
    try {
      await markCompleted.mutateAsync(goalId);
      refetch();
    } catch (error) {
      console.error('Failed to mark goal as completed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-background-primary)] to-[var(--color-background-secondary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading your goals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-background-primary)] to-[var(--color-background-secondary)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--color-error)] mb-4">Failed to load goals</p>
          <Button variant="primary" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background-primary)] to-[var(--color-background-secondary)]">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Financial Goals</h1>
          <p className="text-body text-[var(--color-text-secondary)]">Track your financial aspirations</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Progress Overview */}
        <motion.div 
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-lg font-bold text-[var(--color-text-primary)]">{goals.length}</div>
            <div className="text-sm text-[var(--color-text-secondary)]">Total Goals</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">💰</div>
            <div className="text-lg font-bold text-[var(--color-text-primary)]">${totalSaved.toLocaleString()}</div>
            <div className="text-sm text-[var(--color-text-secondary)]">Saved</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-lg font-bold text-[var(--color-text-primary)]">{averageProgress.toFixed(0)}%</div>
            <div className="text-sm text-[var(--color-text-secondary)]">Progress</div>
          </Card>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {[
            { value: 'all', label: 'All Goals' },
            { value: 'high', label: 'High Priority' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' }
          ].map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter(option.value as any)}
            >
              {option.label}
            </Button>
          ))}
        </motion.div>

        {/* Goals List */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {filteredGoals.map((goal, index) => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100;
            const remaining = goal.targetAmount - goal.currentAmount;
            const timeLeft = formatDate(goal.deadline);

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  className="p-5 hover:shadow-lg transition-shadow cursor-pointer"
                  clickable={true}
                  onClick={() => setSelectedGoal(selectedGoal === goal.id ? null : goal.id)}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: `${goal.color}20` }}
                    >
                      {goal.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-headline text-[var(--color-text-primary)] truncate">{goal.title}</h3>
                          <p className="text-footnote text-[var(--color-text-secondary)]">{goal.category.replace('_', ' ').toUpperCase()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-caption-2 font-medium ${
                            goal.priority === 'high' || goal.priority === 'critical' ? 
                              'bg-red-50 text-red-600' :
                            goal.priority === 'medium' ? 
                              'bg-yellow-50 text-yellow-600' :
                              'bg-green-50 text-green-600'
                          }`}>
                            {goal.priority}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-subhead text-[var(--color-text-secondary)]">
                            ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                          </span>
                          <span className="text-subhead font-semibold text-[var(--color-text-primary)]">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="h-2 rounded-full"
                            style={{ backgroundColor: goal.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(percentage, 100)}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-footnote text-[var(--color-text-secondary)]">
                            ${remaining.toLocaleString()} remaining
                          </p>
                          <p className="text-caption-1 text-[var(--color-text-secondary)]">
                            {timeLeft}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              setContributionModal({
                                isOpen: true,
                                goalId: goal.id,
                                amount: '',
                              });
                            }}
                          >
                            Add Funds
                          </Button>
                          {goal.progress >= 100 && !goal.isCompleted && (
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click
                                handleMarkCompleted(goal.id);
                              }}
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Create Goal CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-title-3 text-[var(--color-text-primary)] mb-2">Create New Goal</h3>
            <p className="text-body text-[var(--color-text-secondary)] mb-4">
              Set a financial target and track your progress
            </p>
            <Button 
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Goal
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Goal Details Modal */}
      <AnimatePresence>
        {selectedGoal && (() => {
          const goal = goals.find(g => g.id === selectedGoal);
          if (!goal) return null;
          
          return (
            <motion.div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGoal(null)}
            >
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 overflow-hidden"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${goal.color}20` }}
                    >
                      {goal.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{goal.title}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{goal.category.replace('_', ' ').toUpperCase()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedGoal(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Progress Section */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                      <motion.div
                        className="h-2.5 rounded-full"
                        style={{ backgroundColor: goal.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>${goal.currentAmount.toLocaleString()}</span>
                      <span>${goal.targetAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Details Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Priority</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{goal.priority}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Deadline</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(goal.deadline)}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Remaining</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${(goal.targetAmount - goal.currentAmount).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {goal.isCompleted ? 'Completed' : 'In Progress'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions Section */}
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => setSelectedGoal(null)}
                    >
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => {
                        setSelectedGoal(null);
                        setContributionModal({
                          isOpen: true,
                          goalId: goal.id,
                          amount: '',
                        });
                      }}
                    >
                      Add Contribution
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
      
      {/* Create Goal Modal */}
      <CreateGoalModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => refetch()}
      />

      {/* Add Contribution Modal */}
      {contributionModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-sm w-full p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Add Contribution
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                <input
                  type="number"
                  value={contributionModal.amount}
                  onChange={(e) => setContributionModal(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="100"
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setContributionModal({ isOpen: false, amount: '' })}
              >
                Cancel
              </Button>
              
              <Button
                variant="primary"
                size="md"
                onClick={handleAddContribution}
                isLoading={addContribution.isPending}
                isDisabled={!contributionModal.amount || addContribution.isPending}
              >
                Add Contribution
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <BottomTabNavigation activeTab="goals" />
    </div>
  );
};

export default GoalsPage;
