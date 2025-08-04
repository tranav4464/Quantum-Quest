'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import BottomTabNavigation from '@/components/molecules/BottomTabNavigation';
import { apiService } from '@/lib/api-service';

interface BudgetCategory {
  id: number;
  category_name: string;
  allocated_amount: number;
  spent_amount: number;
  remaining_amount: number;
  percentage_used: number;
  color?: string; // Optional color property
}

interface BudgetRecommendation {
  id: number;
  title: string;
  description: string;
  potential_savings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  icon?: string; // Optional icon property
}

interface Transaction {
  id: number;
  name: string; // Added name property
  description: string;
  amount: number;
  date: string;
  category: string;
}

// Animation constants
const springConfig = {
  type: 'spring',
  damping: 25,
  stiffness: 300,
} as const;

export default function SmartBudgetPage() {
  const [budgetOverview, setBudgetOverview] = useState<BudgetCategory[]>([]);
  const [recommendations, setRecommendations] = useState<BudgetRecommendation[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchBudgetOverview = async () => {
      try {
        const data = await apiService.get<BudgetCategory[]>('/budgets/overview/');
        setBudgetOverview(data);
      } catch (error) {
        console.error('Error fetching budget overview:', error);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const data = await apiService.get<BudgetRecommendation[]>('/budgets/recommendations/');
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    const fetchRecentTransactions = async () => {
      try {
        const data = await apiService.get<Transaction[]>('/transactions/recent/');
        setRecentTransactions(data);
      } catch (error) {
        console.error('Error fetching recent transactions:', error);
      }
    };

    fetchBudgetOverview();
    fetchRecommendations();
    fetchRecentTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background-primary)] to-[var(--color-background-secondary)]">
      {/* Header */}
      <div className="border-b border-[var(--color-divider)]">
        <div className="w-full px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springConfig}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                Smart Budget
              </h1>
              <p className="text-[var(--color-text-secondary)] mt-1">
                AI-powered budgeting to optimize your spending
              </p>
            </div>
            <Link href="/smart-budget/create">
              <Button variant="primary" size="md">Create Budget</Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budget Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                  Monthly Budget Overview
                </h2>
                
                {/* Budget Progress */}
                <div className="space-y-4">
                  {budgetOverview.map((item, index) => {
                    const percentage = (item.spent_amount / item.allocated_amount) * 100;
                    const isOverBudget = percentage > 100;
                    
                    return (
                      <motion.div
                        key={item.category_name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ ...springConfig, delay: 0.2 + index * 0.1 }}
                        className="bg-[var(--color-background-secondary)] rounded-xl p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-[var(--color-text-primary)]">
                            {item.category_name}
                          </span>
                          <span className={`text-sm font-semibold ${
                            isOverBudget ? 'text-[var(--color-error)]' : 'text-[var(--color-text-secondary)]'
                          }`}>
                            ${item.spent_amount} / ${item.allocated_amount}
                          </span>
                        </div>
                        <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(percentage, 100)}%` }}
                            transition={{ ...springConfig, delay: 0.5 + index * 0.1 }}
                            className="h-2 rounded-full"
                            style={{ backgroundColor: isOverBudget ? 'var(--color-error)' : (item.color || 'var(--color-primary)') }}
                          />
                        </div>
                        {isOverBudget && (
                          <p className="text-xs text-[var(--color-error)] mt-1">
                            Over budget by ${item.spent_amount - item.allocated_amount}
                          </p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* AI Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.2 }}
            className="space-y-6"
          >
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  AI Recommendations
                </h3>
                <div className="space-y-3">
                  {recommendations.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ ...springConfig, delay: 0.3 + index * 0.1 }}
                      className="bg-[var(--color-background-secondary)] rounded-lg p-3"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">{suggestion.icon}</span>
                        <div>
                          <h4 className="font-medium text-[var(--color-text-primary)]">
                            {suggestion.title}
                          </h4>
                          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                            {suggestion.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link href="/smart-budget/adjust-categories" className="block w-full">
                    <Button variant="secondary" size="md" className="w-full">Adjust Budget Categories</Button>
                  </Link>
                  <Link href="/smart-budget/spending-trends" className="block w-full">
                    <Button variant="secondary" size="md" className="w-full">View Spending Trends</Button>
                  </Link>
                  <Link href="/smart-budget/set-savings-goals" className="block w-full">
                    <Button variant="secondary" size="md" className="w-full">Set Savings Goals</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springConfig, delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                Recent Budget-Related Transactions
              </h3>
              <div className="space-y-3">
                {recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springConfig, delay: 0.5 + index * 0.05 }}
                    className="flex items-center justify-between py-3 border-b border-[var(--color-divider)] last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-[var(--color-text-primary)]">
                        {transaction.name}
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {transaction.category} • {transaction.date}
                      </p>
                    </div>
                    <span className={`font-semibold ${
                      transaction.amount > 0 
                        ? 'text-[var(--color-success)]' 
                        : 'text-[var(--color-text-primary)]'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomTabNavigation activeTab="smart-budget" />
    </div>
  );
}
