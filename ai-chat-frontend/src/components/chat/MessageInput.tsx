import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Send, Paperclip, Smile, Upload } from 'lucide-react';
import { Button } from '../ui';
import { useAuthStore } from '../../stores/authStore';
import { Character } from '../../types';
import { cn } from '../../utils';

interface MessageInputProps {
  character: Character;
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export interface MessageInputHandle {
  sendMessage: () => void;
}

// Ограничения для разных типов пользователей
const LIMITS = {
  FREE: { chars: 50, messages: 10 },
  BASIC: { chars: 500, messages: 100 },
  PREMIUM: { chars: -1, messages: -1 }, // -1 означает без ограничений
} as const;

const MessageInput = forwardRef<MessageInputHandle, MessageInputProps>(function MessageInput(
  {
    character,
    onSendMessage,
    disabled = false,
    placeholder,
    className,
  },
  ref
) {
  const { user, subscription } = useAuthStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Состояние компонента
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [messagesCount, setMessagesCount] = useState(0); // Счетчик сообщений за день
  
  // Получение лимитов на основе подписки
  const getLimits = () => {
    if (!user) return LIMITS.FREE;
    
    switch (subscription) {
      case 'basic':
        return LIMITS.BASIC;
      case 'premium':
        return LIMITS.PREMIUM;
      default:
        return LIMITS.FREE;
    }
  };

  const limits = getLimits();
  const isCharOverLimit = limits.chars > 0 && message.length > limits.chars;
  const isCharNearLimit = limits.chars > 0 && message.length > limits.chars * 0.8;
  const isMessagesOverLimit = limits.messages > 0 && messagesCount >= limits.messages;

  // Авто-изменение высоты textarea (max 4 строки)
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = 24; // примерная высота строки
      const maxHeight = lineHeight * 4; // max 4 строки
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, []);

  // Эффект для изменения высоты при изменении текста
  useEffect(() => {
    adjustTextareaHeight();
  }, [message, adjustTextareaHeight]);

  // Debounced typing indicator
  const startTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      // TODO: Отправить событие "начал печатать" в чат
    }
    
