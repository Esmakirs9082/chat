# Toast Notification System 🍞

Полнофункциональная система уведомлений для React приложения с анимациями Framer Motion, поддержкой позиций, очереди и swipe жестов.

## 🚀 Быстрый старт

```tsx
import { ToastProvider, useToast } from './path-to-toast';

// 1. Оберните приложение в ToastProvider
function App() {
  return (
    <ToastProvider defaultPosition="top-right" maxToasts={5}>
      <YourApp />
    </ToastProvider>
  );
}

// 2. Используйте в любом компоненте
function MyComponent() {
  const toast = useToast();
  
  const handleSuccess = () => {
    toast.success({
      title: 'Success!',
      description: 'Operation completed successfully'
    });
  };
  
  return <button onClick={handleSuccess}>Show Toast</button>;
}
```

## 🎯 Основные возможности

### ✨ Типы уведомлений
- **Success** - зеленые уведомления для успешных операций
- **Error** - красные уведомления для ошибок (показываются дольше)
- **Warning** - желтые уведомления для предупреждений
- **Info** - синие уведомления для информации

### 📍 Позиционирование
- **Top Right** - правый верхний угол (по умолчанию)
- **Bottom Right** - правый нижний угол
- **Center** - центр экрана

### ⏱️ Управление временем
- Автоматическое исчезновение (настраиваемо)
- Progress bar показывает оставшееся время
- Возможность создать persistent уведомления (duration: 0)

### 🎭 Анимации
- Плавный slide-in/out эффект с spring анимацией
- Поддержка swipe жестов для закрытия
- Hover эффекты и scale при drag

### 🗂️ Очередь и управление
- Ограничение количества уведомлений (по умолчанию 5)
- FIFO система очереди
- Возможность очистить все уведомления

## 📝 API Reference

### useToast Hook

```tsx
const toast = useToast();

// Основные методы
toast.success(options)   // Показать success toast
toast.error(options)     // Показать error toast
toast.warning(options)   // Показать warning toast
toast.info(options)      // Показать info toast

// Управление
toast.clearAll()         // Очистить все toast'ы
toast.toasts            // Массив активных toast'ов
```

### ToastOptions Interface

```tsx
interface ToastOptions {
  title: string;           // Заголовок (обязательно)
  description?: string;    // Описание
  duration?: number;       // Время показа в мс (0 = бесконечно)
  position?: ToastPosition; // 'top-right' | 'bottom-right' | 'center'
}
```

### ToastProvider Props

```tsx
interface ToastProviderProps {
  children: ReactNode;
  defaultPosition?: ToastPosition;  // По умолчанию 'top-right'
  maxToasts?: number;              // По умолчанию 5
}
```

## 🎨 Примеры использования

### Базовые уведомления

```tsx
const toast = useToast();

// Простое success уведомление
toast.success({ title: 'Saved!' });

// Детальное error уведомление
toast.error({
  title: 'Save failed',
  description: 'Unable to connect to server. Please try again.',
  duration: 8000
});

// Центрированное важное предупреждение
toast.warning({
  title: 'Data will be lost',
  description: 'Are you sure you want to continue?',
  position: 'center'
});
```

### Интеграция с формами

```tsx
const LoginForm = () => {
  const toast = useToast();
  
  const handleLogin = async (formData) => {
    try {
      await loginUser(formData);
      toast.success({
        title: 'Welcome back!',
        description: `Hello, ${formData.username}!`
      });
    } catch (error) {
      toast.error({
        title: 'Login failed',
        description: error.message || 'Please check your credentials.'
      });
    }
  };
  
  return (/* форма */);
};
```

### Использование пресетов

```tsx
import { toastPresets } from './hooks/useToast';

const FileUploader = () => {
  const toast = useToast();
  
  const handleUpload = async (file) => {
    try {
      await uploadFile(file);
      toast.success({ ...toastPresets.uploadSuccess(file.name) });
    } catch (error) {
      toast.error({ ...toastPresets.uploadError(error.message) });
    }
  };
};
```

