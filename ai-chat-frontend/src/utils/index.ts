import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Утилиты
export const formatDate = (date: Date | string): string => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffMs = now.getTime() - messageDate.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Менее минуты
  if (diffMins < 1) {
    return 'Только что';
  }
  
  // Менее часа
  if (diffMins < 60) {
    return `${diffMins} мин назад`;
  }
  
  // Менее суток
  if (diffHours < 24) {
    return `${diffHours} ч назад`;
  }
  
  // Менее недели
  if (diffDays < 7) {
    return `${diffDays} дн назад`;
  }
  
  // Более недели - показываем дату
  return messageDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

/**
 * Форматирует время для отображения
 */
export const formatTime = (date: Date | string): string => {
  const messageDate = new Date(date);
  return messageDate.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Дебаунс функции
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

// Utility для объединения классов Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}