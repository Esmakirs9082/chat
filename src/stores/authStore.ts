import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '../types';

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      
      login: (user: User, token: string) => {
        set({
          isAuthenticated: true,
          user,
          token,
        });
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        });
      },
      
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);