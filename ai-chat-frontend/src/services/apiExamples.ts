// Примеры использования API клиента

import {
  get,
  post,
  put,
  del,
  upload,
  createCancelToken,
  isCancel,
} from '../services/api';
import { Character } from '../types';
import { Chat, Message } from '../types/chat';
import { User } from '../types';

// === AUTH API ===

export const authAPI = {
  // Логин
  login: (credentials: { email: string; password: string }) =>
    post<{ user: User; token: string; refreshToken: string }>(
      '/auth/login',
      credentials
    ),

  // Регистрация
  register: (userData: { email: string; password: string; name: string }) =>
    post<{ user: User; token: string; refreshToken: string }>(
      '/auth/register',
      userData
    ),

  // Обновление токена
  refreshToken: (refreshToken: string) =>
    post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      refreshToken,
    }),

  // Логаут
  logout: () => post('/auth/logout'),

  // Профиль пользователя
  getProfile: () => get<User>('/auth/profile'),
  updateProfile: (data: Partial<User>) => put<User>('/auth/profile', data),
};

// === CHARACTERS API ===

export const charactersAPI = {
  // Получить список персонажей
  getCharacters: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    nsfw?: boolean;
  }) =>
    get<{ characters: Character[]; total: number; hasMore: boolean }>(
      '/characters',
      { params }
    ),

  // Получить персонажа по ID
  getCharacter: (id: string) => get<Character>(`/characters/${id}`),

  // Создать персонажа
  createCharacter: (data: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) =>
    post<Character>('/characters', data),

  // Обновить персонажа
  updateCharacter: (id: string, data: Partial<Character>) =>
    put<Character>(`/characters/${id}`, data),

  // Удалить персонажа
  deleteCharacter: (id: string) => del(`/characters/${id}`),

  // Загрузить аватар персонажа
  uploadAvatar: (
    characterId: string,
    file: File,
    onProgress?: (progress: number) => void
  ) =>
    upload(`/characters/${characterId}/avatar`, file, (event) => {
      if (onProgress) {
        onProgress(event.percentage);
      }
    }),

  // Добавить в избранное
  toggleFavorite: (id: string) => post(`/characters/${id}/favorite`),

  // Получить избранных персонажей
  getFavorites: () => get<Character[]>('/characters/favorites'),
};

// === CHAT API ===

export const chatAPI = {
  // Получить список чатов
  getChats: () => get<Chat[]>('/chats'),

  // Получить чат по ID
  getChat: (id: string) => get<Chat>(`/chats/${id}`),

  // Создать новый чат
  createChat: (characterId: string) => post<Chat>('/chats', { characterId }),

  // Отправить сообщение
  sendMessage: (chatId: string, content: string) =>
    post<Message>(`/chats/${chatId}/messages`, { content }),

  // Получить сообщения чата
  getMessages: (chatId: string, params?: { before?: string; limit?: number }) =>
    get<{ messages: Message[]; hasMore: boolean }>(
      `/chats/${chatId}/messages`,
      { params }
    ),

  // Удалить чат
  deleteChat: (id: string) => del(`/chats/${id}`),

  // Очистить историю чата
  clearHistory: (id: string) => post(`/chats/${id}/clear`),
};

// === SUBSCRIPTION API ===

export const subscriptionAPI = {
  // Получить текущую подписку
  getCurrentSubscription: () => get('/subscription/current'),

  // Получить доступные планы
  getPlans: () => get('/subscription/plans'),

  // Создать подписку
  subscribe: (planId: string, paymentMethodId: string) =>
    post('/subscription/subscribe', { planId, paymentMethodId }),

  // Отменить подписку
  cancelSubscription: () => post('/subscription/cancel'),

  // Получить историю платежей
  getPaymentHistory: (params?: { page?: number; limit?: number }) =>
    get('/subscription/payments', { params }),

  // Получить статистику использования
  getUsageStats: () => get('/subscription/usage'),
};

// === SETTINGS API ===

export const settingsAPI = {
  // Получить настройки пользователя
  getSettings: () => get('/settings'),

  // Обновить настройки
  updateSettings: (settings: any) => put('/settings', settings),

  // Экспорт настроек
  exportSettings: () => get('/settings/export'),

  // Импорт настроек
  importSettings: (settings: any) => post('/settings/import', settings),
};

// === Пример использования с отменой запросов ===

export class CharacterService {
  private cancelTokenSource = createCancelToken();

  async loadCharacters(filters: any) {
    try {
      // Отменяем предыдущий запрос если он выполняется
      this.cancelTokenSource.cancel('New request initiated');
      this.cancelTokenSource = createCancelToken();

      const response = await charactersAPI.getCharacters({
        ...filters,
        cancelToken: this.cancelTokenSource.token,
      } as any);

      return response;
    } catch (error) {
      if (isCancel(error)) {
        console.log('Request was cancelled');
        return null;
      }
      throw error;
    }
  }

  cancelCurrentRequest() {
    this.cancelTokenSource.cancel('Request cancelled by user');
  }
}

// === Пример использования с прогрессом загрузки ===

export const uploadCharacterAvatar = async (
  characterId: string,
  file: File,
  onProgress: (progress: number) => void
) => {
  try {
    const result = await charactersAPI.uploadAvatar(
      characterId,
      file,
      onProgress
    );
    console.log('Upload completed:', result);
    return result;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

// === Пример batch операций ===

export const batchOperations = {
  // Массовое удаление чатов
  deleteMultipleChats: async (chatIds: string[]) => {
    const deletePromises = chatIds.map((id) => chatAPI.deleteChat(id));
    return Promise.allSettled(deletePromises);
  },

  // Массовое добавление в избранное
  addMultipleToFavorites: async (characterIds: string[]) => {
    const favoritePromises = characterIds.map((id) =>
      charactersAPI.toggleFavorite(id)
    );
    return Promise.allSettled(favoritePromises);
  },
};

export default {
  auth: authAPI,
  characters: charactersAPI,
  chat: chatAPI,
  subscription: subscriptionAPI,
  settings: settingsAPI,
  batch: batchOperations,
};
