import { get, post, put, del, patch, upload, createCancelToken } from './api';
import { Character, CharacterCreateForm } from '../types';
import { PaginatedResponse } from '../types';

// Типы для фильтров и параметров поиска
interface CharacterFilters {
  category?: string;
  tags?: string[];
  nsfw?: boolean;
  gender?: 'male' | 'female' | 'other';
  ageRange?: 'young' | 'adult' | 'mature';
  personality?: string[];
  creator?: string;
  isPublic?: boolean;
}

interface CharacterSearchParams {
  query: string;
  filters?: CharacterFilters;
  sortBy?: 'relevance' | 'popularity' | 'newest' | 'rating';
  page?: number;
  limit?: number;
}

interface CharacterStats {
  messageCount: number;
  favoriteCount: number;
  rating: number;
  totalRatings: number;
  chatCount: number;
  createdAt: string;
  lastActiveAt?: string;
}

interface CharacterReport {
  characterId: string;
  reason: 'inappropriate_content' | 'copyright_violation' | 'spam' | 'other';
  description?: string;
}

// === CHARACTER CRUD ===

/**
 * Получить список персонажей с фильтрами и пагинацией
 */
export const getCharacters = async (
  filters?: CharacterFilters,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Character>> => {
  const params = {
    page,
    limit,
    ...filters,
  };

  // Преобразуем массивы в строки для URL параметров
  if (params.tags) {
    (params as any).tags = Array.isArray(params.tags)
      ? params.tags.join(',')
      : params.tags;
  }
  if (params.personality) {
    (params as any).personality = Array.isArray(params.personality)
      ? params.personality.join(',')
      : params.personality;
  }

  return await get<PaginatedResponse<Character>>('/characters', { params });
};

/**
 * Получить конкретного персонажа по ID
 */
export const getCharacter = async (characterId: string): Promise<Character> => {
  return await get<Character>(`/characters/${characterId}`);
};

/**
 * Создать нового персонажа
 */
export const createCharacter = async (
  characterData: CharacterCreateForm
): Promise<Character> => {
  return await post<Character>('/characters', characterData);
};

/**
 * Обновить данные персонажа
 */
export const updateCharacter = async (
  characterId: string,
  updates: Partial<Character>
): Promise<Character> => {
  return await patch<Character>(`/characters/${characterId}`, updates);
};

/**
 * Удалить персонажа
 */
export const deleteCharacter = async (characterId: string): Promise<void> => {
  await del(`/characters/${characterId}`);
};

// === CHARACTER INTERACTION ===

/**
 * Добавить/убрать персонажа из избранного
 */
export const toggleFavorite = async (characterId: string): Promise<void> => {
  await post(`/characters/${characterId}/favorite`);
};

/**
 * Получить список избранных персонажей
 */
export const getFavorites = async (): Promise<Character[]> => {
  const response = await get<{ characters: Character[] }>(
    '/characters/favorites'
  );
  return response.characters;
};

/**
 * Оценить персонажа (1-5 звезд)
 */
export const rateCharacter = async (
  characterId: string,
  rating: number
): Promise<void> => {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  await post(`/characters/${characterId}/rate`, { rating });
};

/**
 * Пожаловаться на персонажа
 */
export const reportCharacter = async (
  characterId: string,
  reason: CharacterReport['reason'],
  description?: string
): Promise<void> => {
  const reportData: CharacterReport = {
    characterId,
    reason,
    description,
  };
  await post(`/characters/${characterId}/report`, reportData);
};

/**
 * Получить отзывы о персонаже
 */
export const getCharacterReviews = async (
  characterId: string,
  page: number = 1,
  limit: number = 10
): Promise<
  PaginatedResponse<{
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment?: string;
    createdAt: string;
  }>
> => {
  const params = { page, limit };
  return await get<PaginatedResponse<any>>(
    `/characters/${characterId}/reviews`,
    { params }
  );
};

// === CHARACTER ASSETS ===

/**
 * Загрузить аватар для персонажа
 */
export const uploadCharacterAvatar = async (
  characterId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ avatarUrl: string }> => {
  return await upload(
    `/characters/${characterId}/avatar`,
    file,
    onProgress ? (event) => onProgress(event.percentage) : undefined
  );
};

/**
 * Загрузить дополнительные изображения для персонажа
 */
export const uploadCharacterImages = async (
  characterId: string,
  files: File[],
  onProgress?: (progress: number) => void
): Promise<{ imageUrls: string[] }> => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`images[${index}]`, file);
  });

  return await upload(
    `/characters/${characterId}/images`,
    formData as any,
    onProgress ? (event) => onProgress(event.percentage) : undefined
  );
};

