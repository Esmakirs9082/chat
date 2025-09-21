# Hooks Documentation

Набор переиспользуемых хуков для React + TypeScript приложения AI чат-сервиса.

## Структура проекта

```
src/
├── hooks/
│   ├── useLocalStorage.ts    # LocalStorage хуки
│   ├── useForm.ts           # Form хуки с Zod валидацией
│   └── useToast.ts          # Toast notification хуки
├── components/
│   ├── ui/
│   │   ├── Toast.tsx        # Базовый Toast компонент
│   │   └── ToastContainer.tsx # Контейнер для позиционирования
│   ├── LocalStorageDemo.tsx # Демо localStorage функциональности
│   ├── FormDemo.tsx         # Демо form функциональности
│   ├── ToastDemo.tsx        # Демо toast функциональности
│   └── HooksDemo.tsx        # Общий демо компонент
├── contexts/
│   └── ToastContext.tsx     # React Context для Toast системы
```

## LocalStorage Hooks

### `useLocalStorage`

Базовый хук для работы с localStorage с поддержкой JSON сериализации, SSR безопасности и синхронизации между табами.

```tsx
const [value, setValue, clearValue] = useLocalStorage('key', defaultValue);
```

**Особенности:**
- Автоматическая JSON сериализация/десериализация
- SSR безопасность (не падает на сервере)
- Синхронизация между табами через StorageEvent
- TypeScript типизация

### `useTheme`

Специализированный хук для управления темой приложения.

```tsx
const { theme, setTheme, toggleTheme } = useTheme();
```

**Темы:** `'light'` | `'dark'` | `'system'`

### `useChatHistory`

Хук для управления историей чатов с функциями добавления, удаления и поиска.

```tsx
const {
  chatHistory,
  addChat,
  removeChat,
  clearHistory,
  searchChats,
  getTotalMessages
} = useChatHistory();
```

### `useUserPreferences`

Комплексный хук для управления пользовательскими настройками.

```tsx
const {
  preferences,
  updatePreferences,
  resetPreferences,
  toggleNSFW
} = useUserPreferences();
```

## Form Hooks

### `useForm`

Универсальный хук-обертка для react-hook-form с интеграцией Zod валидации.

```tsx
const form = useForm({
  schema: zodSchema,
  onSubmit: async (data) => { /* обработка отправки */ },
  defaultValues: {},
  mode: 'onChange',
  resetOnSuccess: true,
  successMessage: 'Success!',
  errorMessage: 'Error occurred'
});
```

**Возвращает:**
- Все методы из react-hook-form
- `isSubmitting` - состояние загрузки
- `submitError` - ошибка отправки
- `submitSuccess` - сообщение успеха
- `clearSubmitError` - очистка ошибки
- `clearSubmitSuccess` - очистка успеха

### Специализированные хуки

#### `useAuthForm`

Хук для форм авторизации с предустановленными схемами валидации.

```tsx
const loginForm = useAuthForm('login');
const registerForm = useAuthForm('register');
const resetForm = useAuthForm('resetPassword');
const changePasswordForm = useAuthForm('changePassword');
```

#### `useCharacterForm`

Хук для формы создания/редактирования персонажей.

```tsx
const createForm = useCharacterForm();
const editForm = useCharacterForm(characterId);
```

#### `useSettingsForm`

Хук для формы пользовательских настроек с сложной вложенной структурой.

```tsx
const settingsForm = useSettingsForm();
```

## Схемы валидации

### Auth Schemas

- **Login**: email, password, rememberMe
- **Register**: username, email, password, confirmPassword, acceptTerms
- **Reset Password**: email
- **Change Password**: currentPassword, newPassword, confirmNewPassword

### Character Schema

- **name**: 2-50 символов
- **description**: 10-1000 символов
- **personality**: 5-500 символов
- **avatar**: URL (опционально)
- **tags**: массив строк (1-10 элементов)
- **isNSFW**: boolean
- **isPublic**: boolean
- **category**: enum
- **age**: число 18+ (опционально)
- **background**: до 2000 символов (опционально)

### Settings Schema

Вложенная структура с секциями:

- **profile**: displayName, bio, avatar, location, website
- **preferences**: language, theme, nsfwEnabled, autoSave, showOnlineStatus
- **notifications**: email, push, sound, newMessages, characterUpdates, systemUpdates
- **privacy**: profileVisibility, allowDirectMessages, showActivityStatus, dataCollection

## Утилиты

### `getFieldError`

Извлекает сообщение об ошибке для конкретного поля (поддерживает вложенные пути).

```tsx
const error = getFieldError(errors, 'profile.displayName');
```

### `hasFieldError`

Проверяет наличие ошибки для поля.

```tsx
const hasError = hasFieldError(errors, 'email');
```

## TypeScript типы

Все схемы автоматически экспортируют соответствующие TypeScript типы:

```tsx
type LoginFormData = z.infer<typeof authSchemas.login>;
type RegisterFormData = z.infer<typeof authSchemas.register>;
type CharacterFormData = z.infer<typeof characterSchema>;
type SettingsFormData = z.infer<typeof settingsSchema>;
```

