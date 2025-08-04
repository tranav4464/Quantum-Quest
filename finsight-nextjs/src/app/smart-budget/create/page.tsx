'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Button from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import { apiService } from '@/lib/api-service';

export default function CreateBudgetPage() {
  const router = useRouter();
  const [budgetName, setBudgetName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await apiService.post('/budgets/', {
        name: budgetName,
        total_amount: totalAmount,
        start_date: startDate,
        end_date: endDate,
      });
      router.push('/smart-budget');
    } catch (err) {
      setError('Failed to create budget. Please check your input and try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Create a New Budget</h1>
          <p className="mt-2 text-gray-600">Let's set up a new budget to track your spending.</p>
        </motion.div>

        <Card className="mt-8">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="budgetName" className="block text-sm font-medium text-gray-700">
                Budget Name
              </label>
              <input
                type="text"
                id="budgetName"
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="e.g., Monthly Expenses"
                required
              />
            </div>

            <div>
              <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">
                Total Amount
              </label>
              <input
                type="number"
                id="totalAmount"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="e.g., 2000"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="secondary" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create Budget
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}