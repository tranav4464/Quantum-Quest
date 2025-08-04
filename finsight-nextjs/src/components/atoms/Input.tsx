'use client';

import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { InputProps } from '@/types';

const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  placeholder,
  value,
  defaultValue,
  isRequired = false,
  isDisabled = false,
  isInvalid = false,
  errorMessage,
  helperText,
  leftIcon,
  rightIcon,
  onChange,
  onBlur,
  onFocus,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const id = useId();

  const currentValue = value !== undefined ? value : internalValue;
  const hasValue = currentValue && currentValue.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.();
  };

  const containerClasses = cn(
    'relative',
    className
  );

  const inputClasses = cn(
    'input',
    'w-full rounded-xl border bg-white transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-opacity-20',
    {
      // Default state
      'border-gray-200 text-gray-900 placeholder-gray-500': !isInvalid && !isFocused,
      'focus:border-primary-500 focus:ring-primary-500': !isInvalid,
      
      // Invalid state
      'border-danger-500 text-danger-900 focus:border-danger-500 focus:ring-danger-500': isInvalid,
      
      // Disabled state
      'bg-gray-50 text-gray-500 cursor-not-allowed': isDisabled,
      
      // Padding adjustments for icons
      'pl-10': leftIcon,
      'pr-10': rightIcon,
      'px-4 py-3': !leftIcon && !rightIcon,
      'pl-10 pr-4 py-3': leftIcon && !rightIcon,
      'pl-4 pr-10 py-3': !leftIcon && rightIcon,
      'pl-10 pr-10 py-3': leftIcon && rightIcon,
    }
  );

  const labelClasses = cn(
    'absolute left-4 transition-all duration-200 pointer-events-none',
    'text-gray-500',
    {
      // Floating label when focused or has value
      'text-sm -top-2 bg-white px-1 text-primary-600': (isFocused || hasValue) && !isInvalid,
      'text-sm -top-2 bg-white px-1 text-danger-600': (isFocused || hasValue) && isInvalid,
      
      // Default label position
      'text-base top-3': !isFocused && !hasValue,
      
      // Icon adjustments
      'left-10': leftIcon && (!isFocused && !hasValue),
    }
  );

  return (
    <div className={containerClasses}>
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          id={id}
          type={type}
          value={currentValue}
          placeholder={!label ? placeholder : undefined}
          disabled={isDisabled}
          required={isRequired}
          className={inputClasses}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {/* Floating Label */}
        {label && (
          <motion.label
            htmlFor={id}
            className={labelClasses}
            animate={{
              fontSize: isFocused || hasValue ? '0.875rem' : '1rem',
              top: isFocused || hasValue ? '-0.5rem' : '0.75rem',
            }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {label}
            {isRequired && <span className="text-danger-500 ml-1">*</span>}
          </motion.label>
        )}

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Helper Text / Error Message */}
      <AnimatePresence>
        {(errorMessage || helperText) && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'mt-2 text-sm',
              {
                'text-danger-600': isInvalid && errorMessage,
                'text-gray-500': !isInvalid && helperText,
              }
            )}
          >
            {isInvalid && errorMessage ? errorMessage : helperText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;
