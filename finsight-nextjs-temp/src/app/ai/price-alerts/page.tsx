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

export default function PriceAlertsPage() {
  const router = useRouter();
  const [alerts] = useState([
    { symbol: 'AAPL', name: 'Apple Inc.', currentPrice: 175.43, targetPrice: 180.00, type: 'above', active: true },
    { symbol: 'TSLA', name: 'Tesla Inc.', currentPrice: 248.50, targetPrice: 230.00, type: 'below', active: true },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', currentPrice: 875.28, targetPrice: 900.00, type: 'above', active: false },
  ]);

  const [newAlert, setNewAlert] = useState({
    symbol: '',
    targetPrice: '',
    type: 'above'
  });

  const handleCreateAlert = () => {
    if (newAlert.symbol && newAlert.targetPrice) {
      alert(`Price alert created for ${newAlert.symbol} at $${newAlert.targetPrice}`);
      setNewAlert({ symbol: '', targetPrice: '', type: 'above' });
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
                  Price Alerts
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-1">
                  Set intelligent price notifications
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Create New Alert */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                Create New Alert
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Stock Symbol
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., AAPL"
                    value={newAlert.symbol}
                    onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-[var(--color-divider)] rounded-lg bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Target Price
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={newAlert.targetPrice}
                    onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--color-divider)] rounded-lg bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Alert Type
                  </label>
                  <select
                    value={newAlert.type}
                    onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--color-divider)] rounded-lg bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="above">Above</option>
                    <option value="below">Below</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleCreateAlert}
                    className="w-full"
                  >
                    Create Alert
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Active Alerts */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                Active Alerts
              </h2>
              
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={alert.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...springConfig, delay: index * 0.1 }}
                    className={`bg-[var(--color-background-secondary)] rounded-lg p-4 border-l-4 ${
                      alert.active 
                        ? 'border-l-[var(--color-success)]' 
                        : 'border-l-[var(--color-text-secondary)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-[var(--color-text-primary)]">
                            {alert.symbol}
                          </h3>
                          <span className="text-sm text-[var(--color-text-secondary)]">
                            {alert.name}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            alert.active
                              ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]'
                              : 'bg-[var(--color-text-secondary)]/20 text-[var(--color-text-secondary)]'
                          }`}>
                            {alert.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-[var(--color-text-secondary)]">Current Price</p>
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">
                              ${alert.currentPrice.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[var(--color-text-secondary)]">Target Price</p>
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">
                              ${alert.targetPrice.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[var(--color-text-secondary)]">Alert When</p>
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">
                              {alert.type === 'above' ? 'Above' : 'Below'} target
                            </p>
                          </div>
                        </div>
                        
                        {/* Progress indicator */}
                        <div className="mt-3">
                          <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                alert.type === 'above'
                                  ? 'bg-[var(--color-success)]'
                                  : 'bg-[var(--color-warning)]'
                              }`}
                              style={{
                                width: `${Math.min(100, (alert.currentPrice / alert.targetPrice) * 100)}%`
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mt-1">
                            <span>Current: ${alert.currentPrice}</span>
                            <span>Target: ${alert.targetPrice}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col space-y-2">
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

          {/* Smart Recommendations */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                AI Recommendations
              </h2>
              
              <div className="space-y-3">
                <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">
                    Set Support Level Alert for AAPL
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                    Based on technical analysis, consider setting a buy alert at $170 (strong support level)
                  </p>
                  <Button variant="secondary" size="sm">
                    Create Alert
                  </Button>
                </div>
                
                <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">
                    Earnings Alert for TSLA
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                    Tesla earnings release in 5 days. Consider setting volatility alerts around current price.
                  </p>
                  <Button variant="secondary" size="sm">
                    Set Volatility Alert
                  </Button>
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
