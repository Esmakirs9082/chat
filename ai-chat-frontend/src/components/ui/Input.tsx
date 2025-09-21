import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: InputSize;
  showPasswordToggle?: boolean;
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-8 text-sm px-2',
  md: 'h-10 text-base px-3',
  lg: 'h-12 text-lg px-4',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label = '',
      error = '',
      helperText = '',
      leftIcon = null,
      rightIcon = null,
      type = 'text',
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const isPassword = type === 'password';
    const inputType =
      isPassword && (showPassword || props.showPasswordToggle) ? 'text' : type;

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-1 text-sm font-medium text-gray-300 dark:text-gray-200">
            {label}
          </label>
        )}
        <div
          className={clsx(
            'relative flex items-center',
            error ? 'border border-red-500' : 'border border-gray-700',
            'rounded-lg bg-background focus-within:border-primary-dark',
            sizeClasses[size],
            'transition-colors duration-150'
          )}
        >
          {leftIcon && <span className="pl-2 text-gray-400">{leftIcon}</span>}
          <input
            ref={ref}
            type={inputType}
            className={clsx(
              'w-full bg-transparent outline-none text-white placeholder-gray-400',
              leftIcon ? 'pl-2' : '',
              rightIcon || isPassword ? 'pr-10' : '',
              'border-none'
            )}
            {...props}
          />
          {isPassword && props.showPasswordToggle && (
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 text-gray-400 hover:text-primary-dark focus:outline-none"
              onClick={() => setShowPassword((v: boolean) => !v)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
          {!isPassword && rightIcon && (
            <span className="absolute right-2 text-gray-400">{rightIcon}</span>
          )}
        </div>
        {helperText && !error && (
          <div className="mt-1 text-xs text-gray-400">{helperText}</div>
        )}
        {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
