# localStorage Hooks Documentation

## useLocalStorage Hook

Базовый типизированный wrapper для localStorage с автоматической сериализацией JSON и SSR-безопасностью.

### Особенности
✅ **Типизация**: Полная поддержка TypeScript generic типов  
✅ **JSON**: Автоматическая сериализация/десериализация  
✅ **SSR Safe**: Проверка существования window  
✅ **Синхронизация**: Между вкладками через события  
✅ **Fallbacks**: Graceful handling ошибок  

### API
```typescript
useLocalStorage<T>(key: string, defaultValue: T): [
  value: T,
  setValue: (value: T | (prev: T) => T) => void,
  removeValue: () => void
]
```

### Пример использования
```typescript
const [user, setUser, removeUser] = useLocalStorage('user', { name: '', id: 0 });

// Обновление
setUser({ name: 'John', id: 1 });

// Функциональное обновление  
setUser(prev => ({ ...prev, name: 'Jane' }));

// Удаление
removeUser();
```

---

## useTheme Hook

Специализированный хук для управления темой приложения.

### Особенности
✅ **3 режима**: light, dark, system  
✅ **Auto-detect**: Системная тема через matchMedia  
✅ **DOM Integration**: Автоматическое обновление классов  
✅ **Toggle**: Циклическое переключение тем  

### API
```typescript
useTheme(): {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  removeTheme: () => void;
  isDark: boolean;
}
```

### Пример использования
```typescript
const { theme, setTheme, toggleTheme, isDark } = useTheme();

// Установка темы
setTheme('dark');

// Переключение: light → dark → system → light
toggleTheme();

// Проверка темной темы
if (isDark) {
  // Темная тема активна
}
```

---

## useChatHistory Hook

Управление историей чатов с персонажами.

### Особенности
✅ **Лимит**: Максимум 100 чатов  
✅ **Сортировка**: По времени (новые первые)  
✅ **Поиск**: По ID, характеру, тегам  
✅ **Обновление**: Автоматическое обновление timestamp  

### API
```typescript
useChatHistory(): {
  chatHistory: ChatHistoryItem[];
  addChatToHistory: (chat: Omit<ChatHistoryItem, 'timestamp'>) => void;
  removeChatFromHistory: (chatId: string) => void;
  clearChatHistory: () => void;
  getChatById: (chatId: string) => ChatHistoryItem | undefined;
  getChatsByCharacter: (characterId: string) => ChatHistoryItem[];
  getRecentChats: (limit?: number) => ChatHistoryItem[];
  removeChatHistory: () => void;
}
```

### Пример использования
```typescript
const { 
  chatHistory, 
  addChatToHistory, 
  getRecentChats 
} = useChatHistory();

// Добавление чата
addChatToHistory({
  id: 'chat-1',
  characterId: 'char-1',
  characterName: 'Alice',
  lastMessage: 'Привет!',
  messageCount: 15,
  tags: ['дружба', 'повседневное']
});

// Получение последних чатов
const recent = getRecentChats(5);
```

---

## useUserPreferences Hook

Управление пользовательскими настройками.

### Особенности
✅ **Структурированные настройки**: Категории настроек  
✅ **Валидация**: TypeScript типизация  
✅ **Глубокое слияние**: Для вложенных объектов  
✅ **Специализированные методы**: Для уведомлений и отображения  

### API
```typescript
useUserPreferences(): {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  updateNotificationSettings: (notifications: Partial<NotificationSettings>) => void;
  updateDisplaySettings: (display: Partial<DisplaySettings>) => void;
  removePreferences: () => void;
}
```

### Структура UserPreferences
```typescript
interface UserPreferences {
  language: string;
  nsfwEnabled: boolean;
  autoSave: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  display: {
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
    showAvatars: boolean;
  };
}
```

### Пример использования
```typescript
const { 
  preferences, 
  updatePreferences,
  updateNotificationSettings 
} = useUserPreferences();

// Общие настройки
updatePreferences({ 
  language: 'ru', 
  nsfwEnabled: true 
});

// Настройки уведомлений
updateNotificationSettings({ 
  email: false, 
  push: true 
});

// Функциональное обновление
updatePreferences(prev => ({
  ...prev,
  language: prev.language === 'en' ? 'ru' : 'en'
}));
```

---

## Демо компонент

Интерактивная демонстрация всех возможностей:
- `/localstorage-demo` - тестирование хуков
- Экспорт/импорт данных
- Real-time синхронизация
- Валидация работы

## Техническая информация

### Синхронизация между вкладками
- CustomEvent('localStorage') для собственных изменений
- Native StorageEvent для изменений в других вкладках

### SSR Compatibility
- Проверка `typeof window === 'undefined'`
- Fallback к значениям по умолчанию
- Lazy инициализация в useEffect

### Обработка ошибок
- Try-catch блоки
- console.warn для отладки
- Graceful fallbacks

### Оптимизация
- useCallback для стабильных ссылок
- Минимальные re-renders
- Efficient JSON serialization