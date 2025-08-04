'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Debt Destroyer - Game-themed debt elimination interface
const DebtDestroyerPage: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'snowball' | 'avalanche' | 'custom'>('snowball');
  const [debts, setDebts] = useState([
    { id: 1, name: 'Credit Card', balance: 5000, minPayment: 100, rate: 18.5, type: 'credit', color: '#E53E3E' },
    { id: 2, name: 'Student Loan', balance: 25000, minPayment: 250, rate: 6.5, type: 'education', color: '#3182CE' },
    { id: 3, name: 'Car Loan', balance: 15000, minPayment: 300, rate: 4.2, type: 'auto', color: '#38A169' },
    { id: 4, name: 'Personal Loan', balance: 8000, minPayment: 150, rate: 12.0, type: 'personal', color: '#D69E2E' }
  ]);

  const [extraPayment, setExtraPayment] = useState(500);
  const [gameScore, setGameScore] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [powerUps, setPowerUps] = useState({
    doublePayment: false,
    interestFreeze: false,
    bonusAttack: false
  });

  // Calculate debt elimination strategy
  const calculateStrategy = () => {
    let sortedDebts = [...debts];
    
    if (activeMode === 'snowball') {
      sortedDebts.sort((a, b) => a.balance - b.balance);
    } else if (activeMode === 'avalanche') {
      sortedDebts.sort((a, b) => b.rate - a.rate);
    }
    
    let totalPaid = 0;
    let months = 0;
    const paymentSchedule = [];
    
    while (sortedDebts.some(debt => debt.balance > 0) && months < 360) {
      months++;
      let availableExtra = extraPayment;
      
      // Apply minimum payments
      sortedDebts.forEach(debt => {
        if (debt.balance > 0) {
          const minPayment = Math.min(debt.minPayment, debt.balance);
          debt.balance -= minPayment;
          totalPaid += minPayment;
        }
      });
      
      // Apply extra payment to target debt
      const targetDebt = sortedDebts.find(debt => debt.balance > 0);
      if (targetDebt && availableExtra > 0) {
        const extraToApply = Math.min(availableExtra, targetDebt.balance);
        targetDebt.balance -= extraToApply;
        totalPaid += extraToApply;
        
        if (targetDebt.balance === 0) {
          setGameScore(prev => prev + 100);
        }
      }
      
      // Apply interest
      sortedDebts.forEach(debt => {
        if (debt.balance > 0) {
          debt.balance += (debt.balance * debt.rate / 100 / 12);
        }
      });
      
      paymentSchedule.push({
        month: months,
        totalBalance: sortedDebts.reduce((sum, debt) => sum + debt.balance, 0),
        totalPaid
      });
    }
    
    return {
      months,
      totalPaid,
      totalInterest: totalPaid - debts.reduce((sum, debt) => sum + debt.balance, 0),
      paymentSchedule
    };
  };

  const strategy = calculateStrategy();

  const debtTypes = {
    credit: { icon: '💳', name: 'Credit', boss: '👹' },
    education: { icon: '🎓', name: 'Education', boss: '🧙‍♂️' },
    auto: { icon: '🚗', name: 'Auto', boss: '🤖' },
    personal: { icon: '💰', name: 'Personal', boss: '👻' }
  };

  // Game elements
  const attackDebt = (debtId: number) => {
    setDebts(prev => prev.map(debt => 
      debt.id === debtId 
        ? { ...debt, balance: Math.max(0, debt.balance - 100) }
        : debt
    ));
    setGameScore(prev => prev + 10);
  };

  const activatePowerUp = (powerUp: keyof typeof powerUps) => {
    setPowerUps(prev => ({ ...prev, [powerUp]: true }));
    setTimeout(() => {
      setPowerUps(prev => ({ ...prev, [powerUp]: false }));
    }, 10000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-red-900 to-black relative overflow-hidden">
      {/* Game particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
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
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center"
              animate={{
                rotate: [0, 360],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <span className="text-2xl">⚔️</span>
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                Debt Destroyer
              </h1>
              <p className="text-purple-200">Battle your way to financial freedom</p>
            </div>
          </div>
          
          {/* Game Score */}
          <motion.div
            className="bg-black/40 backdrop-blur-xl rounded-lg px-4 py-2 border border-yellow-400/50"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-yellow-400 text-sm">Score</div>
            <div className="text-white text-xl font-bold">{gameScore.toLocaleString()}</div>
          </motion.div>
        </motion.div>

        {/* Strategy Selection */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'snowball', label: 'Snowball Method', icon: '❄️', description: 'Smallest debt first' },
            { key: 'avalanche', label: 'Avalanche Method', icon: '🏔️', description: 'Highest interest first' },
            { key: 'custom', label: 'Custom Battle', icon: '⚡', description: 'Choose your targets' }
          ].map((method) => (
            <motion.button
              key={method.key}
              onClick={() => setActiveMode(method.key as any)}
              className={cn(
                'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
                activeMode === method.key
                  ? 'bg-purple-500/30 text-white border border-purple-400'
                  : 'bg-white/10 text-purple-200 hover:bg-white/15'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{method.icon}</span>
              <div className="text-left">
                <div className="text-sm font-medium">{method.label}</div>
                <div className="text-xs opacity-70">{method.description}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Battle Arena */}
      <div className="relative z-10 px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Debt Monsters */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <span>👾</span>
              Debt Monsters
            </h3>
            
            {debts.map((debt, index) => {
              const debtType = debtTypes[debt.type as keyof typeof debtTypes];
              const healthPercentage = (debt.balance / (debt.balance + 1000)) * 100; // Mock original balance
              
              return (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/40 backdrop-blur-xl rounded-2xl border border-red-400/30 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-16 h-16 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center text-3xl"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {debtType.boss}
                      </motion.div>
                      <div>
                        <h4 className="text-white text-lg font-bold">{debt.name}</h4>
                        <p className="text-red-300">{debtType.name} Monster</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white text-xl font-bold">${debt.balance.toLocaleString()}</div>
                      <div className="text-red-300 text-sm">{debt.rate}% APR</div>
                    </div>
                  </div>
                  
                  {/* Health Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-white mb-1">
                      <span>Monster Health</span>
                      <span>{healthPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <motion.div
                        className="h-3 rounded-full bg-gradient-to-r from-red-500 to-red-700"
                        style={{ width: `${healthPercentage}%` }}
                        animate={{
                          boxShadow: [
                            '0 0 5px #EF4444',
                            '0 0 20px #EF4444',
                            '0 0 5px #EF4444',
                          ],
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </div>
                  </div>
                  
                  {/* Attack Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => attackDebt(debt.id)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>⚔️</span>
                      Attack ($100)
                    </motion.button>
                    
                    <motion.button
                      className="bg-purple-500/30 text-purple-300 font-bold py-2 px-4 rounded-lg border border-purple-400"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>🛡️</span>
                    </motion.button>
                  </div>
                  
                  {/* Damage indicators */}
                  <div className="mt-2 text-sm text-gray-300">
                    <div>Min Payment: ${debt.minPayment}/month</div>
                    <div>Interest Damage: ${(debt.balance * debt.rate / 100 / 12).toFixed(2)}/month</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Battle Stats & Power-ups */}
          <div className="space-y-6">
            
            {/* Battle Stats */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-400/30 p-6">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <span>📊</span>
                Battle Stats
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-purple-200">Strategy:</span>
                  <span className="text-white font-medium capitalize">{activeMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Time to Victory:</span>
                  <span className="text-white font-medium">{Math.ceil(strategy.months / 12)}y {strategy.months % 12}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Total Damage:</span>
                  <span className="text-white font-medium">${strategy.totalPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Interest Penalty:</span>
                  <span className="text-red-300 font-medium">${strategy.totalInterest.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* Extra Payment Weapon */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-yellow-400/30 p-6">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <span>⚔️</span>
                Weapon Power
              </h4>
              
              <div className="mb-4">
                <label className="text-yellow-200 text-sm">Extra Payment Amount</label>
                <input
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(parseInt(e.target.value) || 0)}
                  className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                <motion.div
                  className="h-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"
                  style={{ width: `${Math.min((extraPayment / 1000) * 100, 100)}%` }}
                  animate={{
                    boxShadow: [
                      '0 0 5px #F59E0B',
                      '0 0 20px #F59E0B',
                      '0 0 5px #F59E0B',
                    ],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
              <div className="text-center text-yellow-300 text-sm">
                Weapon Level: {Math.ceil(extraPayment / 100)}
              </div>
            </div>
            
            {/* Power-ups */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-green-400/30 p-6">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <span>⭐</span>
                Power-ups
              </h4>
              
              <div className="space-y-3">
                {[
                  { 
                    key: 'doublePayment', 
                    name: 'Double Damage', 
                    icon: '💥', 
                    description: '2x payment for 10 seconds',
                    cost: 50
                  },
                  { 
                    key: 'interestFreeze', 
                    name: 'Freeze Ray', 
                    icon: '🧊', 
                    description: 'Stop interest for 10 seconds',
                    cost: 30
                  },
                  { 
                    key: 'bonusAttack', 
                    name: 'Critical Strike', 
                    icon: '⚡', 
                    description: 'Instant $500 damage',
                    cost: 75
                  }
                ].map((powerUp) => (
                  <motion.button
                    key={powerUp.key}
                    onClick={() => activatePowerUp(powerUp.key as keyof typeof powerUps)}
                    disabled={powerUps[powerUp.key as keyof typeof powerUps] || gameScore < powerUp.cost}
                    className={cn(
                      'w-full p-3 rounded-lg border text-left transition-all',
                      powerUps[powerUp.key as keyof typeof powerUps]
                        ? 'bg-green-500/20 border-green-400 text-green-300'
                        : gameScore >= powerUp.cost
                        ? 'bg-white/10 border-white/20 text-white hover:bg-white/15'
                        : 'bg-gray-500/10 border-gray-500/20 text-gray-500'
                    )}
                    whileHover={gameScore >= powerUp.cost ? { scale: 1.02 } : {}}
                    whileTap={gameScore >= powerUp.cost ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{powerUp.icon}</span>
                      <span className="font-medium">{powerUp.name}</span>
                      <span className="ml-auto text-yellow-400">{powerUp.cost}⭐</span>
                    </div>
                    <div className="text-xs opacity-70">{powerUp.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Achievements */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-6">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <span>🏆</span>
                Achievements
              </h4>
              
              <div className="space-y-2">
                {[
                  { name: 'First Strike', description: 'Make your first extra payment', icon: '⚔️' },
                  { name: 'Monster Slayer', description: 'Eliminate your first debt', icon: '💀' },
                  { name: 'Speed Demon', description: 'Pay off debt faster than planned', icon: '🏃‍♂️' },
                  { name: 'Boss Killer', description: 'Eliminate highest interest debt', icon: '👑' }
                ].map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: achievements.includes(achievement.name) ? 1 : 0.5 }}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border',
                      achievements.includes(achievement.name)
                        ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                        : 'bg-gray-500/10 border-gray-500/20 text-gray-400'
                    )}
                  >
                    <span className="text-xl">{achievement.icon}</span>
                    <div>
                      <div className="font-medium">{achievement.name}</div>
                      <div className="text-xs opacity-70">{achievement.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Game Assistant */}
      <motion.div
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ⚔️
      </motion.div>
    </div>
  );
};

export default DebtDestroyerPage;
