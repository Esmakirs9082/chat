import React, { useState, useEffect, useRef } from 'react';
import {
  getChat,
  getMessages,
  sendMessage,
  connectWebSocket,
  sendTypingIndicator,
  markAsRead,
  wsManager
} from '../../services/chatApi';
import { Chat, Message } from '../../types/chat';
import { PaginatedResponse } from '../../types';

interface ChatInterfaceProps {
  chatId: string;
}

const ChatInterfaceExample: React.FC<ChatInterfaceProps> = ({ chatId }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChatData();
  }, [chatId]);

  const loadChatData = async () => {
    try {
      setIsLoading(true);
      const [chatData, messagesResponse] = await Promise.all([
        getChat(chatId),
        getMessages(chatId, 1, 50)
      ]);

      setChat(chatData);
      setMessages(messagesResponse.data || []);
    } catch (error) {
      console.error('Failed to load chat data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      await sendMessage(chatId, messageContent);
    } catch (error) {
      console.error('Failed to send message:', error);
      setNewMessage(messageContent);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="flex items-center p-4 border-b">
        <h2 className="font-semibold text-gray-900 dark:text-white">
          {chat?.title || 'Chat'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Напишите сообщение..."
            className="flex-1 p-3 border rounded-lg"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Отправить
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterfaceExample;