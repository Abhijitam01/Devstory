import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'subtle';
}

export function GlassCard({ 
  children, 
  className, 
  variant = 'default',
  ...props 
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border transition-all duration-300',
        'backdrop-blur-xl bg-white/80 dark:bg-gray-900/80',
        'border-white/20 dark:border-gray-700/50',
        'shadow-lg shadow-black/5 dark:shadow-black/20',
        'hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30',
        'hover:scale-[1.02] hover:-translate-y-1',
        {
          'bg-white/90 dark:bg-gray-900/90 shadow-2xl': variant === 'elevated',
          'bg-white/60 dark:bg-gray-900/60 shadow-sm': variant === 'subtle',
        },
        className
      )}
      {...props}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
