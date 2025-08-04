'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Control Center - Settings-themed financial dashboard interface
const ControlCenterPage: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'dashboard' | 'settings' | 'automation'>('dashboard');
  const [systemStatus, setSystemStatus] = useState({
    budgetTracking: 'online',
    goalProgress: 'online',
    riskMonitoring: 'warning',
    taxOptimization: 'online',
    investmentSync: 'offline'
  });

  const [automationRules, setAutomationRules] = useState([
    { id: 1, name: 'Emergency Fund Alert', enabled: true, trigger: 'Balance < $1000', action: 'Send notification' },
    { id: 2, name: 'Bill Payment Reminder', enabled: true, trigger: '3 days before due', action: 'Auto-schedule payment' },
    { id: 3, name: 'Investment Rebalance', enabled: false, trigger: 'Monthly', action: 'Rebalance portfolio' },
    { id: 4, name: 'Spending Alert', enabled: true, trigger: 'Budget exceeded', action: 'Block transaction' }
  ]);

  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalAssets: 285000,
    monthlyIncome: 7500,
    monthlyExpenses: 5200,
    savingsRate: 30.7,
    creditScore: 750,
    netWorth: 185000
  });

  const systemModules = [
    {
      id: 'budget-engine',
      name: 'Budget Engine',
      status: systemStatus.budgetTracking,
      description: 'Real-time expense tracking and categorization',
      icon: '💰',
      color: '#10B981',
      metrics: { processed: '2,847 transactions', accuracy: '98.2%' }
    },
    {
      id: 'goal-tracker',
      name: 'Goal Tracker',
      status: systemStatus.goalProgress,
      description: 'Financial goal monitoring and progress analysis',
      icon: '🎯',
      color: '#3B82F6',
      metrics: { active: '7 goals', completion: '64%' }
    },
    {
      id: 'risk-analyzer',
      name: 'Risk Analyzer',
      status: systemStatus.riskMonitoring,
      description: 'Portfolio risk assessment and alerts',
      icon: '🛡️',
      color: '#F59E0B',
      metrics: { risk_level: 'Moderate', alerts: '2 active' }
    },
    {
      id: 'tax-optimizer',
      name: 'Tax Optimizer',
      status: systemStatus.taxOptimization,
      description: 'Tax strategy automation and optimization',
      icon: '📊',
      color: '#8B5CF6',
      metrics: { savings: '$3,200', efficiency: '92%' }
    },
    {
      id: 'investment-sync',
      name: 'Investment Sync',
      status: systemStatus.investmentSync,
      description: 'Investment account synchronization',
      icon: '📈',
      color: '#EF4444',
      metrics: { accounts: '4 connected', sync: 'Failed 2hrs ago' }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'offline': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '✅';
      case 'warning': return '⚠️';
      case 'offline': return '❌';
      default: return '❓';
    }
  };

  const controlPanels = [
    {
      id: 'notifications',
      name: 'Notification Center',
      description: 'Manage alerts and communication preferences',
      icon: '🔔',
      settings: ['Email alerts', 'Push notifications', 'SMS updates', 'Weekly reports']
    },
    {
      id: 'security',
      name: 'Security Settings',
      description: 'Account protection and access controls',
      icon: '🔒',
      settings: ['Two-factor auth', 'Device management', 'Session timeout', 'Login alerts']
    },
    {
      id: 'integration',
      name: 'Account Integration',
      description: 'Connect and manage external accounts',
      icon: '🔗',
      settings: ['Bank accounts', 'Credit cards', 'Investment accounts', 'Crypto wallets']
    },
    {
      id: 'preferences',
      name: 'User Preferences',
      description: 'Customize dashboard and display options',
      icon: '⚙️',
      settings: ['Currency format', 'Date format', 'Chart types', 'Color themes']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-zinc-900 relative overflow-hidden">
      {/* Digital grid background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#3B82F6" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating tech particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-400/60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${0.8 + Math.random() * 0.4}rem`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          >
            ⚙️
          </motion.div>
        ))}
      </div>

      {/* Floating status indicators */}
      <div className="absolute inset-0">
        {['📊', '🔧', '⚡', '🖥️', '🔍'].map((symbol, i) => (
          <motion.div
            key={`symbol-${i}`}
            className="absolute text-2xl text-slate-400/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.7, 0.3],
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
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-slate-700 rounded-lg flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 20px #2563EB',
                  '0 0 40px #1E40AF',
                  '0 0 20px #2563EB',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-2xl">🖥️</span>
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-slate-400 bg-clip-text text-transparent">
                Control Center
              </h1>
              <p className="text-slate-300">Master financial command console</p>
            </div>
          </div>
          
          {/* System Status */}
          <motion.div
            className="bg-black/40 backdrop-blur-xl rounded-lg px-4 py-2 border border-blue-400/50"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-blue-400 text-sm">System Status</div>
            <div className="text-white text-xl font-bold flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              Operational
            </div>
          </motion.div>
        </motion.div>

        {/* Module Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'dashboard', label: 'System Dashboard', icon: '📊' },
            { key: 'settings', label: 'Control Panels', icon: '⚙️' },
            { key: 'automation', label: 'Automation Hub', icon: '🤖' }
          ].map((module) => (
            <motion.button
              key={module.key}
              onClick={() => setActiveModule(module.key as any)}
              className={cn(
                'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
                activeModule === module.key
                  ? 'bg-blue-500/30 text-white border border-blue-400'
                  : 'bg-white/10 text-slate-300 hover:bg-white/15'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{module.icon}</span>
              <span className="text-sm font-medium">{module.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 px-6 pb-6">
        <AnimatePresence mode="wait">
          {activeModule === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* System Overview */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-6">
                <h3 className="text-white text-xl font-semibold mb-6">System Performance Dashboard</h3>
                
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <motion.div
                    className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-400/30"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">💰</div>
                      <div>
                        <div className="text-green-300 text-sm">Net Worth</div>
                        <div className="text-white text-xl font-bold">${dashboardMetrics.netWorth.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-green-200 text-xs">+5.2% this month</div>
                  </motion.div>
                  
                  <motion.div
                    className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-400/30"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">📈</div>
                      <div>
                        <div className="text-blue-300 text-sm">Savings Rate</div>
                        <div className="text-white text-xl font-bold">{dashboardMetrics.savingsRate}%</div>
                      </div>
                    </div>
                    <div className="text-blue-200 text-xs">Above target by 5.7%</div>
                  </motion.div>
                  
                  <motion.div
                    className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/30"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">🏆</div>
                      <div>
                        <div className="text-purple-300 text-sm">Credit Score</div>
                        <div className="text-white text-xl font-bold">{dashboardMetrics.creditScore}</div>
                      </div>
                    </div>
                    <div className="text-purple-200 text-xs">Excellent rating</div>
                  </motion.div>
                </div>

                {/* System Modules Status */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">System Modules</h4>
                  <div className="space-y-3">
                    {systemModules.map((module, index) => (
                      <motion.div
                        key={module.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 rounded-xl p-4 border border-white/20"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                              style={{ backgroundColor: `${module.color}20`, border: `2px solid ${module.color}` }}
                            >
                              {module.icon}
                            </div>
                            <div>
                              <h5 className="text-white font-bold">{module.name}</h5>
                              <p className="text-slate-300 text-sm">{module.description}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              <span>{getStatusIcon(module.status)}</span>
                              <span 
                                className="font-bold text-sm"
                                style={{ color: getStatusColor(module.status) }}
                              >
                                {module.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-slate-400 text-xs">
                              {Object.entries(module.metrics).map(([key, value]) => (
                                <div key={key}>{key}: {value}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeModule === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {controlPanels.map((panel, index) => (
                <motion.div
                  key={panel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/40 backdrop-blur-xl rounded-2xl border border-slate-400/30 p-6"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-gray-600 rounded-lg flex items-center justify-center text-2xl">
                      {panel.icon}
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-bold">{panel.name}</h3>
                      <p className="text-slate-300 text-sm">{panel.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {panel.settings.map((setting, settingIndex) => (
                      <motion.div
                        key={settingIndex}
                        className="flex items-center justify-between p-3 bg-white/10 rounded-lg"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + settingIndex * 0.05 }}
                      >
                        <span className="text-slate-200">{setting}</span>
                        <motion.div
                          className="w-12 h-6 bg-blue-500 rounded-full flex items-center px-1 cursor-pointer"
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="w-4 h-4 bg-white rounded-full"
                            layout
                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                          />
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.button
                    className="w-full mt-4 bg-gradient-to-r from-slate-600 to-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Configure Panel
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeModule === 'automation' && (
            <motion.div
              key="automation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Automation Rules */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-6">
                <h3 className="text-white text-xl font-semibold mb-6">Automation Rules Engine</h3>
                
                <div className="space-y-4">
                  {automationRules.map((rule, index) => (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        'flex items-center justify-between p-4 rounded-xl border',
                        rule.enabled 
                          ? 'bg-green-500/20 border-green-400' 
                          : 'bg-gray-500/20 border-gray-400'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center',
                          rule.enabled ? 'bg-green-500' : 'bg-gray-500'
                        )}>
                          {rule.enabled ? '🤖' : '⏸️'}
                        </div>
                        <div>
                          <h4 className="text-white font-bold">{rule.name}</h4>
                          <div className="text-sm text-slate-300">
                            <span className="text-blue-300">When:</span> {rule.trigger}
                          </div>
                          <div className="text-sm text-slate-300">
                            <span className="text-green-300">Then:</span> {rule.action}
                          </div>
                        </div>
                      </div>
                      
                      <motion.button
                        onClick={() => setAutomationRules(prev => 
                          prev.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r)
                        )}
                        className={cn(
                          'px-4 py-2 rounded-lg font-bold text-sm',
                          rule.enabled 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-green-500 text-white hover:bg-green-600'
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {rule.enabled ? 'Disable' : 'Enable'}
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
                
                {/* Add New Rule */}
                <motion.button
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg border-2 border-dashed border-blue-400"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  + Create New Automation Rule
                </motion.button>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  className="bg-black/40 backdrop-blur-xl rounded-xl border border-green-400/30 p-4 text-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-3xl mb-2">🚀</div>
                  <div className="text-green-400 font-bold">Quick Setup</div>
                  <div className="text-slate-300 text-sm">Pre-configured rules</div>
                </motion.button>
                
                <motion.button
                  className="bg-black/40 backdrop-blur-xl rounded-xl border border-blue-400/30 p-4 text-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-blue-400 font-bold">Analytics</div>
                  <div className="text-slate-300 text-sm">Rule performance</div>
                </motion.button>
                
                <motion.button
                  className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-400/30 p-4 text-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-3xl mb-2">🔧</div>
                  <div className="text-purple-400 font-bold">Advanced</div>
                  <div className="text-slate-300 text-sm">Custom scripting</div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Control Assistant */}
      <motion.div
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-slate-700 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 4px 20px rgba(37, 99, 235, 0.5)',
            '0 8px 30px rgba(37, 99, 235, 0.7)',
            '0 4px 20px rgba(37, 99, 235, 0.5)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🖥️
      </motion.div>
    </div>
  );
};

export default ControlCenterPage;
