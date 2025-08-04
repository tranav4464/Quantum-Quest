'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FaPlus, FaEdit, FaTrash, FaChartLine, FaMoneyBillWave, FaChartPie, FaGlobe } from 'react-icons/fa';
import { FaRegStar, FaRegListAlt } from 'react-icons/fa';
import CreateGoalModal from '@/components/modals/CreateGoalModal';
import GoalDetailsModal from '@/components/modals/GoalDetailsModal';
import GoalContributionModal from '@/components/modals/GoalContributionModal';
import { useGoals, useUpdateGoal, useDeleteGoal, useAddGoalContribution } from '@/hooks/useGoals';
import { Goal } from '@/hooks/useGoals';
import { Card } from '@/components/molecules/Card';
import { Colors } from '@/lib/theme/colors';
import Button from '@/components/atoms/Button';

// Goal Universe - Professional goal management interface
const GoalUniversePage: React.FC = () => {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedGoalForContribution, setSelectedGoalForContribution] = useState<Goal | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'goals' | 'universe' | 'timeline' | 'achievements'>('dashboard');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  
  // Fetch goals from API
  const { data: apiGoals, isLoading, error, refetch } = useGoals();
  const { mutate: updateGoal } = useUpdateGoal();
  const { mutate: deleteGoal } = useDeleteGoal();
  const { mutate: addContribution } = useAddGoalContribution();
  
  // Find the selected goal object
  const selectedGoal = apiGoals?.goals?.find((goal) => goal.id === selectedGoalId) || null;
  
  // Handle opening the goal details modal
  const handleGoalClick = (goalId: string) => {
    setSelectedGoalId(goalId);
    setIsDetailsModalOpen(true);
  };
  
  // Handle opening the contribution modal
  const handleAddContribution = (goal: Goal) => {
    setSelectedGoalForContribution(goal);
    setIsContributionModalOpen(true);
  };
  
  // Handle goal deletion
  const handleDeleteGoal = (goalId: string) => {
    deleteGoal(goalId, {
      onSuccess: () => {
        refetch();
      }
    });
  };
  
  // Use API goals if available, otherwise use mock data
  const goals = apiGoals?.goals?.length ? apiGoals.goals : [];
  
  // Calculate total stats for the dashboard
  const totalStats = {
    activeGoals: goals.filter((goal) => goal.is_active).length,
    completedGoals: goals.filter((goal) => goal.progress_percentage >= 100).length,
    totalTarget: goals.reduce((sum: number, goal) => sum + goal.target_amount, 0),
    totalCurrent: goals.reduce((sum: number, goal) => sum + goal.current_amount, 0),
    overallProgress: goals.length > 0 
      ? (goals.reduce((sum: number, goal) => sum + goal.current_amount, 0) / 
         goals.reduce((sum: number, goal) => sum + goal.target_amount, 0)) * 100
      : 0
  };
  
  // Sort goals by priority and progress for display
  const sortedGoals = [...goals].sort((a: any, b: any) => {
    // First sort by active status
    if (a.is_active && !b.is_active) return -1;
    if (!a.is_active && b.is_active) return 1;
    
    // Then sort by priority
    const priorityOrder: Record<string, number> = { 'URGENT': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
    const aPriority = a.priority || 'MEDIUM';
    const bPriority = b.priority || 'MEDIUM';
    if (priorityOrder[aPriority] !== priorityOrder[bPriority]) {
      return priorityOrder[aPriority] - priorityOrder[bPriority];
    }
    
    // Then sort by progress (ascending, so goals with less progress come first)
    return a.progress_percentage - b.progress_percentage;
  });
  
  // Get recent activity (last 3 goals updated)
  const recentActivity = [...goals]
    .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3);
  
  // Mock data for development if no API goals are available
  const mockGoals = [
    {
      id: 'emergency-fund',
      name: 'Emergency Fund',
      target_amount: 10000,
      current_amount: 7500,
      goal_type: 'savings',
      category: 'EMERGENCY_FUND',
      priority: 'HIGH',
      progress_percentage: 75,
      is_active: true,
      target_date: '2024-12-31',
      remaining_amount: 2500,
      days_remaining: 180,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-06-01T00:00:00Z',
      milestones: [
        { id: '1', goal_id: 'emergency-fund', amount: 2500, achieved: true, date: '2023-03-01' },
        { id: '2', goal_id: 'emergency-fund', amount: 5000, achieved: true, date: '2023-04-15' },
        { id: '3', goal_id: 'emergency-fund', amount: 7500, achieved: true, date: '2023-05-28' },
        { id: '4', goal_id: 'emergency-fund', amount: 10000, achieved: false, date: '2023-12-31' }
      ],
      contributions: [
        { id: '1', goal_id: 'emergency-fund', amount: 2500, date: '2023-01-15', notes: 'Initial deposit' },
        { id: '2', goal_id: 'emergency-fund', amount: 2500, date: '2023-03-01', notes: 'Bonus' },
        { id: '3', goal_id: 'emergency-fund', amount: 2500, date: '2023-05-01', notes: 'Monthly savings' }
      ]
    },
    {
      id: 'house-deposit',
      name: 'House Deposit',
      target_amount: 50000,
      current_amount: 22000,
      goal_type: 'purchase',
      category: 'INVESTMENT',
      priority: 'HIGH',
      progress_percentage: 44,
      is_active: true,
      target_date: '2026-03-01',
      remaining_amount: 28000,
      days_remaining: 730,
      created_at: '2023-02-15T00:00:00Z',
      updated_at: '2023-05-10T00:00:00Z',
      milestones: [
        { id: '17', goal_id: 'house-deposit', amount: 10000, achieved: true, date: '2023-05-01' },
        { id: '18', goal_id: 'house-deposit', amount: 25000, achieved: false, date: '2024-06-01' },
        { id: '19', goal_id: 'house-deposit', amount: 40000, achieved: false, date: '2025-12-01' },
        { id: '20', goal_id: 'house-deposit', amount: 50000, achieved: false, date: '2026-03-01' }
      ],
      contributions: [
        { id: '9', goal_id: 'house-deposit', amount: 15000, date: '2023-02-15', notes: 'Initial deposit' },
        { id: '10', goal_id: 'house-deposit', amount: 7000, date: '2023-05-10', notes: 'Bonus' }
      ]
    },
    {
      id: 'vacation',
      name: 'Dream Vacation',
      target_amount: 5000,
      current_amount: 3200,
      goal_type: 'travel',
      category: 'LIFESTYLE',
      priority: 'MEDIUM',
      progress_percentage: 64,
      is_active: true,
      target_date: '2025-07-01',
      remaining_amount: 1800,
      days_remaining: 365,
      created_at: '2023-03-01T00:00:00Z',
      updated_at: '2023-06-15T00:00:00Z',
      milestones: [
        { id: '21', goal_id: 'vacation', amount: 1500, achieved: true, date: '2023-06-01' },
        { id: '22', goal_id: 'vacation', amount: 3000, achieved: true, date: '2023-12-01' },
        { id: '23', goal_id: 'vacation', amount: 5000, achieved: false, date: '2025-07-01' }
      ],
      contributions: [
        { id: '11', goal_id: 'vacation', amount: 1500, date: '2023-03-01', notes: 'Initial deposit' },
        { id: '12', goal_id: 'vacation', amount: 1700, date: '2023-06-15', notes: 'Summer bonus' }
      ]
    },
    {
      id: 'car-upgrade',
      name: 'Car Upgrade',
      target_amount: 15000,
      current_amount: 8500,
      goal_type: 'purchase',
      category: 'TRANSPORTATION',
      priority: 'LOW',
      progress_percentage: 57,
      is_active: true,
      target_date: '2025-09-01',
      remaining_amount: 6500,
      days_remaining: 425,
      created_at: '2023-04-01T00:00:00Z',
      updated_at: '2023-06-20T00:00:00Z',
      milestones: [
        { id: '24', goal_id: 'car-upgrade', amount: 5000, achieved: true, date: '2023-06-15' },
        { id: '25', goal_id: 'car-upgrade', amount: 10000, achieved: false, date: '2024-05-01' },
        { id: '26', goal_id: 'car-upgrade', amount: 15000, achieved: false, date: '2025-09-01' }
      ],
      contributions: [
        { id: '13', goal_id: 'car-upgrade', amount: 5000, date: '2023-04-01', notes: 'Initial deposit' },
        { id: '14', goal_id: 'car-upgrade', amount: 3500, date: '2023-06-20', notes: 'Tax refund' }
      ]
    }
  ];

  const [selectedAchievement, setSelectedAchievement] = useState<number | null>(null);

  const achievements = [
    { id: 1, title: 'First Goal Set', description: 'Created your first financial goal', unlocked: true, icon: '🎯' },
    { id: 2, title: 'Milestone Master', description: 'Reached 5 milestones', unlocked: true, icon: '🏆' },
    { id: 3, title: 'Consistency Champion', description: '30 days of progress updates', unlocked: false, icon: '📅' },
    { id: 4, title: 'Goal Crusher', description: 'Completed your first goal', unlocked: false, icon: '💪' }
  ];
  
  const handleAchievementClick = (achievementId: number) => {
    setSelectedAchievement(selectedAchievement === achievementId ? null : achievementId);
  };

  const getGoalProgress = (goal: any) => (goal.current_amount / goal.target_amount) * 100;

  const getConstellationColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#4ECDC4';
      case 'low': return '#45B7D1';
      default: return '#95A5A6';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#007AFF] rounded-lg flex items-center justify-center shadow-md">
              <span className="text-xl text-white">🎯</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Goal Universe
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)]">Professional goal management interface</p>
            </div>
          </div>
          
          <motion.button
            className="px-4 py-2 bg-[#007AFF] text-white rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
          >
            <span>+</span>
            <span className="text-sm font-medium">Add Goal</span>
          </motion.button>
        </motion.div>

        {/* Goal Overview Dashboard */}
        <Card className="mb-6" padding="medium" variant="elevated">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Your Financial Goals</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--color-text-secondary)]">
                <div>Active Goals: {goals.filter(g => getGoalProgress(g) < 100).length}</div>
                <div>•</div>
                <div>Completed: {goals.filter(g => getGoalProgress(g) >= 100).length}</div>
                <div>•</div>
                <div>Total Target: ${goals.reduce((sum, goal) => sum + goal.target_amount, 0).toLocaleString()}</div>
                <div>•</div>
                <div>Progress: {(goals.reduce((sum, goal) => sum + goal.current_amount, 0) / goals.reduce((sum, goal) => sum + goal.target_amount, 0) * 100).toFixed(0)}%</div>
              </div>
            </div>
          </div>
        </Card>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6 border-b border-[var(--color-divider)]">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: <FaChartPie /> },
            { key: 'goals', label: 'Goals', icon: <FaRegStar /> },
            { key: 'universe', label: 'Universe', icon: <FaGlobe /> }
          ].map((view) => (
            <button
              key={view.key}
              onClick={() => setActiveView(view.key as any)}
              className={`px-4 py-3 flex items-center gap-2 transition-all border-b-2 font-medium ${
                activeView === view.key
                  ? 'border-[#007AFF] text-[#007AFF]'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <span>{view.icon}</span>
              <span className="text-sm">{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 px-6 pb-6">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Dashboard Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card padding="medium" variant="default">
                  <div className="flex flex-col h-full">
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">Active Goals</h3>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-semibold text-[var(--color-text-primary)]">
                        {totalStats.activeGoals}
                      </span>
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        of {goals.length} total
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[var(--color-divider)]">
                      <div className="text-xs text-[var(--color-text-secondary)]">
                        {totalStats.completedGoals} completed goals
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card padding="medium" variant="default">
                  <div className="flex flex-col h-full">
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">Total Target</h3>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-semibold text-[var(--color-text-primary)]">
                        ${totalStats.totalTarget.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[var(--color-divider)]">
                      <div className="text-xs text-[var(--color-text-secondary)]">
                        ${totalStats.totalCurrent.toLocaleString()} saved so far
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card padding="medium" variant="default">
                  <div className="flex flex-col h-full">
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">Overall Progress</h3>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-semibold text-[var(--color-text-primary)]">
                        {totalStats.overallProgress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#007AFF] rounded-full" 
                          style={{ width: `${totalStats.overallProgress.toFixed(0)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-2 pt-4 border-t border-[var(--color-divider)]">
                      <div className="text-xs text-[var(--color-text-secondary)]">
                        ${(totalStats.totalTarget - totalStats.totalCurrent).toLocaleString()} remaining
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Recent Activity */}
              <Card padding="medium" variant="default" className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between py-2 border-b border-[var(--color-divider)] last:border-0">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center" 
                          style={{ 
                            backgroundColor: (goal as any).priority === 'HIGH' ? '#FF6B6B20' : 
                                          (goal as any).priority === 'MEDIUM' ? '#4ECDC420' : 
                                          (goal as any).priority === 'LOW' ? '#45B7D120' : '#95A5A620',
                            color: (goal as any).priority === 'HIGH' ? '#FF6B6B' : 
                                   (goal as any).priority === 'MEDIUM' ? '#4ECDC4' : 
                                   (goal as any).priority === 'LOW' ? '#45B7D1' : '#95A5A6'
                          }}
                        >
                          {(goal as any).category === 'EMERGENCY_FUND' && '🛡️'}
                          {(goal as any).category === 'INVESTMENT' && '💰'}
                          {(goal as any).category === 'HOUSING' && '🏠'}
                          {(goal as any).category === 'TRAVEL' && '✈️'}
                          {(goal as any).category === 'LIFESTYLE' && '🎭'}
                          {(goal as any).category === 'TRANSPORTATION' && '🚗'}
                          {!['EMERGENCY_FUND', 'INVESTMENT', 'HOUSING', 'TRAVEL', 'LIFESTYLE', 'TRANSPORTATION'].includes((goal as any).category) && '🎯'}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--color-text-primary)]">{goal.name}</p>
                          <p className="text-xs text-[var(--color-text-secondary)]">
                            Updated {new Date(goal.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right mr-2">
                          <p className="font-medium text-[var(--color-text-primary)]">${goal.current_amount.toLocaleString()}</p>
                          <p className="text-xs text-[var(--color-text-secondary)]">{goal.progress_percentage}% complete</p>
                        </div>
                        <button 
                          onClick={() => handleGoalClick(goal.id)}
                          className="p-2 text-[var(--color-text-secondary)] hover:text-[#007AFF] transition-colors"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button 
                          onClick={() => handleAddContribution(goal as any)}
                          className="p-2 text-[var(--color-text-secondary)] hover:text-[#28a745] transition-colors"
                        >
                          <FaMoneyBillWave size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-sm text-[#007AFF] font-medium">View All Activity</button>
              </Card>
              
              {/* Goal Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedGoals.map((goal) => (
                  <Card key={goal.id} padding="medium" variant="default" className="h-full">
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-[var(--color-text-primary)]">{goal.name}</h3>
                          <p className="text-xs text-[var(--color-text-secondary)]">{(goal as any).category?.replace('_', ' ') || ''}</p>
                        </div>
                        <div 
                          className="px-2 py-1 text-xs rounded-full" 
                          style={{ 
                            backgroundColor: (goal as any).priority === 'HIGH' ? '#FF6B6B20' : 
                                           (goal as any).priority === 'MEDIUM' ? '#4ECDC420' : 
                                           (goal as any).priority === 'LOW' ? '#45B7D120' : '#95A5A620',
                            color: (goal as any).priority === 'HIGH' ? '#FF6B6B' : 
                                   (goal as any).priority === 'MEDIUM' ? '#4ECDC4' : 
                                    (goal as any).priority === 'LOW' ? '#45B7D1' : '#95A5A6'
                          }}
                        >
                          {(goal as any).priority}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="text-xs text-[var(--color-text-secondary)]">Current</p>
                          <p className="font-medium text-[var(--color-text-primary)]">${goal.current_amount.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-[var(--color-text-secondary)]">Progress</p>
                          <p className="font-medium text-[var(--color-text-primary)]">{goal.progress_percentage}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[var(--color-text-secondary)]">Target</p>
                          <p className="font-medium text-[var(--color-text-primary)]">${goal.target_amount.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${goal.progress_percentage}%`,
                              backgroundColor: (goal as any).priority === 'HIGH' ? '#FF6B6B' : 
                                             (goal as any).priority === 'MEDIUM' ? '#4ECDC4' : 
                                             (goal as any).priority === 'LOW' ? '#45B7D1' : '#95A5A6'
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">Target Date: {new Date(goal.target_date).toLocaleDateString()}</p>
                        <div className="flex justify-between">
                          {(goal as any).milestones && (goal as any).milestones.map((milestone: any, idx: number) => (
                            <div key={idx} className="flex flex-col items-center">
                              <div 
                                className={`w-3 h-3 rounded-full mb-1 ${milestone.achieved ? 'bg-[#28a745]' : 'bg-gray-200'}`}
                              ></div>
                              <p className="text-[10px] text-[var(--color-text-secondary)]">
                                ${(milestone.amount / 1000).toFixed(0)}k
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4 pt-4 border-t border-[var(--color-divider)]">
                        <Button
                          variant="text"
                          size="sm"
                          onClick={() => handleGoalClick(goal.id)}
                          className="mr-2"
                        >
                          <FaEdit className="mr-1" size={12} /> Details
                        </Button>
                        <Button 
                          variant="text" 
                          size="sm" 
                          onClick={() => handleAddContribution(goal as any)}
                          className="text-[#28a745]"
                        >
                          <FaMoneyBillWave className="mr-1" size={12} /> Add Funds
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
          
          {activeView === 'universe' && (
            <motion.div
              key="universe"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Goal Universe */}
              <div className="relative h-[500px] bg-[var(--color-background-secondary)] rounded-lg overflow-hidden">
                {sortedGoals.map((goal) => {
                  // Generate pseudo-random positions based on goal id
                  const hash = goal.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                  const x = (hash % 80) + 10; // 10-90% of width
                  const y = ((hash * 13) % 80) + 10; // 10-90% of height
                  
                  return (
                    <div 
                      key={goal.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ 
                        left: `${x}%`, 
                        top: `${y}%`,
                        zIndex: Math.floor(goal.progress_percentage)
                      }}
                      onClick={() => handleGoalClick(goal.id)}
                    >
                      <div 
                        className="relative flex items-center justify-center rounded-full shadow-lg"
                        style={{ 
                          width: `${Math.max(40, (goal.target_amount / 1000) + 30)}px`, 
                          height: `${Math.max(40, (goal.target_amount / 1000) + 30)}px`,
                          backgroundColor: `${(goal as any).priority === 'HIGH' ? '#FF6B6B40' : 
                                          (goal as any).priority === 'MEDIUM' ? '#4ECDC440' : 
                                          (goal as any).priority === 'LOW' ? '#45B7D140' : '#95A5A640'}`,
                          border: `2px solid ${(goal as any).priority === 'HIGH' ? '#FF6B6B' : 
                                              (goal as any).priority === 'MEDIUM' ? '#4ECDC4' : 
                                              (goal as any).priority === 'LOW' ? '#45B7D1' : '#95A5A6'}`
                        }}
                      >
                        <div 
                          className="absolute rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${goal.progress_percentage}%`, 
                            height: `${goal.progress_percentage}%`,
                            backgroundColor: (goal as any).priority === 'HIGH' ? '#FF6B6B' : 
                                           (goal as any).priority === 'MEDIUM' ? '#4ECDC4' : 
                                           (goal as any).priority === 'LOW' ? '#45B7D1' : '#95A5A6',
                            opacity: 0.7
                          }}
                        ></div>
                        <span className="relative text-xs font-medium text-white">
                          {goal.name.split(' ')[0]}
                        </span>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-center">
                        <p className="text-xs font-medium text-[var(--color-text-primary)] whitespace-nowrap">
                          {goal.name}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-secondary)]">
                          ${goal.current_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
                
                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#007AFF" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  {sortedGoals.map((goal, i) => {
                    if (i === sortedGoals.length - 1) return null;
                    
                    // Generate pseudo-random positions based on goal id
                    const hash1 = goal.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    const x1 = (hash1 % 80) + 10;
                    const y1 = ((hash1 * 13) % 80) + 10;
                    
                    const nextGoal = sortedGoals[i + 1];
                    const hash2 = nextGoal.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    const x2 = (hash2 % 80) + 10;
                    const y2 = ((hash2 * 13) % 80) + 10;
                    
                    return (
                      <line 
                        key={`line-${i}`}
                        x1={`${x1}%`} 
                        y1={`${y1}%`} 
                        x2={`${x2}%`} 
                        y2={`${y2}%`}
                        stroke="url(#lineGradient)"
                        strokeWidth="1"
                      />
                    );
                  })}
                </svg>
                
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                
                {/* Add Goal Button in Universe */}
                <div 
                  className="absolute bottom-4 right-4 w-12 h-12 bg-[#007AFF] rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <FaPlus size={16} />
                </div>
              </div>
              
              {/* Goal Legend */}
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF6B6B' }}></div>
                  <span className="text-xs text-[var(--color-text-secondary)]">High Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#4ECDC4' }}></div>
                  <span className="text-xs text-[var(--color-text-secondary)]">Medium Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#45B7D1' }}></div>
                  <span className="text-xs text-[var(--color-text-secondary)]">Low Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-3 bg-gradient-to-r from-[#4ECDC4] to-[#007AFF] rounded-full opacity-30"></div>
                  <span className="text-xs text-[var(--color-text-secondary)]">Goal Connections</span>
                </div>
              </div>
              
              {/* Goal Stats */}
              <Card padding="medium" variant="default">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Universe Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-[var(--color-background-secondary)] rounded-lg">
                    <p className="text-xs text-[var(--color-text-secondary)] mb-1">Active Goals</p>
                    <p className="text-xl font-semibold text-[var(--color-text-primary)]">{totalStats.activeGoals}</p>
                  </div>
                  <div className="text-center p-3 bg-[var(--color-background-secondary)] rounded-lg">
                    <p className="text-xs text-[var(--color-text-secondary)] mb-1">Completed</p>
                    <p className="text-xl font-semibold text-[var(--color-text-primary)]">{totalStats.completedGoals}</p>
                  </div>
                  <div className="text-center p-3 bg-[var(--color-background-secondary)] rounded-lg">
                    <p className="text-xs text-[var(--color-text-secondary)] mb-1">Total Target</p>
                    <p className="text-xl font-semibold text-[var(--color-text-primary)]">${totalStats.totalTarget.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-[var(--color-background-secondary)] rounded-lg">
                    <p className="text-xs text-[var(--color-text-secondary)] mb-1">Overall Progress</p>
                    <p className="text-xl font-semibold text-[var(--color-text-primary)]">{totalStats.overallProgress.toFixed(0)}%</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeView === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-4"
            >
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-lg font-semibold">{goal.name}</h3>
                    <span className="text-blue-200 text-sm">{getGoalProgress(goal).toFixed(0)}% Complete</span>
                  </div>
                  
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {((goal as any).milestones || []).map((milestone: any, mIndex: number) => (
                      <div
                        key={mIndex}
                        className={cn(
                          'flex-shrink-0 w-32 p-3 rounded-lg border text-center',
                          milestone.achieved
                            ? 'bg-green-500/20 border-green-400 text-green-100'
                            : 'bg-white/10 border-white/20 text-white'
                        )}
                      >
                        <div className="text-lg font-bold">${milestone.amount.toLocaleString()}</div>
                        <div className="text-xs opacity-75">{milestone.date}</div>
                        {milestone.achieved && <div className="text-green-400 text-lg">✓</div>}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeView === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'p-6 rounded-xl border backdrop-blur-xl cursor-pointer',
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50'
                      : 'bg-white/10 border-white/20'
                  )}
                  onClick={() => handleAchievementClick(achievement.id)}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-16 h-16 rounded-full flex items-center justify-center text-2xl',
                      achievement.unlocked
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                        : 'bg-gray-600'
                    )}>
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className={cn(
                        'font-semibold text-lg',
                        achievement.unlocked ? 'text-yellow-200' : 'text-gray-400'
                      )}>
                        {achievement.title}
                      </h3>
                      <p className={cn(
                        'text-sm',
                        achievement.unlocked ? 'text-yellow-300' : 'text-gray-500'
                      )}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Achievement Details Popup */}
              <AnimatePresence>
                {selectedAchievement && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-xl rounded-xl p-6 w-[90%] max-w-md border border-white/20 z-20"
                  >
                    {(() => {
                      const achievement = achievements.find(a => a.id === selectedAchievement);
                      if (!achievement) return null;
                      
                      return (
                        <div className="text-white">
                          <div className="flex items-center gap-4 mb-4">
                            <div className={cn(
                              'w-16 h-16 rounded-full flex items-center justify-center text-3xl',
                              achievement.unlocked
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                                : 'bg-gray-600'
                            )}>
                              {achievement.icon}
                            </div>
                            <div>
                              <h3 className={cn(
                                'font-bold text-xl',
                                achievement.unlocked ? 'text-yellow-200' : 'text-gray-400'
                              )}>
                                {achievement.title}
                              </h3>
                              <p className={cn(
                                'text-sm',
                                achievement.unlocked ? 'text-yellow-300' : 'text-gray-500'
                              )}>
                                {achievement.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-4 bg-white/5 rounded-lg">
                            <h4 className="text-blue-200 font-medium mb-2">Achievement Details</h4>
                            <p className="text-sm text-white/80 mb-3">
                              {achievement.unlocked 
                                ? "You've unlocked this achievement! Keep up the great work on your financial journey."
                                : "This achievement is still locked. Continue working toward your financial goals to unlock it."}
                            </p>
                            {achievement.unlocked && (
                              <div className="flex items-center gap-2 text-yellow-300 text-sm">
                                <span>✨</span>
                                <span>Earned points: 50</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-6 flex justify-end">
                            <motion.button
                              onClick={() => setSelectedAchievement(null)}
                              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Close
                            </motion.button>
                          </div>
                        </div>
                      );
                    })()} 
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCreateModalOpen(true)}
        animate={{
          boxShadow: [
            '0 4px 20px rgba(59, 130, 246, 0.5)',
            '0 4px 30px rgba(168, 85, 247, 0.7)',
            '0 4px 20px rgba(59, 130, 246, 0.5)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ➕
      </motion.button>
      
      {/* Create Goal Modal */}
      <CreateGoalModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default GoalUniversePage;
