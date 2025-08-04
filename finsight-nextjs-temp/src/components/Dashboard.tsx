'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { apiService, DashboardData } from '@/lib/api-service';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Avatar } from '@/components/atoms';
import { 
  Card,
  BottomTabNavigation, 
  FinancialHealthScore, 
  QuickActionTile 
} from '@/components/molecules';
import { DrawerNavigationContainer } from '@/components/molecules/DrawerNavigation';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: string;
  color?: string;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  color = 'text-primary-600',
  description,
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase': return '↗';
      case 'decrease': return '↘';
      default: return '→';
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-xs ${getChangeColor()}`}>
              <span>{getChangeIcon()}</span>
              <span>{Math.abs(change)}%</span>
              {description && <span className="text-gray-500">• {description}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="text-2xl opacity-80">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // If authenticated, fetch dashboard data
    if (isAuthenticated && !isLoading) {
      fetchDashboardData();
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getDashboardData();
      setDashboardData(data);
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err);
      if (err.message === 'Authentication required') {
        router.push('/login');
        return;
      }
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionId: string) => {
    console.log('Quick action clicked:', actionId);
    // Handle navigation or modal opening here
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show loading (will redirect to login)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchDashboardData} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-soft"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <DrawerNavigationContainer />
              <Avatar 
                name={user?.first_name || user?.username || 'User'} 
                size="lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.first_name || user?.username}!
                </h1>
                <p className="text-gray-600">Here's your financial overview</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outlined" size="sm">
                Settings
              </Button>
              <Button variant="primary" size="sm">
                Add Transaction
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Financial Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <MetricCard
            title="Total Balance"
            value={formatCurrency(dashboardData.total_balance, dashboardData.user_currency)}
            icon="💰"
            color="text-green-600"
          />
          <MetricCard
            title="Monthly Income"
            value={formatCurrency(dashboardData.monthly_income, dashboardData.user_currency)}
            icon="📈"
            color="text-blue-600"
          />
          <MetricCard
            title="Monthly Expenses"
            value={formatCurrency(dashboardData.monthly_expenses, dashboardData.user_currency)}
            icon="📉"
            color="text-red-600"
          />
          <MetricCard
            title="Savings Rate"
            value={`${dashboardData.savings_rate.toFixed(1)}%`}
            icon="🎯"
            color="text-purple-600"
          />
        </motion.div>

        {/* Financial Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <FinancialHealthScore score={dashboardData.financial_health_score} />
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
              <Button variant="outlined" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {dashboardData.recent_transactions.length > 0 ? (
                dashboardData.recent_transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {transaction.category_name?.charAt(0) || 'T'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.account_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.transaction_type === 'credit' ? '+' : '-'}
                        {formatCurrency(transaction.amount, dashboardData.user_currency)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.transaction_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent transactions</p>
                  <Button variant="primary" className="mt-4">
                    Add Your First Transaction
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Active Budgets and Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Active Budgets */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Active Budgets</h2>
              <Button variant="outlined" size="sm">
                Manage Budgets
              </Button>
            </div>
            <div className="space-y-4">
              {dashboardData.active_budgets.length > 0 ? (
                dashboardData.active_budgets.map((budget) => (
                  <div key={budget.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">{budget.name}</h3>
                      <span className="text-sm text-gray-500">{budget.category_name}</span>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{budget.progress_percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            budget.progress_percentage > 100 ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(budget.progress_percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Spent: {formatCurrency(budget.spent_amount, dashboardData.user_currency)}</span>
                      <span>Remaining: {formatCurrency(budget.remaining_amount, dashboardData.user_currency)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No active budgets</p>
                  <Button variant="primary" className="mt-4">
                    Create Budget
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Active Goals */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Financial Goals</h2>
              <Button variant="outlined" size="sm">
                Manage Goals
              </Button>
            </div>
            <div className="space-y-4">
              {dashboardData.active_goals.length > 0 ? (
                dashboardData.active_goals.map((goal) => (
                  <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">{goal.name}</h3>
                      <span className="text-sm text-gray-500">{goal.days_remaining} days left</span>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{goal.progress_percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${goal.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Saved: {formatCurrency(goal.current_amount, dashboardData.user_currency)}</span>
                      <span>Target: {formatCurrency(goal.target_amount, dashboardData.user_currency)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No active goals</p>
                  <Button variant="primary" className="mt-4">
                    Set a Goal
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Bottom Navigation */}
        <BottomTabNavigation />
      </div>
    </div>
  );
} 