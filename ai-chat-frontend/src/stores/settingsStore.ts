import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

// Интерфейсы для настроек
interface NotificationSettings {
  email: boolean;
  push: boolean;
  marketing: boolean;
}

interface ChatSettings {
  autoReply: boolean;
  typingIndicators: boolean;
  soundEnabled: boolean;
}

interface PrivacySettings {
  profilePublic: boolean;
  charactersPublic: boolean;
}

// Состояние store
interface SettingsState {
  theme: 'dark' | 'light';
  nsfwEnabled: boolean;
  notifications: NotificationSettings;
  chatSettings: ChatSettings;
  privacy: PrivacySettings;
  isLoading: boolean;
  lastSyncedAt?: Date;
}

// Действия store
interface SettingsActions {
  setTheme: (theme: 'dark' | 'light') => void;
  toggleNSFW: () => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  updateChatSettings: (settings: Partial<ChatSettings>) => void;
  updatePrivacy: (settings: Partial<PrivacySettings>) => void;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  resetToDefaults: () => void;
}

// Функция применения темы к DOM
const applyTheme = (theme: 'dark' | 'light') => {
  if (typeof document !== 'undefined') {
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
    document.documentElement.setAttribute('data-theme', theme);
  }
};

// Функция получения системной темы
const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// Настройки по умолчанию
const defaultSettings: Omit<SettingsState, 'isLoading' | 'lastSyncedAt'> = {
  theme: getSystemTheme(),
  nsfwEnabled: false,
  notifications: {
    email: true,
    push: true,
    marketing: false
  },
  chatSettings: {
    autoReply: false,
    typingIndicators: true,
    soundEnabled: true
  },
  privacy: {
    profilePublic: true,
    charactersPublic: true
  }
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    immer((set, get) => ({
      // State
      ...defaultSettings,
      isLoading: false,
      lastSyncedAt: undefined,

      // Actions
      setTheme: (theme: 'dark' | 'light') => {
        set({ theme });
        applyTheme(theme);
        
        // Асинхронно сохраняем на сервер для авторизованных пользователей
        setTimeout(() => {
          get().saveSettings().catch(console.error);
        }, 0);
      },

      toggleNSFW: () => {
        set((state) => {
          state.nsfwEnabled = !state.nsfwEnabled;
        });
        
        // Асинхронно сохраняем на сервер
        setTimeout(() => {
          get().saveSettings().catch(console.error);
        }, 0);
      },

      updateNotifications: (settings: Partial<NotificationSettings>) => {
        set((state) => {
          Object.assign(state.notifications, settings);
        });
        
        // Асинхронно сохраняем на сервер
        setTimeout(() => {
          get().saveSettings().catch(console.error);
        }, 0);
      },

      updateChatSettings: (settings: Partial<ChatSettings>) => {
        set((state) => {
          Object.assign(state.chatSettings, settings);
        });
        
        // Асинхронно сохраняем на сервер
        setTimeout(() => {
          get().saveSettings().catch(console.error);
        }, 0);
      },

      updatePrivacy: (settings: Partial<PrivacySettings>) => {
        set((state) => {
          Object.assign(state.privacy, settings);
        });
        
        // Асинхронно сохраняем на сервер
        setTimeout(() => {
          get().saveSettings().catch(console.error);
        }, 0);
      },

      loadSettings: async () => {
        set({ isLoading: true });
        
        try {
          // TODO: Проверить, авторизован ли пользователь
          // const authStore = useAuthStore.getState();
          // if (!authStore.isAuthenticated) {
          //   set({ isLoading: false });
          //   return;
          // }

          // TODO: Реальный API вызов для загрузки настроек с сервера
          // const serverSettings = await settingsApi.getSettings();
          
          // Мок данные для демонстрации
          // Если есть настройки на сервере, они перезаписывают локальные
          const serverSettings: Partial<SettingsState> = {
            // theme: 'dark' as const,
            // nsfwEnabled: true,
            // notifications: {
            //   email: true,
            //   push: false,
            //   marketing: false
            // },
            // chatSettings: {
            //   autoReply: true,
            //   typingIndicators: true,
            //   soundEnabled: false
            // },
            // privacy: {
            //   profilePublic: false,
            //   charactersPublic: true
            // }
          };

          // Применяем настройки с сервера (если они есть)
          if (Object.keys(serverSettings).length > 0) {
            set((state) => {
              Object.assign(state, serverSettings);
              state.lastSyncedAt = new Date();
            });

            // Применяем тему
            if (serverSettings.theme) {
              applyTheme(serverSettings.theme);
            }
          }

        } catch (error) {
          console.error('Failed to load settings from server:', error);
          // При ошибке продолжаем использовать локальные настройки
        } finally {
          set({ isLoading: false });
        }
      },

      saveSettings: async () => {
        try {
          // TODO: Проверить, авторизован ли пользователь
          // const authStore = useAuthStore.getState();
          // if (!authStore.isAuthenticated) {
          //   return; // Не синхронизируем для неавторизованных пользователей
          // }

          const currentSettings = get();
          
          // TODO: Реальный API вызов для сохранения настроек на сервер
          // await settingsApi.saveSettings({
          //   theme: currentSettings.theme,
          //   nsfwEnabled: currentSettings.nsfwEnabled,
          //   notifications: currentSettings.notifications,
          //   chatSettings: currentSettings.chatSettings,
          //   privacy: currentSettings.privacy
          // });

          set({ lastSyncedAt: new Date() });

        } catch (error) {
          console.error('Failed to save settings to server:', error);
          // При ошибке продолжаем использовать локальные настройки
        }
      },

      resetToDefaults: () => {
        set((state) => {
          Object.assign(state, defaultSettings);
          state.lastSyncedAt = undefined;
        });
        
        // Применяем дефолтную тему
        applyTheme(defaultSettings.theme);
        
        // Асинхронно сохраняем на сервер
        setTimeout(() => {
          get().saveSettings().catch(console.error);
        }, 0);
      },

      // Utility methods (не в основном интерфейсе, но полезные)
      importSettings: (settings: Partial<SettingsState>) => {
        set((state) => {
          Object.assign(state, settings);
          state.lastSyncedAt = new Date();
        });
        
        // Применяем тему если она была импортирована
        if (settings.theme) {
          applyTheme(settings.theme);
        }
        
        // Сохраняем на сервер
        setTimeout(() => {
          get().saveSettings().catch(console.error);
        }, 0);
      },

      exportSettings: () => {
        const state = get();
        return {
          theme: state.theme,
          nsfwEnabled: state.nsfwEnabled,
          notifications: state.notifications,
          chatSettings: state.chatSettings,
          privacy: state.privacy,
          exportedAt: new Date()
        };
      }
    })),
    {
      name: 'settings-store',
      
      // Настройка сериализации - исключаем временные состояния
      partialize: (state) => ({
        theme: state.theme,
        nsfwEnabled: state.nsfwEnabled,
        notifications: state.notifications,
        chatSettings: state.chatSettings,
        privacy: state.privacy,
        lastSyncedAt: state.lastSyncedAt
      })
    }
  )
);

