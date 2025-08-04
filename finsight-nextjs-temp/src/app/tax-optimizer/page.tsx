'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Tax Optimizer - Professional-themed tax optimization interface
const TaxOptimizerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'strategies' | 'documents'>('calculator');
  const [taxData, setTaxData] = useState({
    income: 85000,
    filingStatus: 'single',
    deductions: 12950, // Standard deduction
    credits: 0,
    retirement401k: 6000,
    iraContribution: 6000,
    hsaContribution: 3650,
    state: 'CA',
    dependents: 0
  });

  const [optimizationSuggestions, setOptimizationSuggestions] = useState<any[]>([]);
  const [currentTaxYear, setCurrentTaxYear] = useState(2024);

  // Tax brackets for 2024 (simplified federal)
  const federalBrackets = [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578125, rate: 0.35 },
    { min: 578125, max: Infinity, rate: 0.37 }
  ];

  const calculateTax = () => {
    const adjustedIncome = Math.max(0, taxData.income - taxData.retirement401k - taxData.iraContribution - taxData.hsaContribution);
    const taxableIncome = Math.max(0, adjustedIncome - taxData.deductions);
    
    let federalTax = 0;
    let remainingIncome = taxableIncome;
    
    for (const bracket of federalBrackets) {
      if (remainingIncome <= 0) break;
      
      const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      federalTax += taxableInBracket * bracket.rate;
      remainingIncome -= taxableInBracket;
    }
    
    federalTax = Math.max(0, federalTax - taxData.credits);
    const stateTax = taxableIncome * 0.05; // Simplified state tax
    const totalTax = federalTax + stateTax;
    const effectiveRate = (totalTax / taxData.income) * 100;
    const marginalBracket = federalBrackets.find(b => taxableIncome >= b.min && taxableIncome <= b.max);
    const marginalRate = marginalBracket ? marginalBracket.rate * 100 : 0;
    
    return {
      adjustedIncome,
      taxableIncome,
      federalTax,
      stateTax,
      totalTax,
      effectiveRate,
      marginalRate,
      afterTaxIncome: taxData.income - totalTax
    };
  };

  const taxCalculation = calculateTax();

  const optimizationStrategies = [
    {
      id: 'retirement-max',
      title: 'Maximize Retirement Contributions',
      description: 'Increase 401(k) and IRA contributions to reduce taxable income',
      category: 'Retirement',
      potentialSavings: 2200,
      difficulty: 'Easy',
      timeframe: 'Annual',
      icon: '🏦',
      color: '#3B82F6',
      actionSteps: [
        'Increase 401(k) contribution to employer match',
        'Max out IRA contribution ($6,500)',
        'Consider Roth vs Traditional options',
        'Set up automatic contributions'
      ]
    },
    {
      id: 'hsa-maximize',
      title: 'Health Savings Account Optimization',
      description: 'Triple tax advantage with HSA contributions',
      category: 'Healthcare',
      potentialSavings: 1100,
      difficulty: 'Easy',
      timeframe: 'Annual',
      icon: '🏥',
      color: '#10B981',
      actionSteps: [
        'Max out HSA contribution ($4,150)',
        'Invest HSA funds for long-term growth',
        'Save receipts for future reimbursement',
        'Use HSA for retirement healthcare costs'
      ]
    },
    {
      id: 'tax-loss-harvesting',
      title: 'Tax-Loss Harvesting',
      description: 'Offset capital gains with strategic losses',
      category: 'Investments',
      potentialSavings: 800,
      difficulty: 'Medium',
      timeframe: 'Annual',
      icon: '📊',
      color: '#F59E0B',
      actionSteps: [
        'Review investment portfolio for losses',
        'Harvest losses to offset gains',
        'Avoid wash sale rules',
        'Reinvest in similar but not identical assets'
      ]
    },
    {
      id: 'itemized-deductions',
      title: 'Itemized Deductions Strategy',
      description: 'Bundle deductions to exceed standard deduction',
      category: 'Deductions',
      potentialSavings: 1500,
      difficulty: 'Medium',
      timeframe: 'Annual',
      icon: '📋',
      color: '#8B5CF6',
      actionSteps: [
        'Track all deductible expenses',
        'Consider bunching charitable donations',
        'Time medical expenses strategically',
        'Maintain detailed records'
      ]
    }
  ];

  const taxDocuments = [
    {
      id: 'w2',
      name: 'W-2 Forms',
      description: 'Wage and tax statements from employers',
      status: 'received',
      dueDate: 'January 31',
      icon: '📄',
      priority: 'high'
    },
    {
      id: '1099',
      name: '1099 Forms',
      description: 'Interest, dividends, and other income',
      status: 'pending',
      dueDate: 'January 31',
      icon: '📊',
      priority: 'high'
    },
    {
      id: 'receipts',
      name: 'Deduction Receipts',
      description: 'Charitable donations, medical expenses',
      status: 'organizing',
      dueDate: 'April 15',
      icon: '🧾',
      priority: 'medium'
    },
    {
      id: 'prior-return',
      name: 'Prior Year Return',
      description: 'Last year\'s tax return for reference',
      status: 'ready',
      dueDate: 'N/A',
      icon: '📂',
      priority: 'low'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Professional document animations */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${0.8 + Math.random() * 0.5}rem`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 5, -5, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          >
            📊
          </motion.div>
        ))}
      </div>

      {/* Floating calculator symbols */}
      <div className="absolute inset-0">
        {['💼', '📈', '📋', '🏦', '💰'].map((symbol, i) => (
          <motion.div
            key={`symbol-${i}`}
            className="absolute text-2xl text-blue-300/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            {symbol}
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
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-slate-700 rounded-full flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 20px #2563EB',
                  '0 0 40px #1D4ED8',
                  '0 0 20px #2563EB',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-2xl">📊</span>
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-slate-400 bg-clip-text text-transparent">
                Tax Optimizer
              </h1>
              <p className="text-blue-200">Professional tax strategy & planning</p>
            </div>
          </div>
          
          {/* Tax Savings Display */}
          <motion.div
            className="bg-black/40 backdrop-blur-xl rounded-lg px-4 py-2 border border-green-400/50"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-green-400 text-sm">Potential Savings</div>
            <div className="text-white text-xl font-bold">
              ${optimizationStrategies.reduce((sum, strategy) => sum + strategy.potentialSavings, 0).toLocaleString()}
            </div>
          </motion.div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'calculator', label: 'Tax Calculator', icon: '🧮' },
            { key: 'strategies', label: 'Optimization', icon: '⚡' },
            { key: 'documents', label: 'Document Tracker', icon: '📋' }
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
          {activeTab === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Tax Summary Dashboard */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-6">
                <h3 className="text-white text-xl font-semibold mb-6">Tax Year {currentTaxYear} Summary</h3>
                
                {/* Tax Breakdown Visualization */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Tax Pie Chart Representation */}
                  <div className="text-center">
                    <div className="relative w-48 h-48 mx-auto mb-6">
                      <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                        {/* Background circle */}
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.1)"
                          strokeWidth="16"
                        />
                        
                        {/* Federal tax arc */}
                        <motion.circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="16"
                          strokeLinecap="round"
                          strokeDasharray={502}
                          strokeDashoffset={502 - (502 * (taxCalculation.federalTax / taxData.income))}
                          initial={{ strokeDashoffset: 502 }}
                          animate={{ strokeDashoffset: 502 - (502 * (taxCalculation.federalTax / taxData.income)) }}
                          transition={{ duration: 2 }}
                        />
                        
                        {/* State tax arc */}
                        <motion.circle
                          cx="100"
                          cy="100"
                          r="60"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={377}
                          strokeDashoffset={377 - (377 * (taxCalculation.stateTax / taxData.income))}
                          initial={{ strokeDashoffset: 377 }}
                          animate={{ strokeDashoffset: 377 - (377 * (taxCalculation.stateTax / taxData.income)) }}
                          transition={{ duration: 2, delay: 0.5 }}
                        />
                      </svg>
                      
                      {/* Center content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-white text-lg font-bold">
                          {taxCalculation.effectiveRate.toFixed(1)}%
                        </div>
                        <div className="text-blue-200 text-sm">Effective Rate</div>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-blue-200">Federal Tax</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-green-200">State Tax</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tax Metrics */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        className="bg-gradient-to-br from-blue-500/20 to-slate-500/20 rounded-xl p-4 border border-blue-400/30"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-blue-300 text-sm">Total Tax</div>
                        <div className="text-white text-xl font-bold">${taxCalculation.totalTax.toLocaleString()}</div>
                      </motion.div>
                      
                      <motion.div
                        className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-400/30"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-green-300 text-sm">After-Tax Income</div>
                        <div className="text-white text-xl font-bold">${taxCalculation.afterTaxIncome.toLocaleString()}</div>
                      </motion.div>
                      
                      <motion.div
                        className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-4 border border-purple-400/30"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-purple-300 text-sm">Marginal Rate</div>
                        <div className="text-white text-xl font-bold">{taxCalculation.marginalRate.toFixed(1)}%</div>
                      </motion.div>
                      
                      <motion.div
                        className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-400/30"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-yellow-300 text-sm">Taxable Income</div>
                        <div className="text-white text-xl font-bold">${taxCalculation.taxableIncome.toLocaleString()}</div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Input Form */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Income & Status</h4>
                    
                    <div>
                      <label className="text-blue-200 text-sm">Annual Income ($)</label>
                      <input
                        type="number"
                        value={taxData.income}
                        onChange={(e) => setTaxData(prev => ({ ...prev, income: parseInt(e.target.value) || 0 }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-blue-200 text-sm">Filing Status</label>
                      <select
                        value={taxData.filingStatus}
                        onChange={(e) => setTaxData(prev => ({ ...prev, filingStatus: e.target.value }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="single">Single</option>
                        <option value="marriedJoint">Married Filing Jointly</option>
                        <option value="marriedSeparate">Married Filing Separately</option>
                        <option value="headOfHousehold">Head of Household</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-blue-200 text-sm">Dependents</label>
                      <input
                        type="number"
                        value={taxData.dependents}
                        onChange={(e) => setTaxData(prev => ({ ...prev, dependents: parseInt(e.target.value) || 0 }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Deductions & Contributions</h4>
                    
                    <div>
                      <label className="text-blue-200 text-sm">401(k) Contribution ($)</label>
                      <input
                        type="number"
                        value={taxData.retirement401k}
                        onChange={(e) => setTaxData(prev => ({ ...prev, retirement401k: parseInt(e.target.value) || 0 }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-blue-200 text-sm">IRA Contribution ($)</label>
                      <input
                        type="number"
                        value={taxData.iraContribution}
                        onChange={(e) => setTaxData(prev => ({ ...prev, iraContribution: parseInt(e.target.value) || 0 }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-blue-200 text-sm">HSA Contribution ($)</label>
                      <input
                        type="number"
                        value={taxData.hsaContribution}
                        onChange={(e) => setTaxData(prev => ({ ...prev, hsaContribution: parseInt(e.target.value) || 0 }))}
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'strategies' && (
            <motion.div
              key="strategies"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {optimizationStrategies.map((strategy, index) => (
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
                      <h3 className="text-white text-lg font-bold">{strategy.title}</h3>
                      <p className="text-blue-200 text-sm">{strategy.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                    <div className="text-center">
                      <div className="text-green-300">Savings</div>
                      <div className="text-white font-bold">${strategy.potentialSavings.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-300">Difficulty</div>
                      <div className="text-white font-bold">{strategy.difficulty}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-300">Timeline</div>
                      <div className="text-white font-bold">{strategy.timeframe}</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Implementation Steps:</h4>
                    <div className="space-y-2">
                      {strategy.actionSteps.map((step, stepIndex) => (
                        <motion.div
                          key={stepIndex}
                          className="flex items-center gap-2 text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + stepIndex * 0.05 }}
                        >
                          <div className="w-4 h-4 rounded-full border-2 border-blue-400 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          </div>
                          <span className="text-blue-200">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <motion.button
                    className="w-full bg-gradient-to-r from-blue-500 to-slate-600 text-white font-bold py-2 px-4 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ background: `linear-gradient(to right, ${strategy.color}, ${strategy.color}dd)` }}
                  >
                    Implement Strategy
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Document Checklist */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-6">
                <h3 className="text-white text-xl font-semibold mb-6">Tax Document Checklist</h3>
                
                <div className="space-y-4">
                  {taxDocuments.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        'flex items-center justify-between p-4 rounded-xl border',
                        doc.status === 'ready' || doc.status === 'received'
                          ? 'bg-green-500/20 border-green-400'
                          : doc.status === 'organizing'
                          ? 'bg-yellow-500/20 border-yellow-400'
                          : 'bg-red-500/20 border-red-400'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-lg',
                          doc.status === 'ready' || doc.status === 'received'
                            ? 'bg-green-500'
                            : doc.status === 'organizing'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        )}>
                          {doc.icon}
                        </div>
                        <div>
                          <h4 className="text-white font-bold">{doc.name}</h4>
                          <p className="text-gray-300 text-sm">{doc.description}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={cn(
                          'text-sm font-bold mb-1',
                          doc.priority === 'high' ? 'text-red-300' :
                          doc.priority === 'medium' ? 'text-yellow-300' :
                          'text-green-300'
                        )}>
                          {doc.priority.toUpperCase()}
                        </div>
                        <div className="text-gray-300 text-xs">Due: {doc.dueDate}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Important Dates Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  className="bg-black/40 backdrop-blur-xl rounded-xl border border-red-400/30 p-4"
                  animate={{
                    borderColor: ['rgba(239, 68, 68, 0.3)', 'rgba(239, 68, 68, 0.6)', 'rgba(239, 68, 68, 0.3)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">📅</div>
                    <div className="text-red-400 font-bold">Jan 31</div>
                    <div className="text-gray-300 text-sm">W-2 & 1099 Deadline</div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="bg-black/40 backdrop-blur-xl rounded-xl border border-yellow-400/30 p-4"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">📋</div>
                    <div className="text-yellow-400 font-bold">Apr 15</div>
                    <div className="text-gray-300 text-sm">Tax Filing Deadline</div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="bg-black/40 backdrop-blur-xl rounded-xl border border-blue-400/30 p-4"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">💰</div>
                    <div className="text-blue-400 font-bold">Dec 31</div>
                    <div className="text-gray-300 text-sm">Contribution Deadline</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Tax Assistant */}
      <motion.div
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-slate-700 rounded-full flex items-center justify-center text-white text-2xl shadow-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: [0, 2, -2, 0],
          boxShadow: [
            '0 4px 20px rgba(37, 99, 235, 0.5)',
            '0 8px 30px rgba(37, 99, 235, 0.7)',
            '0 4px 20px rgba(37, 99, 235, 0.5)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        📊
      </motion.div>
    </div>
  );
};

export default TaxOptimizerPage;
