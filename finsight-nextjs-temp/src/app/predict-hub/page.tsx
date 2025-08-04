'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Button from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import BottomTabNavigation from '@/components/molecules/BottomTabNavigation';
import predictionsAPI from '@/services/predictionsAPI';

// Animation constants
const springConfig = {
  type: 'spring',
  damping: 25,
  stiffness: 300,
} as const;

export default function PredictHubPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [healthForecast, setHealthForecast] = useState<any>(null);
  const [spendingForecast, setSpendingForecast] = useState<any>(null);
  const [investmentOutlook, setInvestmentOutlook] = useState<any>(null);
  const [marketInsights, setMarketInsights] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadPredictionData();
  }, []);

  const loadPredictionData = async () => {
    try {
      setIsLoading(true);
      
      // Load all prediction data
      const [health, spending, investment, market] = await Promise.all([
        predictionsAPI.getFinancialHealthForecast(),
        predictionsAPI.getSpendingForecast(),
        predictionsAPI.getInvestmentOutlook(),
        predictionsAPI.getMarketInsights()
      ]);

      setHealthForecast(health);
      setSpendingForecast(spending);
      setInvestmentOutlook(investment);
      setMarketInsights(market);
    } catch (error) {
      console.error('Error loading prediction data:', error);
      // Set fallback data if API fails
      setHealthForecast({
        current_score: 85,
        predictions: [
          { month: 'Month 1', score: 87, improvement: 2 },
          { month: 'Month 2', score: 90, improvement: 5 },
          { month: 'Month 3', score: 92, improvement: 7 },
        ],
        improvements: [
          { metric: 'Savings Rate', current: '15%', predicted: '22%', trend: 'up' },
          { metric: 'Debt-to-Income', current: '35%', predicted: '28%', trend: 'down' },
          { metric: 'Emergency Fund', current: '2.5 months', predicted: '4 months', trend: 'up' },
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateForecast = async () => {
    try {
      setIsGenerating(true);
      await predictionsAPI.generateForecast('comprehensive');
      await loadPredictionData(); // Reload data after generation
    } catch (error) {
      console.error('Error generating forecast:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRebalancePortfolio = () => {
    router.push('/ai/portfolio-rebalance');
  };

  const handleSetPriceAlerts = () => {
    router.push('/ai/price-alerts');
  };

  const handleScheduleInvestment = () => {
    router.push('/ai/investment-scheduler');
  };

  const handleDetailedAnalysis = () => {
    router.push('/ai/detailed-analysis');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-background-primary)] to-[var(--color-background-secondary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading predictions...</p>
        </div>
      </div>
    );
  }
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
            <div>
              <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                Predict Hub
              </h1>
              <p className="text-[var(--color-text-secondary)] mt-1">
                AI-powered financial predictions and forecasting
              </p>
            </div>
            <Button 
              variant="primary" 
              size="md"
              onClick={handleGenerateForecast}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Forecast'}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Health Predictions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.1 }}
            className="space-y-6"
          >
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                  Financial Health Forecast
                </h2>
                
                {/* Health Score Prediction */}
                <div className="bg-[var(--color-background-secondary)] rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[var(--color-text-secondary)]">Current Score</span>
                    <span className="text-2xl font-bold text-[var(--color-success)]">
                      {healthForecast?.current_score || 85}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[var(--color-text-secondary)]">Predicted (3 months)</span>
                    <span className="text-2xl font-bold text-[var(--color-success)]">
                      {healthForecast?.predictions?.[2]?.score || 92}
                    </span>
                  </div>
                  
                  {/* Progress visualization */}
                  <div className="space-y-2">
                    {(healthForecast?.predictions || [
                      { month: 'Month 1', score: 87, color: 'var(--color-success)' },
                      { month: 'Month 2', score: 90, color: 'var(--color-success)' },
                      { month: 'Month 3', score: 92, color: 'var(--color-success)' },
                    ]).map((prediction: { month: string; score: number; color: string }, index: number) => (
                      <motion.div
                        key={prediction.month}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ ...springConfig, delay: 0.3 + index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          {prediction.month}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-[var(--color-background-tertiary)] rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${prediction.score}%` }}
                              transition={{ ...springConfig, delay: 0.5 + index * 0.1 }}
                              className="h-2 rounded-full bg-[var(--color-success)]"
                            />
                          </div>
                          <span className="text-sm font-medium text-[var(--color-text-primary)]">
                            {prediction.score}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Key Improvements */}
                <div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">
                    Expected Improvements
                  </h3>
                  <div className="space-y-2">
                    {(healthForecast?.improvements || [
                      { metric: 'Savings Rate', current: '15%', predicted: '22%', trend: 'up' },
                      { metric: 'Debt-to-Income', current: '35%', predicted: '28%', trend: 'down' },
                      { metric: 'Emergency Fund', current: '2.5 months', predicted: '4 months', trend: 'up' },
                    ]).map((metric: { metric: string; current: string; predicted: string; trend: string }, index: number) => (
                      <motion.div
                        key={metric.metric}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...springConfig, delay: 0.4 + index * 0.1 }}
                        className="flex items-center justify-between bg-[var(--color-background-tertiary)] rounded-lg p-3"
                      >
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">
                          {metric.metric}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-[var(--color-text-secondary)]">
                            {metric.current}
                          </span>
                          <span className="text-sm">→</span>
                          <span className={`text-sm font-semibold ${
                            metric.trend === 'up' ? 'text-[var(--color-success)]' : 'text-[var(--color-success)]'
                          }`}>
                            {metric.predicted}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Spending Predictions */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  Upcoming Expenses Forecast
                </h3>
                <div className="space-y-3">
                  {(spendingForecast?.predictions || [
                    { category: 'Monthly Subscriptions', amount: 89.97, date: 'Next 7 days', confidence: 'High' },
                    { category: 'Grocery Shopping', amount: 450.00, date: 'This month', confidence: 'Medium' },
                    { category: 'Car Maintenance', amount: 250.00, date: 'Next month', confidence: 'Low' },
                    { category: 'Utilities', amount: 180.00, date: 'Next 15 days', confidence: 'High' },
                  ]).slice(0, 4).map((expense: { category: string; amount: number; date: string; confidence: string }, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...springConfig, delay: 0.2 + index * 0.05 }}
                      className="flex items-center justify-between bg-[var(--color-background-secondary)] rounded-lg p-3"
                    >
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)]">
                          {expense.category}
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {expense.date} • {expense.confidence} confidence
                        </p>
                      </div>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        ${expense.amount.toFixed(2)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Investment & Market Predictions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.2 }}
            className="space-y-6"
          >
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  Investment Outlook
                </h3>
                
                {/* Portfolio Performance Prediction */}
                <div className="bg-[var(--color-background-secondary)] rounded-xl p-4 mb-4">
                  <div className="text-center mb-4">
                    <p className="text-sm text-[var(--color-text-secondary)]">Expected Portfolio Growth</p>
                    <p className="text-3xl font-bold text-[var(--color-success)]">
                      +{investmentOutlook?.expected_growth || 8.5}%
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">Next 12 months</p>
                  </div>
                  
                  <div className="space-y-3">
                    {(investmentOutlook?.portfolio_assets || [
                      { asset: 'Stocks', allocation: '60%', expected_return: '+12.3%', risk: 'Medium' },
                      { asset: 'Bonds', allocation: '30%', expected_return: '+3.8%', risk: 'Low' },
                      { asset: 'Real Estate', allocation: '10%', expected_return: '+6.2%', risk: 'Medium' },
                    ]).map((asset: { asset: string; allocation: string; expected_return: string; risk: string }, index: number) => (
                      <motion.div
                        key={asset.asset}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ ...springConfig, delay: 0.3 + index * 0.1 }}
                        className="flex items-center justify-between bg-[var(--color-background-tertiary)] rounded-lg p-3"
                      >
                        <div>
                          <p className="font-medium text-[var(--color-text-primary)]">{asset.asset}</p>
                          <p className="text-xs text-[var(--color-text-secondary)]">{asset.risk} risk</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">
                            {asset.allocation}
                          </p>
                          <p className="text-xs text-[var(--color-success)]">{asset.expected_return}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Market Insights */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  Market Insights
                </h3>
                <div className="space-y-4">
                  {(marketInsights?.insights || [
                    {
                      title: 'Tech Sector Rally',
                      description: 'AI and semiconductor stocks expected to outperform by 15-20% over next quarter.',
                      impact: 'Positive',
                      probability: '78%'
                    },
                    {
                      title: 'Interest Rate Stability',
                      description: 'Federal Reserve likely to maintain current rates, benefiting bond investments.',
                      impact: 'Neutral',
                      probability: '85%'
                    },
                    {
                      title: 'Real Estate Market',
                      description: 'Housing prices expected to stabilize with moderate growth in key markets.',
                      impact: 'Positive',
                      probability: '62%'
                    }
                  ]).slice(0, 3).map((insight: { title: string; description: string; impact: string; probability: string }, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ ...springConfig, delay: 0.4 + index * 0.1 }}
                      className="bg-[var(--color-background-secondary)] rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-[var(--color-text-primary)]">{insight.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          insight.impact === 'Positive' 
                            ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]'
                            : 'bg-[var(--color-warning)]/20 text-[var(--color-warning)]'
                        }`}>
                          {insight.impact}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                        {insight.description}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        Probability: {insight.probability}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  Recommended Actions
                </h3>
                <div className="space-y-3">
                  <Button 
                    variant="primary" 
                    size="md" 
                    className="w-full"
                    onClick={handleRebalancePortfolio}
                  >
                    Rebalance Portfolio
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="md" 
                    className="w-full"
                    onClick={handleSetPriceAlerts}
                  >
                    Set Price Alerts
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="md" 
                    className="w-full"
                    onClick={handleScheduleInvestment}
                  >
                    Schedule Investment
                  </Button>
                  <Button 
                    variant="text" 
                    size="md" 
                    className="w-full"
                    onClick={handleDetailedAnalysis}
                  >
                    View Detailed Analysis
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomTabNavigation activeTab="predict-hub" />
    </div>
  );
}