/**
 * Получить статистику персонажа
 */
export const getCharacterStats = async (
  characterId: string
): Promise<CharacterStats> => {
  return await get<CharacterStats>(`/characters/${characterId}/stats`);
};

/**
 * Удалить аватар персонажа
 */
export const deleteCharacterAvatar = async (
  characterId: string
): Promise<void> => {
  await del(`/characters/${characterId}/avatar`);
};

/**
 * Удалить изображение персонажа
 */
export const deleteCharacterImage = async (
  characterId: string,
  imageId: string
): Promise<void> => {
  await del(`/characters/${characterId}/images/${imageId}`);
};

// === SEARCH AND DISCOVERY ===

/**
 * Поиск персонажей по запросу с фильтрами
 */
export const searchCharacters = async (
  query: string,
  filters?: CharacterFilters,
  sortBy: 'relevance' | 'popularity' | 'newest' | 'rating' = 'relevance',
  page: number = 1,
  limit: number = 20
): Promise<Character[]> => {
  const params = {
    q: query,
    sortBy,
    page,
    limit,
    ...filters,
  };

  // Преобразуем массивы в строки для URL параметров
  if (params.tags) {
    (params as any).tags = Array.isArray(params.tags)
      ? params.tags.join(',')
      : params.tags;
  }
  if (params.personality) {
    (params as any).personality = Array.isArray(params.personality)
      ? params.personality.join(',')
      : params.personality;
  }

  const response = await get<{ characters: Character[] }>(
    '/characters/search',
    { params }
  );
  return response.characters;
};

/**
 * Получить рекомендуемых персонажей
 */
export const getFeaturedCharacters = async (
  limit: number = 10,
  category?: string
): Promise<Character[]> => {
  const params = { limit, category };
  const response = await get<{ characters: Character[] }>(
    '/characters/featured',
    { params }
  );
  return response.characters;
};

/**
 * Получить популярных персонажей (тренды)
 */
export const getTrendingCharacters = async (
  timeframe: 'day' | 'week' | 'month' = 'week',
  limit: number = 10
): Promise<Character[]> => {
  const params = { timeframe, limit };
  const response = await get<{ characters: Character[] }>(
    '/characters/trending',
    { params }
  );
  return response.characters;
};

/**
 * Получить похожих персонажей
 */
export const getSimilarCharacters = async (
  characterId: string,
  limit: number = 5
): Promise<Character[]> => {
  const params = { limit };
  const response = await get<{ characters: Character[] }>(
    `/characters/${characterId}/similar`,
    { params }
  );
  return response.characters;
};

/**
 * Получить персонажей по категории
 */
