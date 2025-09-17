import { ApiResponse } from '../types';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '../stores/authStore';

// Типы для API ответов
interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
  details?: any;
}

// Базовая конфигурация API
const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Генерация уникального ID для запроса
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Создаем экземпляр axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - добавляем токен авторизации, timestamp и request ID
apiClient.interceptors.request.use(
  (config) => {
    // Добавляем timestamp и request ID для логирования
    const requestId = generateRequestId();
    const timestamp = new Date().toISOString();
    
    if (config.headers) {
      config.headers['X-Request-ID'] = requestId;
      config.headers['X-Timestamp'] = timestamp;
    }

    // Автоматически добавляем Authorization header с token из authStore
    const authState = useAuthStore.getState();
    if (authState.token) {
      config.headers.Authorization = `Bearer ${authState.token}`;
    } else {
      // Fallback к localStorage для обратной совместимости
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage);
          const accessToken = state?.tokens?.accessToken || state?.token;
          
          if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        } catch (error) {
          console.error('Error parsing auth token:', error);
        }
      }
    }

    // Логируем исходящий запрос
    console.log(`[API Request ${requestId}]`, {
      method: config.method?.toUpperCase(),
      url: config.url,
      timestamp,
      headers: { ...config.headers, Authorization: config.headers.Authorization ? '[REDACTED]' : undefined },
      data: config.data,
    });
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Функция для показа уведомлений (временная реализация)
const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
  console.log(`[Notification ${type.toUpperCase()}]`, message);
  // TODO: Интегрировать с настоящей системой уведомлений
};

// Response interceptor - обработка ответов и ошибок
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const requestId = response.config.headers?.['X-Request-ID'];
    
    // Логируем успешный ответ
    console.log(`[API Response ${requestId}]`, {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      responseTime: Date.now() - parseInt(response.config.headers?.['X-Timestamp'] || '0', 10),
    });

    // Transform response data - извлекаем data если это обёрнутый ответ
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return {
        ...response,
        data: response.data.data,
        originalData: response.data,
      };
    }

    return response;
  },
  async (error: AxiosError) => {
    const requestId = error.config?.headers?.['X-Request-ID'];
    const statusCode = error.response?.status;
    const originalRequest = error.config;

    // Логируем ошибку
    console.error(`[API Error ${requestId}]`, {
      status: statusCode,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url,
      },
    });

    // Обработка различных статус-кодов
    switch (statusCode) {
      case 401: {
        // Автоматический refresh token
        if (originalRequest && !(originalRequest as any)._retry) {
          (originalRequest as any)._retry = true;

          try {
            const authState = useAuthStore.getState();
            
            if (authState.refreshToken && !error.config?.url?.includes('/auth/refresh')) {
              // TODO: Реализовать refresh token через authStore
              // await authState.refreshAccessToken();
              
              // Fallback к старой логике
              const authStorage = localStorage.getItem('auth-storage');
              if (authStorage) {
                const { state } = JSON.parse(authStorage);
                const refreshToken = state?.tokens?.refreshToken || state?.refreshToken;
                
                if (refreshToken) {
                  const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                    refreshToken,
                  });
                  
                  const { accessToken, refreshToken: newRefreshToken } = response.data;
                  
                  // Обновляем токены через localStorage (пока setTokens не реализован)
                  const updatedState = {
                    ...state,
                    tokens: { accessToken, refreshToken: newRefreshToken },
                  };
                  localStorage.setItem('auth-storage', JSON.stringify({
                    state: updatedState,
                    version: 0,
                  }));
                  
                  // Повторяем оригинальный запрос с новым токеном
                  if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                  }
                  return apiClient.request(originalRequest);
                }
              }
            } else {
              // Если нет refresh token, разлогиниваем
              authState.logout();
              showNotification('Необходимо войти в систему', 'error');
            }
          } catch (refreshError) {
            // Если refresh не удался, разлогиниваем пользователя
            console.error('[API] Refresh token failed:', refreshError);
            const authState = useAuthStore.getState();
            authState.logout();
            showNotification('Сессия истекла. Пожалуйста, войдите снова.', 'error');
          }
        }
        break;
      }

      case 403:
        showNotification('Недостаточно прав для выполнения этого действия', 'error');
        break;

      case 429:
        showNotification('Слишком много запросов. Попробуйте позже', 'warning');
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        showNotification('Ошибка сервера. Попробуйте позже', 'error');
        break;

      default:
        if (statusCode && statusCode >= 400) {
          const errorMessage = (error.response?.data as any)?.message || 'Произошла ошибка';
          showNotification(errorMessage, 'error');
        }
    }

    // Создаём стандартизированную ошибку
    const apiError: ApiError = {
      message: (error.response?.data as any)?.message || error.message,
      code: (error.response?.data as any)?.code,
      statusCode: statusCode || 0,
      details: error.response?.data,
    };

    return Promise.reject(apiError);
  }
);

