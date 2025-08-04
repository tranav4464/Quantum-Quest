'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Income Amplifier - Growth-themed income optimization interface
const IncomeAmplifierPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analyze' | 'opportunities' | 'tracker'>('analyze');
  const [incomeData, setIncomeData] = useState({
    primaryIncome: 75000,
    sideHustles: [
      { id: 1, name: 'Freelance Design', monthly: 1200, potential: 2500, effort: 3 },
      { id: 2, name: 'Online Tutoring', monthly: 800, potential: 1500, effort: 2 },
      { id: 3, name: 'E-commerce Store', monthly: 600, potential: 3000, effort: 4 }
    ],
    skills: ['Design', 'Teaching', 'Marketing', 'Coding'],
    goals: { monthly: 8000, timeframe: 12 }
  });

  const [growthMultiplier, setGrowthMultiplier] = useState(1);
  const [animatedValues, setAnimatedValues] = useState({
    totalIncome: 0,
    growth: 0,
    potential: 0
  });

  useEffect(() => {
    const totalSideIncome = incomeData.sideHustles.reduce((sum, hustle) => sum + hustle.monthly, 0);
    const monthlyIncome = (incomeData.primaryIncome / 12) + totalSideIncome;
    const potentialIncome = (incomeData.primaryIncome / 12) + incomeData.sideHustles.reduce((sum, hustle) => sum + hustle.potential, 0);
    const growthRate = ((potentialIncome - monthlyIncome) / monthlyIncome) * 100;

    setAnimatedValues({
      totalIncome: monthlyIncome,
      growth: growthRate,
      potential: potentialIncome
    });
  }, [incomeData]);

  const opportunities = [
    {
      id: 'skill-monetization',
      title: 'Skill Monetization',
      description: 'Turn your expertise into income streams',
      potential: '$2,000/month',
      difficulty: 'Medium',
      timeframe: '3-6 months',
      icon: '🎯',
      color: '#10B981',
      tasks: [
        'Identify your top 3 marketable skills',
        'Create a portfolio or service offering',
        'Set up pricing and client acquisition',
        'Launch and iterate based on feedback'
      ]
    },
    {
      id: 'passive-income',
      title: 'Passive Income Streams',
      description: 'Build income that works while you sleep',
      potential: '$1,500/month',
      difficulty: 'Hard',
      timeframe: '6-12 months',
      icon: '🌱',
      color: '#8B5CF6',
      tasks: [
        'Research passive income opportunities',
        'Create digital products or content',
        'Set up automated systems',
        'Scale and optimize performance'
      ]
    },
    {
      id: 'career-advancement',
      title: 'Career Advancement',
      description: 'Increase your primary income source',
      potential: '$15,000/year',
      difficulty: 'Medium',
      timeframe: '6-18 months',
      icon: '📈',
      color: '#F59E0B',
      tasks: [
        'Document current achievements',
        'Identify promotion requirements',
        'Develop missing skills',
        'Negotiate raise or new position'
      ]
    },
    {
      id: 'investment-income',
      title: 'Investment Income',
      description: 'Generate returns from investments',
      potential: '$800/month',
      difficulty: 'Medium',
      timeframe: '1-5 years',
      icon: '💎',
      color: '#3B82F6',
      tasks: [
        'Assess risk tolerance',
        'Research investment options',
        'Start with small amounts',
        'Gradually increase investments'
      ]
    }
  ];

  const incomeGrowthData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const baseGrowth = animatedValues.totalIncome * (1 + (animatedValues.growth / 100 / 12)) ** month;
    return {
      month: month,
      income: baseGrowth,
      target: incomeData.goals.monthly,
      cumulative: baseGrowth * month
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 relative overflow-hidden">
      {/* Growing plant animations */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 text-green-400"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${1 + Math.random()}rem`,
            }}
            animate={{
              scale: [0, 1, 1.2, 1],
              y: [0, -20, -40, -30],
              opacity: [0, 1, 1, 0.7],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            🌱
          </motion.div>
        ))}
      </div>

      {/* Floating money particles */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`money-${i}`}
            className="absolute text-yellow-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 360],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          >
            💰
          </motion.div>
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
            className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 20px #10B981',
                '0 0 40px #059669',
                '0 0 20px #10B981',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-2xl">📈</span>
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Income Amplifier
            </h1>
            <p className="text-green-200">Grow your earning potential exponentially</p>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'analyze', label: 'Income Analysis', icon: '📊' },
            { key: 'opportunities', label: 'Growth Opportunities', icon: '🚀' },
            { key: 'tracker', label: 'Progress Tracker', icon: '📈' }
          ].map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
                activeTab === tab.key
                  ? 'bg-green-500/30 text-white border border-green-400'
                  : 'bg-white/10 text-green-200 hover:bg-white/15'
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
          {activeTab === 'analyze' && (
            <motion.div
              key="analyze"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Income Overview */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-green-400/30 p-6">
                <h3 className="text-white text-xl font-semibold mb-6">Income Growth Analysis</h3>
                
                {/* Main Growth Tree */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    {/* Tree trunk */}
                    <div className="w-12 h-32 bg-gradient-to-t from-amber-700 to-amber-600 rounded-t-full mx-auto"></div>
                    
                    {/* Tree canopy with income levels */}
                    <motion.div
                      className="relative -mt-16"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {/* Main canopy */}
                      <div className="w-40 h-40 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        ${animatedValues.totalIncome.toLocaleString()}/mo
                      </div>
                      
                      {/* Growth branches */}
                      <motion.div
                        className="absolute -top-8 -left-16 w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        animate={{
                          scale: [0.8, 1, 0.8],
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      >
                        +{animatedValues.growth.toFixed(1)}%
                      </motion.div>
                      
                      <motion.div
                        className="absolute -top-8 -right-16 w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        animate={{
                          scale: [0.8, 1, 0.8],
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      >
                        ${animatedValues.potential.toLocaleString()}
                      </motion.div>
                    </motion.div>
                  </div>
                </div>

                {/* Income Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Primary Income */}
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-400/30">
                    <h4 className="text-green-300 font-semibold mb-3 flex items-center gap-2">
                      <span>🏢</span>
                      Primary Income
                    </h4>
                    <div className="text-white text-2xl font-bold mb-2">
                      ${(incomeData.primaryIncome / 12).toLocaleString()}/month
                    </div>
                    <div className="text-green-200 text-sm">
                      ${incomeData.primaryIncome.toLocaleString()}/year
                    </div>
                    
                    <div className="mt-4">
                      <label className="text-green-200 text-sm">Annual Salary</label>
                      <input
                        type="number"
                        value={incomeData.primaryIncome}
                        onChange={(e) => setIncomeData(prev => ({ ...prev, primaryIncome: parseInt(e.target.value) || 0 }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                  
                  {/* Side Income */}
                  <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-400/30">
                    <h4 className="text-emerald-300 font-semibold mb-3 flex items-center gap-2">
                      <span>💼</span>
                      Side Hustles
                    </h4>
                    <div className="text-white text-2xl font-bold mb-2">
                      ${incomeData.sideHustles.reduce((sum, hustle) => sum + hustle.monthly, 0).toLocaleString()}/month
                    </div>
                    <div className="text-emerald-200 text-sm">
                      {incomeData.sideHustles.length} active streams
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      {incomeData.sideHustles.map((hustle) => (
                        <div key={hustle.id} className="flex justify-between items-center text-sm">
                          <span className="text-emerald-200">{hustle.name}</span>
                          <span className="text-white font-medium">${hustle.monthly}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Growth Potential Meters */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {incomeData.sideHustles.map((hustle) => {
                    const utilizationPercent = (hustle.monthly / hustle.potential) * 100;
                    
                    return (
                      <motion.div
                        key={hustle.id}
                        className="bg-white/10 rounded-xl p-4"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium text-sm">{hustle.name}</span>
                          <span className="text-green-300 text-xs">Effort: {hustle.effort}/5</span>
                        </div>
                        
                        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                          <motion.div
                            className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${utilizationPercent}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-green-200">${hustle.monthly}</span>
                          <span className="text-emerald-300">${hustle.potential} max</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'opportunities' && (
            <motion.div
              key="opportunities"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {opportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/40 backdrop-blur-xl rounded-2xl border border-green-400/30 p-6"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${opportunity.color}20`, border: `2px solid ${opportunity.color}` }}
                    >
                      {opportunity.icon}
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-bold">{opportunity.title}</h3>
                      <p className="text-green-200 text-sm">{opportunity.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                    <div className="text-center">
                      <div className="text-green-300">Potential</div>
                      <div className="text-white font-bold">{opportunity.potential}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-300">Difficulty</div>
                      <div className="text-white font-bold">{opportunity.difficulty}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-300">Timeline</div>
                      <div className="text-white font-bold">{opportunity.timeframe}</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Action Steps:</h4>
                    <div className="space-y-2">
                      {opportunity.tasks.map((task, taskIndex) => (
                        <motion.div
                          key={taskIndex}
                          className="flex items-center gap-2 text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + taskIndex * 0.05 }}
                        >
                          <div className="w-4 h-4 rounded-full border-2 border-green-400 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-green-400"></div>
                          </div>
                          <span className="text-green-200">{task}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <motion.button
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-2 px-4 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ background: `linear-gradient(to right, ${opportunity.color}, ${opportunity.color}dd)` }}
                  >
                    Start Growing
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'tracker' && (
            <motion.div
              key="tracker"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-black/40 backdrop-blur-xl rounded-2xl border border-green-400/30 p-6"
            >
              <h3 className="text-white text-xl font-semibold mb-6">12-Month Growth Projection</h3>
              
              {/* Goal Setting */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-green-200 text-sm">Monthly Income Goal</label>
                  <input
                    type="number"
                    value={incomeData.goals.monthly}
                    onChange={(e) => setIncomeData(prev => ({ 
                      ...prev, 
                      goals: { ...prev.goals, monthly: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-green-200 text-sm">Target Timeframe (months)</label>
                  <input
                    type="number"
                    value={incomeData.goals.timeframe}
                    onChange={(e) => setIncomeData(prev => ({ 
                      ...prev, 
                      goals: { ...prev.goals, timeframe: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
              
              {/* Growth Chart */}
              <div className="space-y-4">
                {incomeGrowthData.slice(0, 6).map((data, index) => {
                  const progressPercent = (data.income / incomeData.goals.monthly) * 100;
                  const isGoalReached = data.income >= incomeData.goals.monthly;
                  
                  return (
                    <motion.div
                      key={data.month}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl border',
                        isGoalReached 
                          ? 'bg-green-500/20 border-green-400' 
                          : 'bg-white/10 border-white/20'
                      )}
                    >
                      <div className="flex-shrink-0">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                          isGoalReached ? 'bg-green-500 text-white' : 'bg-white/20 text-green-200'
                        )}>
                          {data.month}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">Month {data.month}</span>
                          <span className="text-green-300 font-bold">
                            ${data.income.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <motion.div
                            className={cn(
                              'h-3 rounded-full',
                              isGoalReached 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                : 'bg-gradient-to-r from-yellow-500 to-green-500'
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                        
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-green-200">
                            {progressPercent.toFixed(1)}% of goal
                          </span>
                          {isGoalReached && (
                            <span className="text-green-300 font-bold">🎯 Goal Reached!</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Progress Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 text-center">
                  <div className="text-green-300 text-sm">Current Growth Rate</div>
                  <div className="text-white text-2xl font-bold">+{animatedValues.growth.toFixed(1)}%</div>
                  <div className="text-green-200 text-xs">monthly</div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl p-4 text-center">
                  <div className="text-emerald-300 text-sm">Months to Goal</div>
                  <div className="text-white text-2xl font-bold">
                    {Math.ceil((incomeData.goals.monthly - animatedValues.totalIncome) / (animatedValues.totalIncome * animatedValues.growth / 100))}
                  </div>
                  <div className="text-emerald-200 text-xs">estimated</div>
                </div>
                
                <div className="bg-gradient-to-br from-teal-500/20 to-green-500/20 rounded-xl p-4 text-center">
                  <div className="text-teal-300 text-sm">Annual Potential</div>
                  <div className="text-white text-2xl font-bold">
                    ${(animatedValues.potential * 12).toLocaleString()}
                  </div>
                  <div className="text-teal-200 text-xs">yearly</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Growth Assistant */}
      <motion.div
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          y: [0, -10, 0],
          boxShadow: [
            '0 4px 20px rgba(16, 185, 129, 0.5)',
            '0 8px 30px rgba(16, 185, 129, 0.7)',
            '0 4px 20px rgba(16, 185, 129, 0.5)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🌱
      </motion.div>
    </div>
  );
};

export default IncomeAmplifierPage;
