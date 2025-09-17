import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { Character } from '../types';
import { CharacterCreateForm } from '../types/forms';

// Интерфейс для фильтров
interface CharacterFilters {
  search: string;
  tags: string[];
  nsfwEnabled: boolean;
  sortBy: string;
}

// Интерфейс для пагинации
interface CharacterPagination {
  page: number;
  limit: number;
  total: number;
}

// Состояние store
interface CharacterState {
  characters: Character[];
  selectedCharacter: Character | null;
  favorites: string[];
  isLoading: boolean;
  filters: CharacterFilters;
  pagination: CharacterPagination;
  // Для обратной совместимости
  error: string | null;
  showNsfw: boolean;
  searchQuery: string;
  selectedTags: string[];
}

// Действия store
interface CharacterActions {
  loadCharacters: (filters?: Partial<CharacterFilters>) => Promise<void>;
  loadCharacter: (id: string) => Promise<Character>;
  createCharacter: (form: CharacterCreateForm) => Promise<Character>;
  updateCharacter: (id: string, updates: Partial<Character>) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  toggleFavorite: (characterId: string) => void;
  setFilters: (filters: Partial<CharacterFilters>) => void;
  setSelectedCharacter: (character: Character | null) => void;
  setPagination: (pagination: Partial<CharacterPagination>) => void;
  // Для обратной совместимости
  fetchCharacters: () => Promise<void>;
  addToFavorites: (characterId: string) => void;
  removeFromFavorites: (characterId: string) => void;
  toggleNsfw: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  clearError: () => void;
  isFavorite: (characterId: string) => boolean;
}

// Computed properties
interface CharacterComputed {
  filteredCharacters: Character[];
  favoriteCharacters: Character[];
}

