'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import { useUpdateGoal, useDeleteGoal, useAddGoalContribution, Goal } from '@/hooks/useGoals';
import { FaEdit, FaTrash, FaPlus, FaChartLine } from 'react-icons/fa';
import { Colors } from '@/lib/theme/colors';

interface GoalDetailsModalProps {
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

const GoalDetailsModal: React.FC<GoalDetailsModalProps> = ({ isOpen, onClose, goal, onSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingContribution, setIsAddingContribution] = useState(false);
  const [formData, setFormData] = useState<Partial<Goal>>({
    name: '',
    description: '',
    target_amount: 0,
    current_amount: 0,
    target_date: '',
    category: '',
    priority: 'MEDIUM',
  });
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionNotes, setContributionNotes] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { mutate: updateGoal, isPending: isUpdating } = useUpdateGoal();
  const { mutate: deleteGoal, isPending: isDeleting } = useDeleteGoal();
  const { mutate: addContribution, isPending: isContributing } = useAddGoalContribution();

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        description: goal.description || '',
        target_amount: goal.target_amount,
        current_amount: goal.current_amount,
        target_date: goal.target_date,
        category: goal.category || '',
        priority: goal.priority || 'MEDIUM',
      });
    }
  }, [goal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;

    // Convert string values to appropriate types
    const goalData = {
      ...formData,
      target_amount: typeof formData.target_amount === 'string' 
        ? parseFloat(formData.target_amount) 
        : formData.target_amount,
      current_amount: typeof formData.current_amount === 'string' 
        ? parseFloat(formData.current_amount) 
        : formData.current_amount,
    };
    
    updateGoal({ id: goal.id, data: goalData }, {
      onSuccess: () => {
        setIsEditing(false);
        if (onSuccess) onSuccess();
      }
    });
  };

  const handleDelete = () => {
    if (!goal) return;
    
    deleteGoal(goal.id, {
      onSuccess: () => {
        onClose();
        if (onSuccess) onSuccess();
      }
    });
  };

  const handleAddContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;
    
    addContribution({
      goalId: goal.id,
      amount: parseFloat(contributionAmount),
      notes: contributionNotes,
    }, {
      onSuccess: () => {
        setIsAddingContribution(false);
        setContributionAmount('');
        setContributionNotes('');
        if (onSuccess) onSuccess();
      }
    });
  };

  if (!isOpen || !goal) return null;

  const renderMainContent = () => {
    if (isEditing) {
      return (
        <form onSubmit={handleUpdate} className="space-y-4">
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
            />
          </div>
          
          <div>
            <label htmlFor="target_amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Target Amount*
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
              <input
                type="number"
                id="target_amount"
                name="target_amount"
                value={formData.target_amount}
                onChange={handleChange}
                required
                min="1"
                step="0.01"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="current_amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
              <input
                type="number"
                id="current_amount"
                name="current_amount"
                value={formData.current_amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
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
            <label htmlFor="target_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Target Date
            </label>
            <input
              type="date"
              id="target_date"
              name="target_date"
              value={formData.target_date}
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
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsEditing(false)}
              type="button"
            >
              Cancel
            </Button>
            
            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={isUpdating}
              isDisabled={isUpdating}
            >
              Save Changes
            </Button>
          </div>
        </form>
      );
    } else if (isAddingContribution) {
      return (
        <form onSubmit={handleAddContribution} className="space-y-4">
          <div>
            <label htmlFor="contributionAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contribution Amount*
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
              <input
                type="number"
                id="contributionAmount"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Amount to add"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="contributionNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              id="contributionNotes"
              value={contributionNotes}
              onChange={(e) => setContributionNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Optional notes about this contribution"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsAddingContribution(false)}
              type="button"
            >
              Cancel
            </Button>
            
            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={isContributing}
              isDisabled={isContributing}
            >
              Add Contribution
            </Button>
          </div>
        </form>
      );
    } else if (confirmDelete) {
      return (
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Delete Goal</h3>
            <p className="mt-2 text-sm text-red-700 dark:text-red-400">
              Are you sure you want to delete this goal? This action cannot be undone.
            </p>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setConfirmDelete(false)}
              type="button"
            >
              Cancel
            </Button>
            
            <Button
              variant="danger"
              size="md"
              onClick={handleDelete}
              isLoading={isDeleting}
              isDisabled={isDeleting}
            >
              Delete Goal
            </Button>
          </div>
        </div>
      );
    } else {
      // View mode
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{goal.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {goal.category ? goal.category.replace('_', ' ').toLowerCase() : 'No category'} · 
                  {goal.priority ? goal.priority.toLowerCase() : 'medium'} priority
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                  aria-label="Edit goal"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                  aria-label="Delete goal"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {goal.description && (
              <p className="text-gray-700 dark:text-gray-300">{goal.description}</p>
            )}
            
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Progress</span>
                <span className="text-sm font-medium">{goal.progress_percentage.toFixed(0)}%</span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="h-2.5 rounded-full" 
                  style={{
                    width: `${goal.progress_percentage}%`,
                    backgroundColor: goal.progress_percentage >= 100 
                      ? Colors.semantic.income 
                      : Colors.primary.finsightGreen
                  }}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current</p>
                  <p className="text-lg font-semibold">${goal.current_amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Target</p>
                  <p className="text-lg font-semibold">${goal.target_amount.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
                  <p className="text-lg font-semibold">${goal.remaining_amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Target Date</p>
                  <p className="text-lg font-semibold">
                    {new Date(goal.target_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button
              variant="primary"
              size="md"
              fullWidth
              leftIcon={<FaPlus />}
              onClick={() => setIsAddingContribution(true)}
            >
              Add Contribution
            </Button>
          </div>
        </div>
      );
    }
  };

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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Goal' : 
               isAddingContribution ? 'Add Contribution' : 
               confirmDelete ? 'Delete Goal' : 'Goal Details'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {renderMainContent()}
        </div>
      </motion.div>
    </div>
  );
};

export default GoalDetailsModal;