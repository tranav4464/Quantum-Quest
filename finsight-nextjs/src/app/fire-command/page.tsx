'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// FIRE Command - Flame-themed progress indicators page
const FireCommandPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'timeline' | 'strategies'>('calculator');
  const [fireData, setFireData] = useState({
    currentAge: 30,
    retirementAge: 50,
    currentSavings: 100000,
    monthlyContribution: 3000,
    expectedReturn: 7,
    annualExpenses: 50000,
    withdrawalRate: 4
  });

  const [flameIntensity, setFlameIntensity] = useState(0);

  // Calculate FIRE metrics
  const calculateFIRE = () => {
    const yearsToRetirement = fireData.retirementAge - fireData.currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = fireData.expectedReturn / 100 / 12;
    
    // Future value calculation
    const futureValue = fireData.currentSavings * Math.pow(1 + monthlyReturn, monthsToRetirement) +
      fireData.monthlyContribution * ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);
    
    const fireNumber = fireData.annualExpenses * (100 / fireData.withdrawalRate);
    const progress = (futureValue / fireNumber) * 100;
    
    return {
      fireNumber,
      projectedSavings: futureValue,
      progress: Math.min(progress, 100),
      yearsToRetirement,
      monthlyIncome: (futureValue * fireData.withdrawalRate / 100) / 12
    };
  };

  const fireMetrics = calculateFIRE();

  useEffect(() => {
    setFlameIntensity(fireMetrics.progress);
  }, [fireMetrics.progress]);

  const flameColors = [
    '#FF6B35', '#FF8E53', '#FF4757', '#FFA502', '#FF6348',
    '#FF3742', '#FF5722', '#FF9800', '#FFB74D', '#FFCC02'
  ];

  const strategies = [
    {
      id: 'lean-fire',
      name: 'Lean FIRE',
      target: '$1M - $1.25M',
      description: 'Retire with minimal expenses',
      difficulty: 'Moderate',
      timeframe: '15-20 years',
      icon: '🔥',
      color: '#FF6B35'
    },
    {
      id: 'regular-fire',
      name: 'Regular FIRE',
      target: '$1.25M - $5M',
      description: 'Standard comfortable retirement',
      difficulty: 'Challenging',
      timeframe: '20-25 years',
      icon: '🔥🔥',
      color: '#FF4757'
    },
    {
      id: 'fat-fire',
      name: 'Fat FIRE',
      target: '$5M+',
      description: 'Luxurious early retirement',
      difficulty: 'Very Hard',
      timeframe: '25+ years',
      icon: '🔥🔥🔥',
      color: '#FF3742'
    },
    {
      id: 'coast-fire',
      name: 'Coast FIRE',
      target: 'Variable',
      description: 'Let compound interest do the work',
      difficulty: 'Easy',
      timeframe: '10-15 years',
      icon: '🌊🔥',
      color: '#FFA502'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 relative overflow-hidden">
      {/* Animated flame particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-4 rounded-full"
            style={{
              background: `linear-gradient(to top, ${flameColors[i % flameColors.length]}, transparent)`,
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 20}%`,
            }}
            animate={{
              y: [0, -100, -200],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
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
          <motion.div 
            className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 20px #FF6B35',
                '0 0 40px #FF4757',
                '0 0 20px #FF6B35',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-2xl">🔥</span>
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              FIRE Command Center
            </h1>
            <p className="text-orange-200">Financial Independence, Retire Early</p>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'calculator', label: 'FIRE Calculator', icon: '🧮' },
            { key: 'timeline', label: 'Timeline', icon: '⏰' },
            { key: 'strategies', label: 'Strategies', icon: '🎯' }
          ].map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
                activeTab === tab.key
                  ? 'bg-orange-500/30 text-white border border-orange-400'
                  : 'bg-white/10 text-orange-200 hover:bg-white/15'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{tab.icon}</span>
              <span className="text-sm font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 px-6 pb-6">
        <AnimatePresence mode="wait">
          {activeTab === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* FIRE Progress Display */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-orange-400/30 p-6">
                <div className="text-center mb-6">
                  <h3 className="text-white text-xl font-semibold mb-4">Your FIRE Progress</h3>
                  
                  {/* Main Flame Progress */}
                  <div className="relative mx-auto w-48 h-48 mb-6">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {/* Background circle */}
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="8"
                      />
                      
                      {/* Progress arc */}
                      <motion.circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="url(#flameGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={565}
                        strokeDashoffset={565 - (565 * fireMetrics.progress) / 100}
                        className="rotate-[-90deg] origin-center"
                        initial={{ strokeDashoffset: 565 }}
                        animate={{ strokeDashoffset: 565 - (565 * fireMetrics.progress) / 100 }}
                        transition={{ duration: 2 }}
                      />
                      
                      {/* Gradient definition */}
                      <defs>
                        <linearGradient id="flameGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#FF6B35" />
                          <stop offset="50%" stopColor="#FF4757" />
                          <stop offset="100%" stopColor="#FFA502" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.div
                        className="text-4xl mb-2"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🔥
                      </motion.div>
                      <div className="text-white text-2xl font-bold">{fireMetrics.progress.toFixed(1)}%</div>
                      <div className="text-orange-200 text-sm">to FIRE</div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <motion.div
                    className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-4 border border-red-400/30"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-center">
                      <div className="text-red-300 text-sm">FIRE Number</div>
                      <div className="text-white text-xl font-bold">${fireMetrics.fireNumber.toLocaleString()}</div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl p-4 border border-orange-400/30"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-center">
                      <div className="text-orange-300 text-sm">Projected Savings</div>
                      <div className="text-white text-xl font-bold">${fireMetrics.projectedSavings.toLocaleString()}</div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="bg-gradient-to-br from-yellow-500/20 to-red-500/20 rounded-xl p-4 border border-yellow-400/30"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-center">
                      <div className="text-yellow-300 text-sm">Years to FIRE</div>
                      <div className="text-white text-xl font-bold">{fireMetrics.yearsToRetirement}</div>
                    </div>
                  </motion.div>
                </div>

                {/* Input Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold mb-3">Personal Info</h4>
                    
                    <div>
                      <label className="text-orange-200 text-sm">Current Age</label>
                      <input
                        type="number"
                        value={fireData.currentAge}
                        onChange={(e) => setFireData(prev => ({ ...prev, currentAge: parseInt(e.target.value) || 0 }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-orange-200 text-sm">Target Retirement Age</label>
                      <input
                        type="number"
                        value={fireData.retirementAge}
                        onChange={(e) => setFireData(prev => ({ ...prev, retirementAge: parseInt(e.target.value) || 0 }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-orange-200 text-sm">Current Savings ($)</label>
                      <input
                        type="number"
                        value={fireData.currentSavings}
                        onChange={(e) => setFireData(prev => ({ ...prev, currentSavings: parseInt(e.target.value) || 0 }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold mb-3">Financial Parameters</h4>
                    
                    <div>
                      <label className="text-orange-200 text-sm">Monthly Contribution ($)</label>
                      <input
                        type="number"
                        value={fireData.monthlyContribution}
                        onChange={(e) => setFireData(prev => ({ ...prev, monthlyContribution: parseInt(e.target.value) || 0 }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-orange-200 text-sm">Expected Annual Return (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={fireData.expectedReturn}
                        onChange={(e) => setFireData(prev => ({ ...prev, expectedReturn: parseFloat(e.target.value) || 0 }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-orange-200 text-sm">Annual Expenses ($)</label>
                      <input
                        type="number"
                        value={fireData.annualExpenses}
                        onChange={(e) => setFireData(prev => ({ ...prev, annualExpenses: parseInt(e.target.value) || 0 }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-black/40 backdrop-blur-xl rounded-2xl border border-orange-400/30 p-6"
            >
              <h3 className="text-white text-xl font-semibold mb-6">FIRE Timeline</h3>
              
              <div className="space-y-4">
                {Array.from({ length: fireMetrics.yearsToRetirement }, (_, i) => {
                  const year = fireData.currentAge + i + 1;
                  const isCurrentYear = i === 0;
                  const progress = ((i + 1) / fireMetrics.yearsToRetirement) * 100;
                  
                  return (
                    <motion.div
                      key={year}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl border',
                        isCurrentYear 
                          ? 'bg-orange-500/20 border-orange-400' 
                          : 'bg-white/10 border-white/20'
                      )}
                    >
                      <div className="flex-shrink-0">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center font-bold',
                          isCurrentYear ? 'bg-orange-500 text-white' : 'bg-white/20 text-orange-200'
                        )}>
                          {year}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-medium">Age {year}</span>
                          {isCurrentYear && <span className="text-orange-300 text-sm">(Current)</span>}
                        </div>
                        
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                          />
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-white font-bold">
                          ${(fireData.currentSavings + (fireData.monthlyContribution * 12 * (i + 1))).toLocaleString()}
                        </div>
                        <div className="text-orange-200 text-sm">Projected</div>
                      </div>
                    </motion.div>
                  );
                })}
                
                {/* FIRE Achievement */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: fireMetrics.yearsToRetirement * 0.05 }}
                  className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-400/50"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎉</div>
                    <div className="text-green-300 font-bold text-xl">FIRE Achieved!</div>
                    <div className="text-green-200 text-sm">
                      Monthly Income: ${fireMetrics.monthlyIncome.toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'strategies' && (
            <motion.div
              key="strategies"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {strategies.map((strategy, index) => (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/40 backdrop-blur-xl rounded-2xl border border-orange-400/30 p-6"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${strategy.color}20`, border: `2px solid ${strategy.color}` }}
                    >
                      {strategy.icon.split('')[0]}
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-bold">{strategy.name}</h3>
                      <p className="text-orange-200 text-sm">{strategy.target}</p>
                    </div>
                  </div>
                  
                  <p className="text-white mb-4">{strategy.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-orange-200">Difficulty:</span>
                      <span className="text-white font-medium">{strategy.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-200">Timeframe:</span>
                      <span className="text-white font-medium">{strategy.timeframe}</span>
                    </div>
                  </div>
                  
                  <motion.button
                    className="w-full mt-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-2 px-4 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating FIRE Assistant */}
      <motion.div
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 4px 20px rgba(239, 68, 68, 0.5)',
            '0 4px 30px rgba(245, 101, 101, 0.7)',
            '0 4px 20px rgba(239, 68, 68, 0.5)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🔥
      </motion.div>
    </div>
  );
};

export default FireCommandPage;
