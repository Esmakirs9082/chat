import React from 'react';
import { X, Filter, Tag } from 'lucide-react';
import { Button, Badge } from '../ui';
import { cn } from '../../utils';

interface CharacterFiltersProps {
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
  showNsfw: boolean;
  onNsfwToggle: () => void;
  className?: string;
}

const CharacterFilters: React.FC<CharacterFiltersProps> = ({
  availableTags,
  selectedTags,
  onTagToggle,
  onClearAll,
  showNsfw,
  onNsfwToggle,
  className,
}) => {
  const hasActiveFilters = selectedTags.length > 0;

  return (
    <div className={cn('bg-gray-50 rounded-lg p-4 space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Фильтры</h3>
          {hasActiveFilters && (
            <Badge variant="default" size="sm">
              {selectedTags.length}
            </Badge>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            <X className="w-4 h-4 mr-1" />
            Очистить все
          </Button>
        )}
      </div>

      {/* Content Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 flex items-center">
          <span className="w-2 h-2 bg-amber-400 rounded-full mr-2" />
          Контент
        </h4>
        
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showNsfw}
              onChange={onNsfwToggle}
              className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">
              Показывать контент 18+
            </span>
          </label>
          
          {showNsfw && (
            <Badge variant="warning" size="sm">
              18+
            </Badge>
          )}
        </div>
      </div>

      {/* Tag Filters */}
      {availableTags.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            Теги и категории
          </h4>
          
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-full border transition-all duration-200',
                    isSelected
                      ? 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  )}
                >
                  {tag}
                  {isSelected && (
                    <span className="ml-1">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
          {selectedTags.length > 0 && (
            <div className="text-xs text-gray-500">
              Выбрано тегов: {selectedTags.length} из {availableTags.length}
            </div>
          )}
        </div>
      )}

      {/* Popular Tags */}
      {availableTags.length > 6 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Популярные теги
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {availableTags.slice(0, 6).map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={`popular-${tag}`}
                  onClick={() => onTagToggle(tag)}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-full border transition-all duration-200',
                    isSelected
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-700'
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="pt-3 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Активные фильтры:</span>
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedTags.map((tag) => (
                <button
                  key={`active-${tag}`}
                  onClick={() => onTagToggle(tag)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition-colors"
                >
                  {tag}
                  <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Filters State */}
      {availableTags.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            Фильтры недоступны
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Загрузите персонажей для отображения фильтров
          </p>
        </div>
      )}
    </div>
  );
};

export default CharacterFilters;