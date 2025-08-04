'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { QUICK_ACTIONS } from '@/constants';

export interface QuickActionTileProps {
  id: string;
  title: string;
  icon: string;
  color: string;
  bgColor: string;
  description?: string;
  onClick?: (id: string) => void;
  isDisabled?: boolean;
  className?: string;
}

export interface QuickActionsGridProps {
  actions?: Array<Omit<QuickActionTileProps, 'onClick'>>;
  onActionClick?: (actionId: string) => void;
  columns?: 2 | 3 | 4;
  className?: string;
}

const QuickActionTile: React.FC<QuickActionTileProps> = ({
  id,
  title,
  icon,
  color,
  bgColor,
  description,
  onClick,
  isDisabled = false,
  className,
}) => {
  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick(id);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: isDisabled ? 1 : 1.05 }}
      whileTap={{ scale: isDisabled ? 1 : 0.95 }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-4',
        'cursor-pointer transition-all duration-200',
        'hover:shadow-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        {
          'opacity-50 cursor-not-allowed': isDisabled,
        },
        className
      )}
      style={{ backgroundColor: bgColor }}
      onClick={handleClick}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
        <div 
          className="w-full h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ 
              backgroundColor: color + '20',
              color: color 
            }}
          >
            {icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-headline font-semibold text-gray-900 mb-1">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-footnote text-gray-600 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Hover Overlay */}
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        whileHover={{ opacity: isDisabled ? 0 : 0.1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};

const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  actions = QUICK_ACTIONS,
  onActionClick,
  columns = 2,
  className,
}) => {
  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-title-2 font-bold text-gray-900">
          Quick Actions
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm font-medium text-primary-500 hover:text-primary-600"
        >
          See All
        </motion.button>
      </div>

      {/* Actions Grid */}
      <motion.div
        className={cn(
          'grid gap-4',
          gridClasses[columns]
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6,
          staggerChildren: 0.1,
          delayChildren: 0.2 
        }}
      >
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4,
              delay: index * 0.1 
            }}
          >
            <QuickActionTile
              {...action}
              onClick={onActionClick}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default QuickActionTile;
export { QuickActionsGrid };
