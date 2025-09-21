/**
 * API Client Configuration
 * Пример интеграции с environment конфигурацией
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiConfig, env, features, isDevelopment } from '../config/env';

// Типы для API ответов
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

// Основной API клиент
class ApiClient {
  private client: AxiosInstance;
  private retryCount = 0;
  private maxRetries = apiConfig.retries;

  constructor() {
    this.client = axios.create({
      baseURL: apiConfig.baseURL,
      timeout: apiConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
        'X-App-Version': env.APP_VERSION,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Добавляем debug логи в development
        if (isDevelopment && features.ENABLE_DEBUG_MODE) {
          console.log(
            `🔌 API Request: ${config.method?.toUpperCase()} ${config.url}`,
            {
              data: config.data,
              params: config.params,
            }
          );
        }

        // Добавляем auth token если есть
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        if (features.ENABLE_DEBUG_MODE) {
          console.error('❌ API Request Error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (isDevelopment && features.ENABLE_DEBUG_MODE) {
          console.log(
            `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
            {
              status: response.status,
              data: response.data,
            }
          );
        }
        return response;
      },
      async (error) => {
        if (features.ENABLE_DEBUG_MODE) {
          console.error('❌ API Response Error:', error.response || error);
        }

        // Retry logic для production
        if (this.shouldRetry(error) && this.retryCount < this.maxRetries) {
          this.retryCount++;
          if (features.ENABLE_DEBUG_MODE) {
            console.log(
              `🔄 Retrying request (${this.retryCount}/${this.maxRetries})`
            );
          }

          // Exponential backoff
          const delay = Math.pow(2, this.retryCount) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));

          return this.client.request(error.config);
        }

        this.retryCount = 0;
        return Promise.reject(error);
      }
    );
  }

  private shouldRetry(error: any): boolean {
    // Retry только на network errors или 5xx статусы
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600)
    );
  }

  // Generic request methods
  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  // File upload (только если feature включен)
  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    if (!features.ENABLE_CHARACTER_CREATION) {
      throw new Error('File upload is disabled');
    }

    const formData = new FormData();
    formData.append('file', file);

    return this.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });
  }
}

// WebSocket Client
class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket(apiConfig.wsURL);
      this.setupEventHandlers();
    } catch (error) {
      if (features.ENABLE_DEBUG_MODE) {
        console.error('❌ WebSocket connection failed:', error);
      }
      this.handleReconnect();
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      if (features.ENABLE_DEBUG_MODE) {
        console.log('🔌 WebSocket connected to:', apiConfig.wsURL);
      }
      this.reconnectAttempts = 0;
    };

    this.ws.onclose = () => {
      if (features.ENABLE_DEBUG_MODE) {
        console.log('🔌 WebSocket disconnected');
      }
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      if (features.ENABLE_DEBUG_MODE) {
        console.error('❌ WebSocket error:', error);
      }
    };

    this.ws.onmessage = (event) => {
      if (features.ENABLE_DEBUG_MODE) {
        console.log('📨 WebSocket message:', event.data);
      }

      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;

      if (features.ENABLE_DEBUG_MODE) {
        console.log(
          `🔄 Attempting to reconnect WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
        );
      }

      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  private handleMessage(data: any) {
    // Обработка входящих сообщений
    // Можно добавить event emitter для компонентов
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else if (features.ENABLE_DEBUG_MODE) {
      console.warn('⚠️ WebSocket is not connected, message not sent:', data);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Создаем синглтон instances
export const apiClient = new ApiClient();
export const wsClient = new WebSocketClient();

// Environment-specific configurations
export const apiFeatures = {
  // Feature flags для API функций
  uploadEnabled: features.ENABLE_CHARACTER_CREATION,
  voiceEnabled: features.ENABLE_REALTIME_CHAT,
  subscriptionsEnabled: features.ENABLE_SUBSCRIPTIONS,

  // Environment-specific timeouts
  chatTimeout: isDevelopment ? 60000 : 30000,
  uploadTimeout: isDevelopment ? 120000 : 60000,

  // Retry policies
  maxRetries: apiConfig.retries,
  retryDelay: isDevelopment ? 2000 : 1000,
};
