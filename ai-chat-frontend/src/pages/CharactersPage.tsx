import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Filter,
  X,
  Users,
  Heart,
  Flame,
  Crown,
  Zap,
  ChevronRight,
  Home,
} from 'lucide-react';
import {
  CharacterGallery,
  CharacterFilters,
  CharacterCreator,
} from '../components/character';
import type { CharacterFilters as CharacterFiltersType } from '../components/character/CharacterFilters';
import { Button } from '../components/ui';
import { useCharacterStore } from '../stores/characterStore';
import { useSettingsStore } from '../stores/settingsStore';
import AuthGuard from '../components/auth/AuthGuard';
import { cn } from '../utils';
import { Character } from '../types';

// Компонент Breadcrumbs
const Breadcrumbs: React.FC = () => (
  <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
    <Link
      to="/"
      className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors flex items-center"
    >
      <Home className="w-4 h-4 mr-1" />
      Главная
    </Link>
    <ChevronRight className="w-4 h-4" />
    <span className="text-gray-900 dark:text-gray-200 font-medium">
      Персонажи
    </span>
  </nav>
);

// Компонент Empty State
const EmptyState: React.FC<{ onCreateCharacter: () => void }> = ({
  onCreateCharacter,
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mb-8">
          <Users className="w-16 h-16 text-purple-500 dark:text-purple-400" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Создайте своего первого персонажа
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Персонажи — это ядро вашего опыта. Создайте уникальных компаньонов для
          увлекательных диалогов и историй.
        </p>

        <Button
          onClick={onCreateCharacter}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-4 text-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-6 h-6 mr-3" />
          Создать первого персонажа
        </Button>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Быстро и просто
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Создание персонажа займет всего несколько минут
            </p>
          </div>

          <div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Crown className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Уникальный характер
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Настройте личность и поведение под себя
            </p>
          </div>

          <div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Безграничные возможности
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              От друзей до наставников — любые роли
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент плавающей кнопки создания
const CreateCharacterFAB: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center group"
    title="Создать персонажа"
  >
    <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-200" />
  </button>
);

// Пагинация
const PaginationControls: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Назад
      </Button>

      <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
        Страница {currentPage} из {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Далее
      </Button>
    </div>
  );
};

const CharactersPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { theme } = useSettingsStore();
  const { characters, filteredCharacters, isLoading, loadCharacters } =
    useCharacterStore();

  const [filters, setFilters] = useState<CharacterFiltersType>({
    search: '',
    categories: [],
    tags: [],
    rating: 0,
    isNSFW: false,
    sortBy: 'popular',
    timeFilter: 'all',
    creatorFilter: 'all',
  });

  // Пагинация
  const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage);

  // Загрузка персонажей при маунте
  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  // Сброс пагинации при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFiltersChange = (newFilters: CharacterFiltersType) => {
    setFilters(newFilters);
  };

  const handleCreateCharacter = () => {
    setShowCreateModal(true);
  };

  const handleCharacterSelect = (character: Character) => {
    window.location.href = `/chat/character/${character.id}`;
  };

  const handleViewProfile = (character: Character) => {
    window.location.href = `/character/${character.id}`;
  };

  return (
    <AuthGuard requirePremium={false}>
      <div
        className={cn(
          'min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200',
          theme === 'dark' && 'dark'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Персонажи
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Найдите идеального собеседника из {characters.length} персонажей
              </p>
            </div>

            <div className="hidden lg:block">
              <Button
                onClick={handleCreateCharacter}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus className="w-5 h-5 mr-2" />
                Создать персонажа
              </Button>
            </div>

            <div className="lg:hidden">
              <Button
                onClick={() => setSidebarOpen(true)}
                variant="outline"
                className="w-full"
              >
                <Filter className="w-5 h-5 mr-2" />
                Фильтры
              </Button>
            </div>
          </div>

          <div className="flex gap-8">
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-8">
                <CharacterFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700"
                />
              </div>
            </div>

            {sidebarOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
                <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 shadow-xl lg:hidden overflow-y-auto">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Фильтры
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <CharacterFilters
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      onClose={() => setSidebarOpen(false)}
                      isMobile={true}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex-1 min-w-0">
              {filteredCharacters.length === 0 && !isLoading ? (
                <EmptyState onCreateCharacter={handleCreateCharacter} />
              ) : (
                <>
                  <CharacterGallery
                    filters={filters}
                    onCharacterSelect={handleCharacterSelect}
                    onViewProfile={handleViewProfile}
                    className="mb-8"
                  />

                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <CreateCharacterFAB onClick={handleCreateCharacter} />
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <CharacterCreator
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={(character) => {
                  console.log('Character created:', character);
                  setShowCreateModal(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default CharactersPage;
