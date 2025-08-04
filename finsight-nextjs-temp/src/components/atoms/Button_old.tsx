'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ButtonProps } from '@/types';

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  onClick,
  children,
  className,
  ...props
}) => {
  const baseClasses = cn(
    'btn',
    'inline-flex items-center justify-center gap-2',
    'font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:scale-95',
    {
      // Variants
      'btn-primary bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500': variant === 'primary',
      'btn-secondary bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500': variant === 'secondary',
      'btn-danger bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500': variant === 'danger',
      'bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-300': variant === 'ghost',
      'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300': variant === 'outline',
      
      // Sizes
      'btn-sm px-3 py-2 text-sm rounded-lg': size === 'sm',
      'btn-md px-4 py-2.5 text-base rounded-xl': size === 'md',
      'btn-lg px-6 py-3 text-lg rounded-xl': size === 'lg',
    },
    className
  );

  const handleClick = () => {
    if (!isDisabled && !isLoading && onClick) {
      onClick();
    }
  };

  return (
    <motion.button
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      className={baseClasses}
      disabled={isDisabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
          Loading...
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};

export default Button;
