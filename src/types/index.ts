export interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  personality: string;
  isNSFW: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  characterId: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatRoom {
  id: string;
  characterId: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastActivity: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  subscriptionTier: 'free' | 'basic' | 'premium';
  subscriptionExpires?: Date;
  preferences: UserPreferences;
  createdAt: Date;
}

export interface UserPreferences {
  darkMode: boolean;
  nsfwEnabled: boolean;
  language: string;
  notifications: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  messageLimit: number;
  characterLimit: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface ChatState {
  activeRoom: ChatRoom | null;
  rooms: ChatRoom[];
  isTyping: boolean;
  selectedCharacter: Character | null;
}

export interface AppState {
  auth: AuthState;
  chat: ChatState;
  characters: Character[];
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
}