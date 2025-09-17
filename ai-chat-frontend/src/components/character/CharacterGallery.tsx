import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useCharacterStore } from '../../stores/characterStore';
import { CharacterCard, CharacterFilters } from '../character';
import { Badge, Button } from '../ui';
import { Character } from '../../types';
import { cn, debounce } from '../../utils';

interface CharacterGalleryProps {
  className?: string;
  onCharacterSelect?: (character: Character) => void;
  viewMode?: 'grid' | 'list';
  itemsPerPage?: number;
}

const CharacterGallery: React.FC<CharacterGalleryProps> = ({
  className,
  onCharacterSelect,
  viewMode: initialViewMode = 'grid',
  itemsPerPage = 20,
}) => {
  const {
    filteredCharacters,
    searchQuery,
    selectedTags,
    showNsfw,
    isLoading,
    error,
    setSearchQuery,
    setSelectedTags,
    toggleNsfw,
    fetchCharacters,
    clearError,
  } = useCharacterStore();

  const [viewMode, setViewMode] = useState(initialViewMode);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Debounced search
  const debouncedSetSearch = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
      setCurrentPage(1); // Сброс пагинации при поиске
    }, 300),
    [setSearchQuery]
  );

  // Обновление поиска
  useEffect(() => {
    debouncedSetSearch(searchInput);
  }, [searchInput, debouncedSetSearch]);

  // Загрузка персонажей при монтировании
  useEffect(() => {
    if (filteredCharacters.length === 0 && !isLoading) {
      fetchCharacters();
    }
  }, [filteredCharacters.length, isLoading, fetchCharacters]);

  // Infinite scroll logic
  const displayedCharacters = useMemo(() => {
    return filteredCharacters.slice(0, currentPage * itemsPerPage);
  }, [filteredCharacters, currentPage, itemsPerPage]);

  const hasMoreCharacters = filteredCharacters.length > displayedCharacters.length;

  // Infinite scroll handler
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMoreCharacters) {
      setCurrentPage(prev => prev + 1);
    }
  }, [isLoading, hasMoreCharacters]);

  // Intersection Observer для infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMoreCharacters && !isLoading) {
          handleLoadMore();
        }
      },
      { threshold: 1.0, rootMargin: '100px' }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [handleLoadMore, hasMoreCharacters, isLoading]);

  // Получение всех доступных тегов
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    filteredCharacters.forEach(char => {
      char.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [filteredCharacters]);

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setSelectedTags([]);
    setCurrentPage(1);
  };

  const activeFiltersCount = selectedTags.length + (searchQuery ? 1 : 0);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ошибка загрузки</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => { clearError(); fetchCharacters(); }}>
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header с поиском и фильтрами */}
      <div className="bg-white border-b border-gray-200 p-4 space-y-4">
        {/* Основная панель управления */}
        <div className="flex items-center justify-between gap-4">
          {/* Поиск */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Поиск персонажей..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Управляющие кнопки */}
          <div className="flex items-center space-x-2">
            {/* Фильтры */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters || activeFiltersCount > 0 ? 'primary' : 'secondary'}
              className="relative"
            >
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
              {activeFiltersCount > 0 && (
                <Badge 
                  variant="default" 
                  className="absolute -top-2 -right-2 min-w-[20px] h-5 text-xs flex items-center justify-center"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {/* NSFW toggle */}
            <Button
              onClick={toggleNsfw}
              variant={showNsfw ? 'danger' : 'ghost'}
              title={showNsfw ? 'Скрыть контент 18+' : 'Показать контент 18+'}
            >
              18+
            </Button>

            {/* View mode toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                )}
                title="Сетка"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                )}
                title="Список"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Расширенные фильтры */}
        {showFilters && (
          <CharacterFilters
            availableTags={availableTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            onClearAll={clearFilters}
            showNsfw={showNsfw}
            onNsfwToggle={toggleNsfw}
          />
        )}

        {/* Активные фильтры */}
        {(selectedTags.length > 0 || searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Активные фильтры:</span>
            
            {searchQuery && (
              <Badge variant="default" className="flex items-center gap-1">
                Поиск: "{searchQuery}"
                <button 
                  onClick={() => setSearchInput('')}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Badge>
            )}

            {selectedTags.map(tag => (
              <Badge key={tag} variant="default" className="flex items-center gap-1">
                {tag}
                <button 
                  onClick={() => handleTagToggle(tag)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Badge>
            ))}

            <Button size="sm" variant="ghost" onClick={clearFilters}>
              Очистить все
            </Button>
          </div>
        )}
      </div>

      {/* Основной контент */}
      <div className="flex-1 overflow-auto p-4">
        {/* Статистика */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Показано {displayedCharacters.length} из {filteredCharacters.length} персонажей
          </p>
          
          {filteredCharacters.length === 0 && searchQuery && (
            <Button variant="ghost" onClick={clearFilters}>
              Сбросить фильтры
            </Button>
          )}
        </div>

        {/* Сетка персонажей */}
        {filteredCharacters.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || selectedTags.length > 0 ? 'Ничего не найдено' : 'Нет персонажей'}
            </h3>
            <p className="text-gray-600 mb-4 max-w-md">
              {searchQuery || selectedTags.length > 0 
                ? 'Попробуйте изменить критерии поиска или фильтры'
                : 'Пока нет доступных персонажей. Попробуйте обновить страницу.'
              }
            </p>
            {(searchQuery || selectedTags.length > 0) && (
              <Button onClick={clearFilters}>
                Очистить фильтры
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className={cn(
              viewMode === 'grid'
                ? 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
                : 'space-y-2'
            )}>
              {displayedCharacters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  viewMode={viewMode}
                  onSelect={() => onCharacterSelect?.(character)}
                  onClick={() => onCharacterSelect?.(character)}
                />
              ))}
            </div>

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Загрузка...</span>
              </div>
            )}

            {/* Infinite scroll sentinel */}
            <div id="scroll-sentinel" className="h-4" />

            {/* Load more button (fallback для devices без intersection observer) */}
            {!isLoading && hasMoreCharacters && (
              <div className="flex justify-center py-8">
                <Button onClick={handleLoadMore} variant="secondary">
                  Загрузить еще ({filteredCharacters.length - displayedCharacters.length})
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CharacterGallery;