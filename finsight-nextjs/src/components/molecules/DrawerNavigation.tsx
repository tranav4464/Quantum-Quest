'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NAVIGATION_ITEMS } from '@/constants';

// Icon components
const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HelpIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

// Navigation icon mapping (reusing from bottom navigation)
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
  </svg>
);

const TargetIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const CPUIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

// Specialized category icons for drawer sections
const ConstellationIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const LabIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const FireIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14l4-4c0 3.15-.951 5.3-2.121 6.121z" />
  </svg>
);

const DestroyIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const AmplifierIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const TaxIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const BuilderIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

const ControlIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
  </svg>
);

const ReportIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-6 h-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const navigationIconMap = {
  home: HomeIcon,
  target: TargetIcon,
  cpu: CPUIcon,
  'trending-up': TrendingUpIcon,
  'book-open': BookOpenIcon,
};

// Drawer Categories with themed interfaces
const DRAWER_CATEGORIES = [
  {
    title: "Financial Universe",
    items: [
      {
        key: 'goal-universe',
        label: 'Goal Universe',
        icon: ConstellationIcon,
        description: 'Constellation-style goal mapping',
        theme: 'constellation',
        color: '#6366F1'
      },
      {
        key: 'investment-lab',
        label: 'Investment Lab',
        icon: LabIcon,
        description: 'Laboratory-themed interface',
        theme: 'laboratory',
        color: '#8B5CF6'
      },
      {
        key: 'fire-command',
        label: 'FIRE Command',
        icon: FireIcon,
        description: 'Flame-themed progress indicators',
        theme: 'fire',
        color: '#F59E0B'
      }
    ]
  },
  {
    title: "Optimization Tools",
    items: [
      {
        key: 'debt-destroyer',
        label: 'Debt Destroyer',
        icon: DestroyIcon,
        description: 'Game-like debt visualization',
        theme: 'gaming',
        color: '#EF4444'
      },
      {
        key: 'income-amplifier',
        label: 'Income Amplifier',
        icon: AmplifierIcon,
        description: 'Growth-themed opportunities',
        theme: 'growth',
        color: '#10B981'
      },
      {
        key: 'risk-manager',
        label: 'Risk Manager',
        icon: ShieldIcon,
        description: 'Shield protection interface',
        theme: 'protection',
        color: '#0EA5E9'
      }
    ]
  },
  {
    title: "Professional Tools",
    items: [
      {
        key: 'tax-optimizer',
        label: 'Tax Optimizer',
        icon: TaxIcon,
        description: 'Professional document styling',
        theme: 'professional',
        color: '#84CC16'
      },
      {
        key: 'credit-builder',
        label: 'Credit Builder',
        icon: BuilderIcon,
        description: 'Building/construction metaphors',
        theme: 'construction',
        color: '#F97316'
      }
    ]
  },
  {
    title: "System Controls",
    items: [
      {
        key: 'control-center',
        label: 'Control Center',
        icon: ControlIcon,
        description: 'iOS Settings-inspired interface',
        theme: 'system',
        color: '#6B7280'
      },
      {
        key: 'report-studio',
        label: 'Report Studio',
        icon: ReportIcon,
        description: 'Document creation interface',
        theme: 'documents',
        color: '#EC4899'
      }
    ]
  }
];

export interface DrawerNavigationProps {
  className?: string;
  onItemClick?: () => void;
}

export interface DrawerTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

