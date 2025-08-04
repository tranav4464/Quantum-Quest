'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Report Studio - Document-themed reporting interface
const ReportStudioPage: React.FC = () => {
  const [activeReport, setActiveReport] = useState<'financial' | 'investment' | 'tax' | 'custom'>('financial');
  const [reportData, setReportData] = useState({
    period: 'monthly',
    year: 2024,
    month: 'december',
    categories: ['income', 'expenses', 'savings', 'investments']
  });

  const [reportStatus, setReportStatus] = useState({
    financial: 'ready',
    investment: 'generating',
    tax: 'scheduled',
    custom: 'draft'
  });

  const reportTemplates = [
    {
      id: 'financial-summary',
      name: 'Financial Summary Report',
      description: 'Comprehensive overview of financial position',
      type: 'financial',
      frequency: 'Monthly',
      lastGenerated: '2024-12-15',
      icon: '📊',
      color: '#10B981',
      sections: ['Income Analysis', 'Expense Breakdown', 'Cash Flow', 'Net Worth Tracking']
    },
    {
      id: 'investment-performance',
      name: 'Investment Performance Report',
      description: 'Portfolio analysis and performance metrics',
      type: 'investment',
      frequency: 'Quarterly',
      lastGenerated: '2024-12-01',
      icon: '📈',
      color: '#3B82F6',
      sections: ['Portfolio Allocation', 'Performance Analysis', 'Risk Assessment', 'Rebalancing Recommendations']
    },
    {
      id: 'tax-preparation',
      name: 'Tax Preparation Report',
      description: 'Annual tax document compilation',
      type: 'tax',
      frequency: 'Annually',
      lastGenerated: '2024-04-15',
      icon: '📋',
      color: '#8B5CF6',
      sections: ['Income Summary', 'Deduction Tracking', 'Tax Credits', 'Document Checklist']
    },
    {
      id: 'budget-analysis',
      name: 'Budget Analysis Report',
      description: 'Detailed budget vs actual spending analysis',
      type: 'financial',
      frequency: 'Weekly',
      lastGenerated: '2024-12-14',
      icon: '💰',
      color: '#F59E0B',
      sections: ['Budget Performance', 'Variance Analysis', 'Trend Identification', 'Optimization Suggestions']
    }
  ];

  const reportMetrics = {
    totalReports: 47,
    automatedReports: 32,
    scheduledReports: 8,
    customReports: 7,
    storageUsed: '2.3 GB',
    lastBackup: '2024-12-15 03:00 AM'
  };

  const chartConfigs = [
    {
      id: 'income-trend',
      name: 'Income Trend Analysis',
      type: 'line',
      description: 'Monthly income progression',
      dataPoints: 12,
      color: '#10B981'
    },
    {
      id: 'expense-breakdown',
      name: 'Expense Category Breakdown',
      type: 'pie',
      description: 'Spending distribution by category',
      dataPoints: 8,
      color: '#EF4444'
    },
    {
      id: 'net-worth-growth',
      name: 'Net Worth Growth',
      type: 'area',
      description: 'Asset vs liability progression',
      dataPoints: 24,
      color: '#3B82F6'
    },
    {
      id: 'savings-rate',
      name: 'Savings Rate Tracking',
      type: 'bar',
      description: 'Monthly savings percentage',
      dataPoints: 12,
      color: '#8B5CF6'
    }
  ];

  const exportFormats = [
    { id: 'pdf', name: 'PDF Report', icon: '📄', description: 'Professional document format' },
    { id: 'excel', name: 'Excel Spreadsheet', icon: '📊', description: 'Detailed data analysis' },
    { id: 'csv', name: 'CSV Data', icon: '📝', description: 'Raw data export' },
    { id: 'presentation', name: 'PowerPoint', icon: '📊', description: 'Presentation format' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return '#10B981';
      case 'generating': return '#F59E0B';
      case 'scheduled': return '#3B82F6';
      case 'draft': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return '✅';
      case 'generating': return '⏳';
      case 'scheduled': return '📅';
      case 'draft': return '📝';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-slate-900 relative overflow-hidden">
      {/* Document floating animations */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-400/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${1 + Math.random() * 0.5}rem`,
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
            📄
          </motion.div>
        ))}
      </div>

      {/* Floating chart elements */}
      <div className="absolute inset-0">
        {['📊', '📈', '📉', '📋', '💼'].map((chart, i) => (
          <motion.div
            key={`chart-${i}`}
            className="absolute text-2xl text-indigo-300/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            {chart}
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
              className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-blue-700 rounded-lg flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 20px #4F46E5',
                  '0 0 40px #3730A3',
                  '0 0 20px #4F46E5',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-2xl">📊</span>
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                Report Studio
              </h1>
              <p className="text-indigo-200">Professional financial reporting & analytics</p>
            </div>
          </div>
          
          {/* Report Metrics */}
          <motion.div
            className="bg-black/40 backdrop-blur-xl rounded-lg px-4 py-2 border border-indigo-400/50"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-indigo-400 text-sm">Total Reports</div>
            <div className="text-white text-xl font-bold">{reportMetrics.totalReports}</div>
          </motion.div>
        </motion.div>

        {/* Report Type Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'financial', label: 'Financial Reports', icon: '💰' },
            { key: 'investment', label: 'Investment Reports', icon: '📈' },
            { key: 'tax', label: 'Tax Reports', icon: '📋' },
            { key: 'custom', label: 'Custom Reports', icon: '🔧' }
          ].map((report) => (
            <motion.button
              key={report.key}
              onClick={() => setActiveReport(report.key as any)}
              className={cn(
                'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
                activeReport === report.key
                  ? 'bg-indigo-500/30 text-white border border-indigo-400'
                  : 'bg-white/10 text-indigo-200 hover:bg-white/15'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{report.icon}</span>
              <span className="text-sm font-medium">{report.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 px-6 pb-6">
        <AnimatePresence mode="wait">
          {activeReport === 'financial' && (
            <motion.div
              key="financial"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Report Templates */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-indigo-400/30 p-6">
                <h3 className="text-white text-xl font-semibold mb-6">Financial Report Templates</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {reportTemplates.filter(template => template.type === 'financial').map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 rounded-xl p-6 border border-white/20"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${template.color}20`, border: `2px solid ${template.color}` }}
                        >
                          {template.icon}
                        </div>
                        <div>
                          <h4 className="text-white font-bold">{template.name}</h4>
                          <p className="text-indigo-200 text-sm">{template.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div>
                          <div className="text-indigo-300">Frequency</div>
                          <div className="text-white font-bold">{template.frequency}</div>
                        </div>
                        <div>
                          <div className="text-indigo-300">Last Generated</div>
                          <div className="text-white font-bold">{template.lastGenerated}</div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="text-white font-semibold mb-2 text-sm">Report Sections:</h5>
                        <div className="space-y-1">
                          {template.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="flex items-center gap-2 text-xs">
                              <div className="w-1 h-1 rounded-full bg-indigo-400"></div>
                              <span className="text-indigo-200">{section}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.button
                          className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Generate Report
                        </motion.button>
                        <motion.button
                          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ⚙️
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Chart Configuration */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-indigo-400/30 p-6">
                <h3 className="text-white text-xl font-semibold mb-6">Chart Configurations</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chartConfigs.map((chart, index) => (
                    <motion.div
                      key={chart.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-bold text-sm">{chart.name}</h4>
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: chart.color }}
                        ></div>
                      </div>
                      <p className="text-indigo-200 text-xs mb-2">{chart.description}</p>
                      <div className="flex justify-between text-xs">
                        <span className="text-indigo-300">Type: {chart.type}</span>
                        <span className="text-indigo-300">{chart.dataPoints} points</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeReport === 'investment' && (
            <motion.div
              key="investment"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              {/* Investment Report Dashboard */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-indigo-400/30 p-6">
                <h3 className="text-white text-xl font-semibold mb-6">Investment Performance Reports</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="space-y-4">
                      {reportTemplates.filter(template => template.type === 'investment').map((template, index) => (
                        <motion.div
                          key={template.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/10 rounded-xl p-6 border border-white/20"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                                style={{ backgroundColor: `${template.color}20`, border: `2px solid ${template.color}` }}
                              >
                                {template.icon}
                              </div>
                              <div>
                                <h4 className="text-white font-bold">{template.name}</h4>
                                <p className="text-indigo-200 text-sm">{template.description}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span>{getStatusIcon(reportStatus[template.type as keyof typeof reportStatus])}</span>
                              <span 
                                className="font-bold text-sm"
                                style={{ color: getStatusColor(reportStatus[template.type as keyof typeof reportStatus]) }}
                              >
                                {reportStatus[template.type as keyof typeof reportStatus].toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-4">Export Options</h4>
                    <div className="space-y-3">
                      {exportFormats.map((format, index) => (
                        <motion.button
                          key={format.id}
                          className="w-full bg-white/10 rounded-lg p-3 text-left border border-white/20 hover:bg-white/15"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{format.icon}</span>
                            <div>
                              <div className="text-white font-bold text-sm">{format.name}</div>
                              <div className="text-indigo-200 text-xs">{format.description}</div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeReport === 'tax' && (
            <motion.div
              key="tax"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-black/40 backdrop-blur-xl rounded-2xl border border-indigo-400/30 p-6"
            >
              <h3 className="text-white text-xl font-semibold mb-6">Tax Preparation Reports</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-4">Annual Tax Summary</h4>
                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-indigo-300 text-sm">Tax Year</div>
                      <div className="text-white font-bold">2024</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-indigo-300 text-sm">Filing Status</div>
                      <div className="text-white font-bold">Single</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-indigo-300 text-sm">Estimated Refund</div>
                      <div className="text-green-400 font-bold">$2,450</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-4">Document Status</h4>
                  <div className="space-y-2">
                    {['W-2 Forms', '1099 Forms', 'Deduction Receipts', 'Investment Statements'].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                        <span className="text-white">{doc}</span>
                        <span className="text-green-400">✓</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeReport === 'custom' && (
            <motion.div
              key="custom"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-black/40 backdrop-blur-xl rounded-2xl border border-indigo-400/30 p-6"
            >
              <h3 className="text-white text-xl font-semibold mb-6">Custom Report Builder</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h4 className="text-white font-semibold mb-4">Report Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-indigo-200 text-sm">Report Name</label>
                      <input
                        type="text"
                        placeholder="Enter report name..."
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-indigo-200 text-sm">Date Range</label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <input
                          type="date"
                          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                        />
                        <input
                          type="date"
                          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-indigo-200 text-sm">Data Sources</label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {['Bank Accounts', 'Credit Cards', 'Investments', 'Budget Data'].map((source) => (
                          <label key={source} className="flex items-center gap-2 text-white">
                            <input type="checkbox" className="rounded" defaultChecked />
                            <span className="text-sm">{source}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-4">Quick Templates</h4>
                  <div className="space-y-2">
                    {['Monthly Summary', 'Quarterly Review', 'Annual Report', 'Custom Analysis'].map((template, index) => (
                      <motion.button
                        key={index}
                        className="w-full bg-white/10 rounded-lg p-3 text-left border border-white/20 hover:bg-white/15"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-white font-bold text-sm">{template}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
              
              <motion.button
                className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Generate Custom Report
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Report Assistant */}
      <motion.div
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-blue-700 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 4px 20px rgba(79, 70, 229, 0.5)',
            '0 8px 30px rgba(79, 70, 229, 0.7)',
            '0 4px 20px rgba(79, 70, 229, 0.5)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        📊
      </motion.div>
    </div>
  );
};

export default ReportStudioPage;
