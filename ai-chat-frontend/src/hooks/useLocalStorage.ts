import { useState, useEffect, useCallback } from 'react';

// Типы для localStorage событий
type StorageValue<T> = T | null;
type SetStorageValue<T> = (value: T | ((prevValue: T) => T)) => void;
type RemoveStorageValue = () => void;

// Утилитарные функции для работы с localStorage
const isSSR = () => typeof window === 'undefined';

const getStorageValue = <T>(key: string, defaultValue: T): T => {
  if (isSSR()) return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return defaultValue;

    // Пытаемся парсить как JSON, если не получается - возвращаем как строку
    try {
      return JSON.parse(item);
    } catch {
      // Если не JSON, но есть значение - возвращаем как есть (для строк)
      return item as unknown as T;
    }
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const setStorageValue = <T>(key: string, value: T): void => {
  if (isSSR()) return;

  try {
    const serializedValue =
      typeof value === 'string' ? value : JSON.stringify(value);
    window.localStorage.setItem(key, serializedValue);

    // Диспатчим событие для синхронизации между вкладками
    window.dispatchEvent(
      new CustomEvent('localStorage', {
        detail: { key, value },
      })
    );
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
};

const removeStorageValue = (key: string): void => {
  if (isSSR()) return;

  try {
    window.localStorage.removeItem(key);

    // Диспатчим событие для синхронизации между вкладками
    window.dispatchEvent(
      new CustomEvent('localStorage', {
        detail: { key, value: null },
      })
    );
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
  }
};

/**
 * Типизированный localStorage hook с автоматической сериализацией
 * и синхронизацией между вкладками
 */
export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, SetStorageValue<T>, RemoveStorageValue] => {
  // Инициализируем состояние значением из localStorage или дефолтным
  const [value, setValue] = useState<T>(() =>
    getStorageValue(key, defaultValue)
  );

  // Функция для обновления значения
  const setStorageValueWithState = useCallback<SetStorageValue<T>>(
    (newValue) => {
      const valueToStore =
        typeof newValue === 'function'
          ? (newValue as (prevValue: T) => T)(value)
          : newValue;

      setValue(valueToStore);
      setStorageValue(key, valueToStore);
    },
    [key, value]
  );

  // Функция для удаления значения
  const removeStorageValueWithState = useCallback<RemoveStorageValue>(() => {
    setValue(defaultValue);
    removeStorageValue(key);
  }, [key, defaultValue]);

  // Синхронизация между вкладками
  useEffect(() => {
    if (isSSR()) return;

    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; value: any }>;

      if (customEvent.detail?.key === key) {
        const newValue = customEvent.detail.value;
        setValue(newValue !== null ? newValue : defaultValue);
      }
    };

    // Слушаем изменения в других вкладках
    const handleNativeStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        const newValue = e.newValue
          ? typeof defaultValue === 'string'
            ? e.newValue
            : JSON.parse(e.newValue)
          : defaultValue;
        setValue(newValue);
      }
    };

    window.addEventListener('localStorage', handleStorageChange);
    window.addEventListener('storage', handleNativeStorageChange);

    return () => {
      window.removeEventListener('localStorage', handleStorageChange);
      window.removeEventListener('storage', handleNativeStorageChange);
    };
  }, [key, defaultValue]);

  return [value, setStorageValueWithState, removeStorageValueWithState];
};

// Типы для специализированных хуков
export type Theme = 'light' | 'dark' | 'system';

export interface UserPreferences {
  language: string;
  nsfwEnabled: boolean;
  autoSave: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  display: {
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
    showAvatars: boolean;
  };
}

export interface ChatHistoryItem {
  id: string;
  characterId: string;
  characterName: string;
  lastMessage: string;
  timestamp: number;
  messageCount: number;
  tags: string[];
}

// Дефолтные значения
const DEFAULT_USER_PREFERENCES: UserPreferences = {
  language: 'en',
  nsfwEnabled: false,
  autoSave: true,
  notifications: {
    email: true,
    push: true,
    sound: true,
  },
  display: {
    fontSize: 'medium',
    compactMode: false,
    showAvatars: true,
  },
};

const DEFAULT_CHAT_HISTORY: ChatHistoryItem[] = [];

