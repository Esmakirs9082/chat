import { get, post, put, del, patch, createCancelToken } from './api';
import { Chat, Message } from '../types/chat';
import { PaginatedResponse } from '../types';

// Типы для WebSocket сообщений
interface WebSocketMessage {
  type: 'message' | 'typing' | 'presence' | 'error';
  data: any;
  chatId?: string;
  userId?: string;
  timestamp: string;
}

interface TypingIndicator {
  userId: string;
  isTyping: boolean;
  timestamp: string;
}

interface MessageReaction {
  messageId: string;
  emoji: string;
  userId: string;
  timestamp: string;
}

// === CHAT MANAGEMENT ===
// === CHAT MANAGEMENT ===

/**
 * Получить список чатов пользователя с пагинацией
 */
export const getChats = async (
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Chat>> => {
  const params = { page, limit };
  return await get<PaginatedResponse<Chat>>('/chats', { params });
};

/**
 * Получить конкретный чат по ID
 */
export const getChat = async (chatId: string): Promise<Chat> => {
  return await get<Chat>(`/chats/${chatId}`);
};

/**
 * Создать новый чат с персонажем
 */
export const createChat = async (
  characterId: string,
  title?: string
): Promise<Chat> => {
  return await post<Chat>('/chats', { characterId, title });
};

/**
 * Обновить данные чата (например, заголовок)
 */
export const updateChat = async (
  chatId: string,
  updates: { title?: string; archived?: boolean }
): Promise<Chat> => {
  return await patch<Chat>(`/chats/${chatId}`, updates);
};

/**
 * Удалить чат полностью
 */
export const deleteChat = async (chatId: string): Promise<void> => {
  await del(`/chats/${chatId}`);
};

/**
 * Архивировать чат (скрыть из основного списка)
 */
export const archiveChat = async (chatId: string): Promise<void> => {
  await patch(`/chats/${chatId}`, { archived: true });
};

/**
 * Восстановить чат из архива
 */
export const unarchiveChat = async (chatId: string): Promise<void> => {
  await patch(`/chats/${chatId}`, { archived: false });
};

// === MESSAGES ===

/**
 * Получить сообщения чата с пагинацией
 */
export const getMessages = async (
  chatId: string,
  page: number = 1,
  limit: number = 50
): Promise<PaginatedResponse<Message>> => {
  const params = { page, limit };
  return await get<PaginatedResponse<Message>>(`/chats/${chatId}/messages`, {
    params,
  });
};

/**
 * Отправить сообщение в чат
 */
export const sendMessage = async (
  chatId: string,
  content: string
): Promise<Message> => {
  return await post<Message>(`/chats/${chatId}/messages`, { content });
};

/**
 * Редактировать существующее сообщение
 */
export const editMessage = async (
  messageId: string,
  content: string
): Promise<Message> => {
  return await patch<Message>(`/messages/${messageId}`, { content });
};

/**
 * Удалить сообщение
 */
export const deleteMessage = async (messageId: string): Promise<void> => {
  await del(`/messages/${messageId}`);
};

/**
 * Добавить реакцию на сообщение
 */
export const reactToMessage = async (
  messageId: string,
  emoji: string
): Promise<void> => {
  await post(`/messages/${messageId}/reactions`, { emoji });
};

/**
 * Удалить реакцию с сообщения
 */
export const removeReaction = async (
  messageId: string,
  emoji: string
): Promise<void> => {
  await del(`/messages/${messageId}/reactions/${emoji}`);
};

// === REAL-TIME FEATURES ===

/**
 * Подключение к WebSocket для real-time обновлений
 */
export const connectWebSocket = (chatId: string): WebSocket => {
  const wsUrl = (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:3000';
  const token = localStorage.getItem('auth-token') || '';

  const ws = new WebSocket(
    `${wsUrl}/chat/${chatId}?token=${encodeURIComponent(token)}`
  );

  ws.onopen = (event) => {
    console.log(`[WebSocket] Connected to chat ${chatId}`, event);
  };

  ws.onmessage = (event) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      console.log(`[WebSocket] Received message:`, message);

      // Emit custom events для обработки в компонентах
      const customEvent = new CustomEvent('websocket-message', {
        detail: { message, chatId },
      });
      window.dispatchEvent(customEvent);
    } catch (error) {
      console.error('[WebSocket] Error parsing message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error(`[WebSocket] Connection error for chat ${chatId}:`, error);
  };

  ws.onclose = (event) => {
    console.log(`[WebSocket] Connection closed for chat ${chatId}:`, event);

    // Автоматическое переподключение через 5 секунд если соединение оборвалось неожиданно
    if (event.code !== 1000) {
      // 1000 = normal closure
      setTimeout(() => {
        console.log(`[WebSocket] Attempting to reconnect to chat ${chatId}`);
        connectWebSocket(chatId);
      }, 5000);
    }
  };

  return ws;
};

/**
 * Отправить индикатор печати
 */
export const sendTypingIndicator = async (
  chatId: string,
  isTyping: boolean
): Promise<void> => {
  await post(`/chats/${chatId}/typing`, { isTyping });
};

/**
 * Пометить сообщения как прочитанные
 */
export const markAsRead = async (
  chatId: string,
  messageId?: string
): Promise<void> => {
  const data = messageId ? { messageId } : {};
  await post(`/chats/${chatId}/read`, data);
};

// === ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ===

/**
 * Поиск в сообщениях чата
 */
export const searchMessages = async (
  chatId: string,
  query: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Message>> => {
  const params = { q: query, page, limit };
  return await get<PaginatedResponse<Message>>(`/chats/${chatId}/search`, {
    params,
  });
};

/**
 * Экспорт истории чата
 */
export const exportChatHistory = async (
  chatId: string,
  format: 'json' | 'txt' | 'html' = 'json'
): Promise<{ downloadUrl: string }> => {
  return await post<{ downloadUrl: string }>(`/chats/${chatId}/export`, {
    format,
  });
};

/**
 * Получить статистику чата
 */
export const getChatStats = async (chatId: string) => {
  return await get(`/chats/${chatId}/stats`);
};

/**
 * Очистить историю чата (удалить все сообщения)
 */
export const clearChatHistory = async (chatId: string): Promise<void> => {
  await del(`/chats/${chatId}/messages`);
};

// === BATCH OPERATIONS ===

/**
 * Массовые операции с чатами
 */
export const batchChatOperations = {
  /**
   * Архивировать несколько чатов
   */
  archiveMultiple: async (chatIds: string[]): Promise<void> => {
    await post('/chats/batch/archive', { chatIds });
  },

  /**
   * Удалить несколько чатов
   */
  deleteMultiple: async (chatIds: string[]): Promise<void> => {
    await post('/chats/batch/delete', { chatIds });
  },

  /**
   * Пометить несколько чатов как прочитанные
   */
  markMultipleAsRead: async (chatIds: string[]): Promise<void> => {
    await post('/chats/batch/read', { chatIds });
  },
};

// === WEBSOCKET UTILITIES ===

/**
 * Класс для управления WebSocket соединениями
 */
export class ChatWebSocketManager {
  private connections: Map<string, WebSocket> = new Map();
  private reconnectTimeouts: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Подключиться к чату
   */
  connect(chatId: string): WebSocket {
    // Закрываем существующее соединение если есть
    this.disconnect(chatId);

    const ws = connectWebSocket(chatId);
    this.connections.set(chatId, ws);

    return ws;
  }

  /**
   * Отключиться от чата
   */
  disconnect(chatId: string): void {
    const ws = this.connections.get(chatId);
    if (ws) {
      ws.close(1000, 'Manual disconnect');
      this.connections.delete(chatId);
    }

    // Отменяем таймер переподключения если есть
    const timeout = this.reconnectTimeouts.get(chatId);
    if (timeout) {
      clearTimeout(timeout);
      this.reconnectTimeouts.delete(chatId);
    }
  }

  /**
   * Отключиться от всех чатов
   */
  disconnectAll(): void {
    this.connections.forEach((ws, chatId) => {
      this.disconnect(chatId);
    });
  }

  /**
   * Получить соединение для чата
   */
  getConnection(chatId: string): WebSocket | undefined {
    return this.connections.get(chatId);
  }

  /**
   * Проверить статус соединения
   */
  isConnected(chatId: string): boolean {
    const ws = this.connections.get(chatId);
    return ws ? ws.readyState === WebSocket.OPEN : false;
  }

  /**
   * Отправить сообщение через WebSocket
   */
  sendMessage(chatId: string, message: any): boolean {
    const ws = this.connections.get(chatId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  }
}

// Экспорт singleton instance
export const wsManager = new ChatWebSocketManager();

// === CANCEL TOKEN SUPPORT ===

/**
 * Создать отменяемый запрос для получения сообщений
 */
export const getCancellableMessages = (chatId: string, page: number = 1) => {
  const cancelTokenSource = createCancelToken();

  const promise = get<PaginatedResponse<Message>>(`/chats/${chatId}/messages`, {
    params: { page },
    cancelToken: cancelTokenSource.token,
  });

  return {
    promise,
    cancel: () => cancelTokenSource.cancel('Request cancelled'),
  };
};

// Экспорт всех функций как единый объект
export default {
  // Chat management
  getChats,
  getChat,
  createChat,
  updateChat,
  deleteChat,
  archiveChat,
  unarchiveChat,

  // Messages
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  reactToMessage,
  removeReaction,
  markAsRead,
  searchMessages,
  clearChatHistory,

  // Real-time
  connectWebSocket,
  sendTypingIndicator,
  wsManager,

  // Additional features
  exportChatHistory,
  getChatStats,
  batch: batchChatOperations,

  // Utilities
  getCancellableMessages,
};
