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

export default function PortfolioRebalancePage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAllocation] = useState([
    { asset: 'Stocks', current: 65, target: 60, difference: -5, color: '#EF4444' },
    { asset: 'Bonds', current: 25, target: 30, difference: +5, color: '#10B981' },
    { asset: 'Real Estate', current: 10, target: 10, difference: 0, color: '#8B5CF6' },
  ]);

  const handleRebalance = async () => {
    setIsAnalyzing(true);
    // Simulate rebalancing process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
    alert('Portfolio rebalancing recommendations generated!');
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
                  Portfolio Rebalance
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-1">
                  AI-powered portfolio optimization
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Current vs Target Allocation */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
                Asset Allocation Analysis
              </h2>
              
              <div className="space-y-4">
                {currentAllocation.map((asset, index) => (
                  <motion.div
                    key={asset.asset}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springConfig, delay: index * 0.1 }}
                    className="bg-[var(--color-background-secondary)] rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-[var(--color-text-primary)]">
                        {asset.asset}
                      </h3>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        asset.difference > 0
                          ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]'
                          : asset.difference < 0
                          ? 'bg-[var(--color-error)]/20 text-[var(--color-error)]'
                          : 'bg-[var(--color-text-secondary)]/20 text-[var(--color-text-secondary)]'
                      }`}>
                        {asset.difference > 0 ? '+' : ''}{asset.difference}%
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[var(--color-text-secondary)]">Current</p>
                        <p className="text-lg font-semibold text-[var(--color-text-primary)]">
                          {asset.current}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--color-text-secondary)]">Target</p>
                        <p className="text-lg font-semibold text-[var(--color-text-primary)]">
                          {asset.target}%
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress bars */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-text-secondary)]">Current</span>
                        <span className="text-[var(--color-text-primary)]">{asset.current}%</span>
                      </div>
                      <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${asset.current}%`,
                            backgroundColor: asset.color
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>

          {/* Rebalancing Actions */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                Recommended Actions
              </h2>
              
              <div className="space-y-4">
                <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">
                    Reduce Stock Allocation
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                    Sell $2,500 worth of stock investments to reduce allocation from 65% to 60%
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-error)]">High Priority</span>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">-$2,500</span>
                  </div>
                </div>

                <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">
                    Increase Bond Allocation
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                    Invest $2,500 in bond funds to increase allocation from 25% to 30%
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-success)]">Medium Priority</span>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">+$2,500</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleRebalance}
                  disabled={isAnalyzing}
                  className="flex-1"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Execute Rebalancing'}
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  className="flex-1"
                >
                  Schedule for Later
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <BottomTabNavigation activeTab="ai" />
    </div>
  );
}
