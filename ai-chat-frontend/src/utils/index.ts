// Временная замена clsx и twMerge до установки зависимостей
// import { clsx, type ClassValue } from 'clsx';
// import { twMerge } from 'tailwind-merge';

// Простая утилита для объединения классов
export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

// Дополнительные утилиты производительности будут добавлены по мере необходимости
// export * from './performanceUtils';

// Дополнительные вспомогательные функции
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // Менее минуты назад
  if (diff < 60000) {
    return 'только что';
  }

  // Менее часа назад
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} мин. назад`;
  }

  // Менее дня назад
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} ч. назад`;
  }

  // Менее недели назад
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days} дн. назад`;
  }

  // Более недели - показываем дату
  return date.toLocaleDateString('ru-RU');
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
