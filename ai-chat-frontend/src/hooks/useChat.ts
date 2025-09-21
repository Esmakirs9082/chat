import { useEffect, useRef, useState, useCallback } from 'react';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import { Message } from '../types/chat';

export type ConnectionStatus =
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'reconnecting';

export interface WebSocketMessage {
  type:
    | 'message'
    | 'typing_start'
    | 'typing_stop'
    | 'user_joined'
    | 'user_left'
    | 'error';
  data: any;
  timestamp: string;
  userId?: string;
  chatId?: string;
}

export interface UseChatOptions {
  chatId?: string;
  characterId?: string;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  typingTimeout?: number;
}

export interface UseChatReturn {
  // Messages
  messages: Message[];
  sendMessage: (content: string) => void;

  // Connection
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  reconnect: () => void;
  disconnect: () => void;

  // Typing
  isTyping: boolean;
  isOtherTyping: boolean;
  startTyping: () => void;
  stopTyping: () => void;

  // Users
  onlineUsers: string[];

  // Error handling
  lastError: string | null;
  clearError: () => void;
}

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';

export const useChat = (options: UseChatOptions = {}): UseChatReturn => {
  const {
    chatId,
    characterId,
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    typingTimeout = 3000,
  } = options;

  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  // State
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('disconnected');
  const [isTyping, setIsTyping] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);

  // Store hooks
  const { user, token } = useAuthStore();
  const {
    messages,
    addMessage,
    startTyping: storeStartTyping,
    stopTyping: storeStopTyping,
  } = useChatStore();

  // Computed values
  const isConnected = connectionStatus === 'connected';

  // Clear error
  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  // WebSocket message handler
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const wsMessage: WebSocketMessage = JSON.parse(event.data);

        switch (wsMessage.type) {
          case 'message':
            // Add message to store
            if (
              wsMessage.data &&
              wsMessage.chatId === chatId &&
              wsMessage.chatId
            ) {
              const message: Message = {
                id: wsMessage.data.id || Date.now().toString(),
                chatId: wsMessage.chatId,
                characterId: wsMessage.data.characterId,
                sender: wsMessage.data.sender || 'ai',
                content: wsMessage.data.content || '',
                timestamp: new Date(wsMessage.timestamp),
                type: wsMessage.data.type || 'text',
              };
              addMessage(message);
            }
            break;

          case 'typing_start':
            if (wsMessage.userId !== user?.id && wsMessage.chatId === chatId) {
              setIsOtherTyping(true);
              if (wsMessage.data?.characterName) {
                storeStartTyping(wsMessage.data.characterName);
              }
            }
            break;

          case 'typing_stop':
            if (wsMessage.userId !== user?.id && wsMessage.chatId === chatId) {
              setIsOtherTyping(false);
              storeStopTyping();
            }
            break;

          case 'user_joined':
            if (wsMessage.data?.userId) {
              setOnlineUsers((prev) => [
                ...prev.filter((id) => id !== wsMessage.data.userId),
                wsMessage.data.userId,
              ]);
            }
            break;

          case 'user_left':
            if (wsMessage.data?.userId) {
              setOnlineUsers((prev) =>
                prev.filter((id) => id !== wsMessage.data.userId)
              );
            }
            break;

          case 'error':
            console.error('WebSocket error:', wsMessage.data);
            setLastError(wsMessage.data?.message || 'WebSocket error occurred');
            break;

          default:
            console.warn('Unknown WebSocket message type:', wsMessage.type);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
        setLastError('Failed to parse server message');
      }
    },
    [chatId, user?.id, addMessage, storeStartTyping, storeStopTyping]
  );

  // WebSocket connection setup
  const connect = useCallback(() => {
    if (!user || !token || !chatId) {
      console.warn('Cannot connect: missing user, token, or chatId');
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.warn('WebSocket already connected');
      return;
    }

    try {
      setConnectionStatus('connecting');

      const wsUrl = `${WS_URL}?token=${encodeURIComponent(token)}&chatId=${encodeURIComponent(chatId)}${characterId ? `&characterId=${encodeURIComponent(characterId)}` : ''}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        setLastError(null);

        // Send join message
        ws.send(
          JSON.stringify({
            type: 'join_chat',
            chatId,
            userId: user.id,
            timestamp: new Date().toISOString(),
          })
        );
      };

      ws.onmessage = handleMessage;

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setConnectionStatus('disconnected');

        // Auto-reconnect if enabled and not manually disconnected
        if (
          autoReconnect &&
          event.code !== 1000 &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          setConnectionStatus('reconnecting');
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            console.log(
              `Reconnect attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`
            );
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('disconnected');
        setLastError('Connection error occurred');
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('disconnected');
      setLastError('Failed to establish connection');
    }
  }, [
    user,
    token,
    chatId,
    characterId,
    autoReconnect,
    maxReconnectAttempts,
    reconnectInterval,
    handleMessage,
  ]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      // Send leave message before closing
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'leave_chat',
            chatId,
            userId: user?.id,
            timestamp: new Date().toISOString(),
          })
        );
      }

      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }

    setConnectionStatus('disconnected');
  }, [chatId, user?.id]);

  // Reconnect manually
  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    setTimeout(connect, 100);
  }, [disconnect, connect]);

  // Send message
  const sendMessage = useCallback(
    (content: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        setLastError('Not connected to server');
        return;
      }

      if (!content.trim()) {
        setLastError('Message cannot be empty');
        return;
      }

      try {
        const message: WebSocketMessage = {
          type: 'message',
          data: {
            content: content.trim(),
            sender: 'user',
            type: 'text',
          },
          chatId,
          userId: user?.id,
          timestamp: new Date().toISOString(),
        };

        wsRef.current.send(JSON.stringify(message));

        // Add user message to local state immediately
        const localMessage: Message = {
          id: Date.now().toString(),
          chatId: chatId!,
          characterId,
          sender: 'user',
          content: content.trim(),
          timestamp: new Date(),
          type: 'text',
        };

        addMessage(localMessage);
      } catch (error) {
        console.error('Failed to send message:', error);
        setLastError('Failed to send message');
      }
    },
    [chatId, characterId, user?.id, addMessage]
  );

  // Start typing
  const startTyping = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    setIsTyping(true);

    try {
      wsRef.current.send(
        JSON.stringify({
          type: 'typing_start',
          chatId,
          userId: user?.id,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error('Failed to send typing start:', error);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop typing after timeout
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, typingTimeout);
  }, [chatId, user?.id, typingTimeout]);

  // Stop typing
  const stopTyping = useCallback(() => {
    if (!isTyping) return;

    setIsTyping(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(
          JSON.stringify({
            type: 'typing_stop',
            chatId,
            userId: user?.id,
            timestamp: new Date().toISOString(),
          })
        );
      } catch (error) {
        console.error('Failed to send typing stop:', error);
      }
    }
  }, [isTyping, chatId, user?.id]);

  // Effect: Connect on mount and when dependencies change
  useEffect(() => {
    if (user && token && chatId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user, token, chatId, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnect();
    };
  }, [disconnect]);

  return {
    // Messages
    messages,
    sendMessage,

    // Connection
    isConnected,
    connectionStatus,
    reconnect,
    disconnect,

    // Typing
    isTyping,
    isOtherTyping,
    startTyping,
    stopTyping,

    // Users
    onlineUsers,

    // Error handling
    lastError,
    clearError,
  };
};

export default useChat;
