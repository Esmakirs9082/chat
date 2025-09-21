import React, { useState, useEffect } from 'react';
import { Send, Wifi, WifiOff, RotateCcw } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import Button from '../components/ui/Button';

interface ChatExampleProps {
  chatId: string;
  characterId?: string;
}

const ChatExample: React.FC<ChatExampleProps> = ({ chatId, characterId }) => {
  const [messageInput, setMessageInput] = useState('');
  const [isUserTyping, setIsUserTyping] = useState(false);

  const {
    messages,
    sendMessage,
    isConnected,
    connectionStatus,
    reconnect,
    disconnect,
    isTyping,
    isOtherTyping,
    startTyping,
    stopTyping,
    onlineUsers,
    lastError,
    clearError,
  } = useChat({
    chatId,
    characterId,
    autoReconnect: true,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    typingTimeout: 3000,
  });

  // Handle message sending
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
      stopTyping();
      setIsUserTyping(false);
    }
  };

  // Handle typing start
  const handleTypingStart = () => {
    if (!isUserTyping) {
      setIsUserTyping(true);
      startTyping();
    }
  };

  // Handle typing stop with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isUserTyping) {
        setIsUserTyping(false);
        stopTyping();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [messageInput, isUserTyping, stopTyping]);

  // Connection status indicator
  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'connecting':
      case 'reconnecting':
        return <RotateCcw className="w-4 h-4 text-yellow-500 animate-spin" />;
      default:
        return <WifiOff className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Chat {chatId}
          </h2>
          {characterId && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              with {characterId}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Online users */}
          {onlineUsers.length > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {onlineUsers.length} online
            </span>
          )}

          {/* Connection status */}
          <div className="flex items-center space-x-2">
            {getConnectionIcon()}
            <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {connectionStatus}
            </span>
          </div>

          {/* Reconnect button */}
          {!isConnected && (
            <Button
              onClick={reconnect}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              Reconnect
            </Button>
          )}
        </div>
      </div>

      {/* Error display */}
      {lastError && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-700 dark:text-red-300">
              {lastError}
            </p>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600 dark:hover:text-red-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isOtherTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
              handleTypingStart();
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={isConnected ? 'Type a message...' : 'Connecting...'}
            disabled={!isConnected}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!isConnected || !messageInput.trim()}
            className="px-4 py-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* User typing indicator */}
        {isUserTyping && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Typing...
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatExample;
