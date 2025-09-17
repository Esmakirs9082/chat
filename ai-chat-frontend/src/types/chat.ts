// Типы для чат функционала

export interface Message {
  id: string;
  chatId: string;
  characterId?: string;
  sender: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'system'; // Сделаем обязательным
}

export interface Chat {
  id: string;
  characterId: string;
  userId: string;
  title: string;
  lastMessageAt?: Date;
  messageCount: number;
  isArchived: boolean;
  settings: {
    autoReply: boolean;
    typingEnabled: boolean;
  };
  messages: Message[];
}

export interface ChatSession {
  chatId: string;
  isActive: boolean;
  isTyping: boolean;
  typingStartedAt?: Date;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

export interface TypingIndicator {
  characterName: string;
  isTyping: boolean;
  startedAt: Date;
}

export interface MessageInput {
  placeholder: string;
  maxLength: number;
  disabled: boolean;
  onSend: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
}
