import { get, post, del, patch } from './api';
import { PaginatedResponse } from '../types';

// Типы для подписок и платежей
interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing' | 'paused';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  trialStart?: string;
  trialEnd?: string;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  intervalCount: number;
  features: {
    maxChatsPerDay: number;
    maxMessagesPerMonth: number;
    nsfwContent: boolean;
    prioritySupport: boolean;
    customCharacters: boolean;
    voiceMessages: boolean;
    imageGeneration: boolean;
  };
  isPopular: boolean;
  isActive: boolean;
  stripePriceId?: string;
  createdAt: string;
}

interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'paypal' | 'bank_account';
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    funding: 'credit' | 'debit' | 'prepaid' | 'unknown';
  };
  paypal?: {
    email: string;
  };
  isDefault: boolean;
  stripePaymentMethodId?: string;
  createdAt: string;
}

interface PaymentHistory {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'canceled' | 'refunded';
  description: string;
  paymentMethodId: string;
  paymentMethod: PaymentMethod;
  invoiceId?: string;
  invoiceUrl?: string;
  receiptUrl?: string;
  failureReason?: string;
  refundedAt?: string;
  createdAt: string;
}

interface UsageStats {
  chatsToday: number;
  messagesThisMonth: number;
  charactersCreated: number;
  storageUsed: number; // в MB
  limits: {
    maxChatsPerDay: number;
    maxMessagesPerMonth: number;
    maxCharacters: number;
    maxStorageMB: number;
  };
  resetDate: string;
}

interface PaymentMethodData {
  type: 'card' | 'paypal';
  card?: {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  };
  paypal?: {
    email: string;
  };
  billingDetails?: {
    name: string;
    email: string;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
    };
  };
}

// === SUBSCRIPTION MANAGEMENT ===

/**
 * Получить текущую подписку пользователя
 */
export const getSubscription = async (): Promise<Subscription | null> => {
  try {
    return await get<Subscription>('/subscription');
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; // У пользователя нет активной подписки
    }
    throw error;
  }
};

/**
 * Получить все доступные планы подписки
 */
export const getPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await get<{ plans: SubscriptionPlan[] }>('/subscription/plans');
  return response.plans;
};

/**
 * Получить конкретный план подписки
 */
export const getPlan = async (planId: string): Promise<SubscriptionPlan> => {
  return await get<SubscriptionPlan>(`/subscription/plans/${planId}`);
};

/**
 * Подписаться на план
 */
export const subscribe = async (
  planId: string,
  paymentMethodId: string,
  promoCode?: string
): Promise<Subscription> => {
  const data = {
    planId,
    paymentMethodId,
    promoCode
  };
  return await post<Subscription>('/subscription/subscribe', data);
};

/**
 * Изменить план подписки
 */
export const changePlan = async (
  newPlanId: string,
  prorationBehavior: 'none' | 'create_prorations' | 'always_invoice' = 'create_prorations'
): Promise<Subscription> => {
  const data = {
    planId: newPlanId,
    prorationBehavior
  };
  return await patch<Subscription>('/subscription', data);
};

/**
 * Отменить подписку (в конце текущего периода)
 */
export const cancelSubscription = async (
  cancelAtPeriodEnd: boolean = true,
  reason?: string
): Promise<void> => {
  const data = {
    cancelAtPeriodEnd,
    reason
  };
  await post('/subscription/cancel', data);
};

/**
 * Возобновить отмененную подписку
 */
export const resumeSubscription = async (): Promise<Subscription> => {
  return await post<Subscription>('/subscription/resume');
};

/**
 * Приостановить подписку
 */
export const pauseSubscription = async (
  resumeAt?: string
): Promise<Subscription> => {
  const data = { resumeAt };
  return await post<Subscription>('/subscription/pause', data);
};

/**
 * Получить промо-коды пользователя
 */
export const getUserPromoCodes = async (): Promise<{
  id: string;
  code: string;
  discountPercent: number;
  validUntil: string;
  isUsed: boolean;
}[]> => {
  const response = await get<{ promoCodes: any[] }>('/subscription/promo-codes');
  return response.promoCodes;
};

/**
 * Применить промо-код
 */
export const applyPromoCode = async (code: string): Promise<{
  valid: boolean;
  discountPercent: number;
  validUntil: string;
}> => {
  return await post('/subscription/promo-codes/apply', { code });
};

