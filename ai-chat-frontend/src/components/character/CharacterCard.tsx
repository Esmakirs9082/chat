import React, { useState } from 'react';
import { Heart, MessageCircle, Eye, EyeOff } from 'lucide-react';
import { Character } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import { useCharacterStore } from '../../stores/characterStore';
import { useSettingsStore } from '../../stores/settingsStore';
import Button from '../ui/Button';

interface CharacterCardProps {
  character: Character;
  onSelect: () => void;
  showStats?: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onSelect,
  showStats = false,
}) => {
  const { user } = useAuthStore();
  const { favorites, toggleFavorite } = useCharacterStore();
  const { nsfwEnabled } = useSettingsStore();
  
  const [showNsfwWarning, setShowNsfwWarning] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isFavorite = favorites.includes(character.id);
  const shouldBlurNsfw = character.isNsfw && !nsfwEnabled;

  // Генерация инициалов для fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Обработка клика по карточке
  const handleCardClick = () => {
    if (character.isNsfw && !nsfwEnabled) {
      setShowNsfwWarning(true);
      return;
    }
    onSelect();
  };

  // Обработка клика по избранному
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    toggleFavorite(character.id);
  };

  // Закрытие NSFW предупреждения
  const handleNsfwWarningClose = () => {
    setShowNsfwWarning(false);
  };

  // Принятие NSFW контента
  const handleNsfwAccept = () => {
    setShowNsfwWarning(false);
    onSelect();
  };

  return (
    <>
      <div 
        className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
        onClick={handleCardClick}
      >
        {/* NSFW Badge */}
        {character.isNsfw && (
          <div className="absolute top-2 right-2 z-10">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              18+
            </span>
          </div>
        )}

        {/* Favorite Button */}
        {user && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 left-2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isFavorite 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-600 hover:text-red-500'
              }`}
            />
          </button>
        )}

        {/* Avatar */}
        <div className="relative aspect-[3/4] bg-gray-100">
          {!imageError && character.avatar ? (
            <img
              src={character.avatar}
              alt={character.name}
              className={`w-full h-full object-cover transition-all duration-200 ${
                shouldBlurNsfw ? 'blur-md' : ''
              }`}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <span className="text-2xl font-bold text-gray-600">
                {getInitials(character.name)}
              </span>
            </div>
          )}

          {/* Blur Overlay для NSFW */}
          {shouldBlurNsfw && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="text-white text-center">
                <EyeOff className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Контент 18+</p>
              </div>
            </div>
          )}

          {/* Chat Button - появляется при hover */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="w-full bg-white/90 text-gray-900 hover:bg-white"
              size="sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Начать чат
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Name */}
          <h3 className="font-semibold text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
            {character.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {character.description || 'Нет описания'}
          </p>

          {/* Tags */}
          {character.tags && character.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {character.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {tag}
                </span>
              ))}
              {character.tags.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-500">
                  +{character.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          {showStats && (
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center">
                <MessageCircle className="w-3 h-3 mr-1" />
                <span>{character.messageCount || 0} чатов</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-3 h-3 mr-1" />
                <span>{character.favoriteCount || 0}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NSFW Warning Modal */}
      {showNsfwWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-red-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Контент для взрослых
              </h3>
              
              <p className="text-sm text-gray-600 mb-6">
                Этот персонаж содержит контент для взрослых (18+). 
                Вы можете включить отображение такого контента в настройках.
              </p>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleNsfwWarningClose}
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button
                  onClick={handleNsfwAccept}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Продолжить
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CharacterCard;