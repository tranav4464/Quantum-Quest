'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Investment Lab - Laboratory-themed interface page
const InvestmentLabPage: React.FC = () => {
  const [activeExperiment, setActiveExperiment] = useState<'portfolio' | 'backtest' | 'risk'>('portfolio');
  const [portfolioMix, setPortfolioMix] = useState({
    stocks: 60,
    bonds: 30,
    crypto: 5,
    reits: 5
  });
  const [riskLevel, setRiskLevel] = useState(5);

  const experiments = [
    { id: 'portfolio', name: 'Portfolio Simulator', icon: '🧪', color: '#4ECDC4' },
    { id: 'backtest', name: 'Backtest Lab', icon: '⚗️', color: '#FF6B6B' },
    { id: 'risk', name: 'Risk Assessment', icon: '🔬', color: '#45B7D1' }
  ];

  const assetClasses = [
    { name: 'stocks', label: 'Stocks', color: '#4ECDC4', icon: '📈' },
    { name: 'bonds', label: 'Bonds', color: '#45B7D1', icon: '🏛️' },
    { name: 'crypto', label: 'Crypto', color: '#F39C12', icon: '₿' },
    { name: 'reits', label: 'REITs', color: '#E74C3C', icon: '🏢' }
  ];

  const backtestResults = [
    { period: '1Y', returns: 12.4, volatility: 8.2, sharpe: 1.45 },
    { period: '3Y', returns: 9.8, volatility: 12.1, sharpe: 0.81 },
    { period: '5Y', returns: 11.2, volatility: 15.3, sharpe: 0.73 },
    { period: '10Y', returns: 8.9, volatility: 18.6, sharpe: 0.48 }
  ];

  const riskMetrics = [
    { name: 'Value at Risk (95%)', value: '-$2,150', status: 'moderate' },
    { name: 'Expected Shortfall', value: '-$3,240', status: 'high' },
    { name: 'Beta', value: '1.12', status: 'moderate' },
    { name: 'Correlation Risk', value: '0.78', status: 'high' }
  ];

  const getExpectedReturn = () => {
    const returns = {
      stocks: 0.10,
      bonds: 0.04,
      crypto: 0.15,
      reits: 0.08
    };
    
    return Object.entries(portfolioMix).reduce((total, [asset, weight]) => {
      return total + (returns[asset as keyof typeof returns] * weight / 100);
    }, 0);
  };

  const getPortfolioRisk = () => {
    const baseRisk = Object.values(portfolioMix).reduce((sum, weight, index) => {
      const riskFactors = [0.18, 0.05, 0.45, 0.12]; // Risk levels for each asset
      return sum + (riskFactors[index] * weight / 100);
    }, 0);
    return baseRisk;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 relative">
      {/* Animated bubbles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-cyan-400/30"
            style={{
              width: Math.random() * 100 + 20,
              height: Math.random() * 100 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Investment Lab
            </h1>
            <p className="text-cyan-200">Experiment with your portfolio composition</p>
          </div>
        </motion.div>

        {/* Experiment Selector */}
        <div className="flex gap-2 mb-6">
          {experiments.map((exp) => (
            <motion.button
              key={exp.id}
              onClick={() => setActiveExperiment(exp.id as any)}
              className={cn(
                'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
                activeExperiment === exp.id
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-cyan-200 hover:bg-white/15'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow: activeExperiment === exp.id ? `0 4px 20px ${exp.color}40` : 'none'
              }}
            >
              <span>{exp.icon}</span>
              <span className="text-sm font-medium">{exp.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Laboratory Equipment */}
      <div className="relative z-10 px-6 pb-6">
        <AnimatePresence mode="wait">
          {activeExperiment === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Portfolio Beakers */}
              <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-cyan-400/30 p-6">
                <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
                  🧪 Portfolio Composition Lab
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Beaker Controls */}
                  <div className="space-y-4">
                    {assetClasses.map((asset) => (
                      <motion.div
                        key={asset.name}
                        className="bg-white/10 rounded-xl p-4 border border-white/20"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{asset.icon}</span>
                            <span className="text-white font-medium">{asset.label}</span>
                          </div>
                          <span className="text-cyan-200 font-bold">{portfolioMix[asset.name as keyof typeof portfolioMix]}%</span>
                        </div>
                        
                        {/* Beaker Visualization */}
                        <div className="relative">
                          <div className="w-full h-20 bg-gray-700 rounded-lg overflow-hidden relative">
                            <motion.div
                              className="absolute bottom-0 left-0 right-0 rounded-lg"
                              style={{ 
                                backgroundColor: asset.color + '80',
                                height: `${portfolioMix[asset.name as keyof typeof portfolioMix]}%`
                              }}
                              animate={{
                                height: `${portfolioMix[asset.name as keyof typeof portfolioMix]}%`,
                              }}
                              transition={{ duration: 0.5 }}
                            />
                            {/* Bubbles in beaker */}
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-white/50 rounded-full"
                                style={{
                                  left: `${20 + i * 25}%`,
                                  bottom: `${5 + Math.random() * 10}%`,
                                }}
                                animate={{
                                  y: [0, -10, 0],
                                  opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  delay: i * 0.3,
                                }}
                              />
                            ))}
                          </div>
                          
                          {/* Slider */}
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={portfolioMix[asset.name as keyof typeof portfolioMix]}
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value);
                              const total = Object.values(portfolioMix).reduce((sum, val, index) => 
                                index === assetClasses.findIndex(a => a.name === asset.name) ? sum : sum + val, 0
                              );
                              
                              if (total + newValue <= 100) {
                                setPortfolioMix(prev => ({
                                  ...prev,
                                  [asset.name]: newValue
                                }));
                              }
                            }}
                            className="w-full mt-2 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                            style={{
                              background: `linear-gradient(to right, ${asset.color} 0%, ${asset.color} ${portfolioMix[asset.name as keyof typeof portfolioMix]}%, #4B5563 ${portfolioMix[asset.name as keyof typeof portfolioMix]}%, #4B5563 100%)`
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Results Panel */}
                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-cyan-400/30">
                    <h4 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                      📊 Analysis Results
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-cyan-200">Expected Annual Return</span>
                          <span className="text-white font-bold text-xl">
                            {(getExpectedReturn() * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-cyan-200">Portfolio Risk</span>
                          <span className="text-white font-bold text-xl">
                            {(getPortfolioRisk() * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-cyan-200">Sharpe Ratio</span>
                          <span className="text-white font-bold text-xl">
                            {(getExpectedReturn() / getPortfolioRisk()).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      <motion.div 
                        className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-green-400/30"
                        animate={{
                          boxShadow: ['0 0 20px rgba(34, 197, 94, 0.3)', '0 0 30px rgba(34, 197, 94, 0.5)', '0 0 20px rgba(34, 197, 94, 0.3)']
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="text-center">
                          <div className="text-green-300 text-sm">Portfolio Grade</div>
                          <div className="text-white font-bold text-2xl">
                            {getExpectedReturn() > 0.08 && getPortfolioRisk() < 0.2 ? 'A+' : 
                             getExpectedReturn() > 0.06 && getPortfolioRisk() < 0.25 ? 'A' :
                             getExpectedReturn() > 0.04 && getPortfolioRisk() < 0.3 ? 'B+' : 'B'}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeExperiment === 'backtest' && (
            <motion.div
              key="backtest"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-black/30 backdrop-blur-xl rounded-2xl border border-red-400/30 p-6"
            >
              <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
                ⚗️ Historical Backtest Chamber
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {backtestResults.map((result, index) => (
                  <motion.div
                    key={result.period}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-4 border border-red-400/30"
                  >
                    <div className="text-center">
                      <div className="text-red-300 text-sm font-medium">{result.period} Period</div>
                      <div className="text-white text-2xl font-bold mb-2">{result.returns}%</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-red-200">Volatility:</span>
                          <span className="text-white">{result.volatility}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-200">Sharpe:</span>
                          <span className="text-white">{result.sharpe}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Performance Chart Placeholder */}
              <div className="mt-6 bg-white/10 rounded-xl p-6 border border-white/20">
                <h4 className="text-white text-lg font-semibold mb-4">Performance Over Time</h4>
                <div className="h-48 bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">📈</div>
                    <div>Historical Performance Chart</div>
                    <div className="text-sm">(Chart visualization would be implemented here)</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeExperiment === 'risk' && (
            <motion.div
              key="risk"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Risk Level Control */}
              <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-6">
                <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
                  🔬 Risk Analysis Microscope
                </h3>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-blue-200">Risk Tolerance Level</span>
                    <span className="text-white font-bold">{riskLevel}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #22C55E 0%, #EAB308 30%, #EF4444 70%, #DC2626 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-blue-200 mt-1">
                    <span>Conservative</span>
                    <span>Moderate</span>
                    <span>Aggressive</span>
                  </div>
                </div>

                {/* Risk Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {riskMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        'bg-white/10 rounded-xl p-4 border',
                        metric.status === 'high' ? 'border-red-400/30 bg-red-500/10' :
                        metric.status === 'moderate' ? 'border-yellow-400/30 bg-yellow-500/10' :
                        'border-green-400/30 bg-green-500/10'
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-white font-medium">{metric.name}</div>
                          <div className="text-blue-200 text-sm">Risk Metric</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold text-lg">{metric.value}</div>
                          <div className={cn(
                            'text-xs font-medium',
                            metric.status === 'high' ? 'text-red-300' :
                            metric.status === 'moderate' ? 'text-yellow-300' :
                            'text-green-300'
                          )}>
                            {metric.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Heat Map */}
              <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-6">
                <h4 className="text-white text-lg font-semibold mb-4">Correlation Heat Map</h4>
                <div className="grid grid-cols-4 gap-2">
                  {assetClasses.map((asset1, i) => 
                    assetClasses.map((asset2, j) => {
                      const correlation = i === j ? 1 : Math.random() * 0.8 + 0.1;
                      return (
                        <motion.div
                          key={`${i}-${j}`}
                          className="aspect-square rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: `rgba(${correlation > 0.7 ? '239, 68, 68' : correlation > 0.4 ? '245, 158, 11' : '34, 197, 94'}, ${correlation})`
                          }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: (i + j) * 0.05 }}
                        >
                          {correlation.toFixed(2)}
                        </motion.div>
                      );
                    })
                  )}
                </div>
                <div className="flex justify-between text-xs text-blue-200 mt-2">
                  <span>Low Correlation</span>
                  <span>High Correlation</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Lab Assistant */}
      <motion.div
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 4px 20px rgba(6, 182, 212, 0.5)',
            '0 4px 30px rgba(59, 130, 246, 0.7)',
            '0 4px 20px rgba(6, 182, 212, 0.5)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🤖
      </motion.div>
    </div>
  );
};

export default InvestmentLabPage;
