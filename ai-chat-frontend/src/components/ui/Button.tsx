
import React, { forwardRef } from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md hover:from-primary-dark hover:to-purple-700 focus:ring-2 focus:ring-primary-dark',
  secondary:
    'border border-primary text-primary bg-transparent hover:bg-primary/10 focus:ring-2 focus:ring-primary',
  outline:
    'border border-gray-400 bg-transparent text-gray-200 hover:bg-gray-800 focus:ring-2 focus:ring-primary',
  ghost:
    'bg-transparent text-primary hover:bg-primary/5 focus:ring-2 focus:ring-primary',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4',
  lg: 'h-12 px-6 text-lg',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      onClick,
      type = 'button',
      className,
      disabled,
      loading,
      variant = 'primary',
      size = 'md',
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={clsx(
          'relative font-semibold rounded-lg transition-all duration-150 outline-none focus:outline-none dark',
          variantClasses[variant],
          sizeClasses[size],
          {
            'opacity-50 cursor-not-allowed': disabled || loading,
          },
          className
        )}
        {...rest}
      >
        {loading && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </span>
        )}
        <span className={clsx({ 'ml-5': loading })}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
