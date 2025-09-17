# Character API Documentation

## Обзор
API для работы с персонажами предоставляет полный набор методов для создания, управления и взаимодействия с AI-персонажами в чат-приложении.

## Основные возможности

### Character CRUD Operations
- ✅ `getCharacters()` - Получение списка персонажей с фильтрами и пагинацией
- ✅ `getCharacter()` - Получение конкретного персонажа
- ✅ `createCharacter()` - Создание нового персонажа
- ✅ `updateCharacter()` - Обновление данных персонажа
- ✅ `deleteCharacter()` - Удаление персонажа

### Character Interactions
- ✅ `toggleFavorite()` - Добавление/удаление из избранного
- ✅ `getFavorites()` - Получение избранных персонажей
- ✅ `rateCharacter()` - Оценка персонажа (1-5 звезд)
- ✅ `reportCharacter()` - Жалоба на персонажа
- ✅ `getCharacterReviews()` - Получение отзывов

### Character Assets
- ✅ `uploadCharacterAvatar()` - Загрузка аватара
- ✅ `uploadCharacterImages()` - Загрузка дополнительных изображений
- ✅ `getCharacterStats()` - Получение статистики персонажа
- ✅ `deleteCharacterAvatar()` - Удаление аватара
- ✅ `deleteCharacterImage()` - Удаление изображения

### Search & Discovery
- ✅ `searchCharacters()` - Поиск персонажей по запросу
- ✅ `getFeaturedCharacters()` - Получение рекомендуемых персонажей
- ✅ `getTrendingCharacters()` - Получение популярных персонажей
- ✅ `getSimilarCharacters()` - Получение похожих персонажей
- ✅ `getCharactersByCategory()` - Персонажи по категории
- ✅ `getCharactersByCreator()` - Персонажи от создателя

### Advanced Features
- ✅ `getCharacterTags()` - Теги для автодополнения
- ✅ `getCharacterCategories()` - Доступные категории
- ✅ `cloneCharacter()` - Клонирование персонажа
- ✅ `exportCharacter()` - Экспорт в различные форматы
- ✅ `importCharacter()` - Импорт из файла

### Batch Operations
- ✅ `batchCharacterOperations` - Массовые операции:
  - `addMultipleToFavorites()`
  - `removeMultipleFromFavorites()`
  - `deleteMultiple()`
  - `updateMultipleCategories()`

### Utilities
- ✅ `CharacterLoader` - Класс для кэширования персонажей
- ✅ `getCancellableCharacterSearch()` - Отменяемый поиск
- ✅ `getCancellableCharacters()` - Отменяемая загрузка

## Примеры использования

### Основные операции

```typescript
import {
  getCharacters,
  createCharacter,
  searchCharacters,
  toggleFavorite
} from '../services/characterApi';

// Получение списка персонажей
const characters = await getCharacters(
  { category: 'anime', nsfw: false }, // фильтры
  1, // страница
  20 // лимит
);

// Создание персонажа
const newCharacter = await createCharacter({
  name: 'Sakura',
  description: 'Дружелюбная девушка из аниме',
  personality: ['дружелюбный', 'энергичный'],
  tags: ['аниме', 'школьница'],
  category: 'anime',
  nsfw: false
});

// Поиск персонажей
const searchResults = await searchCharacters(
  'девушка аниме', // запрос
  { category: 'anime' }, // фильтры
  'popularity', // сортировка
  1, // страница
  10 // лимит
);
```

### Работа с избранным

```typescript
import { toggleFavorite, getFavorites } from '../services/characterApi';

// Добавить/убрать из избранного
await toggleFavorite('character-id');

// Получить избранных
const favorites = await getFavorites();
```

### Загрузка файлов

```typescript
import { uploadCharacterAvatar } from '../services/characterApi';

// Загрузка аватара с прогрессом
const result = await uploadCharacterAvatar(
  'character-id',
  file,
  (progress) => console.log(`Прогресс: ${progress}%`)
);

console.log('Новый аватар:', result.avatarUrl);
```

### Кэширование с CharacterLoader

```typescript
import { characterLoader } from '../services/characterApi';

// Загрузка с кэшированием
const character = await characterLoader.loadCharacter('character-id');

// Предварительная загрузка
await characterLoader.preloadCharacters(['id1', 'id2', 'id3']);

// Очистка кэша
characterLoader.clearCache();
```

### Отменяемые запросы

```typescript
import { getCancellableCharacterSearch } from '../services/characterApi';

// Создаем отменяемый поиск
const search = getCancellableCharacterSearch({
  query: 'аниме девушка',
  filters: { category: 'anime' },
  page: 1
});

// Отменяем если нужно
search.cancel();

// Или ждем результат
try {
  const results = await search.promise;
  console.log('Результаты поиска:', results);
} catch (error) {
  if (error.message === 'Search cancelled') {
    console.log('Поиск отменен');
  }
}
```

### Экспорт и импорт

```typescript
import { exportCharacter, importCharacter } from '../services/characterApi';

// Экспорт персонажа
const exportResult = await exportCharacter('character-id', 'json');
window.open(exportResult.downloadUrl, '_blank');

// Импорт персонажа
const importedCharacter = await importCharacter(file, 'tavern');
console.log('Импортированный персонаж:', importedCharacter);
```

## Типы данных

### CharacterFilters
```typescript
interface CharacterFilters {
  category?: string;
  tags?: string[];
  nsfw?: boolean;
  gender?: 'male' | 'female' | 'other';
  ageRange?: 'young' | 'adult' | 'mature';
  personality?: string[];
  creator?: string;
  isPublic?: boolean;
}
```

### CharacterStats
```typescript
interface CharacterStats {
  messageCount: number;
  favoriteCount: number;
  rating: number;
  totalRatings: number;
  chatCount: number;
  createdAt: string;
  lastActiveAt?: string;
}
```

## Интеграция с backend

Все методы API готовы к интеграции с реальным backend. Необходимо:

1. ✅ Настроить базовый URL API в `src/services/api.ts`
2. ✅ Добавить аутентификацию (токены уже поддерживаются)
3. ✅ Настроить загрузку файлов на сервер
4. ✅ Реализовать WebSocket для real-time уведомлений

## Компоненты примеров

- ✅ `CharacterGalleryExample` - Галерея с поиском и фильтрами
- ✅ `CharacterFormExample` - Форма создания/редактирования персонажа

Все компоненты готовы к использованию и демонстрируют полный функционал API.