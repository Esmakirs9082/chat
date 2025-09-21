import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Filter,
  RotateCcw,
  Heart,
  Calendar,
  TrendingUp,
  User,
  Users,
  Gamepad2,
  Sparkles,
  BookOpen,
  Sword,
  Coffee,
  Music,
} from 'lucide-react';
import { cn } from '../../utils';
import Button from '../ui/Button';
import Input from '../ui/Input';

// Типы фильтров
export interface CharacterFilters {
  search?: string;
  categories?: string[];
  tags?: string[];
  rating?: number; // минимальный рейтинг
  isNSFW?: boolean;
  sortBy?: 'popular' | 'recent' | 'rating' | 'alphabetical';
  timeFilter?: 'all' | 'today' | 'week' | 'month';
  creatorFilter?: 'all' | 'mine' | 'following';
}

interface CharacterFiltersProps {
  filters: CharacterFilters;
  onFiltersChange: (filters: CharacterFilters) => void;
  onClose?: () => void;
  isMobile?: boolean;
  className?: string;
}

// Категории с иконками
const categories = [
  { id: 'romance', name: 'Романтика', icon: Heart, color: 'text-pink-600' },
  { id: 'fantasy', name: 'Фэнтези', icon: Sparkles, color: 'text-purple-600' },
  { id: 'anime', name: 'Аниме', icon: BookOpen, color: 'text-blue-600' },
  { id: 'gaming', name: 'Игры', icon: Gamepad2, color: 'text-green-600' },
  {
    id: 'adventure',
    name: 'Приключения',
    icon: Sword,
    color: 'text-orange-600',
  },
  {
    id: 'slice-of-life',
    name: 'Повседневность',
    icon: Coffee,
    color: 'text-amber-600',
  },
  { id: 'music', name: 'Музыка', icon: Music, color: 'text-indigo-600' },
  { id: 'sci-fi', name: 'Sci-Fi', icon: Users, color: 'text-cyan-600' },
];

// Популярные теги
const popularTags = [
  { name: 'дружелюбный', color: 'bg-green-100 text-green-700' },
  { name: 'умный', color: 'bg-blue-100 text-blue-700' },
  { name: 'загадочный', color: 'bg-purple-100 text-purple-700' },
  { name: 'веселый', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'серьезный', color: 'bg-gray-100 text-gray-700' },
  { name: 'креативный', color: 'bg-pink-100 text-pink-700' },
  { name: 'мудрый', color: 'bg-indigo-100 text-indigo-700' },
  { name: 'энергичный', color: 'bg-orange-100 text-orange-700' },
];

// Варианты сортировки
const sortOptions = [
  { value: 'popular', label: 'Популярные', icon: TrendingUp },
  { value: 'recent', label: 'Недавние', icon: Calendar },
  { value: 'rating', label: 'По рейтингу', icon: Star },
  { value: 'alphabetical', label: 'По алфавиту', icon: BookOpen },
];

