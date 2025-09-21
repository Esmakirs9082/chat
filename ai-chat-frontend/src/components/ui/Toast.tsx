import React, { useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'bottom-right' | 'center';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  position?: ToastPosition;
  onDismiss?: (id: string) => void;
}

interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
}

const toastTypeConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-500',
    titleColor: 'text-green-800',
    descColor: 'text-green-600',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-500',
    titleColor: 'text-red-800',
    descColor: 'text-red-600',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-500',
    titleColor: 'text-yellow-800',
    descColor: 'text-yellow-600',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-800',
    descColor: 'text-blue-600',
  },
};

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  description,
  duration = 5000,
  onDismiss,
}) => {
  const config = toastTypeConfig[type];
  const Icon = config.icon;

  // Автоматическое исчезновение через заданное время
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  // Обработка swipe для закрытия
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 100 || info.offset.x < -100) {
      onDismiss(id);
    }
  };

  // Анимации для входа/выхода
  const slideVariants = {
    initial: {
      opacity: 0,
      x: 300,
      scale: 0.9,
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        damping: 25,
        stiffness: 120,
      },
    },
    exit: {
      opacity: 0,
      x: 300,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={slideVariants}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05, rotate: 5 }}
      className={`
        relative max-w-sm w-full rounded-lg border p-4 shadow-lg cursor-pointer
        ${config.bgColor} ${config.borderColor}
        backdrop-blur-sm mb-3
      `}
      onClick={() => onDismiss(id)}
    >
      {/* Progress bar для показа оставшегося времени */}
      {duration > 0 && (
        <motion.div
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}

      <div className="flex items-start">
        {/* Иконка */}
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>

        {/* Контент */}
        <div className="ml-3 flex-1">
          <h4 className={`text-sm font-medium ${config.titleColor}`}>
            {title}
          </h4>
          {description && (
            <p className={`mt-1 text-sm ${config.descColor}`}>{description}</p>
          )}
        </div>

        {/* Кнопка закрытия */}
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(id);
            }}
            className={`
              inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 
              focus:ring-offset-2 transition-colors duration-200
              ${config.iconColor} hover:bg-gray-100 focus:ring-gray-500
            `}
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Hover эффект */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-white opacity-0 pointer-events-none"
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.15 }}
      />
    </motion.div>
  );
};

export default Toast;
