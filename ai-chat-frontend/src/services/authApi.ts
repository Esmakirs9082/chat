import { api } from './api';
import { User, AuthTokens, LoginCredentials, RegisterData, ApiResponse } from '../types';

// Интерфейсы для API ответов
interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  password: string;
}

// API методы для авторизации
export const authApi = {
  // Вход в систему
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    return api.post<LoginResponse>('/auth/login', credentials);
  },

  // Регистрация
  register: async (data: RegisterData): Promise<ApiResponse<RegisterResponse>> => {
    return api.post<RegisterResponse>('/auth/register', data);
  },

  // Выход из системы
  logout: async (): Promise<ApiResponse<void>> => {
    return api.post<void>('/auth/logout');
  },

  // Обновление токена доступа
  refreshToken: async (refreshToken: string): Promise<ApiResponse<RefreshTokenResponse>> => {
    return api.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });
  },

  // Восстановление пароля - отправка email
  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    return api.post<{ message: string }>('/auth/forgot-password', { email });
  },

  // Сброс пароля по токену
  resetPassword: async (token: string, password: string): Promise<ApiResponse<{ message: string }>> => {
    return api.post<{ message: string }>('/auth/reset-password', { token, password });
  },

  // Получение информации о текущем пользователе
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return api.get<User>('/auth/me');
  },

  // Обновление профиля пользователя
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    return api.patch<User>('/auth/profile', data);
  },

  // Изменение пароля
  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> => {
    return api.post<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  // Верификация email
  verifyEmail: async (token: string): Promise<ApiResponse<{ message: string }>> => {
    return api.post<{ message: string }>('/auth/verify-email', { token });
  },

  // Повторная отправка письма верификации
  resendVerificationEmail: async (): Promise<ApiResponse<{ message: string }>> => {
    return api.post<{ message: string }>('/auth/resend-verification');
  },

  // Проверка доступности username
  checkUsernameAvailability: async (username: string): Promise<ApiResponse<{ available: boolean }>> => {
    return api.get<{ available: boolean }>(`/auth/check-username/${username}`);
  },

  // Проверка доступности email
  checkEmailAvailability: async (email: string): Promise<ApiResponse<{ available: boolean }>> => {
    return api.get<{ available: boolean }>(`/auth/check-email/${email}`);
  },
};

export default authApi;