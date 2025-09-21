import React from 'react';
import { cn } from '../../utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'avatar' | 'card' | 'button' | 'custom';
  width?: string | number;
  height?: string | number;
  lines?: number; // Для text варианта - количество строк
  animate?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'custom',
  width,
  height,
  lines = 1,
  animate = true,
  className,
  ...props
}) => {
  // Базовые классы для shimmer анимации
  const baseClasses = cn(
    'bg-gray-200 dark:bg-gray-700',
    animate && 'animate-pulse',
    'relative overflow-hidden',
    // Shimmer эффект
    animate &&
      'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent dark:before:via-gray-500/20',
    className
  );

  // Стили для разных вариантов
  const variantStyles = {
    text: 'h-4 rounded',
    avatar: 'rounded-full aspect-square',
    card: 'rounded-lg',
    button: 'rounded-md h-10',
    custom: 'rounded',
  };

  // Размеры по умолчанию для каждого варианта
  const defaultSizes: Record<string, { width?: string; height?: string }> = {
    text: { width: '100%', height: '1rem' },
    avatar: { width: '2.5rem', height: '2.5rem' },
    card: { width: '100%', height: '12rem' },
    button: { width: '6rem', height: '2.5rem' },
    custom: {},
  };

  // Получаем стили для текущего варианта
  const variantStyle = variantStyles[variant];
  const defaultSize = defaultSizes[variant];

  // Если это text вариант с несколькими строками
  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(baseClasses, variantStyle)}
            style={{
              width:
                index === lines - 1
                  ? '75%'
                  : width || defaultSize.width || '100%', // Последняя строка короче
              height: height || defaultSize.height || '1rem',
            }}
          />
        ))}
      </div>
    );
  }

  // Обычный single skeleton
  return (
    <div
      className={cn(baseClasses, variantStyle)}
      style={{
        width: width || defaultSize.width || 'auto',
        height: height || defaultSize.height || 'auto',
      }}
      {...props}
    />
  );
};

// Готовые композитные компоненты для частых случаев
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 1, className }) => (
  <Skeleton variant="text" lines={lines} className={className} />
);

export const SkeletonAvatar: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ size = 'md', className }) => {
  const sizeMap = {
    sm: '2rem',
    md: '2.5rem',
    lg: '3rem',
    xl: '4rem',
  };

  return (
    <Skeleton
      variant="avatar"
      width={sizeMap[size]}
      height={sizeMap[size]}
      className={className}
    />
  );
};

export const SkeletonCard: React.FC<{
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}> = ({ className, showHeader = true, showFooter = false }) => (
  <div className={cn('space-y-4', className)}>
    <Skeleton variant="card" height="12rem" />
    {showHeader && (
      <div className="space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" lines={2} />
      </div>
    )}
    {showFooter && (
      <div className="flex justify-between items-center">
        <Skeleton variant="button" width="5rem" />
        <Skeleton variant="text" width="4rem" />
      </div>
    )}
  </div>
);

export const SkeletonButton: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className }) => {
  const sizeMap = {
    sm: { width: '4rem', height: '2rem' },
    md: { width: '6rem', height: '2.5rem' },
    lg: { width: '8rem', height: '3rem' },
  };

  const { width, height } = sizeMap[size];

  return (
    <Skeleton
      variant="button"
      width={width}
      height={height}
      className={className}
    />
  );
};

// Skeleton для списков
export const SkeletonList: React.FC<{
  items?: number;
  showAvatar?: boolean;
  className?: string;
}> = ({ items = 3, showAvatar = false, className }) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3">
        {showAvatar && <SkeletonAvatar size="md" />}
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="80%" />
        </div>
      </div>
    ))}
  </div>
);

// Skeleton для форм
export const SkeletonForm: React.FC<{
  fields?: number;
  className?: string;
}> = ({ fields = 3, className }) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="space-y-2">
        <Skeleton variant="text" width="25%" height="1.25rem" />
        <Skeleton variant="button" width="100%" height="2.5rem" />
      </div>
    ))}
    <div className="flex gap-3 pt-4">
      <SkeletonButton size="lg" />
      <SkeletonButton size="md" />
    </div>
  </div>
);

export default Skeleton;