/**
 * Хук для управления темой приложения
 */
export const useTheme = () => {
  const [theme, setTheme, removeTheme] = useLocalStorage<Theme>(
    'app-theme',
    'system'
  );

  // Применение темы к документу
  useEffect(() => {
    if (isSSR()) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Слушаем изменения системной темы
  useEffect(() => {
    if (isSSR() || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(mediaQuery.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, [setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    removeTheme,
    isDark:
      theme === 'dark' ||
      (theme === 'system' &&
        !isSSR() &&
        window.matchMedia('(prefers-color-scheme: dark)').matches),
  };
};

/**
 * Хук для управления историей чатов
 */
export const useChatHistory = () => {
  const [chatHistory, setChatHistory, removeChatHistory] = useLocalStorage<
    ChatHistoryItem[]
  >('chat-history', DEFAULT_CHAT_HISTORY);

  const addChatToHistory = useCallback(
    (chat: Omit<ChatHistoryItem, 'timestamp'>) => {
      setChatHistory((prev) => {
        const existing = prev.find((item) => item.id === chat.id);

        if (existing) {
          // Обновляем существующий чат
          return prev.map((item) =>
            item.id === chat.id ? { ...chat, timestamp: Date.now() } : item
          );
        } else {
          // Добавляем новый чат в начало списка
          return [
            { ...chat, timestamp: Date.now() },
            ...prev.slice(0, 99), // Ограничиваем до 100 чатов
          ];
        }
      });
    },
    [setChatHistory]
  );

  const removeChatFromHistory = useCallback(
    (chatId: string) => {
      setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
    },
    [setChatHistory]
  );

  const clearChatHistory = useCallback(() => {
    setChatHistory([]);
  }, [setChatHistory]);

  const getChatById = useCallback(
    (chatId: string) => {
      return chatHistory.find((chat) => chat.id === chatId);
    },
    [chatHistory]
  );

  const getChatsByCharacter = useCallback(
    (characterId: string) => {
      return chatHistory.filter((chat) => chat.characterId === characterId);
    },
    [chatHistory]
  );

  const getRecentChats = useCallback(
    (limit: number = 10) => {
      return [...chatHistory]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
    },
    [chatHistory]
  );

  return {
    chatHistory,
    addChatToHistory,
    removeChatFromHistory,
    clearChatHistory,
    getChatById,
    getChatsByCharacter,
    getRecentChats,
    removeChatHistory,
  };
};

/**
 * Хук для управления пользовательскими настройками
 */
export const useUserPreferences = () => {
  const [preferences, setPreferences, removePreferences] =
    useLocalStorage<UserPreferences>(
      'user-preferences',
      DEFAULT_USER_PREFERENCES
    );

  const updatePreferences = useCallback(
    (
      updates:
        | Partial<UserPreferences>
        | ((prev: UserPreferences) => UserPreferences)
    ) => {
      if (typeof updates === 'function') {
        setPreferences(updates);
      } else {
        setPreferences((prev) => ({
          ...prev,
          ...updates,
          // Глубокое слияние для вложенных объектов
          notifications: updates.notifications
            ? { ...prev.notifications, ...updates.notifications }
            : prev.notifications,
          display: updates.display
            ? { ...prev.display, ...updates.display }
            : prev.display,
        }));
      }
    },
    [setPreferences]
  );

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_USER_PREFERENCES);
  }, [setPreferences]);

  const updateNotificationSettings = useCallback(
    (notifications: Partial<UserPreferences['notifications']>) => {
      updatePreferences((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          ...notifications,
        },
      }));
    },
    [updatePreferences]
  );

  const updateDisplaySettings = useCallback(
    (display: Partial<UserPreferences['display']>) => {
      updatePreferences((prev) => ({
        ...prev,
        display: {
          ...prev.display,
          ...display,
        },
      }));
    },
    [updatePreferences]
  );

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    updateNotificationSettings,
    updateDisplaySettings,
    removePreferences,
  };
};

// Экспортируем утилитарные функции для использования вне хуков
export const localStorageUtils = {
  getStorageValue,
  setStorageValue,
  removeStorageValue,
  isSSR,
};
