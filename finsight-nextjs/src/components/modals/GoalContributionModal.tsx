'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import { useAddGoalContribution, Goal } from '@/hooks/useGoals';

interface GoalContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onSuccess?: () => void;
}

const springConfig = {
  type: 'spring' as const,
  damping: 25,
  stiffness: 200,
};

const GoalContributionModal: React.FC<GoalContributionModalProps> = ({ isOpen, onClose, goal, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const { mutate: addContribution, isPending } = useAddGoalContribution();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;
    
    addContribution({
      goalId: goal.id,
      amount: parseFloat(amount),
      notes: notes,
    }, {
      onSuccess: () => {
        onClose();
        setAmount('');
        setNotes('');
        if (onSuccess) onSuccess();
      }
    });
  };

  if (!isOpen || !goal) return null;

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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Contribution</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{goal.name}</h3>
            <div className="mt-1 flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Current: ${goal.current_amount.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Target: ${goal.target_amount.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full bg-primary-500" 
                style={{ width: `${goal.progress_percentage}%` }}
              ></div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contribution Amount*
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Amount to add"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Optional notes about this contribution"
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
                Add Contribution
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default GoalContributionModal;