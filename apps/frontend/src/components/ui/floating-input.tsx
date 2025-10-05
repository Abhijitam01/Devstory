import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export function FloatingInput({ 
  label, 
  error, 
  icon,
  className, 
  ...props 
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value && props.value.toString().length > 0;

  return (
    <div className="relative">
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
        
        {/* Input */}
        <input
          className={cn(
            'peer w-full rounded-xl border-2 bg-white/80 dark:bg-gray-900/80 px-4 py-4 text-gray-900 dark:text-gray-100',
            'backdrop-blur-sm transition-all duration-300',
            'placeholder-transparent focus:outline-none',
            'border-gray-200 dark:border-gray-700',
            'focus:border-blue-500 dark:focus:border-blue-400',
            'hover:border-gray-300 dark:hover:border-gray-600',
            {
              'pl-12': icon,
              'border-red-300 dark:border-red-600': error,
              'focus:border-red-500 dark:focus:border-red-400': error,
            },
            className
          )}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        
        {/* Floating Label */}
        <label
          className={cn(
            'absolute left-4 text-gray-500 dark:text-gray-400 transition-all duration-300 pointer-events-none',
            'peer-focus:text-blue-600 dark:peer-focus:text-blue-400',
            {
              'top-4 text-base': !focused && !hasValue,
              'top-2 text-xs font-medium': focused || hasValue,
              'text-red-500 dark:text-red-400': error,
            },
            {
              'left-12': icon,
            }
          )}
        >
          {label}
        </label>
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
