import React, { useEffect, useState } from 'react';
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
      playful: ['что-то придумывает', 'сочиняет', 'печатает']
    };
    
    const phraseList = phrases[personality];
    const randomPhrase = phraseList[Math.floor(Math.random() * phraseList.length)];
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
                        transitionDelay: `${dotIndex * 100}ms`
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

      <style jsx>{`
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