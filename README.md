# AI Chat Frontend

Современное приложение-чат с AI-персонажами, построенное на React 18, TypeScript и Tailwind CSS.

## 🚀 Особенности

### ✅ Реализованные компоненты

1. **Страница подписок** (`SubscriptionPage.tsx`)
   - Тарифные планы ($9.99 Basic / $19.99 Premium)
   - История биллинга
   - Управление способами оплаты
   - FAQ по подпискам

2. **Страница настроек** (`SettingsPage.tsx`)
   - Профиль пользователя с загрузкой аватара
   - Настройки темы и NSFW контента
   - Уведомления и приватность
   - Валидация форм (react-hook-form + zod)

3. **Система роутинга** (`routes.tsx`)
   - React Router v6 с createBrowserRouter
   - Lazy loading компонентов
   - Защищенные роуты с AuthGuard

4. **WebSocket чат** (`useChat.ts`)
   - Реальное время общение
   - Индикаторы набора текста
   - Автопереподключение
   - Управление состоянием сообщений

5. **Система подписок** (`useSubscription.ts`)
   - Управление тарифами и триалами
   - Контроль доступа к функциям
   - Отслеживание лимитов использования
   - Интеграция с платежными системами

6. **localStorage хуки** (`useLocalStorage.ts`)
   - Типизированный wrapper для localStorage
   - Автоматическая JSON сериализация
   - Синхронизация между вкладками
   - Специализированные хуки (useTheme, useChatHistory, useUserPreferences)

7. **Демо компоненты**
   - `SubscriptionDemo.tsx` - тестирование подписок
   - `LocalStorageDemo.tsx` - демонстрация localStorage хуков

### 🛠 Технологии

- **React 18** с TypeScript
- **Tailwind CSS** для стилизации
- **Zustand** для управления состоянием
- **React Router v6** для навигации
- **React Hook Form + Zod** для валидации
- **Lucide React** для иконок
- **WebSocket** для real-time коммуникации

### 📁 Структура проекта

```
ai-chat-frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # Базовые UI компоненты
│   │   ├── auth/         # Компоненты авторизации
│   │   └── *.tsx         # Основные компоненты
│   ├── pages/            # Страницы приложения
│   ├── hooks/            # Кастомные хуки
│   ├── stores/           # Zustand сторы
│   ├── types/            # TypeScript типы
│   └── utils/            # Утилиты
└── docs/                 # Документация
```

### 🎯 Ключевые хуки

#### `useSubscription`
Комплексное управление подписками:
```typescript
const {
  subscription,
  isPremium,
  canAccessNSFW,
  remainingMessages,
  startFreeTrial,
  upgrade,
  checkFeatureAccess
} = useSubscription({
  autoLoad: true,
  trialDuration: 7
});
```

#### `useLocalStorage<T>`
Базовый localStorage wrapper:
```typescript
const [value, setValue, removeValue] = useLocalStorage('key', defaultValue);
```

#### `useTheme`
Управление темами:
```typescript
const { theme, setTheme, toggleTheme, isDark } = useTheme();
```

#### `useChatHistory`
История чатов:
```typescript
const { 
  chatHistory, 
  addChatToHistory, 
  getRecentChats 
} = useChatHistory();
```

#### `useUserPreferences`
Пользовательские настройки:
```typescript
const { 
  preferences, 
  updatePreferences,
  updateNotificationSettings 
} = useUserPreferences();
```

### 🎨 Дизайн система

- **Цветовая схема**: Фиолетовая тема (#7F5AF0)
- **Шрифт**: Inter
- **Компоненты**: Mobile-first дизайн
- **Темы**: Светлая и темная

### 🔐 Функции подписки

| Функция | Free | Basic ($9.99) | Premium ($19.99) |
|---------|------|---------------|------------------|
| Базовый чат | ✅ | ✅ | ✅ |
| NSFW контент | ❌ | ✅ | ✅ |
| Неограниченные сообщения | ❌ | ❌ | ✅ |
| Создание персонажей | ❌ | ✅ | ✅ |
| Приоритетная поддержка | ❌ | ❌ | ✅ |
| Голосовые сообщения | ❌ | ❌ | ✅ |

### 📱 Responsive дизайн

- Mobile-first подход
- Адаптивные сетки
- Мобильное меню
- Touch-friendly интерфейс

## 🚀 Запуск

```bash
cd ai-chat-frontend
npm install
npm run dev
```

Приложение будет доступно по адресу: http://localhost:5173

### 📍 Доступные маршруты

- `/` - Главная страница
- `/chat` - Чат с персонажами
- `/gallery` - Галерея персонажей
- `/subscription` - Управление подпиской
- `/settings` - Настройки пользователя
- `/subscription-demo` - Демо функций подписки
- `/localstorage-demo` - Демо localStorage хуков

## 🔧 Разработка

### Команды

```bash
npm run dev          # Разработка
npm run build        # Сборка
npm run preview      # Превью продакшена
npm run lint         # Линтинг
```

### Тестирование функций

1. Откройте `/subscription-demo` для интерактивного тестирования
2. Проверьте все функции подписки
3. Тестируйте лимиты использования
4. Проверьте работу WebSocket чата

## 📈 Статус проекта

### ✅ Завершено
- [x] Страницы подписок и настроек
- [x] Система роутинга
- [x] WebSocket чат
- [x] Управление подписками
- [x] localStorage хуки (useLocalStorage, useTheme, useChatHistory, useUserPreferences)
- [x] Интерактивные демо компоненты
- [x] TypeScript настройка
- [x] Tailwind конфигурация

### 🔄 В разработке
- [ ] Интеграция с бэкендом
- [ ] Реальные платежи (Stripe)
- [ ] Push уведомления
- [ ] PWA функционал

### 🎯 Планы
- [ ] Мобильное приложение
- [ ] Голосовые сообщения
- [ ] Видео чат
- [ ] AI-генерация изображений

## 📝 Лицензия

MIT License

---

**Статус сборки**: ✅ Собирается без ошибок  
**Dev сервер**: ✅ http://localhost:5173  
**TypeScript**: ✅ Строгая типизация  
**Компоненты**: 17+ реализованных  
**Хуки**: 15+ кастомных хуков

## Character Creator (MVP)

Мастер создания персонажа реализован как многошаговый модальный интерфейс (5 шагов), использует React + TypeScript + Tailwind.

Шаги:
1. Основная информация – имя (2-50), описание (10-500), теги (autocomplete), категория, NSFW toggle.
2. Личность – список произвольных черт (traits), greeting (первое сообщение), выбор стиля общения (friendly / sarcastic / romantic / mysterious / formal).
3. Аватар – выбор файла (MVP: только имя файла) или указание URL, предпросмотр, валидация (нужно выбрать хотя бы одно).
4. Предпросмотр – сводка всех полей в read-only режиме.
5. Публикация – имитация async сохранения (setTimeout ~900ms), success state. Хук для будущей интеграции с backend API.

Основная структура данных (`CharacterFormData`) расположена в `ai-chat-frontend/src/components/character/types.ts` и расширяется по мере развития.

Валидация пошаговая, кнопка Далее блокируется при незаполненных обязательных полях. Кнопка публикации находится внутри финального шага.

### Следующие улучшения (план):
- Реальная загрузка изображений (S3/Cloudflare R2) вместо placeholder.
- Сохранение черновиков в localStorage.
- Поддержка нескольких аватаров / вариаций стилей.
- i18n (RU / EN переключение).
- Интеграция с backend API (создание, обновление, список персонажей).

---
Если нужна более детальная техническая схема или диаграмма состояний мастера — напишите, добавлю в `docs/`.
