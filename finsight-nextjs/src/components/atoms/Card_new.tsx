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
  ...props
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
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses} {...props}>
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
  const formatChange = (change: number) => {
    const prefix = change > 0 ? '+' : '';
    return `${prefix}${change.toFixed(1)}%`;
  };

  const getChangeColor = (type: MetricCardProps['changeType']) => {
    switch (type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card variant="default" className={className}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          
          <div className="flex items-baseline gap-2 mb-2">
            <h3 className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
            
            {change !== undefined && (
              <span className={cn('text-sm font-medium', getChangeColor(changeType))}>
                {formatChange(change)}
              </span>
            )}
          </div>
          
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
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
