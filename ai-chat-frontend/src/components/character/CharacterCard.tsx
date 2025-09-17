import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Avatar, Badge, Button } from '../ui';
import { Character } from '../../types';
import { useCharacterStore } from '../../stores/characterStore';
import { cn } from '../../utils';

interface CharacterCardProps {
  character: Character;
  viewMode?: 'grid' | 'list';
  onSelect?: () => void;
  onClick?: () => void;
  className?: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  viewMode = 'grid',
  onSelect,
  onClick,
  className,
}) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useCharacterStore();
  const isInFavorites = isFavorite(character.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInFavorites) {
      removeFromFavorites(character.id);
    } else {
      addToFavorites(character.id);
    }
  };

  const handleClick = () => {
    onClick?.();
    onSelect?.();
  };

  if (viewMode === 'list') {
    return (
      <div 
        className={cn(
          'bg-white rounded-lg border border-gray-200 p-4 transition-all duration-300 cursor-pointer group',
          'hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/25',
          'active:transform-none active:shadow-md',
          className
        )}
        onClick={handleClick}
      >
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0 relative">
            <Avatar
              src={character.avatar}
              fallback={character.name}
              size="md"
              className="ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-200"
            />
            {character.isNsfw && (
              <div className="absolute -top-1 -right-1">
                <Badge variant="warning" size="sm" className="shadow-sm text-xs">
                  18+
                </Badge>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-200">
                {character.name}
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-3 group-hover:text-gray-700 transition-colors duration-200">
              {character.description}
            </p>

            <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>Чат доступен</span>
              </div>
              {character.tags.length > 0 && (
                <div className="flex items-center space-x-1">
                  <span>•</span>
                  <span className="flex gap-1 flex-wrap">
                    {character.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                        #{tag}
                      </span>
                    ))}
                    {character.tags.length > 2 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                        +{character.tags.length - 2}
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleFavoriteToggle}
              className={cn(
                'p-2 rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95',
                isInFavorites
                  ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 shadow-sm'
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              )}
              title={isInFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
            >
              <Heart className={cn(
                'w-4 h-4 transition-all duration-200', 
                isInFavorites && 'fill-current'
              )} />
            </button>

            <Button 
              size="sm" 
              className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:transform-none"
              onClick={(e) => { 
                e.stopPropagation(); 
                handleClick(); 
              }}
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Чат
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      className={cn(
        'bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 cursor-pointer group',
        'hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/25 hover:-translate-y-1',
        'active:transform-none active:shadow-lg',
        className
      )}
      onClick={handleClick}
    >
      {/* Avatar Section */}
      <div className="relative p-6 pb-4 bg-gradient-to-br from-gray-50/50 to-white group-hover:from-blue-50/50 group-hover:to-purple-50/30 transition-all duration-300">
        <div className="flex justify-center">
          <div className="relative">
            <Avatar
              src={character.avatar}
              fallback={character.name}
              size="xl"
              className="ring-4 ring-white shadow-lg group-hover:ring-blue-100 group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
            />
            {/* Avatar glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/20 group-hover:to-purple-400/20 transition-all duration-300 blur-sm" />
          </div>
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavoriteToggle}
          className={cn(
            'absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300 backdrop-blur-sm',
            'transform hover:scale-110 active:scale-95',
            isInFavorites
              ? 'text-red-500 bg-red-50/90 hover:bg-red-100 hover:text-red-600 shadow-lg shadow-red-200/50'
              : 'text-gray-400 bg-white/90 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 hover:shadow-lg hover:shadow-red-200/25'
          )}
          title={isInFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <Heart className={cn(
            'w-4 h-4 transition-all duration-200',
            isInFavorites && 'fill-current animate-pulse'
          )} />
          {/* Heart glow effect */}
          {isInFavorites && (
            <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping" />
          )}
        </button>

        {/* NSFW Badge */}
        {character.isNsfw && (
          <div className="absolute top-4 left-4">
            <Badge 
              variant="warning" 
              size="sm"
              className="animate-pulse shadow-lg shadow-orange-200/50"
            >
              🔞 18+
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 pb-6 relative z-10">
        {/* Name */}
        <h3 className="font-bold text-lg text-gray-900 text-center mb-3 truncate group-hover:text-blue-700 transition-colors duration-200">
          {character.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 text-center line-clamp-3 mb-4 group-hover:text-gray-700 transition-colors duration-200 leading-relaxed">
          {character.description}
        </p>

        {/* Tags */}
        {character.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {character.tags.slice(0, 3).map((tag, index) => (
              <span
                key={tag}
                className={cn(
                  'px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-full transition-all duration-200',
                  'hover:bg-blue-100 hover:text-blue-700 group-hover:shadow-sm',
                  'transform group-hover:scale-105'
                )}
                style={{
                  transitionDelay: `${index * 50}ms`
                }}
              >
                #{tag}
              </span>
            ))}
            {character.tags.length > 3 && (
              <span className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-full group-hover:bg-blue-100 group-hover:text-blue-700 transition-all duration-200">
                +{character.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Personality traits */}
        {character.personality.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-5">
            {character.personality.slice(0, 2).map((trait, index) => (
              <span
                        key={trait.trait}
                className={cn(
                  'px-3 py-1.5 text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full',
                  'transition-all duration-300 transform group-hover:scale-105',
                  'hover:from-blue-200 hover:to-purple-200 hover:shadow-md'
                )}
                style={{
                  transitionDelay: `${(index + 3) * 50}ms`
                }}
              >
                        ✨ {trait.trait} ({trait.value})
              </span>
            ))}
          </div>
        )}

        {/* Action Button */}
        <Button 
          className={cn(
            'w-full relative overflow-hidden transition-all duration-300',
            'hover:shadow-lg hover:shadow-blue-200/50 hover:-translate-y-0.5',
            'group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600',
            'active:transform-none active:shadow-md'
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          <MessageCircle className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
          Начать чат
          
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out" />
        </Button>
      </div>

      {/* Enhanced Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/3 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none" />
      
      {/* Subtle border glow */}
      <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-gradient-to-r group-hover:from-blue-200/50 group-hover:to-purple-200/50 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

export default CharacterCard;