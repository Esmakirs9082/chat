import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { User } from '../types';
import { RegisterForm } from '../types/forms';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  // Computed properties
  isAuthenticated: boolean;
  subscription: any | null;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (form: RegisterForm) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  immer((set, get) => ({
    user: null,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isLoading: false,
    
    // Computed properties
    get isAuthenticated() {
      return !!get().token;
    },
    get subscription() {
      return get().user?.subscription || null;
    },
    get error() {
      return null; // TODO: Добавить обработку ошибок
    },

    login: async (email: string, password: string) => {
      set({ isLoading: true });
      try {
        // TODO: Реальный API вызов
        // const response = await authApi.login({ email, password });
        // set({ user: response.user, token: response.token });
        // localStorage.setItem('token', response.token);
        set({ isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        // TODO: set error state
      }
    },
    register: async (form: RegisterForm) => {
      set({ isLoading: true });
      try {
        // TODO: Реальный API вызов
        // const response = await authApi.register(form);
        // set({ user: response.user, token: response.token });
        // localStorage.setItem('token', response.token);
        set({ isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        // TODO: set error state
      }
    },
    logout: () => {
      set({ user: null, token: null, refreshToken: null });
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    refreshAuth: async () => {
      const refreshToken = get().refreshToken;
      if (!refreshToken) return;
      
      try {
        // TODO: Реальный API вызов
        // const response = await authApi.refresh(refreshToken);
        // set({ token: response.token });
        // localStorage.setItem('token', response.token);
      } catch (error) {
        // Refresh failed, logout user
        get().logout();
      }
    },
    updateUser: (userData: Partial<User>) => {
      set((state) => {
        if (state.user) {
          Object.assign(state.user, userData);
        }
      });
    },
    checkAuth: () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      set({ token, refreshToken });
      
      // TODO: Проверить валидность токена
      // if (token) {
      //   authApi.verifyToken(token).then(user => {
      //     set({ user });
      //   }).catch(() => {
      //     get().logout();
      //   });
      // }
    },
  }))
);