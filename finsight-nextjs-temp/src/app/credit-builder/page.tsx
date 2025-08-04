'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Credit Builder - Construction-themed credit improvement interface
const CreditBuilderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'builder' | 'monitoring'>('dashboard');
  const [creditData, setCreditData] = useState({
    currentScore: 650,
    targetScore: 750,
    paymentHistory: 85,
    creditUtilization: 45,
    creditHistory: 70,
    creditMix: 60,
    newCredit: 40
  });

  const [constructionProgress, setConstructionProgress] = useState(0);
  const [buildingBlocks, setBuildingBlocks] = useState([
    { id: 1, name: 'Payment History', impact: 35, completed: 70, color: '#10B981' },
    { id: 2, name: 'Credit Utilization', impact: 30, completed: 45, color: '#F59E0B' },
    { id: 3, name: 'Credit History Length', impact: 15, completed: 80, color: '#3B82F6' },
    { id: 4, name: 'Credit Mix', impact: 10, completed: 60, color: '#8B5CF6' },
    { id: 5, name: 'New Credit', impact: 10, completed: 40, color: '#EF4444' }
  ]);

  useEffect(() => {
    const averageProgress = buildingBlocks.reduce((sum, block) => sum + block.completed, 0) / buildingBlocks.length;
    setConstructionProgress(averageProgress);
  }, [buildingBlocks]);

  const improvementStrategies = [
    {
      id: 'payment-automation',
      title: 'Payment Automation System',
      description: 'Set up automatic payments to never miss a due date',
      category: 'Payment History',
      impact: 'High',
      timeframe: '1-2 months',
      scoreImprovement: '+30-50 points',
      icon: '🔧',
      color: '#10B981',
      steps: [
        'Set up autopay for minimum payments',
        'Schedule payments 2-3 days before due date',
        'Set up calendar reminders for payment review',
        'Monitor account for sufficient funds'
      ]
    },
    {
      id: 'utilization-optimization',
      title: 'Credit Utilization Optimizer',
      description: 'Strategic balance management across all cards',
      category: 'Credit Utilization',
      impact: 'Very High',
      timeframe: '1-3 months',
      scoreImprovement: '+40-80 points',
      icon: '⚖️',
      color: '#F59E0B',
      steps: [
        'Calculate total available credit',
        'Keep total utilization under 30%',
        'Keep individual cards under 10%',
        'Pay down balances before statement close'
      ]
    },
    {
      id: 'account-diversification',
      title: 'Credit Mix Construction',
      description: 'Build a diverse credit portfolio responsibly',
      category: 'Credit Mix',
      impact: 'Medium',
      timeframe: '6-12 months',
      scoreImprovement: '+15-30 points',
      icon: '🏗️',
      color: '#8B5CF6',
      steps: [
        'Assess current credit types',
        'Consider adding installment loan',
        'Research secured credit cards',
        'Apply strategically with timing gaps'
      ]
    },
    {
      id: 'error-dispute',
      title: 'Credit Report Repair Kit',
      description: 'Identify and dispute credit report errors',
      category: 'Credit History',
      impact: 'Variable',
      timeframe: '2-6 months',
      scoreImprovement: '+20-100 points',
      icon: '🔍',
      color: '#3B82F6',
      steps: [
        'Request free annual credit reports',
        'Review reports for errors and inaccuracies',
        'File disputes for incorrect information',
        'Follow up on dispute resolutions'
      ]
    }
  ];

  const creditFactors = [
    {
      name: 'Payment History',
      percentage: 35,
      description: 'Your track record of making payments on time',
      tips: ['Never miss a payment', 'Set up automatic payments', 'Pay at least minimum amount'],
      grade: creditData.paymentHistory >= 80 ? 'A' : creditData.paymentHistory >= 60 ? 'B' : 'C'
    },
    {
      name: 'Credit Utilization',
      percentage: 30,
      description: 'How much credit you use vs. how much you have available',
      tips: ['Keep balances low', 'Pay multiple times per month', 'Request credit limit increases'],
      grade: creditData.creditUtilization <= 30 ? 'A' : creditData.creditUtilization <= 50 ? 'B' : 'C'
    },
    {
      name: 'Length of Credit History',
      percentage: 15,
      description: 'How long you\'ve been using credit',
      tips: ['Keep old accounts open', 'Avoid closing your oldest card', 'Use old cards occasionally'],
      grade: creditData.creditHistory >= 70 ? 'A' : creditData.creditHistory >= 50 ? 'B' : 'C'
    },
    {
      name: 'Credit Mix',
      percentage: 10,
      description: 'Variety of credit types (cards, loans, mortgages)',
      tips: ['Maintain diverse credit types', 'Don\'t open accounts just for mix', 'Focus on responsible usage'],
      grade: creditData.creditMix >= 70 ? 'A' : creditData.creditMix >= 50 ? 'B' : 'C'
    },
    {
      name: 'New Credit',
      percentage: 10,
      description: 'Recent credit inquiries and newly opened accounts',
      tips: ['Limit new applications', 'Space out credit applications', 'Research before applying'],
      grade: creditData.newCredit >= 70 ? 'A' : creditData.newCredit >= 50 ? 'B' : 'C'
    }
  ];

  const creditGoals = [
    { score: 580, label: 'Poor', color: '#EF4444', description: 'Focus on basics' },
    { score: 669, label: 'Fair', color: '#F59E0B', description: 'Improvement needed' },
    { score: 739, label: 'Good', color: '#10B981', description: 'Above average' },
    { score: 799, label: 'Very Good', color: '#3B82F6', description: 'Excellent rates' },
    { score: 850, label: 'Exceptional', color: '#8B5CF6', description: 'Best available' }
  ];

  const getCurrentScoreCategory = () => {
    if (creditData.currentScore < 580) return creditGoals[0];
    if (creditData.currentScore < 670) return creditGoals[1];
    if (creditData.currentScore < 740) return creditGoals[2];
    if (creditData.currentScore < 800) return creditGoals[3];
    return creditGoals[4];
  };

  const currentCategory = getCurrentScoreCategory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-yellow-800 to-amber-900 relative overflow-hidden">
      {/* Construction particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-400/60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${1 + Math.random() * 0.5}rem`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            🔨
          </motion.div>
        ))}
      </div>

      {/* Floating construction tools */}
      <div className="absolute inset-0">
        {['🏗️', '⚒️', '🧱', '📏', '🔧'].map((tool, i) => (
          <motion.div
            key={`tool-${i}`}
            className="absolute text-2xl text-orange-300/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 6 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          >
            {tool}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full flex items-center justify-center"
              animate={{
                rotate: [0, 10, -10, 0],
                boxShadow: [
                  '0 0 20px #F97316',
                  '0 0 40px #EA580C',
                  '0 0 20px #F97316',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-2xl">🏗️</span>
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Credit Builder
              </h1>
              <p className="text-orange-200">Construct your credit foundation</p>
            </div>
          </div>
          
          {/* Construction Progress */}
          <motion.div
            className="bg-black/40 backdrop-blur-xl rounded-lg px-4 py-2 border border-orange-400/50"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-orange-400 text-sm">Construction Progress</div>
            <div className="text-white text-xl font-bold">{constructionProgress.toFixed(0)}%</div>
          </motion.div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'dashboard', label: 'Credit Dashboard', icon: '📊' },
            { key: 'builder', label: 'Credit Builder', icon: '🏗️' },
            { key: 'monitoring', label: 'Credit Monitoring', icon: '📡' }
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
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Credit Score Building */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-orange-400/30 p-6">
                <h3 className="text-white text-xl font-semibold mb-6 text-center">Credit Foundation Construction</h3>
                
                {/* Credit Score Tower */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    {/* Foundation */}
                    <div className="w-64 h-16 bg-gradient-to-t from-gray-600 to-gray-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white font-bold">Foundation: {creditData.currentScore}</span>
                    </div>
                    
                    {/* Building Blocks */}
                    <div className="space-y-2">
                      {buildingBlocks.map((block, index) => {
                        const height = 8 + (block.completed / 100) * 32;
                        return (
                          <motion.div
                            key={block.id}
                            className="relative mx-auto rounded-lg flex items-center justify-center text-white font-bold text-sm"
                            style={{
                              width: `${240 - index * 20}px`,
                              height: `${height}px`,
                              background: `linear-gradient(to top, ${block.color}, ${block.color}dd)`,
                            }}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: `${height}px`, opacity: 1 }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                          >
                            {block.name}
                          </motion.div>
                        );
                      })}
                    </div>
                    
                    {/* Construction Crane */}
                    <motion.div
                      className="absolute -top-8 -right-8 text-4xl"
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      🏗️
                    </motion.div>
                  </div>
                </div>

                {/* Score Progression */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-4">Current Credit Score</h4>
                    <div className="relative w-48 h-48 mx-auto">
                      <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.1)"
                          strokeWidth="12"
                        />
                        <motion.circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke={currentCategory.color}
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={502}
                          strokeDashoffset={502 - (502 * creditData.currentScore) / 850}
                          initial={{ strokeDashoffset: 502 }}
                          animate={{ strokeDashoffset: 502 - (502 * creditData.currentScore) / 850 }}
                          transition={{ duration: 2 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-white text-2xl font-bold">{creditData.currentScore}</div>
                        <div className="text-orange-200 text-sm">{currentCategory.label}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-4">Construction Materials (Credit Factors)</h4>
                    <div className="space-y-3">
                      {creditFactors.slice(0, 3).map((factor, index) => (
                        <motion.div
                          key={factor.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/10 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium text-sm">{factor.name}</span>
                            <span className="text-orange-300 font-bold">{factor.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div
                              className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${factor.percentage * 2.5}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Input Controls */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-orange-200 text-sm">Current Credit Score</label>
                    <input
                      type="number"
                      min="300"
                      max="850"
                      value={creditData.currentScore}
                      onChange={(e) => setCreditData(prev => ({ ...prev, currentScore: parseInt(e.target.value) || 300 }))}
                      className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-orange-200 text-sm">Target Credit Score</label>
                    <input
                      type="number"
                      min="300"
                      max="850"
                      value={creditData.targetScore}
                      onChange={(e) => setCreditData(prev => ({ ...prev, targetScore: parseInt(e.target.value) || 300 }))}
                      className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'builder' && (
            <motion.div
              key="builder"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {improvementStrategies.map((strategy, index) => (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/40 backdrop-blur-xl rounded-2xl border border-orange-400/30 p-6"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${strategy.color}20`, border: `2px solid ${strategy.color}` }}
                    >
                      {strategy.icon}
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-bold">{strategy.title}</h3>
                      <p className="text-orange-200 text-sm">{strategy.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <div className="text-orange-300">Impact</div>
                      <div className="text-white font-bold">{strategy.impact}</div>
                    </div>
                    <div>
                      <div className="text-orange-300">Timeline</div>
                      <div className="text-white font-bold">{strategy.timeframe}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-green-300">Score Improvement</div>
                      <div className="text-white font-bold">{strategy.scoreImprovement}</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Construction Steps:</h4>
                    <div className="space-y-2">
                      {strategy.steps.map((step, stepIndex) => (
                        <motion.div
                          key={stepIndex}
                          className="flex items-center gap-2 text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + stepIndex * 0.05 }}
                        >
                          <div className="w-4 h-4 rounded border-2 border-orange-400 flex items-center justify-center">
                            <div className="w-2 h-2 rounded bg-orange-400"></div>
                          </div>
                          <span className="text-orange-200">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <motion.button
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 text-white font-bold py-2 px-4 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ background: `linear-gradient(to right, ${strategy.color}, ${strategy.color}dd)` }}
                  >
                    Start Building
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'monitoring' && (
            <motion.div
              key="monitoring"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Credit Factor Details */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-orange-400/30 p-6">
                <h3 className="text-white text-xl font-semibold mb-6">Construction Site Monitoring</h3>
                
                <div className="space-y-4">
                  {creditFactors.map((factor, index) => (
                    <motion.div
                      key={factor.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 rounded-xl p-4 border border-white/20"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center font-bold',
                            factor.grade === 'A' ? 'bg-green-500' :
                            factor.grade === 'B' ? 'bg-yellow-500' : 'bg-red-500'
                          )}>
                            {factor.grade}
                          </div>
                          <div>
                            <h4 className="text-white font-bold">{factor.name}</h4>
                            <p className="text-orange-200 text-sm">{factor.percentage}% of score</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold text-lg">{factor.percentage}%</div>
                          <div className="text-orange-300 text-sm">Weight</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">{factor.description}</p>
                      
                      <div>
                        <h5 className="text-white font-semibold mb-2 text-sm">Improvement Tips:</h5>
                        <div className="space-y-1">
                          {factor.tips.map((tip, tipIndex) => (
                            <div key={tipIndex} className="flex items-center gap-2 text-xs">
                              <div className="w-1 h-1 rounded-full bg-orange-400"></div>
                              <span className="text-orange-200">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Score Range Goals */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {creditGoals.slice(1, 4).map((goal, index) => (
                  <motion.div
                    key={goal.label}
                    className="bg-black/40 backdrop-blur-xl rounded-xl border border-orange-400/30 p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-center">
                      <div 
                        className="w-8 h-8 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: goal.color }}
                      ></div>
                      <div className="text-white font-bold">{goal.score}+ Score</div>
                      <div className="text-orange-300 text-sm">{goal.label}</div>
                      <div className="text-gray-300 text-xs">{goal.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Construction Assistant */}
      <motion.div
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: [0, 10, -10, 0],
          boxShadow: [
            '0 4px 20px rgba(249, 115, 22, 0.5)',
            '0 8px 30px rgba(249, 115, 22, 0.7)',
            '0 4px 20px rgba(249, 115, 22, 0.5)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🏗️
      </motion.div>
    </div>
  );
};

export default CreditBuilderPage;
