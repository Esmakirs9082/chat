import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  ReactNode,
} from 'react';
import { ToastData, ToastType, ToastPosition } from '../components/ui/Toast';
import ToastContainer from '../components/ui/ToastContainer';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
  position?: ToastPosition;
}

interface ToastContextValue {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
  // Удобные методы для разных типов
  success: (options: ToastOptions) => string;
  error: (options: ToastOptions) => string;
  warning: (options: ToastOptions) => string;
  info: (options: ToastOptions) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: ReactNode;
  defaultPosition?: ToastPosition;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  defaultPosition = 'top-right',
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Генерация уникального ID для toast
  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Добавление нового toast
  const addToast = useCallback(
    (toastData: Omit<ToastData, 'id'>) => {
      const id = generateId();
      const newToast: ToastData = {
        id,
        position: defaultPosition,
        duration: 5000,
        ...toastData,
      };

      setToasts((prev) => {
        // Ограничиваем количество toast'ов
        const updatedToasts = [newToast, ...prev];
        if (updatedToasts.length > maxToasts) {
          return updatedToasts.slice(0, maxToasts);
        }
        return updatedToasts;
      });

      return id;
    },
    [generateId, defaultPosition, maxToasts]
  );

  // Удаление toast по ID
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Очистка всех toast'ов
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Удобные методы для разных типов toast'ов
  const success = useCallback(
    (options: ToastOptions) => {
      return addToast({ type: 'success', ...options });
    },
    [addToast]
  );

  const error = useCallback(
    (options: ToastOptions) => {
      return addToast({
        type: 'error',
        duration: 7000, // Ошибки показываем дольше
        ...options,
      });
    },
    [addToast]
  );

  const warning = useCallback(
    (options: ToastOptions) => {
      return addToast({
        type: 'warning',
        duration: 6000, // Предупреждения тоже дольше
        ...options,
      });
    },
    [addToast]
  );

  const info = useCallback(
    (options: ToastOptions) => {
      return addToast({ type: 'info', ...options });
    },
    [addToast]
  );

  const contextValue: ToastContextValue = {
    toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Рендерим контейнеры для всех позиций */}
      {(['top-right', 'bottom-right', 'center'] as ToastPosition[]).map(
        (position) => (
          <ToastContainer
            key={position}
            toasts={toasts}
            position={position}
            onDismiss={removeToast}
          />
        )
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