// Hamburger Menu Trigger Component
export const DrawerTrigger: React.FC<DrawerTriggerProps> = ({ 
  isOpen, 
  onToggle, 
  className 
}) => {
  return (
    <motion.button
      onClick={onToggle}
      className={cn(
        'relative flex items-center justify-center',
        'w-10 h-10 rounded-lg',
        'bg-white border border-gray-200',
        'hover:bg-gray-50 active:bg-gray-100',
        'transition-colors duration-200',
        'shadow-sm',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CloseIcon className="text-gray-600" />
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <MenuIcon className="text-gray-600" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Main Drawer Navigation Component
const DrawerNavigation: React.FC<DrawerNavigationProps> = ({ 
  className, 
  onItemClick 
}) => {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40',
        'w-80 bg-white/95 backdrop-blur-xl border-r border-gray-200',
        'shadow-xl',
        'flex flex-col',
        className
      )}
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-100/80">
        <motion.div 
          className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
        >
          <span className="text-white font-bold text-lg">F</span>
        </motion.div>
        <div>
          <h2 className="font-semibold text-gray-900">FinSight</h2>
          <p className="text-sm text-gray-500">Financial Literacy</p>
        </div>
      </div>

      {/* User Profile Section with Financial Health Indicator */}
      <div className="p-6 border-b border-gray-100/80">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="text-gray-600" />
            </div>
            {/* Financial health indicator ring */}
            <svg className="absolute -inset-1 w-14 h-14" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="26"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="26"
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${85 * 1.63} ${163}`}
                strokeDashoffset="40.75"
                initial={{ strokeDasharray: "0 163" }}
                animate={{ strokeDasharray: `${85 * 1.63} 163` }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">John Doe</h3>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-500">Health Score: 85/100</p>
            </div>
          </div>
        </div>
        
        {/* Quick Financial Stats */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl p-3 border border-primary-200/30"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <p className="text-xs text-primary-600 font-medium">Net Worth</p>
            <p className="text-lg font-bold text-primary-700">$45,280</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUpIcon className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600">+12.5%</span>
            </div>
          </motion.div>
          <motion.div 
            className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-3 border border-green-200/30"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <p className="text-xs text-green-600 font-medium">This Month</p>
            <p className="text-lg font-bold text-green-700">+$1,250</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-gray-500">vs $980 last month</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Main Navigation Section */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Main Navigation
          </h4>
          
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = navigationIconMap[item.icon as keyof typeof navigationIconMap];
            
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onItemClick}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-lg',
                  'transition-all duration-200',
                  'group relative overflow-hidden',
                  {
                    'bg-primary-50 text-primary-700 border border-primary-100': isActive,
                    'text-gray-600 hover:bg-gray-50 hover:text-gray-900': !isActive,
                  }
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeDrawerTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r"
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  />
                )}
                
                <div className={cn(
                  'flex items-center justify-center w-6 h-6',
                  {
                    'text-primary-600': isActive,
                    'text-gray-500 group-hover:text-gray-700': !isActive,
                  }
                )}>
                  {IconComponent && <IconComponent />}
                </div>
                
                <span className="font-medium">{item.label}</span>
                
                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.2 }}
                />
              </Link>
            );
          })}
        </div>

        {/* Themed Category Sections */}
        {DRAWER_CATEGORIES.map((category, categoryIndex) => (
          <div key={category.title} className="mb-6">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {category.title}
            </h4>
            
            <div className="space-y-1">
              {category.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === `/${item.key}`;
                
                return (
                  <Link
                    key={item.key}
                    href={`/${item.key}`}
                    onClick={onItemClick}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-lg w-full text-left',
                      'transition-all duration-200 group relative overflow-hidden',
                      'text-gray-600 hover:text-gray-900',
                      {
                        'bg-opacity-10 text-gray-900': isActive
                      }
                    )}
                    style={{
                      '--theme-color': item.color,
                      backgroundColor: isActive ? `${item.color}15` : undefined
                    } as React.CSSProperties}
                  >
                    {/* Active indicator for themed items */}
                    {isActive && (
                      <motion.div
                        layoutId="activeThemedTab"
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                        style={{ backgroundColor: item.color }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      />
                    )}
                    
                    {/* Themed background on hover */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}08, ${item.color}04)`
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    
                    {/* Icon with theme color */}
                    <div 
                      className="flex items-center justify-center w-8 h-8 rounded-lg relative z-10"
                      style={{
                        backgroundColor: isActive ? `${item.color}25` : `${item.color}15`,
                        color: item.color
                      }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 relative z-10">
                      <div className={cn(
                        "font-medium group-hover:text-gray-900",
                        isActive ? "text-gray-900" : "text-gray-900"
                      )}>
                        {item.label}
                      </div>
                      <div className={cn(
                        "text-xs group-hover:text-gray-600",
                        isActive ? "text-gray-600" : "text-gray-500"
                      )}>
                        {item.description}
                      </div>
                    </div>
                    
                    {/* Theme indicator */}
                    <div 
                      className={cn(
                        "w-2 h-2 rounded-full relative z-10",
                        isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                      )}
                      style={{ backgroundColor: item.color }}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Secondary Actions */}
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Account
          </h4>
          
          <div className="space-y-1">
            <Link 
              href="/settings"
              onClick={onItemClick}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 w-full"
            >
              <SettingsIcon className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 w-full">
              <HelpIcon className="w-5 h-5" />
              <span>Help & Support</span>
            </button>
            
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 w-full">
              <LogoutIcon className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          FinSight v1.0.0 • Phase 1
        </p>
      </div>
    </motion.div>
  );
};

// Overlay Component
export const DrawerOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
      onClick={onClose}
    />
  );
};

// Complete Drawer Navigation with Trigger
export const DrawerNavigationContainer: React.FC<{
  triggerClassName?: string;
  drawerClassName?: string;
}> = ({ triggerClassName, drawerClassName }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <DrawerTrigger 
        isOpen={isOpen} 
        onToggle={handleToggle} 
        className={triggerClassName}
      />
      
      <AnimatePresence>
        {isOpen && (
          <>
            <DrawerOverlay onClose={handleClose} />
            <DrawerNavigation 
              className={drawerClassName}
              onItemClick={handleClose}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DrawerNavigation;
