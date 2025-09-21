import React, { useEffect, useState, useRef, useCallback } from 'react';
import { cn } from '../../utils';

interface TypingIndicatorProps {
  characterName: string;
  isTyping: boolean;
  avatar?: string;
  personality?: 'friendly' | 'mysterious' | 'professional' | 'playful';
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  characterName,
  isTyping,
  avatar,
  personality = 'friendly',
  className,
}) => {
  const [dotCount, setDotCount] = useState(1);

  // Анимация точек: . -> .. -> ... -> . (repeat)
  useEffect(() => {
    if (!isTyping) {
      setDotCount(1);
      return;
    }

    const interval = setInterval(() => {
      setDotCount((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 500);

    return () => clearInterval(interval);
  }, [isTyping]);

  // Персонализированные фразы в зависимости от personality
  const getTypingText = () => {
    const phrases = {
      friendly: ['печатает', 'набирает ответ', 'отвечает'],
      mysterious: ['думает', 'размышляет', 'обдумывает ответ'],
      professional: ['печатает', 'формулирует ответ', 'готовит ответ'],
      playful: ['что-то придумывает', 'сочиняет', 'печатает'],
    };

    const phraseList = phrases[personality];
    const randomPhrase =
      phraseList[Math.floor(Math.random() * phraseList.length)];
    return `${characterName} ${randomPhrase}`;
  };

  if (!isTyping) return null;

  return (
    <div
      className={cn(
        'fixed bottom-20 left-4 right-4 z-50',
        'transition-all duration-300 ease-in-out',
        'animate-fade-in',
        className
      )}
      style={{
        animation: isTyping ? 'fadeIn 0.3s ease-out' : 'fadeOut 0.3s ease-out',
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-2xl border border-gray-700/50">
          <div className="flex items-center space-x-3">
            {/* Character Avatar */}
            <div className="flex-shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt={characterName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {characterName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Typing Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <span className="text-white/90 text-sm font-medium truncate">
                  {getTypingText()}
                </span>

                {/* Animated Dots */}
                <div className="flex items-center space-x-0.5 ml-1">
                  {[1, 2, 3].map((dotIndex) => (
                    <span
                      key={dotIndex}
                      className={cn(
                        'inline-block w-1 h-1 rounded-full bg-white/70 transition-opacity duration-300',
                        dotIndex <= dotCount ? 'opacity-100' : 'opacity-30'
                      )}
                      style={{
                        transitionDelay: `${dotIndex * 100}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Pulse animation indicator */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(10px);
          }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;

// Hook для управления состоянием индикатора печатания
export const useTypingIndicator = (autoHideTimeout: number = 3000) => {
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTyping = useCallback(() => {
    setIsTyping(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, autoHideTimeout);
  }, [autoHideTimeout]);

  const hideTyping = useCallback(() => {
    setIsTyping(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const toggleTyping = useCallback(() => {
    if (isTyping) {
      hideTyping();
    } else {
      showTyping();
    }
  }, [isTyping, showTyping, hideTyping]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isTyping,
    showTyping,
    hideTyping,
    toggleTyping,
  };
};

// Компонент для отображения множественных индикаторов печатания
interface MultipleTypingIndicatorProps {
  typingUsers: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  maxVisible?: number;
  className?: string;
}

export const MultipleTypingIndicator: React.FC<
  MultipleTypingIndicatorProps
> = ({ typingUsers, maxVisible = 3, className = '' }) => {
  if (typingUsers.length === 0) return null;

  const visibleUsers = typingUsers.slice(0, maxVisible);
  const hiddenCount = typingUsers.length - maxVisible;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].name} печатает...`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].name} и ${typingUsers[1].name} печатают...`;
    } else {
      return `${visibleUsers.map((u) => u.name).join(', ')}${hiddenCount > 0 ? ` и еще ${hiddenCount}` : ''} печатают...`;
    }
  };

  return (
    <div
      className={`flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg ${className}`}
    >
      <div className="flex -space-x-1">
        {visibleUsers.map((user) => (
          <div
            key={user.id}
            className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">{getTypingText()}</span>
        <div className="flex space-x-1">
          <div
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </div>
  );
};
