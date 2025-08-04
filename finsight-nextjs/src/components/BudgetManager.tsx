'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiService, Budget, Category } from '@/lib/api-service';
import { Button } from '@/components/atoms';
import { Card } from '@/components/molecules';

interface BudgetFormData {
  name: string;
  category: string;
  amount: string;
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  alert_threshold: string;
  rollover_unused: boolean;
}

export default function BudgetManager() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const [formData, setFormData] = useState<BudgetFormData>({
    name: '',
    category: '',
    amount: '',
    period: 'monthly',
    start_date: new Date().toISOString().split('T')[0],
    alert_threshold: '0.8',
    rollover_unused: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [budgetsData, categoriesData] = await Promise.all([
        apiService.getBudgets(),
        apiService.getCategories(),
      ]);
      
      setBudgets(budgetsData);
      setCategories(categoriesData.filter(cat => cat.category_type === 'expense'));
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      amount: '',
      period: 'monthly',
      start_date: new Date().toISOString().split('T')[0],
      alert_threshold: '0.8',
      rollover_unused: false,
    });
    setEditingBudget(null);
  };

  const calculateEndDate = (startDate: string, period: string) => {
    const start = new Date(startDate);
    const end = new Date(start);
    
    switch (period) {
      case 'weekly':
        end.setDate(end.getDate() + 7);
        break;
      case 'monthly':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'quarterly':
        end.setMonth(end.getMonth() + 3);
        break;
      case 'yearly':
        end.setFullYear(end.getFullYear() + 1);
        break;
    }
    
    return end.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endDate = calculateEndDate(formData.start_date, formData.period);
      const budgetData = {
        ...formData,
        amount: parseFloat(formData.amount),
        alert_threshold: parseFloat(formData.alert_threshold),
        end_date: endDate,
      };

      if (editingBudget) {
        await apiService.updateBudget(editingBudget.id, budgetData);
      } else {
        await apiService.createBudget(budgetData);
      }

      await fetchData();
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      console.error('Failed to save budget:', err);
      setError(err.response?.data?.message || 'Failed to save budget. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name,
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period,
      start_date: budget.start_date,
      alert_threshold: budget.alert_threshold.toString(),
      rollover_unused: budget.rollover_unused,
    });
    setShowForm(true);
  };

  const handleDelete = async (budgetId: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    try {
      setLoading(true);
      await apiService.deleteBudget(budgetId);
      await fetchData();
    } catch (err: any) {
      console.error('Failed to delete budget:', err);
      setError('Failed to delete budget. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading && budgets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading budgets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budget Manager</h1>
            <p className="text-gray-600">Create and track your spending budgets</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            variant="primary"
            size="lg"
          >
            Create Budget
          </Button>
        </motion.div>

        {/* Budget Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingBudget ? 'Edit Budget' : 'Create New Budget'}
                </h2>
                <Button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  variant="outlined"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Grocery Budget"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleFormChange}
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Period
                    </label>
                    <select
                      name="period"
                      value={formData.period}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alert Threshold (%)
                    </label>
                    <input
                      type="number"
                      name="alert_threshold"
                      value={formData.alert_threshold}
                      onChange={handleFormChange}
                      step="0.1"
                      min="0"
                      max="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.8"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="rollover_unused"
                    checked={formData.rollover_unused}
                    onChange={handleFormChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Rollover unused budget to next period
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    variant="outlined"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : editingBudget ? 'Update Budget' : 'Create Budget'}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Budgets List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Active Budgets</h2>
              <div className="text-sm text-gray-500">
                {budgets.length} budget{budgets.length !== 1 ? 's' : ''}
              </div>
            </div>

            {budgets.length > 0 ? (
              <div className="space-y-6">
                {budgets.map((budget) => (
                  <motion.div
                    key={budget.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-6 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{budget.name}</h3>
                        <p className="text-sm text-gray-500">{budget.category_name}</p>
                        <p className="text-xs text-gray-400">
                          {budget.period} • {new Date(budget.start_date).toLocaleDateString()} - {new Date(budget.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEdit(budget)}
                          variant="outlined"
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(budget.id)}
                          variant="outlined"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span className="font-semibold">{budget.progress_percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${getProgressColor(budget.progress_percentage)}`}
                            style={{ width: `${Math.min(budget.progress_percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Budget</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(budget.amount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Spent</p>
                          <p className="font-semibold text-red-600">{formatCurrency(budget.spent_amount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Remaining</p>
                          <p className={`font-semibold ${budget.remaining_amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(budget.remaining_amount)}
                          </p>
                        </div>
                      </div>

                      {budget.progress_percentage >= 100 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-red-600 text-sm font-medium">⚠️ Budget exceeded!</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets yet</h3>
                <p className="text-gray-500 mb-6">Create your first budget to start tracking your spending</p>
                <Button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  variant="primary"
                >
                  Create Your First Budget
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}