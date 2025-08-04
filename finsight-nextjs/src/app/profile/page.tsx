'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import BottomTabNavigation from '@/components/molecules/BottomTabNavigation';

interface ProfileSetting {
  id: string;
  title: string;
  description?: string;
  icon: string;
  type: 'navigation' | 'toggle' | 'info';
  value?: boolean;
  action?: () => void;
}

const profileSettings: ProfileSetting[] = [
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Manage your notification preferences',
    icon: '🔔',
    type: 'navigation'
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    description: 'Manage your account security',
    icon: '🔒',
    type: 'navigation'
  },
  {
    id: 'accounts',
    title: 'Connected Accounts',
    description: 'Manage linked bank accounts',
    icon: '🏦',
    type: 'navigation'
  },
  {
    id: 'export',
    title: 'Export Data',
    description: 'Download your financial data',
    icon: '📊',
    type: 'navigation'
  },
  {
    id: 'help',
    title: 'Help & Support',
    description: 'Get help and contact support',
    icon: '❓',
    type: 'navigation'
  },
  {
    id: 'about',
    title: 'About FinSight',
    description: 'Version 1.0.0',
    icon: 'ℹ️',
    type: 'info'
  }
];

const achievementData = [
  {
    id: '1',
    title: 'First Budget Created',
    description: 'Created your first budget category',
    icon: '🎯',
    date: '2 weeks ago',
    unlocked: true
  },
  {
    id: '2',
    title: 'Savings Milestone',
    description: 'Reached $1,000 in savings',
    icon: '💰',
    date: '1 week ago',
    unlocked: true
  },
  {
    id: '3',
    title: 'Budget Master',
    description: 'Stayed under budget for 3 months',
    icon: '👑',
    date: 'Coming soon...',
    unlocked: false
  },
  {
    id: '4',
    title: 'Goal Achiever',
    description: 'Completed your first financial goal',
    icon: '🏆',
    date: 'Coming soon...',
    unlocked: false
  }
];

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [biometrics, setBiometrics] = useState(true);

  const userStats = {
    joinDate: 'January 2025',
    totalTransactions: 142,
    goalsCompleted: 2,
    budgetsCreated: 5
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
        <div className="max-w-md mx-auto px-6 py-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar
              src=""
              name="Sarah Johnson"
              size="xl"
              className="mx-auto mb-4"
            />
            <h1 className="text-title-1 font-bold mb-1">Sarah Johnson</h1>
            <p className="text-callout opacity-90">sarah.johnson@email.com</p>
            <p className="text-footnote opacity-75 mt-1">Member since {userStats.joinDate}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-title-3 font-bold text-gray-900">{userStats.totalTransactions}</p>
            <p className="text-footnote text-gray-600">Transactions</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">🎯</div>
            <p className="text-title-3 font-bold text-gray-900">{userStats.goalsCompleted}</p>
            <p className="text-footnote text-gray-600">Goals Completed</p>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-title-3 text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="h-16 flex-col gap-2">
              <span className="text-xl">💳</span>
              <span className="text-footnote">Add Account</span>
            </Button>
            <Button variant="secondary" className="h-16 flex-col gap-2">
              <span className="text-xl">📝</span>
              <span className="text-footnote">Edit Profile</span>
            </Button>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h2 className="text-title-3 text-gray-900 mb-4">Achievements</h2>
          <div className="grid grid-cols-2 gap-3">
            {achievementData.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`p-4 text-center ${!achievement.unlocked ? 'opacity-50' : ''}`}>
                  <div className="text-2xl mb-2">{achievement.icon}</div>
                  <h3 className="text-subhead font-semibold text-gray-900 mb-1">
                    {achievement.title}
                  </h3>
                  <p className="text-caption-1 text-gray-600 mb-2">
                    {achievement.description}
                  </p>
                  <p className="text-caption-2 text-gray-500">{achievement.date}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h2 className="text-title-3 text-gray-900 mb-4">Settings</h2>
          <div className="space-y-3">
            {/* Toggle Settings */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xl">🌙</div>
                  <div>
                    <h3 className="text-headline text-gray-900">Dark Mode</h3>
                    <p className="text-footnote text-gray-600">Switch to dark theme</p>
                  </div>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xl">👆</div>
                  <div>
                    <h3 className="text-headline text-gray-900">Biometric Login</h3>
                    <p className="text-footnote text-gray-600">Use fingerprint or Face ID</p>
                  </div>
                </div>
                <button
                  onClick={() => setBiometrics(!biometrics)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    biometrics ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      biometrics ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </Card>

            {/* Navigation Settings */}
            {profileSettings.map((setting, index) => (
              <motion.div
                key={setting.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card variant="interactive" className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{setting.icon}</div>
                      <div>
                        <h3 className="text-headline text-gray-900">{setting.title}</h3>
                        {setting.description && (
                          <p className="text-footnote text-gray-600">{setting.description}</p>
                        )}
                      </div>
                    </div>
                    {setting.type === 'navigation' && (
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Button variant="danger" className="w-full">
            Sign Out
          </Button>
        </motion.div>
      </div>

      <BottomTabNavigation activeTab="profile" />
    </div>
  );
}