// Utility functions

/**
 * GET запрос
 */
export const get = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.get<T>(url, config);
  return response.data;
};

/**
 * POST запрос
 */
export const post = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
};

/**
 * PUT запрос
 */
export const put = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
};

/**
 * PATCH запрос
 */
export const patch = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
};

/**
 * DELETE запрос
 */
export const del = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
};

/**
 * Загрузка файлов с прогрессом
 */
export const upload = async (
  url: string,
  file: File | Blob,
  onProgress?: (progressEvent: { loaded: number; total: number; percentage: number }) => void
): Promise<any> => {
  const formData = new FormData();
  
  if (file instanceof File) {
    formData.append('file', file, file.name);
  } else {
    formData.append('file', file);
  }

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress({
          loaded: progressEvent.loaded,
          total: progressEvent.total,
          percentage,
        });
      }
    },
  };

  const response = await apiClient.post(url, formData, config);
  return response.data;
};

/**
 * Множественная загрузка файлов
 */
export const uploadMultiple = async (
  url: string,
  files: (File | Blob)[],
  onProgress?: (progressEvent: { loaded: number; total: number; percentage: number }) => void
): Promise<any> => {
  const formData = new FormData();
  
  files.forEach((file, index) => {
    if (file instanceof File) {
      formData.append(`files[${index}]`, file, file.name);
    } else {
      formData.append(`files[${index}]`, file);
    }
  });

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress({
          loaded: progressEvent.loaded,
          total: progressEvent.total,
          percentage,
        });
      }
    },
  };

  const response = await apiClient.post(url, formData, config);
  return response.data;
};

/**
 * Отмена запроса
 */
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

/**
 * Проверка, была ли операция отменена
 */
export const isCancel = (error: any): boolean => {
  return axios.isCancel(error);
};

/**
 * Настройка базового URL
 */
export const setBaseURL = (baseURL: string) => {
  apiClient.defaults.baseURL = baseURL;
};

/**
 * Получение текущего базового URL
 */
export const getBaseURL = (): string => {
  return apiClient.defaults.baseURL || '';
};

/**
 * Добавление глобального header
 */
export const setGlobalHeader = (key: string, value: string) => {
  apiClient.defaults.headers.common[key] = value;
};

/**
 * Удаление глобального header
 */
export const removeGlobalHeader = (key: string) => {
  delete apiClient.defaults.headers.common[key];
};

// Wrapper для обработки ошибок (для обратной совместимости)
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Сервер ответил с кодом ошибки
    const message = error.response.data?.message || error.response.data?.error;
    return message || `HTTP Error: ${error.response.status}`;
  } else if (error.request) {
    // Запрос был отправлен, но ответа не получено
    return 'Нет ответа от сервера. Проверьте подключение к интернету.';
  } else {
    // Ошибка настройки запроса
    return error.message || 'Произошла неизвестная ошибка';
  }
};

// Generic функция для API запросов (для обратной совместимости)
export async function apiRequest<T = any>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient(config);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

// Методы для быстрого доступа (для обратной совместимости)
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ method: 'GET', url, ...config }),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ method: 'POST', url, data, ...config }),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ method: 'PUT', url, data, ...config }),
    
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ method: 'PATCH', url, data, ...config }),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ method: 'DELETE', url, ...config }),
};

/**
 * Экспорт основного клиента для расширенного использования
 */
export default apiClient;

// Экспорт типов
export type { ApiResponse, ApiError };