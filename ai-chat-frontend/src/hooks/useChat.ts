import { useEffect, useRef, useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  author: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export interface TypingIndicator {
  author: 'user' | 'ai';
  isTyping: boolean;
}

export function useChat(wsUrl: string) {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState<TypingIndicator | null>(null);
  const [status, setStatus] = useState<'connecting' | 'open' | 'closed' | 'error'>('connecting');

  // WebSocket connect
  useEffect(() => {
    ws.current = new WebSocket(wsUrl);
    setStatus('connecting');

    ws.current.onopen = () => setStatus('open');
    ws.current.onclose = () => setStatus('closed');
    ws.current.onerror = () => setStatus('error');
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setMessages((prev) => [...prev, data.message]);
      } else if (data.type === 'typing') {
        setTyping({ author: data.author, isTyping: data.isTyping });
      }
    };
    return () => {
      ws.current?.close();
    };
  }, [wsUrl]);

  // Send message
  const sendMessage = useCallback((content: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const msg = {
        type: 'message',
        content,
        timestamp: Date.now(),
      };
      ws.current.send(JSON.stringify(msg));
    }
  }, []);

  // Send typing indicator
  const sendTyping = useCallback((isTyping: boolean) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'typing', isTyping }));
    }
  }, []);

  return {
    messages,
    typing,
    status,
    sendMessage,
    sendTyping,
  };
}
