import React from 'react';
import { cn } from '../../utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'warning'
    | 'white'
    | 'gray';
  text?: string;
  className?: string;
  textClassName?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  className,
  textClassName,
}) => {
  // Размеры спиннера
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  // Цвета спиннера
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    white: 'text-white',
    gray: 'text-gray-400',
  };

  // Размеры текста в соответствии с размером спиннера
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const spinnerElement = (
    <svg
      className={cn(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (text) {
    return (
      <div className="flex items-center gap-3">
        {spinnerElement}
        <span
          className={cn(
            textSizeClasses[size],
            colorClasses[color],
            'font-medium animate-pulse',
            textClassName
          )}
        >
          {text}
        </span>
      </div>
    );
  }

  return spinnerElement;
};

// Готовые варианты спиннеров для частых случаев
export const LoadingSpinnerSmall: React.FC<{
  color?: LoadingSpinnerProps['color'];
  className?: string;
}> = ({ color = 'primary', className }) => (
  <LoadingSpinner size="sm" color={color} className={className} />
);

export const LoadingSpinnerMedium: React.FC<{
  color?: LoadingSpinnerProps['color'];
  text?: string;
  className?: string;
}> = ({ color = 'primary', text, className }) => (
  <LoadingSpinner size="md" color={color} text={text} className={className} />
);

export const LoadingSpinnerLarge: React.FC<{
  color?: LoadingSpinnerProps['color'];
  text?: string;
  className?: string;
}> = ({ color = 'primary', text, className }) => (
  <LoadingSpinner size="lg" color={color} text={text} className={className} />
);

// Центрированный спиннер для страниц
export const LoadingSpinnerPage: React.FC<{
  size?: LoadingSpinnerProps['size'];
  color?: LoadingSpinnerProps['color'];
  text?: string;
  className?: string;
}> = ({ size = 'lg', color = 'primary', text = 'Loading...', className }) => (
  <div
    className={cn('flex items-center justify-center min-h-[200px]', className)}
  >
    <LoadingSpinner size={size} color={color} text={text} />
  </div>
);

// Overlay спиннер для модалей
export const LoadingSpinnerOverlay: React.FC<{
  size?: LoadingSpinnerProps['size'];
  text?: string;
  className?: string;
}> = ({ size = 'lg', text = 'Loading...', className }) => (
  <div
    className={cn(
      'fixed inset-0 bg-black/20 backdrop-blur-sm z-50',
      'flex items-center justify-center',
      className
    )}
  >
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
      <LoadingSpinner size={size} color="primary" text={text} />
    </div>
  </div>
);

// Inline спиннер для кнопок
export const LoadingSpinnerButton: React.FC<{
  text?: string;
  className?: string;
}> = ({ text, className }) => (
  <LoadingSpinner size="sm" color="white" text={text} className={className} />
);

// Спиннер для карточек
export const LoadingSpinnerCard: React.FC<{
  text?: string;
  className?: string;
}> = ({ text = 'Loading...', className }) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center p-8 space-y-4',
      className
    )}
  >
    <LoadingSpinner size="lg" color="primary" />
    <p className="text-gray-500 dark:text-gray-400 text-sm">{text}</p>
  </div>
);

// Dots спиннер (альтернативный стиль)
export const LoadingDots: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  color?: LoadingSpinnerProps['color'];
  className?: string;
}> = ({ size = 'md', color = 'primary', className }) => {
  const dotSizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  };

  return (
    <div className={cn('flex', gapClasses[size], className)}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            'rounded-full animate-bounce',
            dotSizeClasses[size],
            colorClasses[color].replace('text-', 'bg-')
          )}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
};

// Pulse спиннер (альтернативный стиль)
export const LoadingPulse: React.FC<{
  size?: LoadingSpinnerProps['size'];
  color?: LoadingSpinnerProps['color'];
  className?: string;
}> = ({ size = 'md', color = 'primary', className }) => {
  const pulseSize = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'rounded-full animate-ping absolute',
          pulseSize[size],
          colorClasses[color].replace('text-', 'bg-'),
          'opacity-20'
        )}
      />
      <div
        className={cn(
          'rounded-full animate-pulse',
          pulseSize[size],
          colorClasses[color].replace('text-', 'bg-'),
          'opacity-40'
        )}
      />
    </div>
  );
};

// Экспорт цветовых классов для использования в других компонентах
export const colorClasses = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  white: 'text-white',
  gray: 'text-gray-400',
};

export default LoadingSpinner;
