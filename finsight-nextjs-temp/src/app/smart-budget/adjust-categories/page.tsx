'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Button from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import { apiService } from '@/lib/api-service';

interface BudgetCategory {
  id: number;
  category_name: string;
  allocated_amount: number;
}

export default function AdjustCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService.get<BudgetCategory[]>('/budgets/overview/'); // Re-using the overview endpoint
        setCategories(data);
      } catch (err) {
        setError('Failed to load budget categories.');
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleAmountChange = (id: number, newAmount: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, allocated_amount: parseFloat(newAmount) || 0 } : c));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // This would ideally be a single batch update endpoint
      await Promise.all(categories.map(c => 
        apiService.put(`/budget-categories/${c.id}/`, { allocated_amount: c.allocated_amount })
      ));
      router.push('/smart-budget');
    } catch (err) {
      setError('Failed to update categories. Please try again.');
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
          <h1 className="text-3xl font-bold text-gray-900">Adjust Budget Categories</h1>
          <p className="mt-2 text-gray-600">Fine-tune the allocated amounts for each category.</p>
        </motion.div>

        <Card className="mt-8">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {categories.map(category => (
              <div key={category.id} className="flex items-center justify-between">
                <label htmlFor={`category-${category.id}`} className="text-sm font-medium text-gray-700">
                  {category.category_name}
                </label>
                <input
                  type="number"
                  id={`category-${category.id}`}
                  value={category.allocated_amount}
                  onChange={(e) => handleAmountChange(category.id, e.target.value)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            ))}

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="secondary" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}