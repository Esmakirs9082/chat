# Subscription API Documentation

## Обзор

API для управления подписками предоставляет полный набор методов для работы с планами подписки, методами оплаты, биллингом и интеграцией со Stripe.

## Основные функции

### 🔄 Управление подписками

- ✅ **getSubscription()** - Получение текущей подписки
- ✅ **getPlans()** - Получение всех планов подписки  
- ✅ **subscribe()** - Оформление подписки
- ✅ **cancelSubscription()** - Отмена подписки
- ✅ **resumeSubscription()** - Возобновление подписки
- ✅ **changePlan()** - Изменение плана
- ✅ **pauseSubscription()** - Приостановка подписки

### 💳 Методы оплаты

- ✅ **getPaymentMethods()** - Получение методов оплаты
- ✅ **addPaymentMethod()** - Добавление нового метода
- ✅ **updatePaymentMethod()** - Обновление метода оплаты
- ✅ **deletePaymentMethod()** - Удаление метода оплаты
- ✅ **setDefaultPaymentMethod()** - Установка метода по умолчанию

### 💰 Биллинг и платежи

- ✅ **getPaymentHistory()** - История платежей
- ✅ **downloadInvoice()** - Скачивание инвойсов
- ✅ **getUsageStats()** - Статистика использования
- ✅ **getUpcomingInvoice()** - Предстоящие платежи

### 🔐 Интеграция Stripe

- ✅ **createPaymentIntent()** - Создание намерения платежа
- ✅ **confirmPayment()** - Подтверждение платежа
- ✅ **createSetupIntent()** - Настройка метода оплаты
- ✅ **getCustomerPortalUrl()** - URL портала клиента

## Примеры использования

### Подписка на план

\`\`\`typescript
import { subscribe, getPlans } from '../services/subscriptionApi';

// Получаем доступные планы
const plans = await getPlans();

// Подписываемся на выбранный план
const subscription = await subscribe('plan-premium', 'payment-method-id');
\`\`\`

### Управление методами оплаты

\`\`\`typescript
import { addPaymentMethod, setDefaultPaymentMethod } from '../services/subscriptionApi';

// Добавляем новую карту
const paymentMethod = await addPaymentMethod({
  type: 'card',
  card: {
    number: '4242424242424242',
    expMonth: 12,
    expYear: 2025,
    cvc: '123'
  },
  billingDetails: {
    name: 'Иван Иванов',
    email: 'ivan@example.com'
  }
});

// Устанавливаем как основной метод
await setDefaultPaymentMethod(paymentMethod.id);
\`\`\`

### Работа с историей платежей

\`\`\`typescript
import { getPaymentHistory, downloadInvoice } from '../services/subscriptionApi';

// Получаем историю платежей
const history = await getPaymentHistory(1, 10, 'succeeded');

// Скачиваем инвойс
const blob = await downloadInvoice('invoice-id');
const url = URL.createObjectURL(blob);
window.open(url);
\`\`\`

### Статистика использования

\`\`\`typescript
import { getUsageStats, shouldUpgrade } from '../services/subscriptionApi';

const usage = await getUsageStats();
const upgradeInfo = shouldUpgrade(usage);

if (upgradeInfo.shouldUpgrade) {
  console.log('Рекомендации по улучшению:', upgradeInfo.reasons);
}
\`\`\`

## Компоненты UI

### SubscriptionPlans

Компонент для отображения и выбора планов подписки.

\`\`\`jsx
<SubscriptionPlans
  onPlanSelected={(planId) => console.log('Selected:', planId)}
  onSubscriptionUpdate={(subscription) => setSubscription(subscription)}
/>
\`\`\`

### PaymentMethods

Управление методами оплаты пользователя.

\`\`\`jsx
<PaymentMethods
  onPaymentMethodUpdate={(methods) => console.log('Updated:', methods)}
/>
\`\`\`

### PaymentHistory

Отображение истории платежей с пагинацией и фильтрами.

\`\`\`jsx
<PaymentHistory />
\`\`\`

### UsageStats

Статистика использования с прогрессом и рекомендациями.

\`\`\`jsx
<UsageStats
  subscription={subscription}
  onUpgradeClick={() => showUpgradeModal()}
/>
\`\`\`

## Типы данных

### Subscription

\`\`\`typescript
interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing' | 'paused';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  // ... другие поля
}
\`\`\`

### SubscriptionPlan

\`\`\`typescript
interface SubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: {
    maxChatsPerDay: number;
    maxMessagesPerMonth: number;
    nsfwContent: boolean;
    prioritySupport: boolean;
    customCharacters: boolean;
    voiceMessages: boolean;
    imageGeneration: boolean;
  };
  // ... другие поля
}
\`\`\`

### PaymentMethod

\`\`\`typescript
interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'paypal' | 'bank_account';
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
  // ... другие поля
}
\`\`\`

## Обработка ошибок

Все методы API могут выбрасывать исключения, которые нужно обрабатывать:

\`\`\`typescript
try {
  const subscription = await subscribe(planId, paymentMethodId);
  // Успешная подписка
} catch (error: any) {
  if (error.response?.status === 402) {
    // Ошибка оплаты
    console.error('Payment failed:', error.response.data.message);
  } else {
    // Другая ошибка
    console.error('Subscription failed:', error.message);
  }
}
\`\`\`

## Интеграция со Stripe

### Создание платежа

\`\`\`typescript
import { createPaymentIntent, confirmPayment } from '../services/subscriptionApi';

// Создаем намерение платежа
const { clientSecret, paymentIntentId } = await createPaymentIntent('plan-id');

// Используем Stripe Elements для обработки карты
// ... stripe elements код ...

// Подтверждаем платеж
const result = await confirmPayment(paymentIntentId, 'payment-method-id');

if (result.status === 'succeeded') {
  console.log('Payment succeeded!', result.subscription);
}
\`\`\`

### Портал клиента Stripe

\`\`\`typescript
import { getCustomerPortalUrl } from '../services/subscriptionApi';

const { url } = await getCustomerPortalUrl(window.location.href);
window.location.href = url;
\`\`\`

## Утилиты

### Форматирование цены

\`\`\`typescript
import { formatPrice } from '../services/subscriptionApi';

const price = formatPrice(9.99, 'USD'); // "$9.99"
const priceRu = formatPrice(599, 'RUB', 'ru-RU'); // "599 ₽"
\`\`\`

### Проверка доступа к функциям

\`\`\`typescript
import { hasFeatureAccess } from '../services/subscriptionApi';

const canUseNSFW = hasFeatureAccess(subscription, 'nsfwContent');
const canCreateCharacters = hasFeatureAccess(subscription, 'customCharacters');
\`\`\`

## Рекомендации

1. **Кэширование**: Кэшируйте результаты `getPlans()` и `getSubscription()` для улучшения производительности
2. **Обработка ошибок**: Всегда оборачивайте API вызовы в try-catch
3. **Уведомления**: Используйте toast уведомления для информирования пользователя о результатах операций
4. **Валидация**: Валидируйте данные форм перед отправкой на сервер
5. **Безопасность**: Никогда не храните полные номера карт в клиентском коде