export const getCharactersByCategory = async (
  category: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Character>> => {
  const params = { page, limit };
  return await get<PaginatedResponse<Character>>(
    `/characters/category/${category}`,
    { params }
  );
};

/**
 * Получить персонажей от конкретного создателя
 */
export const getCharactersByCreator = async (
  creatorId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Character>> => {
  const params = { page, limit };
  return await get<PaginatedResponse<Character>>(
    `/characters/creator/${creatorId}`,
    { params }
  );
};

// === ADVANCED FEATURES ===

/**
 * Получить теги для автодополнения
 */
export const getCharacterTags = async (
  query?: string,
  limit: number = 10
): Promise<string[]> => {
  const params = { q: query, limit };
  const response = await get<{ tags: string[] }>('/characters/tags', {
    params,
  });
  return response.tags;
};

/**
 * Получить категории персонажей
 */
export const getCharacterCategories = async (): Promise<
  {
    id: string;
    name: string;
    description: string;
    count: number;
  }[]
> => {
  const response = await get<{ categories: any[] }>('/characters/categories');
  return response.categories;
};

/**
 * Клонировать персонажа (создать копию)
 */
export const cloneCharacter = async (
  characterId: string,
  newName?: string
): Promise<Character> => {
  const data = newName ? { name: newName } : {};
  return await post<Character>(`/characters/${characterId}/clone`, data);
};

/**
 * Экспорт персонажа в различных форматах
 */
export const exportCharacter = async (
  characterId: string,
  format: 'json' | 'tavern' | 'characterai' = 'json'
): Promise<{ downloadUrl: string }> => {
  return await post<{ downloadUrl: string }>(
    `/characters/${characterId}/export`,
    { format }
  );
};

/**
 * Импорт персонажа из файла
 */
export const importCharacter = async (
  file: File,
  format: 'json' | 'tavern' | 'characterai' = 'json'
): Promise<Character> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('format', format);

  return await upload('/characters/import', formData as any);
};

// === BATCH OPERATIONS ===

/**
 * Массовые операции с персонажами
 */
export const batchCharacterOperations = {
  /**
   * Добавить несколько персонажей в избранное
   */
  addMultipleToFavorites: async (characterIds: string[]): Promise<void> => {
    await post('/characters/batch/favorite', { characterIds });
  },

  /**
   * Удалить несколько персонажей из избранного
   */
  removeMultipleFromFavorites: async (
    characterIds: string[]
  ): Promise<void> => {
    await del('/characters/batch/favorite', { data: { characterIds } });
  },

  /**
   * Удалить несколько персонажей (только создатель)
   */
  deleteMultiple: async (characterIds: string[]): Promise<void> => {
    await post('/characters/batch/delete', { characterIds });
  },

  /**
   * Обновить категорию для нескольких персонажей
   */
  updateMultipleCategories: async (
    characterIds: string[],
    category: string
  ): Promise<void> => {
    await post('/characters/batch/category', { characterIds, category });
  },
};

// === CANCEL TOKEN SUPPORT ===

/**
 * Создать отменяемый запрос для поиска персонажей
 */
export const getCancellableCharacterSearch = (
  searchParams: CharacterSearchParams
) => {
  const cancelTokenSource = createCancelToken();

  const promise = searchCharacters(
    searchParams.query,
    searchParams.filters,
    searchParams.sortBy,
    searchParams.page,
    searchParams.limit
  );

  return {
    promise,
    cancel: () => cancelTokenSource.cancel('Search cancelled'),
  };
};

/**
 * Создать отменяемый запрос для загрузки персонажей
 */
export const getCancellableCharacters = (
  filters?: CharacterFilters,
  page: number = 1
) => {
  const cancelTokenSource = createCancelToken();

  const promise = get<PaginatedResponse<Character>>('/characters', {
    params: { ...filters, page },
    cancelToken: cancelTokenSource.token,
  });

  return {
    promise,
    cancel: () => cancelTokenSource.cancel('Request cancelled'),
  };
};

// === UTILITY CLASSES ===

/**
 * Класс для управления загрузкой персонажей с кэшированием
 */
export class CharacterLoader {
  private cache: Map<string, Character> = new Map();
  private loadingPromises: Map<string, Promise<Character>> = new Map();

  /**
   * Загрузить персонажа с кэшированием
   */
  async loadCharacter(
    characterId: string,
    forceRefresh: boolean = false
  ): Promise<Character> {
    // Возвращаем из кэша если есть и не требуется обновление
    if (!forceRefresh && this.cache.has(characterId)) {
      return this.cache.get(characterId)!;
    }

    // Если уже загружается, возвращаем существующий Promise
    if (this.loadingPromises.has(characterId)) {
      return this.loadingPromises.get(characterId)!;
    }

    // Создаем новый Promise для загрузки
    const loadingPromise = getCharacter(characterId)
      .then((character) => {
        this.cache.set(characterId, character);
        this.loadingPromises.delete(characterId);
        return character;
      })
      .catch((error) => {
        this.loadingPromises.delete(characterId);
        throw error;
      });

    this.loadingPromises.set(characterId, loadingPromise);
    return loadingPromise;
  }

  /**
   * Предварительная загрузка персонажей
   */
  async preloadCharacters(characterIds: string[]): Promise<void> {
    const promises = characterIds
      .filter((id) => !this.cache.has(id))
      .map((id) => this.loadCharacter(id));

    await Promise.allSettled(promises);
  }

  /**
   * Очистить кэш
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Получить размер кэша
   */
  getCacheSize(): number {
    return this.cache.size;
  }
}

// Экспорт singleton instance
export const characterLoader = new CharacterLoader();

// Экспорт всех функций как единый объект
export default {
  // CRUD operations
  getCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,

  // Interactions
  toggleFavorite,
  getFavorites,
  rateCharacter,
  reportCharacter,
  getCharacterReviews,

  // Assets
  uploadCharacterAvatar,
  uploadCharacterImages,
  getCharacterStats,
  deleteCharacterAvatar,
  deleteCharacterImage,

  // Search & Discovery
  searchCharacters,
  getFeaturedCharacters,
  getTrendingCharacters,
  getSimilarCharacters,
  getCharactersByCategory,
  getCharactersByCreator,

  // Advanced features
  getCharacterTags,
  getCharacterCategories,
  cloneCharacter,
  exportCharacter,
  importCharacter,

  // Batch operations
  batch: batchCharacterOperations,

  // Utilities
  characterLoader,
  getCancellableCharacterSearch,
  getCancellableCharacters,
};

// Экспорт типов
export type {
  CharacterFilters,
  CharacterSearchParams,
  CharacterStats,
  CharacterReport,
};