    // Очищаем предыдущий таймаут
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Останавливаем индикатор печати через 3 секунды
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // TODO: Отправить событие "прекратил печатать" в чат
    }, 3000);
  }, [isTyping]);

  const stopTyping = useCallback(() => {
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // TODO: Отправить событие "прекратил печатать" в чат
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Обработка отправки сообщения
  const handleSendMessage = useCallback(() => {
    const trimmedMessage = message.trim();
    
    if (!trimmedMessage || disabled || isCharOverLimit || isMessagesOverLimit || isUploading) return;
    
    onSendMessage(trimmedMessage);
    setMessage('');
    setMessagesCount(prev => prev + 1);
    stopTyping();
    
    // Сброс высоты textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }, 0);
  }, [message, disabled, isCharOverLimit, isMessagesOverLimit, isUploading, onSendMessage, stopTyping]);

  useImperativeHandle(ref, () => ({
    sendMessage: handleSendMessage,
  }));

  // Обработка нажатия клавиш
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter = новая строка (браузер обработает это сам)
        return;
      } else {
        // Enter = отправить сообщение
        e.preventDefault();
        handleSendMessage();
      }
    }
  };

  // Обработка изменения текста
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Если есть лимит символов, обрезаем текст
    if (limits.chars > 0 && value.length > limits.chars) {
      setMessage(value.slice(0, limits.chars));
    } else {
      setMessage(value);
    }
    
    // Запускаем индикатор печати при изменении текста
    if (value.length > 0) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  // Обработка фокуса
  const handleFocus = () => {
    setIsFocused(true);
    if (message.length > 0) {
      startTyping();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    stopTyping();
  };

  // Emoji picker
  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
    startTyping();
  };

  // File upload (только для premium)
  const handleFileClick = () => {
    if (subscription !== 'premium') {
      // Показать upgrade prompt
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // TODO: Реализовать загрузку файла через API
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setMessage((prev) => prev + ` [файл: ${file.name}]`);
      startTyping();
    } catch (err) {
      setUploadError('Ошибка загрузки файла');
    } finally {
      setIsUploading(false);
    }
  };

  // Drag & drop для файлов
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (subscription !== 'premium') {
      return;
    }
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadError(null);
      
      try {
        // TODO: Реализовать загрузку файла через API
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setMessage((prev) => prev + ` [файл: ${file.name}]`);
        startTyping();
      } catch (err) {
        setUploadError('Ошибка загрузки файла');
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Динамический placeholder
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return `Сообщение для ${character.name}...`;
  };

  // Получаем цвет счетчика символов
  const getCounterColor = () => {
    if (isCharOverLimit) return 'text-red-600';
    if (isCharNearLimit) return 'text-amber-600';
    return 'text-gray-500';
  };

  const canSend = message.trim().length > 0 && !disabled && !isCharOverLimit && !isMessagesOverLimit && !isUploading;

  return (
    <div
      className={cn('bg-white border-t px-4 py-3 relative', className)}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Upgrade prompt для достижения лимитов */}
      {(isCharOverLimit || isMessagesOverLimit) && subscription !== 'premium' && (
        <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-purple-800">
                {isMessagesOverLimit ? 'Достигнут лимит сообщений' : 'Достигнут лимит символов'}
              </h4>
              <p className="text-xs text-purple-700 mt-1">
                Обновитесь до Premium для безлимитного общения
              </p>
            </div>
            <Button variant="primary" className="ml-2 text-xs px-3 py-1">
              Upgrade
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled || isUploading}
            placeholder={getPlaceholder()}
            className={cn(
              'w-full resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
              'transition-all duration-200',
              (isCharOverLimit || isMessagesOverLimit) && 'border-red-300 focus:ring-red-500'
            )}
            rows={1}
            maxLength={limits.chars > 0 ? limits.chars : undefined}
            style={{ minHeight: '40px' }}
          />
          
          {/* Character counter */}
          {limits.chars > 0 && (
            <div className={cn('text-xs mt-1 text-right', getCounterColor())}>
              {message.length}/{limits.chars}
            </div>
          )}
          
          {/* Messages counter */}
          {limits.messages > 0 && (
            <div className={cn('text-xs mt-1 text-right', messagesCount >= limits.messages ? 'text-red-600' : 'text-gray-500')}>
              Сообщений сегодня: {messagesCount}/{limits.messages}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1">
          {/* File upload button - только для premium */}
          <button
            type="button"
            className={cn(
              'p-2 rounded-full transition-colors',
              subscription === 'premium' 
                ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' 
                : 'text-gray-300 cursor-not-allowed'
            )}
            title={subscription === 'premium' ? 'Прикрепить файл' : 'Доступно только в Premium'}
            disabled={disabled || isUploading}
            onClick={handleFileClick}
          >
            {isUploading ? (
              <div className="w-4 h-4 animate-spin border-2 border-gray-300 border-t-gray-600 rounded-full" />
            ) : (
              <Paperclip className="w-4 h-4" />
            )}
          </button>
          
          {/* Emoji picker button */}
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="Эмодзи"
            disabled={disabled}
            onClick={() => setShowEmoji((v) => !v)}
          >
            <Smile className="w-4 h-4" />
          </button>
          
          {/* Send button */}
          <Button
            type="button"
            variant="primary"
            className="p-2 rounded-full"
            onClick={handleSendMessage}
            disabled={!canSend}
            title="Отправить (Enter)"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Keyboard shortcuts help */}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          <span>Enter - отправить</span>
          <span>Shift+Enter - новая строка</span>
          {isTyping && <span className="text-blue-500 animate-pulse">Печатаете...</span>}
        </div>
      </div>

      {/* Emoji picker popover */}
      {showEmoji && (
        <div className="absolute bottom-full left-4 mb-2 z-10">
          <div className="bg-white border rounded-lg shadow-lg p-3">
            <div className="grid grid-cols-6 gap-2">
              {['😊', '😂', '😍', '🔥', '👍', '❤️', '😮', '😢', '😡', '🎉', '💯', '🚀'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="text-xl hover:bg-gray-100 p-1 rounded"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* File input (hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        accept="image/*,text/*,.pdf,.doc,.docx"
      />

      {/* Upload error */}
      {uploadError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {uploadError}
        </div>
      )}
    </div>
  );
});

export default MessageInput;