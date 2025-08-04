'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useHapticFeedback } from '@/lib/haptic';
import { useDeviceType, useOrientation } from '@/lib/responsive';
import { cn } from '@/lib/utils';

// Settings interface as per Phase 1 specifications
const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const haptic = useHapticFeedback();
  const deviceType = useDeviceType();
  const orientation = useOrientation();

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        {
          id: 'theme',
          label: 'Theme',
          type: 'select' as const,
          value: theme,
          options: [
            { value: 'system', label: 'System' },
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'high-contrast', label: 'High Contrast' }
          ],
          onChange: (value: string) => {
            setTheme(value as any);
            haptic.selection();
          }
        }
      ]
    },
    {
      title: 'Accessibility',
      items: [
        {
          id: 'haptic',
          label: 'Haptic Feedback',
          type: 'toggle' as const,
          value: haptic.isEnabled(),
          onChange: (enabled: boolean) => {
            haptic.setEnabled(enabled);
            if (enabled) haptic.success();
          }
        },
        {
          id: 'reduce-motion',
          label: 'Reduce Motion',
          type: 'toggle' as const,
          value: false,
          onChange: () => {}
        }
      ]
    },
    {
      title: 'Financial Data',
      items: [
        {
          id: 'currency',
          label: 'Currency',
          type: 'select' as const,
          value: 'USD',
          options: [
            { value: 'USD', label: 'US Dollar ($)' },
            { value: 'EUR', label: 'Euro (€)' },
            { value: 'GBP', label: 'British Pound (£)' },
            { value: 'CAD', label: 'Canadian Dollar (C$)' }
          ],
          onChange: () => haptic.selection()
        },
        {
          id: 'date-format',
          label: 'Date Format',
          type: 'select' as const,
          value: 'MM/DD/YYYY',
          options: [
            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
          ],
          onChange: () => haptic.selection()
        }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          id: 'biometric',
          label: 'Biometric Authentication',
          type: 'toggle' as const,
          value: true,
          onChange: () => haptic.selection()
        },
        {
          id: 'data-sharing',
          label: 'Anonymous Analytics',
          type: 'toggle' as const,
          value: false,
          onChange: () => haptic.selection()
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            Settings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 mt-1"
          >
            Customize your FinSight experience
          </motion.p>
        </div>
      </div>

      {/* Device Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">
            Device: {deviceType} • Orientation: {orientation}
          </span>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="p-4 space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (sectionIndex + 1) }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h2>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {section.items.map((item, itemIndex) => (
                <div key={item.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-base font-medium text-gray-900 dark:text-white">
                        {item.label}
                      </label>
                    </div>

                    <div>
                      {item.type === 'toggle' && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            item.onChange?.(!item.value);
                            haptic.selection();
                          }}
                          className={cn(
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                            item.value ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                          )}
                        >
                          <span
                            className={cn(
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                              item.value ? 'translate-x-5' : 'translate-x-0'
                            )}
                          />
                        </motion.button>
                      )}

                      {item.type === 'select' && (
                        <select
                          value={item.value}
                          onChange={(e) => {
                            item.onChange?.(e.target.value);
                            haptic.selection();
                          }}
                          className="block w-40 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          {item.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              About
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Version</span>
              <span className="text-gray-900 dark:text-white font-medium">1.0.0</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Phase</span>
              <span className="text-gray-900 dark:text-white font-medium">Phase 1: Complete ✓</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Framework</span>
              <span className="text-gray-900 dark:text-white font-medium">Next.js 15.4.5</span>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => haptic.success()}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
              >
                Test Haptic Feedback
              </button>
            </div>
          </div>
        </motion.div>

        {/* Reset Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Reset Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This will reset all settings to their default values
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                haptic.warning();
                // Reset logic would go here
              }}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
            >
              Reset All Settings
            </button>
          </div>
        </motion.div>
      </div>

      {/* Safe area for mobile */}
      <div className="h-20" />
    </div>
  );
};

export default SettingsPage;