// === PAYMENT METHODS ===

/**
 * Получить все методы оплаты пользователя
 */
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await get<{ paymentMethods: PaymentMethod[] }>('/payment/methods');
  return response.paymentMethods;
};

/**
 * Добавить новый метод оплаты
 */
export const addPaymentMethod = async (
  paymentMethodData: PaymentMethodData
): Promise<PaymentMethod> => {
  return await post<PaymentMethod>('/payment/methods', paymentMethodData);
};

/**
 * Обновить метод оплаты
 */
export const updatePaymentMethod = async (
  methodId: string,
  updates: Partial<PaymentMethodData>
): Promise<PaymentMethod> => {
  return await patch<PaymentMethod>(`/payment/methods/${methodId}`, updates);
};

/**
 * Удалить метод оплаты
 */
export const deletePaymentMethod = async (methodId: string): Promise<void> => {
  await del(`/payment/methods/${methodId}`);
};

/**
 * Установить метод оплаты по умолчанию
 */
export const setDefaultPaymentMethod = async (methodId: string): Promise<void> => {
  await post(`/payment/methods/${methodId}/set-default`);
};

/**
 * Проверить валидность метода оплаты
 */
export const validatePaymentMethod = async (methodId: string): Promise<{
  valid: boolean;
  errors?: string[];
}> => {
  return await post(`/payment/methods/${methodId}/validate`);
};

// === BILLING ===

/**
 * Получить историю платежей
 */
export const getPaymentHistory = async (
  page: number = 1,
  limit: number = 20,
  status?: PaymentHistory['status']
): Promise<PaginatedResponse<PaymentHistory>> => {
  const params = { page, limit, status };
  return await get<PaginatedResponse<PaymentHistory>>('/payment/history', { params });
};

/**
 * Получить конкретный платеж
 */
export const getPayment = async (paymentId: string): Promise<PaymentHistory> => {
  return await get<PaymentHistory>(`/payment/history/${paymentId}`);
};

/**
 * Скачать инвойс
 */
export const downloadInvoice = async (invoiceId: string): Promise<Blob> => {
  const response = await get(`/billing/invoices/${invoiceId}/download`, {
    responseType: 'blob'
  });
  return response as unknown as Blob;
};

/**
 * Получить список инвойсов
 */
export const getInvoices = async (
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<{
  id: string;
  number: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  amount: number;
  currency: string;
  dueDate: string;
  paidAt?: string;
  invoiceUrl: string;
  downloadUrl: string;
  createdAt: string;
}>> => {
  const params = { page, limit };
  return await get<PaginatedResponse<any>>('/billing/invoices', { params });
};

/**
 * Получить статистику использования
 */
export const getUsageStats = async (): Promise<UsageStats> => {
  return await get<UsageStats>('/billing/usage');
};

/**
 * Получить прогноз следующего счета
 */
export const getUpcomingInvoice = async (): Promise<{
  amount: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
  items: Array<{
    description: string;
    amount: number;
    quantity: number;
  }>;
}> => {
  return await get('/billing/upcoming-invoice');
};

// === STRIPE INTEGRATION ===

/**
 * Создать Payment Intent для оплаты подписки
 */
export const createPaymentIntent = async (
  planId: string,
  paymentMethodId?: string,
  promoCode?: string
): Promise<{
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}> => {
  const data = {
    planId,
    paymentMethodId,
    promoCode
  };
  return await post('/stripe/payment-intent', data);
};

/**
 * Подтвердить платеж
 */
export const confirmPayment = async (
  paymentIntentId: string,
  paymentMethodId?: string
): Promise<{
  status: 'succeeded' | 'requires_action' | 'requires_payment_method' | 'failed';
  subscription?: Subscription;
  error?: string;
}> => {
  const data = {
    paymentIntentId,
    paymentMethodId
  };
  return await post('/stripe/confirm-payment', data);
};

/**
 * Создать Setup Intent для сохранения метода оплаты
 */
export const createSetupIntent = async (): Promise<{
  clientSecret: string;
  setupIntentId: string;
}> => {
  return await post('/stripe/setup-intent');
};

/**
 * Получить Stripe Customer Portal URL
 */
export const getCustomerPortalUrl = async (
  returnUrl?: string
): Promise<{ url: string }> => {
  const data = returnUrl ? { returnUrl } : {};
  return await post('/stripe/customer-portal', data);
};

/**
 * Обработать Stripe webhook (для внутреннего использования)
 */
export const handleStripeWebhook = async (
  payload: string,
  signature: string
): Promise<{ handled: boolean }> => {
  return await post('/stripe/webhook', { payload, signature });
};

// === ANALYTICS AND REPORTING ===

/**
 * Получить статистику подписок (для админов)
 */
export const getSubscriptionAnalytics = async (
  period: 'day' | 'week' | 'month' | 'year' = 'month'
): Promise<{
  totalSubscriptions: number;
  activeSubscriptions: number;
  newSubscriptions: number;
  canceledSubscriptions: number;
  revenue: number;
  churnRate: number;
  planDistribution: Array<{
    planId: string;
    planName: string;
    count: number;
    percentage: number;
  }>;
}> => {
  return await get(`/admin/subscription-analytics?period=${period}`);
};

/**
 * Получить детали биллинга для поддержки
 */
export const getBillingDetails = async (
  userId?: string
): Promise<{
  subscription: Subscription;
  paymentMethods: PaymentMethod[];
  recentPayments: PaymentHistory[];
  usageStats: UsageStats;
}> => {
  const params = userId ? { userId } : {};
  return await get('/support/billing-details', { params });
};

// === UTILITY FUNCTIONS ===

/**
 * Форматировать цену для отображения
 */
export const formatPrice = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount);
};

