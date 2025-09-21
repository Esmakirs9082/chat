import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast, { ToastData, ToastPosition } from './Toast';

interface ToastContainerProps {
  toasts: ToastData[];
  position: ToastPosition;
  onDismiss: (id: string) => void;
}

const positionClasses: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4 items-end',
  'bottom-right': 'bottom-4 right-4 items-end',
  center:
    'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center',
};

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position,
  onDismiss,
}) => {
  // Фильтруем toast'ы по позиции (если position не указана в toast, используем глобальную)
  const positionToasts = toasts.filter(
    (toast) => (toast.position || position) === position
  );

  if (positionToasts.length === 0) {
    return null;
  }

  return (
    <div
      className={`
        fixed z-50 flex flex-col max-w-sm w-full pointer-events-none
        ${positionClasses[position]}
      `}
      style={{ maxHeight: '80vh', overflowY: 'auto' }}
    >
      <AnimatePresence mode="popLayout">
        {positionToasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
