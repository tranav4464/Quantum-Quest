'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import { useCreateGoal } from '@/hooks/useGoals';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const springConfig = {
  type: 'spring' as const,
  damping: 25,
  stiffness: 200,
};

const CreateGoalModal: React.FC<CreateGoalModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    category: 'EMERGENCY_FUND',
    priority: 'MEDIUM',
    targetDate: '',
    description: '',
    currentAmount: '0',
  });

  const { mutate: createGoal, isPending } = useCreateGoal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert string values to appropriate types
    const goalData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      priority: formData.priority as 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW',
    };
    
    createGoal(goalData, {
      onSuccess: () => {
        onClose();
        if (onSuccess) onSuccess();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={springConfig}
        className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Goal</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Goal Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Emergency Fund"
              />
            </div>
            
            <div>
              <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Amount*
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                <input
                  type="number"
                  id="targetAmount"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="10000"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                <input
                  type="number"
                  id="currentAmount"
                  name="currentAmount"
                  value={formData.currentAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="EMERGENCY_FUND">Emergency Fund</option>
                  <option value="FIRE">FIRE</option>
                  <option value="RETIREMENT">Retirement</option>
                  <option value="HOUSE_DOWN_PAYMENT">House Down Payment</option>
                  <option value="VACATION">Vacation</option>
                  <option value="DEBT_PAYOFF">Debt Payoff</option>
                  <option value="EDUCATION">Education</option>
                  <option value="CAR">Car</option>
                  <option value="WEDDING">Wedding</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="URGENT">Urgent</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Date
              </label>
              <input
                type="date"
                id="targetDate"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Describe your financial goal..."
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                size="md"
                onClick={onClose}
                type="button"
              >
                Cancel
              </Button>
              
              <Button
                variant="primary"
                size="md"
                type="submit"
                isLoading={isPending}
                isDisabled={isPending}
              >
                Create Goal
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateGoalModal;