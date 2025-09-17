import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Filter, 
  Grid3X3, 
  List, 
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Users,
  Heart,
  Flame,
  Crown,
  Zap
} from 'lucide-react';
import { CharacterGallery, CharacterFilters } from '../components/character';
import { Button, Input, Badge } from '../components/ui';
import { useCharacterStore } from '../stores/characterStore';
import { cn } from '../utils';

const CharactersPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'name' | 'rating'>('popular');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { 
    characters, 
    filteredCharacters, 
    searchQuery: currentSearchQuery, 
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    showNsfw,
    toggleNsfw,
    isLoading 
  } = useCharacterStore();

  // Получаем все доступные теги
  const availableTags = Array.from(
    new Set(characters.flatMap(char => char.tags))
  ).sort();

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleClearAllFilters = () => {
    setSelectedTags([]);
    setLocalSearchQuery('');
    setSearchQuery('');
  };

  // Статистика для быстрых фильтров
  const stats = {
    total: characters.length,
    nsfw: characters.filter(c => c.isNsfw).length,
    popular: characters.filter(c => c.tags.includes('popular')).length,
    new: characters.filter(c => c.tags.includes('new')).length,
  };

  useEffect(() => {
    setSearchQuery(localSearchQuery);
  }, [localSearchQuery, setSearchQuery]);

  const handleCreateCharacter = () => {
    setShowCreateModal(true);
    // TODO: Открыть CharacterCreator modal
    console.log('Opening CharacterCreator...');
  };

  const quickFilters = [
    {
      label: 'Популярные',
      icon: Flame,
      count: stats.popular,
      color: 'text-orange-600 bg-orange-100',
      onClick: () => {
        // TODO: Применить фильтр популярных
      }
    },
    {
      label: 'Новые',
      icon: Zap,
      count: stats.new,
      color: 'text-blue-600 bg-blue-100',
      onClick: () => {
        // TODO: Применить фильтр новых
      }
    },
    {
      label: 'Избранные',
      icon: Heart,
      count: 0, // TODO: Получить из store
      color: 'text-red-600 bg-red-100',
      onClick: () => {
        // TODO: Показать избранных
      }
    },
    {
      label: 'Премиум',
      icon: Crown,
      count: characters.filter(c => c.tags.includes('premium')).length,
      color: 'text-purple-600 bg-purple-100',
      onClick: () => {
        // TODO: Показать премиум персонажей
      }
    }
  ];

  const sortOptions = [
    { value: 'popular', label: 'По популярности' },
    { value: 'newest', label: 'Сначала новые' },
    { value: 'name', label: 'По алфавиту' },
    { value: 'rating', label: 'По рейтингу' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Filter Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen">
        {/* Filters Sidebar */}
        <div className={cn(
          "flex flex-col bg-white border-r border-gray-200 z-50 transition-all duration-300",
          "lg:relative lg:translate-x-0",
          sidebarOpen 
            ? "fixed inset-y-0 left-0 w-80 translate-x-0" 
            : "fixed inset-y-0 left-0 w-80 -translate-x-full lg:w-80 lg:translate-x-0"
        )}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Персонажи</h1>
                <p className="text-sm text-gray-500">{stats.total} доступно</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-2 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Быстрые фильтры</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickFilters.map((filter) => (
                <button
                  key={filter.label}
                  onClick={filter.onClick}
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                >
                  <div className={cn("p-2 rounded-lg", filter.color)}>
                    <filter.icon className="w-4 h-4" />
                  </div>
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium text-gray-900">{filter.label}</p>
                    <p className="text-xs text-gray-500">{filter.count}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="flex-1 overflow-y-auto">
            <CharacterFilters 
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              onClearAll={handleClearAllFilters}
              showNsfw={showNsfw}
              onNsfwToggle={toggleNsfw}
            />
          </div>

          {/* Create Character Button */}
          <div className="p-6 border-t border-gray-200">
            <Button 
              onClick={handleCreateCharacter}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать персонажа
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </Button>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Поиск персонажей..."
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    className="pl-10 pr-4 w-64 sm:w-80"
                  />
                </div>

                {/* Results Count */}
                <div className="hidden sm:flex items-center text-sm text-gray-600">
                  <span>Найдено: </span>
                  <Badge variant="default" className="ml-1">
                    {filteredCharacters.length}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "px-3 py-2 text-sm font-medium transition-colors",
                      viewMode === 'grid'
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "px-3 py-2 text-sm font-medium transition-colors",
                      viewMode === 'list'
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Character Gallery */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <CharacterGallery viewMode={viewMode} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={handleCreateCharacter}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 lg:hidden z-30"
        title="Создать персонажа"
      >
        <Plus className="w-6 h-6 mx-auto" />
      </button>

      {/* Character Creator Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Создать персонажа</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateModal(false)}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  CharacterCreator
                </h3>
                <p className="text-gray-600 mb-6">
                  Компонент создания персонажа будет добавлен следующим этапом
                </p>
                <Button onClick={() => setShowCreateModal(false)}>
                  Понятно
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharactersPage;