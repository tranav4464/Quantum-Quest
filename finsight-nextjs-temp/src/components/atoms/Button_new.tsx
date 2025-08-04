'use client';

import React, { forwardRef } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MicroInteractions, SpringConfig } from '@/lib/theme/animations';
import { Spacing, BorderRadius } from '@/lib/theme/spacing';

// Button variant types as per Phase 1 specifications
export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger' | 'success' | 'outlined';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDragStart' | 'onDrop'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  hapticFeedback?: boolean;
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
}

// Loading spinner component
const LoadingSpinner: React.FC<{ size: ButtonSize }> = ({ size }) => {
  const spinnerSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
  
  return (
    <motion.div
      className="inline-block"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{ width: spinnerSize, height: spinnerSize }}
    >
      <svg 
        width={spinnerSize} 
        height={spinnerSize} 
        viewBox="0 0 24 24" 
        fill="none"
        className="text-current"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="31.416"
          className="opacity-30"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="15.708"
          className="opacity-100"
        />
      </svg>
    </motion.div>
  );
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  hapticFeedback = true,
  children,
  className,
  onPress,
  onClick,
  ...props
}, ref) => {
  // Combine onClick and onPress handlers
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled || isLoading) return;
    
    // Haptic feedback simulation (would use actual haptic API on mobile)
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10); // Light vibration
    }
    
    onClick?.(e);
    onPress?.();
  };

  // Size configurations - minimum 44px height for accessibility
  const sizeConfig = {
    sm: {
      height: 44, // Minimum touch target
      paddingX: 16,
      paddingY: 8,
      fontSize: 14,
      iconSize: 16,
      gap: 6
    },
    md: {
      height: 48,
      paddingX: 24,
      paddingY: 12,
      fontSize: 16,
      iconSize: 20,
      gap: 8
    },
    lg: {
      height: 56,
      paddingX: 32,
      paddingY: 16,
      fontSize: 18,
      iconSize: 24,
      gap: 10
    }
  };

  const currentSize = sizeConfig[size];

  // Variant styles
  const variantStyles = {
    primary: cn(
      'bg-gradient-to-r from-primary-500 to-secondary-500',
      'text-white font-semibold',
      'border-0',
      'hover:from-primary-600 hover:to-secondary-600',
      'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      'active:from-primary-700 active:to-secondary-700',
      'disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500'
    ),
    
    secondary: cn(
      'bg-gray-100 text-gray-900',
      'border border-gray-200',
      'font-medium',
      'hover:bg-gray-200 hover:border-gray-300',
      'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
      'active:bg-gray-300',
      'disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-100'
    ),
    
    outlined: cn(
      'bg-transparent text-primary-500',
      'border-2 border-primary-500',
      'font-semibold',
      'hover:bg-primary-50 hover:border-primary-600',
      'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      'active:bg-primary-100',
      'disabled:text-gray-400 disabled:border-gray-300'
    ),
    
    text: cn(
      'bg-transparent text-primary-500',
      'border-0',
      'font-semibold',
      'hover:bg-primary-50',
      'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      'active:bg-primary-100',
      'disabled:text-gray-400'
    ),
    
    danger: cn(
      'bg-danger-500 text-white',
      'border-0',
      'font-semibold',
      'hover:bg-danger-600',
      'focus:ring-2 focus:ring-danger-500 focus:ring-offset-2',
      'active:bg-danger-700',
      'disabled:bg-gray-300 disabled:text-gray-500'
    ),
    
    success: cn(
      'bg-success-500 text-white',
      'border-0',
      'font-semibold',
      'hover:bg-success-600',
      'focus:ring-2 focus:ring-success-500 focus:ring-offset-2',
      'active:bg-success-700',
      'disabled:bg-gray-300 disabled:text-gray-500'
    )
  };

  const baseStyles = cn(
    'inline-flex items-center justify-center',
    'relative overflow-hidden',
    'font-medium transition-all duration-200',
    'focus:outline-none',
    'select-none cursor-pointer',
    'disabled:cursor-not-allowed disabled:opacity-50',
    fullWidth && 'w-full'
  );

  return (
    <motion.button
      ref={ref}
      className={cn(
        baseStyles,
        variantStyles[variant],
        className
      )}
      style={{
        height: currentSize.height,
        paddingLeft: currentSize.paddingX,
        paddingRight: currentSize.paddingX,
        paddingTop: currentSize.paddingY,
        paddingBottom: currentSize.paddingY,
        borderRadius: 12,
        fontSize: currentSize.fontSize,
        gap: currentSize.gap
      }}
      disabled={isDisabled || isLoading}
      onClick={handleClick}
      // Spring-based animations as per Phase 1 specs
      whileHover={!isDisabled && !isLoading ? { 
        scale: 1.02,
        transition: { damping: 20, mass: 1, stiffness: 120, velocity: 0, duration: 0.15 }
      } : undefined}
      whileTap={!isDisabled && !isLoading ? { 
        scale: 0.95,
        transition: { damping: 18, mass: 0.8, stiffness: 250, velocity: 0, duration: 0.1 }
      } : undefined}
      initial={{ scale: 1 }}
    >
      {/* Left icon */}
      {leftIcon && !isLoading && (
        <span style={{ width: currentSize.iconSize, height: currentSize.iconSize }}>
          {leftIcon}
        </span>
      )}
      
      {/* Loading spinner */}
      {isLoading && (
        <LoadingSpinner size={size} />
      )}
      
      {/* Button text - hidden when loading */}
      {!isLoading && (
        <span className="relative z-10">
          {children}
        </span>
      )}
      
      {/* Right icon */}
      {rightIcon && !isLoading && (
        <span style={{ width: currentSize.iconSize, height: currentSize.iconSize }}>
          {rightIcon}
        </span>
      )}
      
      {/* Background animation layer for interactive feedback */}
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        initial={false}
        whileHover={!isDisabled && !isLoading ? { opacity: 0.1 } : undefined}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
