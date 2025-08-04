'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Budget, Category } from '@/lib/api-service';
import Button from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';

interface BudgetFormData {
  name: string;
  category: string;
  amount: string;
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  alert_threshold: string;
  rollover_unused: boolean;
}

interface BudgetFormProps {
  onSubmit: (budget: any) => void;
  onCancel: () => void;
  editingBudget?: Budget | null;
  categories?: Category[];
  loading?: boolean;
  error?: string | null;
}

export default function BudgetForm({
  onSubmit,
  onCancel,
  editingBudget = null,
  categories = [],
  loading = false,
  error = null,
}: BudgetFormProps) {
  const [formData, setFormData] = useState<BudgetFormData>({
    name: '',
    category: '',
    amount: '',
    period: 'monthly',
    start_date: new Date().toISOString().split('T')[0],
    alert_threshold: '80', // Changed from decimal to percentage
    rollover_unused: false,
  });

  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    // Initialize form with editing budget data if provided
    if (editingBudget) {
      setFormData({
        name: editingBudget.name,
        category: editingBudget.category,
        amount: editingBudget.amount.toString(),
        period: editingBudget.period,
        start_date: editingBudget.start_date,
        // Convert from decimal to percentage (0.8 -> 80)
        alert_threshold: (editingBudget.alert_threshold * 100).toString(),
        rollover_unused: editingBudget.rollover_unused,
      });
      calculateEndDate(editingBudget.start_date, editingBudget.period);
    } else {
      // Calculate end date for default values
      calculateEndDate(formData.start_date, formData.period);
    }
  }, [editingBudget]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    
    // Update end date when start date or period changes
    if (e.target.name === 'start_date' || e.target.name === 'period') {
      calculateEndDate(
        e.target.name === 'start_date' ? value as string : formData.start_date,
        e.target.name === 'period' ? value as string : formData.period
      );
    }
  };

  const calculateEndDate = (startDate: string, period: string) => {
    if (!startDate) return;
    
    const start = new Date(startDate);
    const end = new Date(start);
    
    switch (period) {
      case 'weekly':
        end.setDate(start.getDate() + 6); // 7 days - 1
        break;
      case 'monthly':
        end.setMonth(start.getMonth() + 1);
        end.setDate(end.getDate() - 1);
        break;
      case 'quarterly':
        end.setMonth(start.getMonth() + 3);
        end.setDate(end.getDate() - 1);
        break;
      case 'yearly':
        end.setFullYear(start.getFullYear() + 1);
        end.setDate(end.getDate() - 1);
        break;
    }
    
    setEndDate(end.toISOString().split('T')[0]);
    return end.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const calculatedEndDate = calculateEndDate(formData.start_date, formData.period);
    const budgetData = {
      ...formData,
      amount: parseFloat(formData.amount),
      // Convert from percentage to decimal (80 -> 0.8)
      alert_threshold: parseInt(formData.alert_threshold, 10) / 100,
      end_date: calculatedEndDate,
    };

    onSubmit(budgetData);
  };

  return (
    <Card className="w-full">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          {editingBudget ? 'Edit Budget' : 'Create New Budget'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Budget Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Budget Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                className="w-full p-2 border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"                
                placeholder="e.g., Monthly Groceries"
              />
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                required
                className="w-full p-2 border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"                
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Budget Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[var(--color-text-tertiary)]">
                  $
                </span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleFormChange}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full p-2 pl-6 border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"                  
                  placeholder="0.00"
                />
              </div>
            </div>
            
            {/* Period */}
            <div>
              <label htmlFor="period" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Budget Period
              </label>
              <select
                id="period"
                name="period"
                value={formData.period}
                onChange={handleFormChange}
                className="w-full p-2 border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"                
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleFormChange}
                  required
                  className="w-full p-2 border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"                  
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  disabled
                  className="w-full p-2 border border-[var(--color-border)] bg-[var(--color-background-tertiary)] rounded-md"
                />
              </div>
            </div>
            
            {/* Alert Threshold */}
            <div>
              <label htmlFor="alert_threshold" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Alert Threshold ({formData.alert_threshold}%)
              </label>
              <input
                type="range"
                id="alert_threshold"
                name="alert_threshold"
                min="50"
                max="100"
                value={formData.alert_threshold}
                onChange={handleFormChange}
                className="w-full h-2 bg-[var(--color-background-tertiary)] rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[var(--color-text-tertiary)]">
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
            
            {/* Rollover Option */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rollover_unused"
                name="rollover_unused"
                checked={formData.rollover_unused}
                onChange={handleFormChange}
                className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-[var(--color-border)] rounded"
              />
              <label htmlFor="rollover_unused" className="ml-2 block text-sm text-[var(--color-text-secondary)]">
                Roll over unused budget to next period
              </label>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Budget'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
}