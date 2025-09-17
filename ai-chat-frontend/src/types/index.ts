// Типы для AI чат-сервиса

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  subscription: 'free' | 'basic' | 'premium';
  subscriptionExpiresAt?: Date;
  isEmailVerified: boolean;
  createdAt: Date;
  lastActiveAt: Date;
  preferences: {
    theme: 'dark' | 'light';
    nsfwEnabled: boolean;
  };
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  chatId: string;
  characterId?: string;
  type: 'text' | 'image' | 'system';
  isEdited?: boolean;
  reactions?: {
    emoji: string;
    count: number;
  }[];
}

export interface Character {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  personality: {
    trait: string;
    value: number;
  }[];
  isNsfw: boolean;
  isPublic: boolean;
  createdBy: string;
  tags: string[];
  messageCount: number;
  favoriteCount: number;
  createdAt: Date;
  lastUsed?: Date;
}

// --- Минимальные типы для обратимой совместимости ---

export interface Chat {
  id: string;
  characterId: string;
  character?: Character;
  messages: Message[];
  lastActivity: Date;
  createdAt: Date;
}

export interface ChatMessageForm {
  content: string;
  characterId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CharacterCreateForm {
  name: string;
  description: string;
  personality: { trait: string; value: number }[];
  avatar?: string;
  isNsfw: boolean;
  tags: string[];
}