## Toast Notification System

### `useToast`

Полнофункциональная система уведомлений с анимациями, позиционированием и очередью сообщений.

```tsx
const toast = useToast();

// Основные методы
toast.success({ title: 'Success!', description: 'Operation completed' });
toast.error({ title: 'Error!', description: 'Something went wrong' });
toast.warning({ title: 'Warning!', description: 'Please be careful' });
toast.info({ title: 'Info!', description: 'Here is some information' });

// Дополнительные возможности
toast.clearAll(); // Очистить все уведомления
```

**Особенности:**
- **Позиционирование**: `top-right`, `bottom-right`, `center`
- **Автоисчезновение**: настраиваемое время (по умолчанию 5 сек)
- **Закрытие**: по клику или swipe жесту
- **Очередь**: максимум 5 уведомлений одновременно
- **Анимации**: плавные slide-in/out с Framer Motion
- **Progress bar**: показывает оставшееся время

### `ToastProvider`

React Context провайдер для глобального управления Toast уведомлениями.

```tsx
import { ToastProvider } from '../contexts/ToastContext';

function App() {
  return (
    <ToastProvider defaultPosition="top-right" maxToasts={5}>
      <YourApp />
    </ToastProvider>
  );
}
```

**Параметры:**
- `defaultPosition`: позиция по умолчанию для всех toast'ов
- `maxToasts`: максимальное количество уведомлений в очереди

### Toast Options

```tsx
interface ToastOptions {
  title: string;           // Заголовок уведомления
  description?: string;    // Описание (опционально)
  duration?: number;       // Время показа в ms (0 = бесконечно)
  position?: ToastPosition; // Позиция на экране
}
```

### Предустановленные сообщения

```tsx
import { toastPresets } from '../hooks/useToast';

// Готовые шаблоны для частых случаев
toast.success({ ...toastPresets.saveSuccess() });
toast.error({ ...toastPresets.saveError('Database connection failed') });
toast.success({ ...toastPresets.loginSuccess('John') });
toast.info({ ...toastPresets.copySuccess() });
toast.error({ ...toastPresets.networkError() });
```

**Доступные пресеты:**
- `saveSuccess()` / `saveError(error?)`
- `deleteSuccess(itemName?)` / `deleteError(error?)`
- `loginSuccess(username?)` / `loginError(error?)`
- `networkError()` / `formValidationError()`
- `copySuccess()` / `uploadSuccess(fileName?)` / `uploadError(error?)`

### Типы Toast'ов

#### Success Toast
- **Цвет**: зеленый
- **Иконка**: CheckCircle
- **Время**: 5 секунд
- **Использование**: успешные операции

#### Error Toast
- **Цвет**: красный
- **Иконка**: AlertCircle
- **Время**: 7 секунд (дольше для важных ошибок)
- **Использование**: ошибки и сбои

#### Warning Toast
- **Цвет**: желтый/оранжевый
- **Иконка**: AlertTriangle
- **Время**: 6 секунд
- **Использование**: предупреждения и важная информация

#### Info Toast
- **Цвет**: синий
- **Иконка**: Info
- **Время**: 5 секунд
- **Использование**: информационные сообщения

## Установка зависимостей

```bash
npm install react-hook-form zod @hookform/resolvers framer-motion
```

## Использование в проекте

1. Импортируйте нужные хуки:
```tsx
import { useAuthForm, useCharacterForm } from '../hooks/useForm';
import { useTheme, useChatHistory } from '../hooks/useLocalStorage';
import { useToast } from '../hooks/useToast';
```

2. Используйте в компонентах:
```tsx
const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();
  const loginForm = useAuthForm('login');
  const toast = useToast();
  
  const handleSubmit = async () => {
    try {
      // Логика отправки формы
      toast.success({ title: 'Login successful!', description: 'Welcome back!' });
    } catch (error) {
      toast.error({ title: 'Login failed', description: error.message });
    }
  };
  
  return (
    <form onSubmit={loginForm.handleSubmit}>
      <input {...loginForm.register('email')} />
      <button type="submit" disabled={loginForm.isSubmitting}>
        Login
      </button>
    </form>
  );
};
```

## Демонстрация

Запустите `HooksDemo.tsx` для интерактивной демонстрации всех возможностей хуков.

## Особенности реализации

- **SSR безопасность**: все localStorage операции обернуты в проверки на наличие window
- **Синхронизация между табами**: использование StorageEvent и CustomEvent
- **Упрощенная валидация**: ручная интеграция Zod вместо zodResolver для обхода проблем типизации
- **Мок API**: все submit функции используют имитацию API вызовов с setTimeout
- **TypeScript**: полная типизация всех интерфейсов и возвращаемых значений

## Roadmap

- [ ] Интеграция с реальным API
- [ ] Добавление тестов
- [ ] Оптимизация производительности
- [ ] Добавление новых специализированных хуков (useSubscription, useNotifications)
- [ ] Миграция на новую версию react-hook-form с исправленным zodResolver