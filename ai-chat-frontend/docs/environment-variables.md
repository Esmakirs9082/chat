# Environment Variables Management

## Обзор

Проект использует комплексную систему управления переменными окружения с полной типизацией TypeScript и поддержкой множественных сред развертывания.

## Структура файлов

### Основные файлы конфигурации

- **`.env.example`** - Шаблон со всеми доступными переменными
- **`.env.development`** - Настройки для локальной разработки
- **`.env.staging`** - Настройки для тестовой среды
- **`.env.production`** - Настройки для продакшена
- **`src/vite-env.d.ts`** - TypeScript типы для переменных окружения
- **`src/config/env.ts`** - Центральная логика управления конфигурацией

### Среды развертывания

#### Development
```bash
# Основные настройки для разработки
VITE_APP_ENV=development
VITE_DEBUG_MODE=true
VITE_USE_MOCK_API=true
VITE_ENABLE_DEV_TOOLS=true
VITE_HMR=true
```

#### Staging
```bash
# Настройки для тестирования
VITE_APP_ENV=staging
VITE_DEBUG_MODE=false
VITE_ENABLE_BETA_FEATURES=true
VITE_USE_MOCK_API=false
```

#### Production
```bash
# Настройки для продакшена
VITE_APP_ENV=production
VITE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SENTRY=true
VITE_ENABLE_MODERATION=true
```

## Категории переменных

### 🌐 API Configuration
- `VITE_API_URL` - URL основного API
- `VITE_WS_URL` - URL WebSocket соединений
- `VITE_API_TIMEOUT` - Таймаут запросов (ms)
- `VITE_API_RETRY_ATTEMPTS` - Количество повторных попыток

### 🔐 Authentication & Security
- `VITE_TOKEN_EXPIRY` - Срок действия токенов (секунды)
- `VITE_REFRESH_TOKEN_EXPIRY` - Срок действия refresh токенов
- `VITE_SECURE_COOKIES` - Использование secure cookies
- `VITE_STORAGE_PREFIX` - Префикс для localStorage ключей

### 🔌 Third-party Services
- `VITE_STRIPE_PUBLISHABLE_KEY` - Публичный ключ Stripe
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `VITE_DISCORD_CLIENT_ID` - Discord OAuth Client ID
- `VITE_SENTRY_DSN` - Sentry DSN для мониторинга ошибок
- `VITE_GA_TRACKING_ID` - Google Analytics ID
- `VITE_GTM_ID` - Google Tag Manager ID
- `VITE_POSTHOG_KEY` - PostHog аналитика

### ⚡ Performance & Rate Limiting
- `VITE_RATE_LIMIT_RPM` - Лимит запросов в минуту
- `VITE_MESSAGE_RATE_LIMIT` - Лимит сообщений
- `VITE_CONNECTION_TIMEOUT` - Таймаут соединения
- `VITE_WS_HEARTBEAT_INTERVAL` - Интервал heartbeat WebSocket

### 🛡️ Content & Moderation
- `VITE_CONTENT_FILTER_LEVEL` - Уровень фильтрации (strict/moderate/permissive)
- `VITE_MAX_MESSAGE_LENGTH` - Максимальная длина сообщения
- `VITE_MAX_MESSAGES_PER_CHAT` - Максимум сообщений в чате
- `VITE_ENABLE_MODERATION` - Включить модерацию контента

### 🎛️ Feature Flags
- `VITE_ENABLE_ANALYTICS` - Аналитика
- `VITE_ENABLE_SENTRY` - Мониторинг ошибок
- `VITE_ENABLE_SUBSCRIPTIONS` - Подписки
- `VITE_ENABLE_NSFW` - NSFW контент
- `VITE_ENABLE_CHARACTER_CREATION` - Создание персонажей
- `VITE_ENABLE_REALTIME_CHAT` - Real-time чат
- `VITE_ENABLE_BETA_FEATURES` - Бета функции

## Использование в коде

### Импорт конфигурации
```typescript
import { env, features, externalServices } from '@/config/env';

// Доступ к переменным
const apiUrl = env.API_URL;
const isAnalyticsEnabled = features.ENABLE_ANALYTICS;
const stripeKey = externalServices.stripe.publicKey;
```

### Проверка feature flags
```typescript
import { isFeatureEnabled } from '@/config/env';

if (isFeatureEnabled('ENABLE_BETA_FEATURES')) {
  // Показать бета функции
}
```

### Условная загрузка сервисов
```typescript
import { externalServices } from '@/config/env';

if (externalServices.sentry.enabled) {
  // Инициализировать Sentry
  Sentry.init({
    dsn: externalServices.sentry.dsn,
    environment: externalServices.sentry.environment,
  });
}
```

## Типобезопасность

Все переменные окружения имеют строгую типизацию:

```typescript
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ENABLE_ANALYTICS?: string;
  readonly VITE_CONTENT_FILTER_LEVEL?: 'strict' | 'moderate' | 'permissive';
  // ... остальные типы
}
```

## Валидация конфигурации

Система автоматически валидирует обязательные переменные для продакшена:

```typescript
// Ошибка если API_URL не задан в production
// Предупреждения для рекомендуемых сервисов
```

## Отладка конфигурации

В development режиме с включенным `VITE_DEBUG_MODE=true`:

```typescript
// В консоли браузера отобразится:
// 🔧 Environment Configuration
//   Environment: development
//   API URL: http://localhost:3001/api
//   Features: { ENABLE_ANALYTICS: false, ... }
//   External Services: { stripe: { enabled: false }, ... }
```

## Deployment конфигурация

### Vercel
Переменные задаются через Vercel Dashboard или `vercel.json`:
```json
{
  "env": {
    "VITE_API_URL": "@api-url",
    "VITE_STRIPE_PUBLISHABLE_KEY": "@stripe-key"
  }
}
```

### Netlify
Переменные задаются через Netlify Dashboard или `netlify.toml`:
```toml
[context.production.environment]
  VITE_APP_ENV = "production"
  VITE_ENABLE_ANALYTICS = "true"
```

### Docker
Переменные передаются через `docker-compose.yml`:
```yaml
environment:
  - VITE_API_URL=${API_URL}
  - VITE_APP_ENV=production
```

## Безопасность

### Публичные переменные
- Все переменные с префиксом `VITE_` доступны в браузере
- Никогда не храните секретные ключи в `VITE_` переменных
- Используйте только публичные ключи для внешних сервисов

### Приватные переменные
- Серверные ключи и секреты без префикса `VITE_`
- Доступны только во время сборки
- Используются в serverless функциях и API

## Миграция конфигурации

При обновлении переменных окружения:

1. Обновите `.env.example` с новыми переменными
2. Добавьте типы в `src/vite-env.d.ts`
3. Обновите интерфейсы в `src/config/env.ts`
4. Обновите соответствующие `.env.*` файлы
5. Обновите deployment конфигурации

## Мониторинг

- Логи инициализации конфигурации в development
- Sentry для отслеживания ошибок конфигурации в production
- Валидация обязательных переменных при старте приложения

---

Эта система обеспечивает:
- ✅ Полную типобезопасность
- ✅ Гибкость для разных сред
- ✅ Централизованную конфигурацию
- ✅ Автоматическую валидацию
- ✅ Удобство разработки и отладки