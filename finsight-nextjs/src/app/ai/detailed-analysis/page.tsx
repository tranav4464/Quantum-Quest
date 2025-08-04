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

export default function DetailedAnalysisPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('financial-health');

  const tabs = [
    { id: 'financial-health', label: 'Financial Health' },
    { id: 'spending-analysis', label: 'Spending Analysis' },
    { id: 'investment-analysis', label: 'Investment Analysis' },
    { id: 'risk-assessment', label: 'Risk Assessment' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'financial-health':
        return <FinancialHealthAnalysis />;
      case 'spending-analysis':
        return <SpendingAnalysis />;
      case 'investment-analysis':
        return <InvestmentAnalysis />;
      case 'risk-assessment':
        return <RiskAssessment />;
      default:
        return <FinancialHealthAnalysis />;
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
                  Detailed Analysis
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-1">
                  Comprehensive financial insights and recommendations
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-[var(--color-divider)]">
        <div className="w-full px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {renderTabContent()}
        </div>
      </div>

      <BottomTabNavigation activeTab="ai" />
    </div>
  );
}

function FinancialHealthAnalysis() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springConfig}
      className="space-y-6"
    >
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
            Financial Health Score Breakdown
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-4">Score Components</h3>
              <div className="space-y-4">
                {[
                  { category: 'Savings Rate', score: 92, weight: 25 },
                  { category: 'Debt Management', score: 78, weight: 20 },
                  { category: 'Emergency Fund', score: 85, weight: 20 },
                  { category: 'Investment Diversity', score: 88, weight: 15 },
                  { category: 'Budget Adherence', score: 90, weight: 10 },
                  { category: 'Credit Utilization', score: 95, weight: 10 },
                ].map((item, index) => (
                  <div key={item.category} className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">
                        {item.category}
                      </span>
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        Weight: {item.weight}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-[var(--color-background-tertiary)] rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-[var(--color-success)]"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">
                        {item.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-4">Recommendations</h3>
              <div className="space-y-4">
                <div className="bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-success)] mb-2">Strengths</h4>
                  <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
                    <li>• Excellent credit utilization (5%)</li>
                    <li>• Strong savings rate (22%)</li>
                    <li>• Good budget discipline</li>
                  </ul>
                </div>
                
                <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-warning)] mb-2">Areas for Improvement</h4>
                  <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
                    <li>• Increase emergency fund to 6 months</li>
                    <li>• Consider debt consolidation</li>
                    <li>• Diversify investment portfolio</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function SpendingAnalysis() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springConfig}
      className="space-y-6"
    >
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
            Spending Pattern Analysis
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-4">Category Breakdown</h3>
              <div className="space-y-4">
                {[
                  { category: 'Housing', amount: 1500, percentage: 37.5, trend: 'stable' },
                  { category: 'Food & Dining', amount: 600, percentage: 15, trend: 'increasing' },
                  { category: 'Transportation', amount: 400, percentage: 10, trend: 'decreasing' },
                  { category: 'Entertainment', amount: 300, percentage: 7.5, trend: 'stable' },
                  { category: 'Shopping', amount: 250, percentage: 6.25, trend: 'increasing' },
                  { category: 'Other', amount: 950, percentage: 23.75, trend: 'stable' },
                ].map((item) => (
                  <div key={item.category} className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-[var(--color-text-primary)]">{item.category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-[var(--color-text-secondary)]">${item.amount}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.trend === 'increasing' ? 'bg-[var(--color-error)]/20 text-[var(--color-error)]' :
                          item.trend === 'decreasing' ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]' :
                          'bg-[var(--color-text-secondary)]/20 text-[var(--color-text-secondary)]'
                        }`}>
                          {item.trend}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-[var(--color-primary)]"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mt-1">
                      <span>{item.percentage}% of total</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-4">Insights & Recommendations</h3>
              <div className="space-y-4">
                <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Spending Habits</h4>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                    Your food & dining expenses have increased 12% this month. Consider meal planning to reduce costs.
                  </p>
                  <Button variant="secondary" size="sm">View Meal Planning Tips</Button>
                </div>
                
                <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Budget Optimization</h4>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                    You could save $150/month by optimizing subscription services and negotiating bills.
                  </p>
                  <Button variant="secondary" size="sm">Start Optimization</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function InvestmentAnalysis() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springConfig}
      className="space-y-6"
    >
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
            Investment Portfolio Analysis
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[var(--color-text-secondary)]">Total Value</p>
                      <p className="text-xl font-bold text-[var(--color-text-primary)]">$45,230</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-text-secondary)]">YTD Return</p>
                      <p className="text-xl font-bold text-[var(--color-success)]">+12.5%</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-text-secondary)]">Risk Score</p>
                      <p className="text-xl font-bold text-[var(--color-warning)]">Medium</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-text-secondary)]">Sharpe Ratio</p>
                      <p className="text-xl font-bold text-[var(--color-text-primary)]">1.24</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-text-primary)] mb-3">Asset Allocation</h4>
                  <div className="space-y-3">
                    {[
                      { asset: 'US Stocks', percentage: 60, value: 27138 },
                      { asset: 'International Stocks', percentage: 20, value: 9046 },
                      { asset: 'Bonds', percentage: 15, value: 6785 },
                      { asset: 'Cash/Money Market', percentage: 5, value: 2261 },
                    ].map((item) => (
                      <div key={item.asset} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-[var(--color-text-primary)]">{item.asset}</span>
                            <span className="text-sm text-[var(--color-text-secondary)]">${item.value.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-[var(--color-primary)]"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-4">Recommendations</h3>
              <div className="space-y-4">
                <div className="bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-success)] mb-2">Strong Performance</h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Your portfolio is outperforming the market by 3.2% this year.
                  </p>
                </div>
                
                <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-warning)] mb-2">Rebalancing Needed</h4>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                    Your stock allocation has drifted to 65%. Consider rebalancing to target 60%.
                  </p>
                  <Button variant="secondary" size="sm">Rebalance Now</Button>
                </div>
                
                <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Tax Optimization</h4>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                    Consider tax-loss harvesting to optimize your tax situation.
                  </p>
                  <Button variant="secondary" size="sm">Learn More</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function RiskAssessment() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springConfig}
      className="space-y-6"
    >
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
            Risk Assessment & Management
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-4">Risk Profile</h3>
              <div className="space-y-4">
                <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-[var(--color-warning)]">Medium</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">Overall Risk Level</p>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { category: 'Investment Risk', level: 'Medium', score: 6 },
                      { category: 'Liquidity Risk', level: 'Low', score: 3 },
                      { category: 'Income Risk', level: 'Low', score: 2 },
                      { category: 'Debt Risk', level: 'Medium', score: 5 },
                    ].map((item) => (
                      <div key={item.category} className="flex items-center justify-between">
                        <span className="text-sm text-[var(--color-text-primary)]">{item.category}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-[var(--color-background-tertiary)] rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                item.score <= 3 ? 'bg-[var(--color-success)]' :
                                item.score <= 6 ? 'bg-[var(--color-warning)]' :
                                'bg-[var(--color-error)]'
                              }`}
                              style={{ width: `${(item.score / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-[var(--color-text-secondary)]">{item.level}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-4">Risk Mitigation</h3>
              <div className="space-y-4">
                <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Emergency Fund</h4>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                    Current: 3.5 months • Target: 6 months
                  </p>
                  <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2 mb-3">
                    <div className="h-2 rounded-full bg-[var(--color-warning)]" style={{ width: '58%' }} />
                  </div>
                  <Button variant="secondary" size="sm">Increase Fund</Button>
                </div>
                
                <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Insurance Coverage</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-secondary)]">Health Insurance</span>
                      <span className="text-[var(--color-success)]">✓ Covered</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-secondary)]">Life Insurance</span>
                      <span className="text-[var(--color-warning)]">Review Needed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-secondary)]">Disability Insurance</span>
                      <span className="text-[var(--color-error)]">Not Covered</span>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="mt-3">Review Insurance</Button>
                </div>
                
                <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Estate Planning</h4>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                    Ensure your financial assets are protected with proper documentation.
                  </p>
                  <Button variant="secondary" size="sm">Start Planning</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
