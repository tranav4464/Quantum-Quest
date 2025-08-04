'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Risk Manager - Shield-themed risk assessment interface
const RiskManagerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assessment' | 'protection' | 'monitoring'>('assessment');
  const [riskProfile, setRiskProfile] = useState({
    age: 35,
    income: 75000,
    dependents: 2,
    debt: 150000,
    savings: 25000,
    riskTolerance: 'moderate',
    timeHorizon: 20
  });

  const [protectionLevels, setProtectionLevels] = useState({
    emergency: 60,
    insurance: 40,
    diversification: 75,
    debt: 30
  });

  const [shieldStrength, setShieldStrength] = useState(0);
  const [threats, setThreats] = useState([
    { id: 1, name: 'Job Loss', severity: 'High', probability: 'Medium', impact: '$50,000', protected: false },
    { id: 2, name: 'Market Crash', severity: 'Medium', probability: 'Low', impact: '$15,000', protected: true },
    { id: 3, name: 'Health Emergency', severity: 'High', probability: 'Medium', impact: '$75,000', protected: true },
    { id: 4, name: 'Disability', severity: 'Very High', probability: 'Low', impact: '$200,000', protected: false }
  ]);

  useEffect(() => {
    const avgProtection = Object.values(protectionLevels).reduce((sum, level) => sum + level, 0) / 4;
    setShieldStrength(avgProtection);
  }, [protectionLevels]);

  const riskCategories = [
    {
      id: 'market',
      name: 'Market Risk',
      description: 'Investment value fluctuations',
      level: 'Medium',
      impact: '$12,000',
      color: '#F59E0B',
      icon: '📈',
      mitigation: ['Diversification', 'Asset allocation', 'Dollar-cost averaging']
    },
    {
      id: 'credit',
      name: 'Credit Risk',
      description: 'Debt and lending exposure',
      level: 'Low',
      impact: '$3,000',
      color: '#10B981',
      icon: '💳',
      mitigation: ['Credit monitoring', 'Debt reduction', 'Payment automation']
    },
    {
      id: 'liquidity',
      name: 'Liquidity Risk',
      description: 'Access to cash when needed',
      level: 'High',
      impact: '$25,000',
      color: '#EF4444',
      icon: '💧',
      mitigation: ['Emergency fund', 'High-yield savings', 'Credit line']
    },
    {
      id: 'inflation',
      name: 'Inflation Risk',
      description: 'Purchasing power erosion',
      level: 'Medium',
      impact: '$8,000',
      color: '#8B5CF6',
      icon: '📊',
      mitigation: ['TIPS bonds', 'Real estate', 'Commodities']
    }
  ];

  const protectionStrategies = [
    {
      id: 'emergency-fund',
      name: 'Emergency Fund Shield',
      description: 'Liquid savings for unexpected expenses',
      strength: protectionLevels.emergency,
      target: 6,
      current: Math.floor(riskProfile.savings / (riskProfile.income / 12)),
      icon: '🛡️',
      color: '#3B82F6'
    },
    {
      id: 'insurance',
      name: 'Insurance Armor',
      description: 'Protection against major risks',
      strength: protectionLevels.insurance,
      target: 100,
      current: protectionLevels.insurance,
      icon: '⛑️',
      color: '#10B981'
    },
    {
      id: 'diversification',
      name: 'Diversification Barrier',
      description: 'Spread risk across investments',
      strength: protectionLevels.diversification,
      target: 100,
      current: protectionLevels.diversification,
      icon: '🌐',
      color: '#F59E0B'
    },
    {
      id: 'debt-shield',
      name: 'Debt Management Shield',
      description: 'Control debt-to-income ratio',
      strength: 100 - protectionLevels.debt,
      target: 70,
      current: 100 - (riskProfile.debt / riskProfile.income * 100),
      icon: '⚔️',
      color: '#8B5CF6'
    }
  ];

  const calculateRiskScore = () => {
    let score = 50; // Base score
    
    // Age factor
    if (riskProfile.age < 30) score += 10;
    else if (riskProfile.age > 50) score -= 10;
    
    // Income stability
    if (riskProfile.income > 100000) score -= 5;
    else if (riskProfile.income < 50000) score += 10;
    
    // Dependents
    score += riskProfile.dependents * 5;
    
    // Debt ratio
    const debtRatio = riskProfile.debt / riskProfile.income;
    if (debtRatio > 3) score += 15;
    else if (debtRatio < 1) score -= 5;
    
    // Emergency fund
    const emergencyMonths = riskProfile.savings / (riskProfile.income / 12);
    if (emergencyMonths < 3) score += 15;
    else if (emergencyMonths > 6) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  };

  const riskScore = calculateRiskScore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Shield particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-6 h-6 text-blue-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.5, 1, 0.5],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          >
            🛡️
          </motion.div>
        ))}
      </div>

      {/* Floating warning signals */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`warning-${i}`}
            className="absolute text-red-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ⚠️
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
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-slate-600 rounded-full flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 20px #3B82F6',
                  '0 0 40px #1E40AF',
                  '0 0 20px #3B82F6',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-2xl">🛡️</span>
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-slate-400 bg-clip-text text-transparent">
                Risk Manager
              </h1>
              <p className="text-blue-200">Protect your financial fortress</p>
            </div>
          </div>
          
          {/* Shield Strength Indicator */}
          <motion.div
            className="bg-black/40 backdrop-blur-xl rounded-lg px-4 py-2 border border-blue-400/50"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-blue-400 text-sm">Shield Strength</div>
            <div className="text-white text-xl font-bold">{shieldStrength.toFixed(0)}%</div>
          </motion.div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'assessment', label: 'Risk Assessment', icon: '🔍' },
            { key: 'protection', label: 'Protection Systems', icon: '🛡️' },
            { key: 'monitoring', label: 'Threat Monitoring', icon: '📡' }
          ].map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
                activeTab === tab.key
                  ? 'bg-blue-500/30 text-white border border-blue-400'
                  : 'bg-white/10 text-blue-200 hover:bg-white/15'
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
          {activeTab === 'assessment' && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Risk Score Display */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-6">
                <h3 className="text-white text-xl font-semibold mb-6 text-center">Overall Risk Assessment</h3>
                
                {/* Central Risk Gauge */}
                <div className="flex justify-center mb-8">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                      {/* Background circle */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="12"
                      />
                      
                      {/* Risk level arc */}
                      <motion.circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke={riskScore > 70 ? '#EF4444' : riskScore > 40 ? '#F59E0B' : '#10B981'}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={502}
                        strokeDashoffset={502 - (502 * riskScore) / 100}
                        initial={{ strokeDashoffset: 502 }}
                        animate={{ strokeDashoffset: 502 - (502 * riskScore) / 100 }}
                        transition={{ duration: 2 }}
                      />
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
                        {riskScore > 70 ? '🚨' : riskScore > 40 ? '⚠️' : '✅'}
                      </motion.div>
                      <div className="text-white text-2xl font-bold">{riskScore}</div>
                      <div className="text-blue-200 text-sm">Risk Score</div>
                    </div>
                  </div>
                </div>

                {/* Profile Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Personal Information</h4>
                    
                    <div>
                      <label className="text-blue-200 text-sm">Age</label>
                      <input
                        type="number"
                        value={riskProfile.age}
                        onChange={(e) => setRiskProfile(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-blue-200 text-sm">Annual Income ($)</label>
                      <input
                        type="number"
                        value={riskProfile.income}
                        onChange={(e) => setRiskProfile(prev => ({ ...prev, income: parseInt(e.target.value) || 0 }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-blue-200 text-sm">Dependents</label>
                      <input
                        type="number"
                        value={riskProfile.dependents}
                        onChange={(e) => setRiskProfile(prev => ({ ...prev, dependents: parseInt(e.target.value) || 0 }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Financial Position</h4>
                    
                    <div>
                      <label className="text-blue-200 text-sm">Total Debt ($)</label>
                      <input
                        type="number"
                        value={riskProfile.debt}
                        onChange={(e) => setRiskProfile(prev => ({ ...prev, debt: parseInt(e.target.value) || 0 }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-blue-200 text-sm">Emergency Savings ($)</label>
                      <input
                        type="number"
                        value={riskProfile.savings}
                        onChange={(e) => setRiskProfile(prev => ({ ...prev, savings: parseInt(e.target.value) || 0 }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-blue-200 text-sm">Risk Tolerance</label>
                      <select
                        value={riskProfile.riskTolerance}
                        onChange={(e) => setRiskProfile(prev => ({ ...prev, riskTolerance: e.target.value }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="conservative">Conservative</option>
                        <option value="moderate">Moderate</option>
                        <option value="aggressive">Aggressive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {riskCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-400/30 p-6"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${category.color}20`, border: `2px solid ${category.color}` }}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-white text-lg font-bold">{category.name}</h3>
                        <p className="text-gray-300 text-sm">{category.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div>
                        <div className="text-gray-300">Risk Level</div>
                        <div className="text-white font-bold">{category.level}</div>
                      </div>
                      <div>
                        <div className="text-gray-300">Potential Impact</div>
                        <div className="text-white font-bold">{category.impact}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-semibold mb-2 text-sm">Mitigation Strategies:</h4>
                      <div className="space-y-1">
                        {category.mitigation.map((strategy, strategyIndex) => (
                          <div key={strategyIndex} className="flex items-center gap-2 text-xs">
                            <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                            <span className="text-gray-300">{strategy}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'protection' && (
            <motion.div
              key="protection"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {protectionStrategies.map((strategy, index) => (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/40 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-6"
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
                      <h3 className="text-white text-lg font-bold">{strategy.name}</h3>
                      <p className="text-blue-200 text-sm">{strategy.description}</p>
                    </div>
                  </div>
                  
                  {/* Protection Level */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-white mb-2">
                      <span>Protection Level</span>
                      <span>{strategy.strength.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <motion.div
                        className="h-4 rounded-full"
                        style={{ background: `linear-gradient(to right, ${strategy.color}, ${strategy.color}cc)` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${strategy.strength}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                  
                  {/* Current vs Target */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-blue-200">Current</div>
                      <div className="text-white font-bold">
                        {strategy.id === 'emergency-fund' ? `${strategy.current} months` : `${strategy.current}%`}
                      </div>
                    </div>
                    <div>
                      <div className="text-blue-200">Target</div>
                      <div className="text-white font-bold">
                        {strategy.id === 'emergency-fund' ? `${strategy.target} months` : `${strategy.target}%`}
                      </div>
                    </div>
                  </div>
                  
                  {/* Improvement Slider */}
                  <div className="mt-4">
                    <label className="text-blue-200 text-sm">Adjust Protection Level</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={strategy.strength}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setProtectionLevels(prev => ({
                          ...prev,
                          [strategy.id.replace('-', '').replace('fund', '').replace('armor', '').replace('barrier', '').replace('shield', '')]: value
                        }));
                      }}
                      className="w-full mt-2"
                    />
                  </div>
                  
                  <motion.button
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 to-slate-600 text-white font-bold py-2 px-4 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Strengthen Shield
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
              {/* Threat Dashboard */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-red-400/30 p-6">
                <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
                  <span>🚨</span>
                  Active Threat Monitoring
                </h3>
                
                <div className="space-y-4">
                  {threats.map((threat, index) => (
                    <motion.div
                      key={threat.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        'flex items-center justify-between p-4 rounded-xl border',
                        threat.protected 
                          ? 'bg-green-500/20 border-green-400' 
                          : 'bg-red-500/20 border-red-400'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-lg',
                          threat.protected ? 'bg-green-500' : 'bg-red-500'
                        )}>
                          {threat.protected ? '🛡️' : '⚠️'}
                        </div>
                        <div>
                          <h4 className="text-white font-bold">{threat.name}</h4>
                          <div className="flex gap-4 text-sm">
                            <span className="text-gray-300">
                              Severity: <span className="text-white">{threat.severity}</span>
                            </span>
                            <span className="text-gray-300">
                              Probability: <span className="text-white">{threat.probability}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-white font-bold">{threat.impact}</div>
                        <div className={cn(
                          'text-sm',
                          threat.protected ? 'text-green-300' : 'text-red-300'
                        )}>
                          {threat.protected ? 'Protected' : 'Vulnerable'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Alert System */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  className="bg-black/40 backdrop-blur-xl rounded-xl border border-yellow-400/30 p-4"
                  animate={{
                    borderColor: ['rgba(250, 204, 21, 0.3)', 'rgba(250, 204, 21, 0.6)', 'rgba(250, 204, 21, 0.3)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">⚠️</div>
                    <div className="text-yellow-400 font-bold">Market Volatility</div>
                    <div className="text-gray-300 text-sm">High alert level</div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="bg-black/40 backdrop-blur-xl rounded-xl border border-blue-400/30 p-4"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <div className="text-blue-400 font-bold">Credit Monitoring</div>
                    <div className="text-gray-300 text-sm">Normal activity</div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="bg-black/40 backdrop-blur-xl rounded-xl border border-green-400/30 p-4"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">🔒</div>
                    <div className="text-green-400 font-bold">Security Status</div>
                    <div className="text-gray-300 text-sm">All systems secure</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Shield Assistant */}
      <motion.div
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-slate-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: [0, 5, -5, 0],
          boxShadow: [
            '0 4px 20px rgba(59, 130, 246, 0.5)',
            '0 8px 30px rgba(59, 130, 246, 0.7)',
            '0 4px 20px rgba(59, 130, 246, 0.5)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🛡️
      </motion.div>
    </div>
  );
};

export default RiskManagerPage;
