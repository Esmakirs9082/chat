# Environment Configuration

Система конфигурации окружения для AI Chat приложения с типизацией, валидацией и feature flags.

## Быстрый старт

1. Скопируйте `.env.example` в `.env.local`:
```bash
cp .env.example .env.local
```

2. Настройте переменные окружения под ваши нужды

3. Импортируйте конфигурацию в компонентах:
```typescript
import { env, features, apiConfig, isProduction } from '@/config/env';
```

## Структура конфигурации

### API Configuration
- `VITE_API_URL` - URL backend API
- `VITE_WS_URL` - WebSocket URL для real-time функций

### External Services  
- `VITE_STRIPE_KEY` - Публичный ключ Stripe для платежей
- `VITE_SENTRY_DSN` - DSN для отслеживания ошибок

### Feature Flags
- `VITE_ENABLE_ANALYTICS` - Включить аналитику
- `VITE_ENABLE_SENTRY` - Включить Sentry
- `VITE_ENABLE_SUBSCRIPTIONS` - Система подписок
- `VITE_ENABLE_NSFW_CONTENT` - NSFW контент
- `VITE_ENABLE_VOICE_MESSAGES` - Голосовые сообщения
- `VITE_ENABLE_IMAGE_UPLOAD` - Загрузка изображений
- `VITE_ENABLE_BETA_FEATURES` - Бета функции
- `VITE_ENABLE_DEBUG_MODE` - Debug режим

## Использование

### Основная конфигурация
```typescript
import { env, isDevelopment, isProduction } from '@/config/env';

// Доступ к переменным
console.log(env.API_URL);
console.log(env.NODE_ENV);

// Проверка окружения
if (isDevelopment) {
  console.log('Development mode');
}
```

### Feature Flags
```typescript
import { features, isFeatureEnabled } from '@/config/env';

// Прямой доступ
if (features.ENABLE_SUBSCRIPTIONS) {
  // Показать UI подписок
}

// Через функцию
if (isFeatureEnabled('ENABLE_NSFW_CONTENT')) {
  // Показать NSFW переключатель
}
```

### API конфигурация
```typescript
import { apiConfig } from '@/config/env';

const api = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
});
```

### External Services
```typescript
import { externalServices } from '@/config/env';

// Stripe
if (externalServices.stripe.enabled) {
  const stripe = loadStripe(externalServices.stripe.publicKey);
}

// Sentry
if (externalServices.sentry.enabled) {
  Sentry.init({
    dsn: externalServices.sentry.dsn,
    environment: externalServices.sentry.environment,
  });
}
```

## Environments

### Development
- Все debug функции включены
- Расширенные таймауты API
- Консольные логи конфигурации
- Валидация не строгая

### Production  
- Оптимизированные feature flags
- Строгая валидация required переменных
- Отключен debug режим
- Включена аналитика и error tracking

### Environment файлы
- `.env.example` - Шаблон с документацией
- `.env.local` - Локальные настройки разработчика
- `.env.production` - Production переменные (не в git)

## Валидация

### Required для Production
- `VITE_API_URL` - обязательно
- `VITE_WS_URL` - обязательно

### Warnings для Production
- `VITE_STRIPE_KEY` - предупреждение если не задан
- `VITE_SENTRY_DSN` - предупреждение если не задан

## TypeScript Support

Полная типизация всех переменных:
```typescript
// Автокомплит и type checking
env.API_URL; // string
features.ENABLE_ANALYTICS; // boolean
isProduction; // boolean
```

## Безопасность

- Все переменные с префиксом `VITE_` (публичные)
- Секретные ключи только в `.env.local` (не в git)
- Production валидация предотвращает запуск без нужных переменных

## Расширение

### Добавление новой переменной

1. Добавьте в `src/types/env.d.ts`:
```typescript
interface ImportMetaEnv {
  readonly VITE_NEW_VARIABLE?: string;
}
```

2. Добавьте в `EnvironmentConfig` в `src/config/env.ts`

3. Добавьте парсинг в `createEnvironmentConfig()`

4. Обновите `.env.example`

### Добавление feature flag

1. Добавьте в `FeatureFlags` интерфейс
2. Добавьте в `DEFAULT_FEATURES` и `PRODUCTION_FEATURES`  
3. Добавьте парсинг в `parseFeatureFlags()`
4. Добавьте переменную в `env.d.ts`

## Примеры использования

### Условный рендеринг
```typescript
{features.ENABLE_SUBSCRIPTIONS && <SubscriptionButton />}
```

### API клиент
```typescript
const wsClient = new WebSocketClient(apiConfig.wsURL);
```

### Debug логи
```typescript
if (features.ENABLE_DEBUG_MODE) {
  console.log('Debug info:', data);
}
```