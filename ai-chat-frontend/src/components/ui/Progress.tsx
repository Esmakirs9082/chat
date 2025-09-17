import React from 'react';
import { cn } from '../../utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
  showValue?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className,
  indicatorClassName,
  showValue = false
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("relative", className)}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn(
            "h-2 rounded-full transition-all duration-300 ease-in-out",
            indicatorClassName || "bg-blue-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span className="absolute right-0 top-0 -mt-6 text-xs text-gray-500">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

export default Progress;