const CharacterFilters: React.FC<CharacterFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
  isMobile = false,
  className,
}) => {
  const [localFilters, setLocalFilters] = useState<CharacterFilters>(filters);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['search', 'categories', 'sort'])
  );

  // Синхронизация с внешними фильтрами
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Подсчет активных фильтров
  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.search) count++;
    if (localFilters.categories?.length)
      count += localFilters.categories.length;
    if (localFilters.tags?.length) count += localFilters.tags.length;
    if (localFilters.rating && localFilters.rating > 0) count++;
    if (localFilters.isNSFW) count++;
    if (localFilters.timeFilter && localFilters.timeFilter !== 'all') count++;
    if (localFilters.creatorFilter && localFilters.creatorFilter !== 'all')
      count++;
    return count;
  };

  const activeCount = getActiveFiltersCount();

  // Обработчики
  const handleFilterChange = (newFilters: Partial<CharacterFilters>) => {
    const updated = { ...localFilters, ...newFilters };
    setLocalFilters(updated);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleClearAll = () => {
    const clearedFilters: CharacterFilters = {
      search: '',
      categories: [],
      tags: [],
      rating: 0,
      isNSFW: false,
      sortBy: 'popular',
      timeFilter: 'all',
      creatorFilter: 'all',
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const handleCancel = () => {
    setLocalFilters(filters);
    if (onClose) onClose();
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const isExpanded = (section: string) => expandedSections.has(section);

  // Компонент секции
  const FilterSection: React.FC<{
    id: string;
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
  }> = ({ id, title, children, defaultExpanded = false }) => {
    const expanded = isExpanded(id);

    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-gray-900">{title}</span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expanded && <div className="px-4 pb-4">{children}</div>}
      </div>
    );
  };

  // Компонент тега
  const TagChip: React.FC<{
    name: string;
    color: string;
    active: boolean;
    onClick: () => void;
  }> = ({ name, color, active, onClick }) => (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
        active ? 'bg-blue-500 text-white' : color
      )}
    >
      {name}
    </button>
  );

  // Компонент рейтинга
  const RatingFilter: React.FC = () => (
    <div className="space-y-2">
      {[4, 3, 2, 1, 0].map((rating) => (
        <label
          key={rating}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="radio"
            name="rating"
            value={rating}
            checked={localFilters.rating === rating}
            onChange={() => handleFilterChange({ rating })}
            className="w-4 h-4 text-blue-600"
          />
          <div className="flex items-center space-x-1">
            {rating > 0 && (
              <>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{rating}+ звёзд</span>
              </>
            )}
            {rating === 0 && (
              <span className="text-sm text-gray-600">Все рейтинги</span>
            )}
          </div>
        </label>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        'bg-white flex flex-col',
        isMobile
          ? 'fixed inset-x-0 bottom-0 top-20 z-50 rounded-t-2xl shadow-2xl'
          : 'w-80 border-r border-gray-200',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Фильтры</h2>
          {activeCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filters Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Search Section */}
        <FilterSection id="search" title="Поиск">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Поиск персонажей..."
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </FilterSection>

        {/* Categories Section */}
        <FilterSection id="categories" title="Категории">
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = localFilters.categories?.includes(category.id);

              return (
                <label
                  key={category.id}
                  className={cn(
                    'flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all',
                    isActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => {
                      const categories = localFilters.categories || [];
                      const updated = isActive
                        ? categories.filter((c) => c !== category.id)
                        : [...categories, category.id];
                      handleFilterChange({ categories: updated });
                    }}
                    className="sr-only"
                  />
                  <Icon className={cn('w-4 h-4', category.color)} />
                  <span className="text-sm font-medium">{category.name}</span>
                </label>
              );
            })}
          </div>
        </FilterSection>

        {/* Tags Section */}
        <FilterSection id="tags" title="Популярные теги">
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <TagChip
                key={tag.name}
                name={tag.name}
                color={tag.color}
                active={localFilters.tags?.includes(tag.name) || false}
                onClick={() => {
                  const tags = localFilters.tags || [];
                  const updated = tags.includes(tag.name)
                    ? tags.filter((t) => t !== tag.name)
                    : [...tags, tag.name];
                  handleFilterChange({ tags: updated });
                }}
              />
            ))}
          </div>
        </FilterSection>

        {/* Rating Section */}
        <FilterSection id="rating" title="Рейтинг">
          <RatingFilter />
        </FilterSection>

        {/* NSFW Section */}
        <FilterSection id="nsfw" title="Контент 18+">
          <label className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={localFilters.isNSFW || false}
                onChange={(e) =>
                  handleFilterChange({ isNSFW: e.target.checked })
                }
                className="sr-only"
              />
              <div
                className={cn(
                  'w-12 h-6 rounded-full transition-colors',
                  localFilters.isNSFW ? 'bg-red-500' : 'bg-gray-300'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full bg-white shadow-md transition-transform mt-0.5',
                    localFilters.isNSFW ? 'translate-x-6' : 'translate-x-0.5'
                  )}
                />
              </div>
            </div>
            <span className="text-sm">Показывать контент для взрослых</span>
          </label>
        </FilterSection>

        {/* Sort Section */}
        <FilterSection id="sort" title="Сортировка">
          <div className="space-y-2">
            {sortOptions.map((option) => {
              const Icon = option.icon;
              return (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={localFilters.sortBy === option.value}
                    onChange={() =>
                      handleFilterChange({ sortBy: option.value as any })
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{option.label}</span>
                </label>
              );
            })}
          </div>
        </FilterSection>

        {/* Time Filter Section */}
        <FilterSection id="time" title="Период">
          <div className="space-y-2">
            {[
              { value: 'all', label: 'Все время' },
              { value: 'today', label: 'Сегодня' },
              { value: 'week', label: 'На этой неделе' },
              { value: 'month', label: 'В этом месяце' },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="timeFilter"
                  value={option.value}
                  checked={
                    localFilters.timeFilter === option.value ||
                    (option.value === 'all' && !localFilters.timeFilter)
                  }
                  onChange={() =>
                    handleFilterChange({ timeFilter: option.value as any })
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Creator Filter Section */}
        <FilterSection id="creator" title="Авторы">
          <div className="space-y-2">
            {[
              { value: 'all', label: 'Все авторы', icon: Users },
              { value: 'mine', label: 'Мои персонажи', icon: User },
              { value: 'following', label: 'Подписки', icon: Heart },
            ].map((option) => {
              const Icon = option.icon;
              return (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="creatorFilter"
                    value={option.value}
                    checked={
                      localFilters.creatorFilter === option.value ||
                      (option.value === 'all' && !localFilters.creatorFilter)
                    }
                    onChange={() =>
                      handleFilterChange({ creatorFilter: option.value as any })
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{option.label}</span>
                </label>
              );
            })}
          </div>
        </FilterSection>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="flex items-center space-x-2 flex-1"
            disabled={activeCount === 0}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Очистить</span>
          </Button>

          {isMobile ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                variant="primary"
                onClick={handleApplyFilters}
                className="flex-1"
              >
                Применить
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={handleApplyFilters}
              className="flex-1"
            >
              Применить фильтры
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterFilters;
