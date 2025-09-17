import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
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
const CHARACTER_LIMITS = {
  FREE: 500,
  PREMIUM: 2000,
  UNLIMITED: -1, // -1 означает без ограничений
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
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Определяем лимит символов на основе подписки
  const getCharacterLimit = () => {
    if (!user) return CHARACTER_LIMITS.FREE;
    
  switch (subscription) {
      case 'premium':
        return CHARACTER_LIMITS.PREMIUM;
      default:
        return CHARACTER_LIMITS.FREE;
    }
  };

  const characterLimit = getCharacterLimit();
  const isOverLimit = characterLimit > 0 && message.length > characterLimit;
  const isNearLimit = characterLimit > 0 && message.length > characterLimit * 0.8;

  // Авто-изменение высоты textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 200; // Максимальная высота в пикселях
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, []);

  // Эффект для изменения высоты при изменении текста
  useEffect(() => {
    adjustTextareaHeight();
  }, [message, adjustTextareaHeight]);

  // Обработка отправки сообщения
  const handleSendMessage = useCallback(() => {
    const trimmedMessage = message.trim();
    
    if (!trimmedMessage || disabled || isOverLimit) return;
    
    onSendMessage(trimmedMessage);
    setMessage('');
    
    // Сброс высоты textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }, 0);
  }, [message, disabled, isOverLimit, onSendMessage]);

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

  // Emoji picker
  const [showEmoji, setShowEmoji] = useState(false);
  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  // File upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      // TODO: upload logic (replace with actual API)
      await new Promise((res) => setTimeout(res, 1200));
      setMessage((prev) => prev + ` [файл: ${file.name}]`);
    } catch (err) {
      setUploadError('Ошибка загрузки файла');
    } finally {
      setIsUploading(false);
    }
  };

  // Drag & drop
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadError(null);
      try {
        // TODO: upload logic
        await new Promise((res) => setTimeout(res, 1200));
        setMessage((prev) => prev + ` [файл: ${file.name}]`);
      } catch (err) {
        setUploadError('Ошибка загрузки файла');
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Индикация "печатает"
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    if (message.length > 0) {
      setTyping(true);
      // TODO: интеграция с Zustand/chatStore для глобального индикатора
    } else {
      setTyping(false);
    }
  }, [message]);

  // Обработка изменения текста
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (characterLimit > 0 && value.length > characterLimit) {
      setMessage(value.slice(0, characterLimit));
    } else {
      setMessage(value);
    }
  };

  // Динамический placeholder
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return `Сообщение для ${character.name}...`;
  };

  // Получаем цвет счетчика символов
  const getCounterColor = () => {
    if (isOverLimit) return 'text-red-600';
    if (isNearLimit) return 'text-amber-600';
    return 'text-gray-500';
  };

  const canSend = message.trim().length > 0 && !disabled && !isOverLimit && !isUploading;

  return (
    <div
      className={cn('bg-white border-t px-4 py-3', className)}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={disabled || isUploading}
        placeholder={getPlaceholder()}
        className="w-full resize-none rounded border px-3 py-2 text-sm focus:outline-none focus:ring"
        rows={1}
        maxLength={characterLimit > 0 ? characterLimit : undefined}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {/* Emoji picker popover */}
      {showEmoji && (
        <div className="absolute z-10 mt-2">
          {/* EmojiPicker должен быть реализован отдельно */}
          <div className="bg-white border rounded shadow p-2">
            <span onClick={() => handleEmojiSelect('😊')} className="cursor-pointer text-xl">😊</span>
            <span onClick={() => handleEmojiSelect('🔥')} className="cursor-pointer text-xl">🔥</span>
            <span onClick={() => handleEmojiSelect('👍')} className="cursor-pointer text-xl">👍</span>
            {/* ...добавьте больше эмодзи */}
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
      />
      {/* Дополнительные кнопки */}
      <div className="flex items-center space-x-2 pt-2">
        <button
          type="button"
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
          title="Прикрепить файл"
          disabled={disabled || isUploading}
          onClick={handleFileClick}
        >
          {isUploading ? <span className="animate-spin">⏳</span> : <Paperclip className="w-4 h-4" />}
        </button>
        <button
          type="button"
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
          title="Эмодзи (Ctrl+E)"
          disabled={disabled}
          onClick={() => setShowEmoji((v) => !v)}
        >
          <Smile className="w-4 h-4" />
        </button>
      </div>
      {/* Кнопка отправки */}
      <div className="pt-2">
        <Button
          type="button"
          variant="primary"
          className="ml-2"
          onClick={handleSendMessage}
          disabled={disabled || isOverLimit || !message.trim() || isUploading}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      {/* Информационная панель */}
      <div className="flex items-center justify-between mt-2 px-3">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>Enter - отправить</span>
          <span>•</span>
          <span>Shift+Enter - новая строка</span>
          <span>•</span>
          <span>Ctrl+E - эмодзи</span>
        </div>
        {/* Счетчик символов */}
        {characterLimit > 0 && (
          <div className={cn('text-xs font-medium', getCounterColor())}>
            {message.length}/{characterLimit}
            {isOverLimit && (
              <span className="ml-1 text-red-600">
                (превышен лимит)
              </span>
            )}
          </div>
        )}
      </div>
      {/* Предупреждение для free users */}
      {!subscription && isNearLimit && (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0">
              <svg className="w-4 h-4 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-amber-800">
                Близко к лимиту символов
              </h4>
              <p className="text-xs text-amber-700 mt-1">
                Обновитесь до Premium для увеличения лимита до {CHARACTER_LIMITS.PREMIUM} символов
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Ошибка превышения лимита */}
      {isOverLimit && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0">
              <svg className="w-4 h-4 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800">
                Превышен лимит символов
              </h4>
              <p className="text-xs text-red-700 mt-1">
                Сократите сообщение на {message.length - characterLimit} символов или обновитесь до Premium
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Ошибка загрузки файла */}
      {uploadError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {uploadError}
        </div>
      )}
      {/* Индикация "печатает" */}
      {typing && (
        <div className="mt-2 text-xs text-blue-500 animate-pulse">Печатаете...</div>
      )}
    </div>
  );
});

export default MessageInput;