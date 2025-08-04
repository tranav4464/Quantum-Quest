'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NAVIGATION_ITEMS } from '@/constants';

// Icon components (using simple SVGs for now)
const HomeIcon = ({ isActive }: { isActive: boolean }) => (
  <svg className="w-6 h-6" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
  </svg>
);

const TargetIcon = ({ isActive }: { isActive: boolean }) => (
  <svg className="w-6 h-6" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const CPUIcon = ({ isActive }: { isActive: boolean }) => (
  <svg className="w-6 h-6" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const TrendingUpIcon = ({ isActive }: { isActive: boolean }) => (
  <svg className="w-6 h-6" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const BookOpenIcon = ({ isActive }: { isActive: boolean }) => (
  <svg className="w-6 h-6" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const iconMap = {
  home: HomeIcon,
  target: TargetIcon,
  cpu: CPUIcon,
  'trending-up': TrendingUpIcon,
  'book-open': BookOpenIcon,
};

export interface BottomTabNavigationProps {
  className?: string;
  activeTab?: string;
}

const BottomTabNavigation: React.FC<BottomTabNavigationProps> = ({ className, activeTab }) => {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white border-t border-gray-200',
        'safe-area-pb',
        className
      )}
    >
      <div className="flex items-center justify-around px-4 py-2">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = activeTab ? activeTab === item.key : pathname === item.href;
          const IconComponent = iconMap[item.icon as keyof typeof iconMap];
          
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center',
                'min-w-0 flex-1 px-2 py-2',
                'transition-all duration-200 ease-in-out'
              )}
            >
              {/* Tab Item Content */}
              <motion.div
                className="flex flex-col items-center gap-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Icon Container */}
                <div
                  className={cn(
                    'relative flex items-center justify-center',
                    'w-8 h-8 rounded-full transition-all duration-200',
                    {
                      'text-primary-500': isActive,
                      'text-gray-400': !isActive,
                    }
                  )}
                >
                  {IconComponent && <IconComponent isActive={isActive} />}
                  
                  {/* Active Indicator Dot */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-1 w-1 h-1 bg-primary-500 rounded-full"
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'text-xs font-medium transition-colors duration-200',
                    {
                      'text-primary-500': isActive,
                      'text-gray-500': !isActive,
                    }
                  )}
                >
                  {item.label}
                </span>
              </motion.div>

              {/* Background Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeBackground"
                  className="absolute inset-0 bg-primary-50 rounded-xl -z-10"
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomTabNavigation;
