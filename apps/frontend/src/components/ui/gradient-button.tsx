import React from 'react';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function GradientButton({ 
  children, 
  className, 
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  ...props 
}: GradientButtonProps) {
  return (
    <button
      className={cn(
        'relative overflow-hidden rounded-xl font-semibold transition-all duration-300',
        'transform hover:scale-105 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        {
          // Primary variant
          'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30': variant === 'primary',
          // Secondary variant
          'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 dark:from-gray-800 dark:to-gray-700 dark:text-gray-100 shadow-md hover:shadow-lg': variant === 'secondary',
          // Ghost variant
          'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800': variant === 'ghost',
        },
        {
          'px-4 py-2 text-sm': size === 'sm',
          'px-6 py-3 text-base': size === 'md',
          'px-8 py-4 text-lg': size === 'lg',
        },
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 opacity-0 transition-opacity duration-300 hover:opacity-100" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        )}
        {children}
      </div>
    </button>
  );
}
