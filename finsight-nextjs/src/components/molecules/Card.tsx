'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated';
  padding?: 'none' | 'small' | 'medium' | 'large';
  clickable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  variant = 'default',
  padding = 'none',
  clickable = false,
  onClick 
}) => {
  const baseClasses = cn(
    'rounded-xl transition-all duration-200',
    {
      // Variants
      'bg-[var(--color-surface-primary)] border border-[var(--color-divider)]': variant === 'default',
      'bg-[var(--color-surface-primary)]/80 backdrop-blur-sm border border-[var(--color-divider)]/50': variant === 'glass',
      'bg-[var(--color-surface-primary)] shadow-lg border border-[var(--color-divider)]': variant === 'elevated',
      
      // Padding
      'p-0': padding === 'none',
      'p-4': padding === 'small',
      'p-6': padding === 'medium',
      'p-8': padding === 'large',
      
      // Clickable
      'cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]': clickable,
    },
    className
  );

  if (clickable) {
    return (
      <motion.div
        className={baseClasses}
        onClick={onClick}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
};

export { Card };
