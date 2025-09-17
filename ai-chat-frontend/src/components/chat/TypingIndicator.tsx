import React, { useEffect, useState } from 'react';
import { Avatar } from '../ui';
import { Character } from '../../types';
import { cn } from '../../utils';

interface TypingIndicatorProps {
  character: Character;
  isVisible?: boolean;
  timeout?: number; // время в миллисекундах до автоскрытия
  onTimeout?: () => void;
  className?: string;
  showAvatar?: boolean;
  variant?: 'bubble' | 'inline' | 'minimal';
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  character,
  isVisible = true,
  timeout = 10000, // 10 секунд по умолчанию
  onTimeout,
  className,
  showAvatar = true,
  variant = 'bubble',
}) => {
  const [visible, setVisible] = useState(isVisible);

  // Таймер для автоскрытия
  useEffect(() => {
    if (!isVisible) {
      setVisible(false);
      return;
    }

    setVisible(true);

    if (timeout > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onTimeout?.();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [isVisible, timeout, onTimeout]);

  // Smooth hide animation
  useEffect(() => {
    if (!isVisible && visible) {
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 300); // время для анимации исчезновения

      return () => clearTimeout(hideTimer);
    }
  }, [isVisible, visible]);

  if (!visible) return null;

  const renderTypingDots = () => (
    <div className="flex space-x-1">
      <div 
        className={cn(
          'w-2 h-2 rounded-full animate-bounce',
          variant === 'bubble' ? 'bg-gray-400' : 'bg-blue-500'
        )}
        style={{ animationDelay: '0ms' }}
      />
      <div 
        className={cn(
          'w-2 h-2 rounded-full animate-bounce',
          variant === 'bubble' ? 'bg-gray-400' : 'bg-blue-500'
        )}
        style={{ animationDelay: '150ms' }}
      />
      <div 
        className={cn(
          'w-2 h-2 rounded-full animate-bounce',
          variant === 'bubble' ? 'bg-gray-400' : 'bg-blue-500'
        )}
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );

  // Bubble variant (как сообщение)
  if (variant === 'bubble') {
    return (
      <div 
        className={cn(
          'flex items-start space-x-3 animate-fade-in',
          !isVisible && 'animate-fade-out',
          className
        )}
      >
        {showAvatar && (
          <Avatar
            src={character.avatar}
            fallback={character.name}
            size="sm"
            className="flex-shrink-0 mt-1"
          />
        )}
        
        <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100 max-w-xs">
          <div className="flex items-center space-x-2">
            {renderTypingDots()}
            <span className="text-xs text-gray-500 ml-2">
              {character.name} печатает...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant (в строке с аватаром)
  if (variant === 'inline') {
    return (
      <div 
        className={cn(
          'flex items-center space-x-2 text-sm text-blue-600 animate-fade-in',
          !isVisible && 'animate-fade-out',
          className
        )}
      >
        {showAvatar && (
          <Avatar
            src={character.avatar}
            fallback={character.name}
            size="xs"
            className="flex-shrink-0"
          />
        )}
        
        <div className="flex items-center space-x-2">
          {renderTypingDots()}
          <span className="font-medium">
            {character.name} печатает...
          </span>
        </div>
      </div>
    );
  }

  // Minimal variant (только текст и точки)
  return (
    <div 
      className={cn(
        'flex items-center space-x-2 text-xs text-gray-500 animate-fade-in',
        !isVisible && 'animate-fade-out',
        className
      )}
    >
      {renderTypingDots()}
      <span>
        {character.name} печатает...
      </span>
    </div>
  );
};

// Компонент для множественных пользователей (если понадобится)
interface MultipleTypingIndicatorProps {
  characters: Character[];
  isVisible?: boolean;
  timeout?: number;
  onTimeout?: () => void;
  className?: string;
  maxVisible?: number;
}

export const MultipleTypingIndicator: React.FC<MultipleTypingIndicatorProps> = ({
  characters,
  isVisible = true,
  timeout: _timeout = 10000,
  onTimeout: _onTimeout,
  className,
  maxVisible = 3,
}) => {
  if (!characters.length || !isVisible) return null;

  const visibleCharacters = characters.slice(0, maxVisible);
  const remainingCount = Math.max(0, characters.length - maxVisible);

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      
      <span className="text-xs text-gray-500">
        {visibleCharacters.length === 1 
          ? `${visibleCharacters[0].name} печатает...`
          : visibleCharacters.length === 2
          ? `${visibleCharacters[0].name} и ${visibleCharacters[1].name} печатают...`
          : `${visibleCharacters[0].name}, ${visibleCharacters[1].name} и еще ${remainingCount + 1} печатают...`
        }
      </span>
    </div>
  );
};

// Хук для управления состоянием typing indicator
export const useTypingIndicator = (timeout: number = 5000) => {
  const [isTyping, setIsTyping] = useState(false);

  const showTyping = () => {
    setIsTyping(true);
  };

  const hideTyping = () => {
    setIsTyping(false);
  };

  const toggleTyping = () => {
    setIsTyping(!isTyping);
  };

  // Автоскрытие через таймер
  useEffect(() => {
    if (isTyping && timeout > 0) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [isTyping, timeout]);

  return {
    isTyping,
    showTyping,
    hideTyping,
    toggleTyping,
  };
};

// Анимации для Tailwind
const _animations = `
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-fade-out {
  animation: fade-out 0.3s ease-out;
}
`;

export default TypingIndicator;