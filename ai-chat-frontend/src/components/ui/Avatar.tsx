import React from 'react';
import clsx from 'clsx';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
};

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string; // инициалы
  size?: AvatarSize;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
  className?: string;
}

const getInitials = (name?: string) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  fallback = '',
  size = 'md',
  showOnlineStatus = false,
  isOnline = false,
  className = '',
}) => {
  return (
    <div className={clsx(
      'relative inline-flex items-center justify-center rounded-full bg-gray-800 dark:bg-gray-700 text-white font-semibold select-none',
      sizeClasses[size],
      className
    )}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={clsx('rounded-full object-cover w-full h-full')}
        />
      ) : (
        <span className="flex items-center justify-center w-full h-full">
          {getInitials(fallback || alt)}
        </span>
      )}
      {showOnlineStatus && (
        <span
          className={clsx(
            'absolute right-0 bottom-0 block h-2.5 w-2.5 rounded-full border-2 border-background',
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          )}
        />
      )}
    </div>
  );
};

export default Avatar;