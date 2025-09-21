import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { Search, Filter, Star, Plus, RefreshCw } from 'lucide-react';
import { cn } from '../../utils';
import { useCharacterStore } from '../../stores/characterStore';
import { Character } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import CharacterCard from './CharacterCard';
import type { CharacterFilters } from './CharacterFilters';

interface CharacterGalleryProps {
  filters?: CharacterFilters;
  onCharacterSelect: (character: Character) => void;
  onViewProfile?: (character: Character) => void;
  className?: string;
}

// Компонент скелетона карточки
const CharacterCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border animate-pulse">
    <div className="aspect-[3/4] bg-gray-200 rounded-t-xl" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="flex items-center justify-between">
        <div className="h-3 bg-gray-200 rounded w-16" />
        <div className="h-6 bg-gray-200 rounded w-12" />
      </div>
    </div>
  </div>
);

// Компонент фильтр чипа
interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: 'default' | 'nsfw';
}

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  active,
  onClick,
  variant = 'default',
}) => (
  <button
    onClick={onClick}
    className={cn(
      'px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200',
      'border whitespace-nowrap',
      active
        ? variant === 'nsfw'
          ? 'bg-red-500 text-white border-red-500'
          : 'bg-blue-500 text-white border-blue-500'
        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
    )}
  >
    {label}
  </button>
);

// Главный компонент
const CharacterGallery: React.FC<CharacterGalleryProps> = ({
  filters: externalFilters,
  onCharacterSelect,
  onViewProfile,
  className,
}) => {
  const { characters, isLoading, loadCharacters } = useCharacterStore();

  // Простая имитация hasMore для пагинации
  const totalCount = 1000; // Мок данные общего количества

  // Локальные фильтры
  const [localFilters, setLocalFilters] = useState<CharacterFilters>({
    search: '',
    categories: [],
    tags: [],
    rating: 0,
    isNSFW: false,
    sortBy: 'popular',
    timeFilter: 'all',
    creatorFilter: 'all',
    ...externalFilters,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced поиск
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setLocalFilters((prev) => ({ ...prev, search: searchQuery }));
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Применение фильтров
  const filteredCharacters = useMemo(() => {
    let result = [...characters];

    // Поиск
    if (localFilters.search) {
      result = result.filter(
        (char) =>
          char.name
            .toLowerCase()
            .includes(localFilters.search!.toLowerCase()) ||
          char.description
            ?.toLowerCase()
            .includes(localFilters.search!.toLowerCase()) ||
          char.tags?.some((tag) =>
            tag.toLowerCase().includes(localFilters.search!.toLowerCase())
          )
      );
    }

    return result;
  }, [characters, localFilters]);

  // Простая имитация hasMore
  const hasMore = filteredCharacters.length < totalCount;

  // Infinite scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !hasMore || isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 200) {
      loadCharacters();
    }
  }, [hasMore, isLoading, loadCharacters]);

  // Pull to refresh (mobile)
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadCharacters({}); // force refresh
    } finally {
      setIsRefreshing(false);
    }
  }, [loadCharacters]);

  // Изначальная загрузка
  useEffect(() => {
    if (characters.length === 0) {
      loadCharacters();
    }
  }, []);

  // Создание персонажа
  const handleCreateCharacter = () => {
    // TODO: Открыть модал создания персонажа
    console.log('Создать персонажа');
  };

  // Категории для фильтров (mock данные)
  const categories = [
    'Аниме',
    'Фэнтези',
    'Sci-Fi',
    'Романтика',
    'Приключения',
    'Комедия',
  ];
  const sortOptions = [
    { value: 'popular', label: 'Популярные' },
    { value: 'newest', label: 'Новые' },
    { value: 'alphabetical', label: 'По алфавиту' },
  ];

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Search & Filters */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Поиск персонажей..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12"
          />

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded',
              'hover:bg-gray-100 transition-colors',
              showFilters && 'text-blue-600'
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Chips */}
        {showFilters && (
          <div className="space-y-3">
            {/* Categories */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Категории
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <FilterChip
                    key={category}
                    label={category}
                    active={
                      localFilters.categories?.includes(category) || false
                    }
                    onClick={() => {
                      setLocalFilters((prev) => ({
                        ...prev,
                        categories: prev.categories?.includes(category)
                          ? prev.categories.filter((c) => c !== category)
                          : [...(prev.categories || []), category],
                      }));
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Sort & NSFW */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-2">
                <FilterChip
                  label="18+"
                  active={localFilters.isNSFW || false}
                  onClick={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      isNSFW: !prev.isNSFW,
                    }))
                  }
                  variant="nsfw"
                />
              </div>

              <select
                value={localFilters.sortBy}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as any,
                  }))
                }
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {/* Pull to Refresh */}
        <div className="lg:hidden">
          <div
            className="flex justify-center py-4"
            style={{ transform: `translateY(${isRefreshing ? '0' : '-100%'})` }}
          >
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 text-blue-600 disabled:opacity-50"
            >
              <RefreshCw
                className={cn('w-4 h-4', isRefreshing && 'animate-spin')}
              />
              <span className="text-sm">Обновить</span>
            </button>
          </div>
        </div>

        {/* Featured Section */}
        {filteredCharacters.length > 0 && !localFilters.search && (
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2 fill-current" />
              Рекомендуемые
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
              {filteredCharacters.slice(0, 5).map((character: Character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onSelect={onCharacterSelect}
                  onViewProfile={onViewProfile}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Gallery */}
        <div className="p-4">
          {filteredCharacters.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6 xl:gap-8">
              {filteredCharacters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onSelect={onCharacterSelect}
                  onViewProfile={onViewProfile}
                />
              ))}

              {/* Loading Skeletons */}
              {isLoading &&
                Array.from({ length: 8 }).map((_, index) => (
                  <CharacterCardSkeleton key={`skeleton-${index}`} />
                ))}
            </div>
          ) : !isLoading ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Персонажи не найдены
              </h3>

              <p className="text-gray-500 mb-6 max-w-sm">
                {localFilters.search
                  ? `Не найдено персонажей по запросу "${localFilters.search}"`
                  : 'Попробуйте изменить фильтры или создайте своего персонажа'}
              </p>

              <Button
                variant="primary"
                onClick={handleCreateCharacter}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Создать персонажа</span>
              </Button>
            </div>
          ) : (
            /* Initial Loading */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6 xl:gap-8">
              {Array.from({ length: 12 }).map((_, index) => (
                <CharacterCardSkeleton key={`initial-skeleton-${index}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterGallery;
