'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Input from '@/components/atoms/Input';

// Currency Input Component
export interface CurrencyInputProps {
  value?: number;
  defaultValue?: number;
  currency?: string;
  locale?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  helperText?: string;
  label?: string;
  isRequired?: boolean;
  onChange?: (value: number | undefined) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  className?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  defaultValue,
  currency = 'USD',
  locale = 'en-US',
  placeholder = '0.00',
  isDisabled = false,
  isInvalid = false,
  errorMessage,
  helperText,
  label,
  isRequired = false,
  onChange,
  onBlur,
  onFocus,
  className,
}) => {
  const [internalValue, setInternalValue] = useState<string>(
    value?.toString() || defaultValue?.toString() || ''
  );
  const [isFocused, setIsFocused] = useState(false);

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `$${amount.toFixed(2)}`;
    }
  };

  const formatDisplayValue = (val: string) => {
    if (!val || val === '') return '';
    const numericValue = parseFloat(val.replace(/[^0-9.-]/g, ''));
    if (isNaN(numericValue)) return '';
    return formatCurrency(numericValue);
  };

  const handleChange = (stringValue: string) => {
    // Remove all non-numeric characters except decimal point
    const numericString = stringValue.replace(/[^0-9.-]/g, '');
    const numericValue = parseFloat(numericString);
    
    setInternalValue(numericString);
    
    if (onChange) {
      onChange(isNaN(numericValue) ? undefined : numericValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    // Format the value when losing focus
    if (internalValue) {
      const numericValue = parseFloat(internalValue.replace(/[^0-9.-]/g, ''));
      if (!isNaN(numericValue)) {
        setInternalValue(numericValue.toString());
      }
    }
    
    if (onBlur) onBlur();
  };

  const displayValue = isFocused ? internalValue : formatDisplayValue(internalValue);

  const currencySymbol = (() => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
      }).formatToParts(0).find(part => part.type === 'currency')?.value || '$';
    } catch {
      return '$';
    }
  })();

  return (
    <Input
      type="text"
      value={displayValue}
      placeholder={placeholder}
      label={label}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      helperText={helperText}
      leftIcon={
        <span className="text-gray-500 font-medium">{currencySymbol}</span>
      }
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
    />
  );
};

// Search Input Component
export interface SearchInputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  showClearButton?: boolean;
  onSearch?: (query: string) => void;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  debounceMs?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  defaultValue,
  placeholder = 'Search...',
  isDisabled = false,
  isLoading = false,
  showClearButton = true,
  onSearch,
  onChange,
  onClear,
  onFocus,
  onBlur,
  className,
  debounceMs = 300,
}) => {
  const [internalValue, setInternalValue] = useState(value || defaultValue || '');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const LoadingIcon = () => (
    <motion.svg 
      className="w-5 h-5 text-primary-500" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </motion.svg>
  );

  const ClearIcon = () => (
    <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }

    // Debounced search
    if (onSearch && debounceMs > 0) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        onSearch(newValue);
      }, debounceMs);
    } else if (onSearch) {
      onSearch(newValue);
    }
  };

  const handleClear = () => {
    setInternalValue('');
    if (onChange) onChange('');
    if (onClear) onClear();
    if (onSearch) onSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      e.preventDefault();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      onSearch(internalValue);
    }
  };

  const rightIcon = (
    <div className="flex items-center gap-2">
      {isLoading && <LoadingIcon />}
      {showClearButton && internalValue && !isLoading && (
        <motion.button
          type="button"
          onClick={handleClear}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ClearIcon />
        </motion.button>
      )}
    </div>
  );

  return (
    <Input
      type="text"
      value={internalValue}
      placeholder={placeholder}
      isDisabled={isDisabled}
      leftIcon={<SearchIcon />}
      rightIcon={rightIcon}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      className={className}
    />
  );
};

// Export all input variants
export { default as TextInput } from '@/components/atoms/Input';