export const useCharacterStore = create<CharacterState & CharacterActions & CharacterComputed>()(
  persist(
    immer((set, get) => ({
      // State
      characters: [],
      selectedCharacter: null,
      favorites: [],
      isLoading: false,
      filters: {
        search: '',
        tags: [],
        nsfwEnabled: false,
        sortBy: 'name'
      },
      pagination: {
        page: 1,
        limit: 20,
        total: 0
      },
      // Для обратной совместимости
      error: null,
      get showNsfw() { return get().filters.nsfwEnabled; },
      get searchQuery() { return get().filters.search; },
      get selectedTags() { return get().filters.tags; },

      // Computed properties
      get filteredCharacters() {
        const { characters, filters } = get();
        let filtered = [...characters];

        // Поиск по имени и описанию
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(char => 
            char.name.toLowerCase().includes(searchLower) ||
            char.description.toLowerCase().includes(searchLower)
          );
        }

        // Фильтр по тегам
        if (filters.tags.length > 0) {
          filtered = filtered.filter(char =>
            filters.tags.some(tag => char.tags.includes(tag))
          );
        }

        // Фильтр NSFW
        if (!filters.nsfwEnabled) {
          filtered = filtered.filter(char => !char.isNsfw);
        }

        // Сортировка
        switch (filters.sortBy) {
          case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'created':
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'popular':
            // TODO: Добавить поле popularity в Character
            break;
          default:
            break;
        }

        return filtered;
      },

      get favoriteCharacters() {
        const { characters, favorites } = get();
        return characters.filter(char => favorites.includes(char.id));
      },

      // Actions
      loadCharacters: async (filterUpdates?: Partial<CharacterFilters>) => {
        set({ isLoading: true });
        
        try {
          // Обновляем фильтры если переданы
          if (filterUpdates) {
            set((state) => {
              Object.assign(state.filters, filterUpdates);
            });
          }

          // TODO: Реальный API вызов
          // const response = await characterApi.getCharacters({
          //   ...get().filters,
          //   page: get().pagination.page,
          //   limit: get().pagination.limit
          // });
          
          // Мок данные для демонстрации
          const mockCharacters: Character[] = [
            {
              id: 'char-1',
              name: 'Алиса',
              description: 'Умная и дружелюбная AI помощница',
              avatar: undefined,
              personality: [
                { trait: 'дружелюбный', value: 5 },
                { trait: 'умный', value: 4 }
              ],
              isNsfw: false,
              tags: ['помощник', 'дружелюбный', 'popular'],
              createdAt: new Date(),
              isPublic: true,
              createdBy: 'system',
              messageCount: 156,
              favoriteCount: 89
            },
            {
              id: 'char-2',
              name: 'Мария',
              description: 'Креативный писатель и рассказчик',
              avatar: undefined,
              personality: [
                { trait: 'творческий', value: 5 },
                { trait: 'вдохновляющий', value: 4 }
              ],
              isNsfw: false,
              tags: ['писатель', 'творческий', 'featured'],
              createdAt: new Date(Date.now() - 86400000), // вчера
              isPublic: true,
              createdBy: 'system',
              messageCount: 234,
              favoriteCount: 67
            }
          ];

          set((state) => {
            state.characters = mockCharacters;
            state.pagination.total = mockCharacters.length;
          });

        } catch (error) {
          console.error('Failed to load characters:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      loadCharacter: async (id: string) => {
        set({ isLoading: true });
        
        try {
          // TODO: Реальный API вызов
          // const character = await characterApi.getCharacter(id);
          
          // Мок: ищем в локальном списке
          const character = get().characters.find(c => c.id === id);
          if (!character) {
            throw new Error('Character not found');
          }

          set({ selectedCharacter: character });
          return character;

        } catch (error) {
          console.error('Failed to load character:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      createCharacter: async (form: CharacterCreateForm) => {
        set({ isLoading: true });
        
        try {
          // TODO: Реальный API вызов
          // const character = await characterApi.createCharacter(form);
          
          // Мок создания персонажа
          const newCharacter: Character = {
            id: `char-${Date.now()}`,
            name: form.name,
            description: form.description,
            avatar: undefined, // TODO: обработка загрузки файла
            personality: [
              { trait: 'открытость', value: form.personality.openness },
              { trait: 'добросовестность', value: form.personality.conscientiousness },
              { trait: 'экстраверсия', value: form.personality.extraversion }
            ],
            isNsfw: form.isNsfw,
            tags: form.tags,
            createdAt: new Date(),
            isPublic: form.isPublic,
            createdBy: 'current-user', // TODO: получать из auth store
            messageCount: 0,
            favoriteCount: 0
          };

          set((state) => {
            state.characters.push(newCharacter);
            state.pagination.total += 1;
          });

          return newCharacter;

        } catch (error) {
          console.error('Failed to create character:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateCharacter: async (id: string, updates: Partial<Character>) => {
        set({ isLoading: true });
        
        try {
          // TODO: Реальный API вызов
          // await characterApi.updateCharacter(id, updates);
          
          set((state) => {
            const index = state.characters.findIndex((c: Character) => c.id === id);
            if (index !== -1) {
              Object.assign(state.characters[index], updates);
              
              // Обновляем выбранного персонажа если это он
              if (state.selectedCharacter && state.selectedCharacter.id === id) {
                Object.assign(state.selectedCharacter, updates);
              }
            }
          });

        } catch (error) {
          console.error('Failed to update character:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteCharacter: async (id: string) => {
        set({ isLoading: true });
        
        try {
          // TODO: Реальный API вызов
          // await characterApi.deleteCharacter(id);
          
          set((state) => {
            state.characters = state.characters.filter((c: Character) => c.id !== id);
            state.favorites = state.favorites.filter((fav: string) => fav !== id);
            state.pagination.total -= 1;
            
            // Сброс выбранного персонажа если это он
            if (state.selectedCharacter && state.selectedCharacter.id === id) {
              state.selectedCharacter = null;
            }
          });

        } catch (error) {
          console.error('Failed to delete character:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      toggleFavorite: (characterId: string) => {
        set((state) => {
          const index = state.favorites.indexOf(characterId);
          if (index === -1) {
            state.favorites.push(characterId);
          } else {
            state.favorites.splice(index, 1);
          }
        });
      },

      setFilters: (filterUpdates: Partial<CharacterFilters>) => {
        set((state) => {
          Object.assign(state.filters, filterUpdates);
          // Сброс пагинации при изменении фильтров
          state.pagination.page = 1;
        });
      },

      setSelectedCharacter: (character: Character | null) => {
        set({ selectedCharacter: character });
      },

      setPagination: (paginationUpdates: Partial<CharacterPagination>) => {
        set((state) => {
          Object.assign(state.pagination, paginationUpdates);
        });
      },

      // Методы для обратной совместимости
      fetchCharacters: async () => {
        return get().loadCharacters();
      },

      addToFavorites: (characterId: string) => {
        set((state) => {
          if (!state.favorites.includes(characterId)) {
            state.favorites.push(characterId);
          }
        });
      },

      removeFromFavorites: (characterId: string) => {
        set((state) => {
          state.favorites = state.favorites.filter((fav: string) => fav !== characterId);
        });
      },

      toggleNsfw: () => {
        set((state) => {
          state.filters.nsfwEnabled = !state.filters.nsfwEnabled;
        });
      },

      setSearchQuery: (query: string) => {
        set((state) => {
          state.filters.search = query;
          state.pagination.page = 1;
        });
      },

      setSelectedTags: (tags: string[]) => {
        set((state) => {
          state.filters.tags = tags;
          state.pagination.page = 1;
        });
      },

      clearError: () => {
        set({ error: null });
      },

      isFavorite: (characterId: string) => {
        return get().favorites.includes(characterId);
      }
    })),
    {
      name: 'character-store',
      partialize: (state) => ({
        favorites: state.favorites,
        filters: state.filters,
        pagination: state.pagination
      })
    }
  )
);