import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '../../types';

interface ChatBubbleProps {
  message: ChatMessage;
  characterName?: string;
  characterAvatar?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  characterName = 'AI',
  characterAvatar = '🤖',
}) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="flex max-w-xs lg:max-w-md">
        {!message.isUser && (
          <div className="flex-shrink-0 mr-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-sm">
              {characterAvatar}
            </div>
          </div>
        )}
        
        <div className="flex flex-col">
          {!message.isUser && (
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
              {characterName}
            </span>
          )}
          
          <div className={`chat-bubble ${message.isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
            {message.isTyping ? (
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}
          </div>
          
          <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 ml-1">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {message.isUser && (
          <div className="flex-shrink-0 ml-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm">
              👤
            </div>
          </div>
        )}
      </div>
    </div>
  );
};