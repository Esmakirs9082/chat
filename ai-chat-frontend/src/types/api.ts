// Типы для API ответов

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: number;
}

export interface AuthResponse {
  user: import('./index').User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ErrorResponse {
  error: string;
  code: number;
  details?: any;
  timestamp: Date;
  path: string;
}
