import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserPreferences } from '../types';

interface PreferencesStore {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  toggleDarkMode: () => void;
  toggleNSFW: () => void;
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set, get) => ({
      preferences: {
        darkMode: false,
        nsfwEnabled: false,
        language: 'en',
        notifications: true,
      },
      
      updatePreferences: (updates: Partial<UserPreferences>) => {
        set({
          preferences: { ...get().preferences, ...updates },
        });
      },
      
      toggleDarkMode: () => {
        const current = get().preferences.darkMode;
        set({
          preferences: { ...get().preferences, darkMode: !current },
        });
        
        // Update document class
        if (!current) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      toggleNSFW: () => {
        const current = get().preferences.nsfwEnabled;
        set({
          preferences: { ...get().preferences, nsfwEnabled: !current },
        });
      },
    }),
    {
      name: 'preferences-storage',
    }
  )
);