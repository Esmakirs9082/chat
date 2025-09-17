import React, { useState, useEffect } from 'react';
import {
  getCharacters,
  getCharacter,
  searchCharacters,
  toggleFavorite,
  getFeaturedCharacters,
  uploadCharacterAvatar,
  getCharacterStats,
  characterLoader,
  type CharacterFilters,
  type CharacterStats
} from '../../services/characterApi';
import { Character } from '../../types';

// Пример компонента галереи персонажей
export const CharacterGalleryExample: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CharacterFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [characterStats, setCharacterStats] = useState<CharacterStats | null>(null);

  // Загрузка персонажей с пагинацией
  const loadCharacters = async (page: number = 1, newFilters?: CharacterFilters) => {
    try {
      setLoading(true);
      const response = await getCharacters(newFilters || filters, page, 12);
      setCharacters(response.data || []);
      setCurrentPage(page);
    } catch (error) {
      console.error('Ошибка загрузки персонажей:', error);
    } finally {
      setLoading(false);
    }
  };

  // Поиск персонажей
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadCharacters(1);
      return;
    }
    
    try {
      setLoading(true);
      const results = await searchCharacters(query, filters, 'relevance', 1, 12);
      setCharacters(results);
    } catch (error) {
      console.error('Ошибка поиска:', error);
    } finally {
      setLoading(false);
    }
  };

  // Просмотр деталей персонажа
  const handleCharacterSelect = async (character: Character) => {
    try {
      // Используем characterLoader для кэширования
      const detailedCharacter = await characterLoader.loadCharacter(character.id);
      setSelectedCharacter(detailedCharacter);
      
      // Загружаем статистику
      const stats = await getCharacterStats(character.id);
      setCharacterStats(stats);
    } catch (error) {
      console.error('Ошибка загрузки деталей:', error);
    }
  };

  // Добавление в избранное
  const handleToggleFavorite = async (characterId: string) => {
    try {
      await toggleFavorite(characterId);
      // Обновляем локальное состояние
      setCharacters(prev => prev.map(char => 
        char.id === characterId 
          ? { ...char, /* isFavorite: !char.isFavorite */ } // TODO: добавить поле isFavorite в тип Character
          : char
      ));
    } catch (error) {
      console.error('Ошибка добавления в избранное:', error);
    }
  };

  // Загрузка аватара
  const handleAvatarUpload = async (characterId: string, file: File) => {
    try {
      const result = await uploadCharacterAvatar(
        characterId, 
        file, 
        (progress) => console.log(`Прогресс загрузки: ${progress}%`)
      );
      
      // Обновляем аватар в локальном состоянии
      setCharacters(prev => prev.map(char => 
        char.id === characterId 
          ? { ...char, avatar: result.avatarUrl }
          : char
      ));
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
    }
  };

  // Применение фильтров
  const handleFilterChange = (newFilters: Partial<CharacterFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    loadCharacters(1, updatedFilters);
  };

  // Начальная загрузка
  useEffect(() => {
    loadCharacters();
  }, []);

  return (
    <div className="character-gallery">
      {/* Поиск */}
      <div className="search-section mb-6">
        <input
          type="text"
          placeholder="Поиск персонажей..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Фильтры */}
      <div className="filters-section mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Все категории</option>
            <option value="anime">Аниме</option>
            <option value="game">Игры</option>
            <option value="movie">Фильмы</option>
            <option value="original">Оригинальные</option>
          </select>

          <select
            value={filters.gender || ''}
            onChange={(e) => handleFilterChange({ gender: e.target.value as any || undefined })}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Любой пол</option>
            <option value="female">Женский</option>
            <option value="male">Мужской</option>
            <option value="other">Другой</option>
          </select>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.nsfw || false}
              onChange={(e) => handleFilterChange({ nsfw: e.target.checked })}
              className="mr-2"
            />
            NSFW контент
          </label>
        </div>
      </div>

      {/* Список персонажей */}
      <div className="characters-grid">
        {loading ? (
          <div className="loading">Загрузка персонажей...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map((character) => (
              <div
                key={character.id}
                className="character-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCharacterSelect(character)}
              >
                <div className="relative">
                  <img
                    src={character.avatar || '/placeholder-avatar.png'}
                    alt={character.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(character.id);
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full ${
                      false // character.isFavorite - TODO: добавить поле в тип Character
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    ♥
                  </button>
                  {character.tags?.includes('nsfw') && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                      NSFW
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{character.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {character.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {character.tags?.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно с деталями персонажа */}
      {selectedCharacter && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedCharacter.name}</h2>
              <button
                onClick={() => setSelectedCharacter(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <img
                  src={selectedCharacter.avatar || '/placeholder-avatar.png'}
                  alt={selectedCharacter.name}
                  className="w-48 h-48 object-cover rounded-lg"
                />
                
                {/* Загрузка нового аватара (только если пользователь - создатель) */}
                {false /* selectedCharacter.isOwner */ && ( // TODO: добавить поле isOwner в тип Character
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && selectedCharacter) {
                          handleAvatarUpload(selectedCharacter.id, file);
                        }
                      }}
                      className="text-sm"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <p className="text-gray-700 mb-4">{selectedCharacter.description}</p>
                
                {/* Статистика */}
                {characterStats && (
                  <div className="stats mb-4 p-4 bg-gray-100 rounded">
                    <h4 className="font-semibold mb-2">Статистика:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Сообщений: {characterStats.messageCount}</div>
                      <div>В избранном: {characterStats.favoriteCount}</div>
                      <div>Рейтинг: {characterStats.rating.toFixed(1)}/5</div>
                      <div>Чатов: {characterStats.chatCount}</div>
                    </div>
                  </div>
                )}
                
                {/* Теги */}
                <div className="tags mb-4">
                  <h4 className="font-semibold mb-2">Теги:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCharacter.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Черты характера */}
                {selectedCharacter.personality && (
                  <div className="personality">
                    <h4 className="font-semibold mb-2">Черты характера:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCharacter.personality.map((trait: any, index: number) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm"
                        >
                          {typeof trait === 'string' ? trait : trait.trait || trait.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Пагинация */}
      <div className="pagination mt-8 flex justify-center gap-2">
        <button
          onClick={() => loadCharacters(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Назад
        </button>
        <span className="px-4 py-2">Страница {currentPage}</span>
        <button
          onClick={() => loadCharacters(currentPage + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default CharacterGalleryExample;