/**
 * Получить статус подписки на русском языке
 */
export const getSubscriptionStatusText = (status: Subscription['status']): string => {
  const statusMap = {
    active: 'Активная',
    canceled: 'Отменена',
    past_due: 'Просрочена',
    unpaid: 'Неоплачена',
    trialing: 'Пробный период',
    paused: 'Приостановлена'
  };
  return statusMap[status] || status;
};

/**
 * Проверить, есть ли у пользователя доступ к функции
 */
export const hasFeatureAccess = (
  subscription: Subscription | null,
  feature: keyof SubscriptionPlan['features']
): boolean => {
  if (!subscription || subscription.status !== 'active') {
    return false;
  }
  const featureValue = subscription.plan.features[feature];
  return typeof featureValue === 'boolean' ? featureValue : featureValue > 0;
};

/**
 * Получить дни до окончания подписки
 */
export const getDaysUntilExpiry = (subscription: Subscription): number => {
  const endDate = new Date(subscription.currentPeriodEnd);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Проверить, нужно ли обновить подписку
 */
export const shouldUpgrade = (usage: UsageStats): {
  shouldUpgrade: boolean;
  reasons: string[];
} => {
  const reasons: string[] = [];
  
  if (usage.chatsToday >= usage.limits.maxChatsPerDay * 0.8) {
    reasons.push('Приближается лимит чатов на день');
  }
  
  if (usage.messagesThisMonth >= usage.limits.maxMessagesPerMonth * 0.8) {
    reasons.push('Приближается лимит сообщений на месяц');
  }
  
  if (usage.storageUsed >= usage.limits.maxStorageMB * 0.8) {
    reasons.push('Заканчивается место для хранения');
  }
  
  return {
    shouldUpgrade: reasons.length > 0,
    reasons
  };
};

// Экспорт основных функций как объект
export default {
  // Subscription management
  getSubscription,
  getPlans,
  getPlan,
  subscribe,
  changePlan,
  cancelSubscription,
  resumeSubscription,
  pauseSubscription,
  
  // Promo codes
  getUserPromoCodes,
  applyPromoCode,
  
  // Payment methods
  getPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  validatePaymentMethod,
  
  // Billing
  getPaymentHistory,
  getPayment,
  downloadInvoice,
  getInvoices,
  getUsageStats,
  getUpcomingInvoice,
  
  // Stripe integration
  createPaymentIntent,
  confirmPayment,
  createSetupIntent,
  getCustomerPortalUrl,
  
  // Analytics
  getSubscriptionAnalytics,
  getBillingDetails,
  
  // Utilities
  formatPrice,
  getSubscriptionStatusText,
  hasFeatureAccess,
  getDaysUntilExpiry,
  shouldUpgrade
};

// Экспорт типов
export type {
  Subscription,
  SubscriptionPlan,
  PaymentMethod,
  PaymentHistory,
  PaymentMethodData,
  UsageStats
};