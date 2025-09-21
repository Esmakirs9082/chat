# Loading Components Documentation 🔄

Полнофункциональная система компонентов загрузки для React приложения с поддержкой Skeleton states и анимированных спиннеров.

## 🚀 Быстрый старт

```tsx
import Skeleton, { SkeletonText, SkeletonAvatar } from './components/ui/Skeleton';
import LoadingSpinner, { LoadingDots } from './components/ui/LoadingSpinner';

// Skeleton для загружающегося контента
<SkeletonText lines={3} />
<SkeletonAvatar size="lg" />

// Спиннер для действий
<LoadingSpinner size="md" color="primary" text="Loading..." />
<LoadingDots size="lg" color="success" />
```

## 🦴 Skeleton Components

### Базовый Skeleton

```tsx
<Skeleton 
  variant="text" | "avatar" | "card" | "button" | "custom"
  width={string | number}
  height={string | number}
  lines={number}        // Для text варианта
  animate={boolean}     // По умолчанию true
  className={string}
/>
```

### Готовые варианты

#### SkeletonText
```tsx
<SkeletonText lines={3} />
<SkeletonText lines={1} className="w-1/2" />
```

#### SkeletonAvatar
```tsx
<SkeletonAvatar size="sm" | "md" | "lg" | "xl" />
```

#### SkeletonButton
```tsx
<SkeletonButton size="sm" | "md" | "lg" />
```

#### SkeletonCard
```tsx
<SkeletonCard 
  showHeader={boolean}
  showFooter={boolean}
/>
```

### Композитные компоненты

#### SkeletonList
```tsx
<SkeletonList 
  items={3}
  showAvatar={true}
/>
```

#### SkeletonForm
```tsx
<SkeletonForm fields={4} />
```

## ⚡ Loading Spinners

### Базовый LoadingSpinner

```tsx
<LoadingSpinner 
  size="sm" | "md" | "lg" | "xl"
  color="primary" | "secondary" | "success" | "error" | "warning" | "white" | "gray"
  text={string}
  className={string}
  textClassName={string}
/>
```

### Размеры спиннеров

| Размер | Диаметр | Использование |
|--------|---------|---------------|
| `sm`   | 16px    | Inline элементы, кнопки |
| `md`   | 24px    | Стандартный размер |
| `lg`   | 32px    | Карточки, секции |
| `xl`   | 48px    | Полностраничная загрузка |

### Цвета спиннеров

- **primary**: синий (по умолчанию)
- **secondary**: серый
- **success**: зеленый
- **error**: красный
- **warning**: желтый
- **white**: белый (для темных фонов)
- **gray**: светло-серый

### Готовые компоненты

#### LoadingSpinnerPage
```tsx
<LoadingSpinnerPage 
  size="lg"
  text="Loading page..."
  className="min-h-screen"
/>
```

#### LoadingSpinnerOverlay
```tsx
<LoadingSpinnerOverlay 
  text="Processing..."
  className="z-50"
/>
```

#### LoadingSpinnerButton
```tsx
<button className="bg-blue-600 text-white px-4 py-2 rounded">
  <LoadingSpinnerButton text="Saving..." />
</button>
```

#### LoadingSpinnerCard
```tsx
<LoadingSpinnerCard text="Fetching data..." />
```

### Альтернативные стили

#### LoadingDots
```tsx
<LoadingDots 
  size="sm" | "md" | "lg"
  color="primary"
/>
```

#### LoadingPulse
```tsx
<LoadingPulse 
  size="md"
  color="primary"
/>
```

## 🎨 Стили и анимации

### Shimmer эффект

Skeleton компоненты используют двойную анимацию:
- `animate-pulse` - основная пульсация
- `animate-shimmer` - блестящий эффект скольжения

```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### Smooth rotation

Спиннеры используют CSS анимацию с плавным вращением:

```css
.animate-spin {
  animation: spin 1s linear infinite;
}
```

## 🌙 Темная тема

Все компоненты автоматически поддерживают темную тему:

```tsx
// Светлая тема
<Skeleton className="bg-gray-200" />

