'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Button from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import BottomTabNavigation from '@/components/molecules/BottomTabNavigation';

const springConfig = {
  type: 'spring',
  damping: 25,
  stiffness: 300,
} as const;

export default function InvestmentSchedulerPage() {
  const router = useRouter();
  const [scheduledInvestments] = useState([
    { id: 1, name: 'S&P 500 Index Fund', amount: 500, frequency: 'Monthly', nextDate: '2024-02-01', active: true },
    { id: 2, name: 'Bond Index Fund', amount: 200, frequency: 'Monthly', nextDate: '2024-02-01', active: true },
    { id: 3, name: 'Tech Sector ETF', amount: 300, frequency: 'Bi-weekly', nextDate: '2024-01-25', active: false },
  ]);

  const [newInvestment, setNewInvestment] = useState({
    name: '',
    amount: '',
    frequency: 'Monthly',
    startDate: ''
  });

  const handleCreateSchedule = () => {
    if (newInvestment.name && newInvestment.amount && newInvestment.startDate) {
      alert(`Investment schedule created for ${newInvestment.name}`);
      setNewInvestment({ name: '', amount: '', frequency: 'Monthly', startDate: '' });
    }
  };

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
            <div className="flex items-center">
              <Button
                variant="text"
                size="sm"
                onClick={() => router.back()}
                className="mr-4"
              >
                ← Back
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                  Investment Scheduler
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-1">
                  Automate your investment strategy
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Create New Schedule */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                Create Investment Schedule
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Investment Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., S&P 500 Index Fund"
                    value={newInvestment.name}
                    onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--color-divider)] rounded-lg bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    placeholder="500"
                    value={newInvestment.amount}
                    onChange={(e) => setNewInvestment({ ...newInvestment, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--color-divider)] rounded-lg bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Frequency
                  </label>
                  <select
                    value={newInvestment.frequency}
                    onChange={(e) => setNewInvestment({ ...newInvestment, frequency: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--color-divider)] rounded-lg bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-weekly">Bi-weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newInvestment.startDate}
                    onChange={(e) => setNewInvestment({ ...newInvestment, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--color-divider)] rounded-lg bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCreateSchedule}
                  className="w-full md:w-auto"
                >
                  Create Schedule
                </Button>
              </div>
            </div>
          </Card>

          {/* Scheduled Investments */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                Scheduled Investments
              </h2>
              
              <div className="space-y-4">
                {scheduledInvestments.map((investment, index) => (
                  <motion.div
                    key={investment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...springConfig, delay: index * 0.1 }}
                    className={`bg-[var(--color-background-secondary)] rounded-lg p-4 border-l-4 ${
                      investment.active 
                        ? 'border-l-[var(--color-success)]' 
                        : 'border-l-[var(--color-text-secondary)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-medium text-[var(--color-text-primary)]">
                            {investment.name}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            investment.active
                              ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]'
                              : 'bg-[var(--color-text-secondary)]/20 text-[var(--color-text-secondary)]'
                          }`}>
                            {investment.active ? 'Active' : 'Paused'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-[var(--color-text-secondary)]">Amount</p>
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">
                              ${investment.amount}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[var(--color-text-secondary)]">Frequency</p>
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">
                              {investment.frequency}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[var(--color-text-secondary)]">Next Investment</p>
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">
                              {investment.nextDate}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col space-y-2">
                        <Button variant="text" size="sm">
                          {investment.active ? 'Pause' : 'Resume'}
                        </Button>
                        <Button variant="text" size="sm">
                          Edit
                        </Button>
                        <Button variant="text" size="sm" className="text-[var(--color-error)]">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>

          {/* Investment Summary */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                Investment Summary
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                  <h3 className="text-sm text-[var(--color-text-secondary)] mb-1">Total Monthly</h3>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">$700</p>
                </div>
                
                <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                  <h3 className="text-sm text-[var(--color-text-secondary)] mb-1">Annual Investment</h3>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">$8,400</p>
                </div>
                
                <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                  <h3 className="text-sm text-[var(--color-text-secondary)] mb-1">Active Schedules</h3>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">2</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
                  Dollar-Cost Averaging Projection
                </h3>
                <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                  <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                    Based on your current investment schedule and historical market performance:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[var(--color-text-secondary)]">Projected Value (5 years)</p>
                      <p className="text-lg font-bold text-[var(--color-success)]">$52,800</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-secondary)]">Expected Annual Return</p>
                      <p className="text-lg font-bold text-[var(--color-success)]">7.2%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <BottomTabNavigation activeTab="ai" />
    </div>
  );
}