// Инициализация store после создания
setTimeout(() => {
  const settings = useSettingsStore.getState();
  
  // Применяем текущую тему
  applyTheme(settings.theme);
  
  // Загружаем настройки с сервера (если пользователь авторизован)
  settings.loadSettings().catch(console.error);
}, 0);

// Инициализация темы при загрузке модуля
if (typeof window !== 'undefined') {
  // Подписываемся на изменения системной темы
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  mediaQuery.addEventListener('change', (e) => {
    const settings = useSettingsStore.getState();
    
    // Обновляем тему только если она следует системной
    // (можно добавить отдельную настройку "follow system theme")
    if (!localStorage.getItem('settings-store')) {
      const newTheme = e.matches ? 'dark' : 'light';
      settings.setTheme(newTheme);
    }
  });

  // Применяем начальную тему
  const initialState = useSettingsStore.getState();
  applyTheme(initialState.theme);
}

// Хук для удобного использования темы
export const useTheme = () => {
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  return { theme, setTheme };
};

// Хок для NSFW настроек
export const useNSFW = () => {
  const nsfwEnabled = useSettingsStore((state) => state.nsfwEnabled);
  const toggleNSFW = useSettingsStore((state) => state.toggleNSFW);
  return { nsfwEnabled, toggleNSFW };
};