### Специальные случаи

```tsx
// Persistent уведомление (не исчезает автоматически)
toast.error({
  title: 'Critical Error',
  description: 'System requires immediate attention',
  duration: 0
});

// Quick notification
toast.info({
  title: 'Copied!',
  duration: 1500
});

// Множественные позиции одновременно
toast.success({ title: 'Top notification', position: 'top-right' });
toast.warning({ title: 'Bottom notification', position: 'bottom-right' });
toast.info({ title: 'Center notification', position: 'center' });
```

## 🛠️ Настройка и кастомизация

### Tailwind CSS классы

Toast компоненты используют Tailwind CSS для стилизации. Основные классы:

```css
/* Success Toast */
.toast-success {
  @apply bg-green-50 border-green-200 text-green-800;
}

/* Error Toast */
.toast-error {
  @apply bg-red-50 border-red-200 text-red-800;
}

/* Warning Toast */
.toast-warning {
  @apply bg-yellow-50 border-yellow-200 text-yellow-800;
}

/* Info Toast */
.toast-info {
  @apply bg-blue-50 border-blue-200 text-blue-800;
}
```

### Framer Motion конфигурация

Анимации настроены для оптимальной производительности:

```tsx
const slideVariants = {
  initial: { opacity: 0, x: 300, scale: 0.9 },
  animate: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { type: 'spring', damping: 25, stiffness: 120 }
  },
  exit: { 
    opacity: 0, 
    x: 300, 
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};
```

## 🎮 Интерактивность

### Способы закрытия Toast'а
1. **Автоматически** - через заданное время (по умолчанию 5 сек)
2. **Клик** - клик по любому месту toast'а
3. **Кнопка X** - клик по кнопке закрытия
4. **Swipe** - смахивание влево или вправо на 100px+

### Визуальные эффекты
- **Progress bar** в верхней части показывает оставшееся время
- **Hover эффект** - легкое подсвечивание при наведении
- **Drag эффект** - поворот и увеличение при перетаскивании
- **Spring анимация** - естественные движения при появлении/исчезновении

## 📦 Структура файлов

```
src/
├── components/
│   └── ui/
│       ├── Toast.tsx          # Основной Toast компонент
│       └── ToastContainer.tsx  # Контейнер для позиционирования
├── contexts/
│   └── ToastContext.tsx       # React Context + Provider
├── hooks/
│   └── useToast.ts           # Hook + утилиты + пресеты
└── components/
    └── ToastDemo.tsx         # Демо компонент
```

## 🚨 Важные замечания

1. **ToastProvider должен быть в корне приложения** для работы во всех компонентах
2. **Максимум toast'ов ограничен** для производительности (по умолчанию 5)
3. **Framer Motion обязательна** для анимаций
4. **Tailwind CSS используется** для стилизации
5. **Lucide-react иконки** используются для визуальных элементов

## 🔧 Troubleshooting

**Toast не появляются:**
- Проверьте, что компонент обернут в `<ToastProvider>`
- Убедитесь, что hook вызывается внутри компонента

**Анимации не работают:**
- Установите `framer-motion`: `npm install framer-motion`
- Проверьте версию Framer Motion (должна быть совместима с React)

**Стили не применяются:**
- Убедитесь, что Tailwind CSS настроен
- Проверьте, что все классы включены в production build

**TypeScript ошибки:**
- Обновите `@types/react` до последней версии
- Проверьте, что все типы импортированы правильно

## 📈 Performance Tips

1. **Ограничивайте количество toast'ов** - используйте `maxToasts` prop
2. **Используйте пресеты** - они оптимизированы и переиспользуются
3. **Избегайте слишком длинных описаний** - они могут замедлить рендеринг
4. **Группируйте похожие уведомления** - вместо множества одинаковых

Готово! 🎉 Toast система полностью готова к использованию в вашем приложении!