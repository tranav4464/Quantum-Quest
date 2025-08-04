'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'interactive' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  color?: string;
  description?: string;
  isLoading?: boolean;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className,
  onClick,
}) => {
  const cardClasses = cn(
    'card',
    'rounded-2xl bg-white transition-all duration-200',
    {
      // Variants
      'shadow-soft hover:shadow-medium': variant === 'default',
      'shadow-soft hover:shadow-medium cursor-pointer hover:scale-[1.02] active:scale-[0.98]': variant === 'interactive',
      'border border-gray-200': variant === 'outlined',
      'shadow-medium hover:shadow-strong': variant === 'elevated',
      
      // Padding
      'p-0': padding === 'none',
      'p-4': padding === 'sm',
      'p-6': padding === 'md',
      'p-8': padding === 'lg',
    },
    className
  );

  if (onClick) {
    return (
      <motion.div
        className={cardClasses}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  color,
  description,
  isLoading = false,
  className,
}) => {
  const formatValue = (val: string | number) => {
    if (isLoading) return '---';
    return val;
  };

  const formatChange = (change: number, type: 'increase' | 'decrease' | 'neutral') => {
    const prefix = change > 0 ? '+' : '';
    const changeClass = {
      increase: 'text-green-600',
      decrease: 'text-red-600',
      neutral: 'text-gray-600',
    }[type];

    return (
      <span className={cn('text-sm font-medium', changeClass)}>
        {prefix}{change}%
      </span>
    );
  };

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatValue(value)}
          </p>
          
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {formatChange(change, changeType)}
              {description && (
                <span className="text-xs text-gray-500">{description}</span>
              )}
            </div>
          )}
        </div>

        {icon && (
          <div
            className={cn(
              'flex items-center justify-center w-12 h-12 rounded-xl',
              color ? `bg-opacity-10` : 'bg-gray-100'
            )}
            style={{ backgroundColor: color ? `${color}20` : undefined }}
          >
            <div 
              className="text-xl"
              style={{ color: color || '#6B7280' }}
            >
              {icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;
export { MetricCard };
