'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MetricCard } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import BottomTabNavigation from '@/components/molecules/BottomTabNavigation';
import CreateGoalModal from '@/components/modals/CreateGoalModal';
import { useGoalsWithFallback, useAddContribution, useMarkGoalCompleted } from '@/hooks/useGoals';

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  icon: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
}

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 6500,
    deadline: '2025-12-31',
    category: 'Safety Net',
    icon: '🛡️',
    color: '#FF6B6B',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Vacation to Japan',
    targetAmount: 5000,
    currentAmount: 2800,
    deadline: '2025-06-15',
    category: 'Travel',
    icon: '✈️',
    color: '#4ECDC4',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'New MacBook Pro',
    targetAmount: 2500,
    currentAmount: 1200,
    deadline: '2025-04-01',
    category: 'Technology',
    icon: '💻',
    color: '#45B7D1',
    priority: 'medium'
  },
  {
    id: '4',
    title: 'Car Down Payment',
    targetAmount: 8000,
    currentAmount: 3200,
    deadline: '2025-08-30',
    category: 'Transportation',
    icon: '🚗',
    color: '#96CEB4',
    priority: 'high'
  },
  {
    id: '5',
    title: 'Investment Portfolio',
    targetAmount: 15000,
    currentAmount: 4500,
    deadline: '2026-01-01',
    category: 'Investment',
    icon: '📈',
    color: '#FECA57',
    priority: 'low'
  }
];

const CircularProgress: React.FC<{ percentage: number; color: string; size?: number }> = ({ 
  percentage, 
  color, 
  size = 60 
}) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="4"
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, delay: 0.2 }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-gray-700">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 30) return `${diffDays} days`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
  return `${Math.floor(diffDays / 365)} years`;
};

export default function GoalsPage() {
  const [filter, setFilter] = useState('all');

  const totalGoalAmount = mockGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSaved = mockGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const averageProgress = (totalSaved / totalGoalAmount) * 100;

  const filteredGoals = mockGoals.filter(goal => 
    filter === 'all' || goal.priority === filter
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-soft">
        <div className="max-w-md mx-auto px-6 py-8">
          <motion.h1 
            className="text-large-title text-gray-900 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Goals
          </motion.h1>
          <p className="text-body text-gray-600">Track your financial aspirations</p>
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
          <MetricCard
            title="Total Goals"
            value={mockGoals.length.toString()}
            icon="🎯"
            color="#007AFF"
          />
          <MetricCard
            title="Saved"
            value={`$${totalSaved.toLocaleString()}`}
            icon="💰"
            color="#00D4AA"
          />
          <MetricCard
            title="Progress"
            value={`${averageProgress.toFixed(0)}%`}
            icon="📊"
            color="#FECA57"
          />
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
              onClick={() => setFilter(option.value)}
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
                <Card variant="default" className="p-5">
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
                          <h3 className="text-headline text-gray-900 truncate">{goal.title}</h3>
                          <p className="text-footnote text-gray-500">{goal.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-caption-2 font-medium ${
                            goal.priority === 'high' ? 'bg-danger-50 text-danger-600' :
                            goal.priority === 'medium' ? 'bg-warning-50 text-warning-600' :
                            'bg-success-50 text-success-600'
                          }`}>
                            {goal.priority}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-subhead text-gray-600">
                            ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                          </span>
                          <span className="text-subhead font-semibold text-gray-900">
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
                          <p className="text-footnote text-gray-600">
                            ${remaining.toLocaleString()} remaining
                          </p>
                          <p className="text-caption-1 text-gray-500">
                            Due in {timeLeft}
                          </p>
                        </div>
                        <Button variant="secondary" size="sm">
                          Add Funds
                        </Button>
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
            <h3 className="text-title-3 text-gray-900 mb-2">Create New Goal</h3>
            <p className="text-body text-gray-600 mb-4">
              Set a financial target and track your progress
            </p>
            <Button variant="primary">
              Create Goal
            </Button>
          </Card>
        </motion.div>
      </div>

      <BottomTabNavigation activeTab="goals" />
    </div>
  );
}