// Темная тема (автоматически)
<Skeleton className="bg-gray-200 dark:bg-gray-700" />
```

## 🔧 Настройка Tailwind

Добавьте shimmer анимацию в `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
};
```

## 📋 Примеры использования

### Chat Message Loading
```tsx
<div className="flex items-start space-x-3">
  <SkeletonAvatar size="sm" />
  <div className="flex-1 space-y-2">
    <Skeleton variant="text" width="30%" height="0.875rem" />
    <SkeletonText lines={2} />
  </div>
</div>
```

### Profile Card Loading
```tsx
<div className="text-center space-y-3">
  <div className="flex justify-center">
    <SkeletonAvatar size="xl" />
  </div>
  <SkeletonText />
  <SkeletonText className="w-3/5 mx-auto" />
  <div className="flex justify-center gap-2">
    <SkeletonButton size="sm" />
    <SkeletonButton size="sm" />
  </div>
</div>
```

### Loading Button States
```tsx
const [isLoading, setIsLoading] = useState(false);

<button 
  disabled={isLoading}
  className="bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2"
>
  {isLoading && <LoadingSpinnerButton />}
  {isLoading ? 'Saving...' : 'Save Changes'}
</button>
```

### Data Fetching with Skeleton
```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

return (
  <div className="space-y-4">
    {loading ? (
      <>
        <SkeletonCard showHeader />
        <SkeletonList items={3} showAvatar />
      </>
    ) : (
      <>
        <DataCard data={data} />
        <DataList items={data.items} />
      </>
    )}
  </div>
);
```

### Form Loading States
```tsx
const [submitting, setSubmitting] = useState(false);

<form onSubmit={handleSubmit}>
  <input disabled={submitting} />
  <input disabled={submitting} />
  
  <button type="submit" disabled={submitting}>
    {submitting ? (
      <LoadingSpinnerButton text="Submitting..." />
    ) : (
      'Submit Form'
    )}
  </button>
</form>
```

## 🎯 Best Practices

### Когда использовать Skeleton

✅ **Используйте для:**
- Загрузки контента, который имеет определенную структуру
- Списков, карточек, профилей
- Текстового контента
- Когда известна приблизительная форма данных

❌ **Не используйте для:**
- Кнопок и действий
- Коротких операций (< 200ms)
- Неопределенного контента

### Когда использовать Spinners

✅ **Используйте для:**
- Отправки форм
- API запросов
- Загрузки файлов
- Обработки данных
- Действий пользователя

❌ **Не используйте для:**
- Загрузки списков и карточек (лучше Skeleton)
- Очень быстрых операций

### Размеры и производительность

- Ограничивайте количество анимированных элементов
- Используйте `animate={false}` для статичных skeleton
- Предпочитайте CSS анимации JavaScript анимациям
- Группируйте похожие элементы

### Accessibility

```tsx
// Добавляйте ARIA атрибуты
<Skeleton 
  role="img" 
  aria-label="Loading content..."
/>

<LoadingSpinner 
  text="Loading..."
  aria-live="polite"
/>
```

## 🔌 Интеграция с другими библиотеками

### React Query
```tsx
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery(['posts'], fetchPosts);

if (isLoading) return <SkeletonList items={5} showAvatar />;
if (error) return <div>Error loading posts</div>;
return <PostList posts={data} />;
```

### SWR
```tsx
import useSWR from 'swr';

const { data, error } = useSWR('/api/user', fetcher);

if (!data && !error) return <SkeletonCard showHeader />;
if (error) return <div>Failed to load</div>;
return <UserProfile user={data} />;
```

## 🎭 Кастомизация

### Создание своих Skeleton вариантов
```tsx
export const SkeletonMessage: React.FC = () => (
  <div className="flex space-x-3">
    <SkeletonAvatar size="sm" />
    <div className="flex-1 space-y-2">
      <div className="flex space-x-2">
        <Skeleton width="80px" height="16px" />
        <Skeleton width="60px" height="16px" />
      </div>
      <SkeletonText lines={Math.random() > 0.5 ? 1 : 2} />
    </div>
  </div>
);
```

### Создание своих Spinner компонентов
```tsx
export const CustomSpinner: React.FC = () => (
  <div className="relative">
    <LoadingSpinner size="lg" color="primary" />
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-xs font-medium">AI</span>
    </div>
  </div>
);
```

Готово! 🎉 Полнофункциональная система Loading компонентов готова к использованию!