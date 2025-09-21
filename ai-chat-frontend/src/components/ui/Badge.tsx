import React from 'react';
import clsx from 'clsx';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'premium'
  | 'nsfw';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  leftIcon?: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-400 text-gray-900',
  error: 'bg-red-500 text-white',
  premium: 'bg-gradient-to-r from-primary to-purple-600 text-white',
  nsfw: 'bg-red-600 text-white',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'h-6 px-2 text-xs',
  md: 'h-8 px-3 text-sm',
  lg: 'h-10 px-4 text-base',
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  leftIcon,
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-semibold select-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {leftIcon && <span className="mr-1 flex items-center">{leftIcon}</span>}
      {children}
    </span>
  );
};

export default Badge;
