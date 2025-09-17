// Типы для подписок и платежей

export interface Subscription {
  type: 'free' | 'basic' | 'premium';
  isActive: boolean;
  startDate: Date;
  expiresAt?: Date;
  autoRenew: boolean;
  paymentMethod?: 'card' | 'paypal' | 'crypto';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: 'USD';
  features: string[];
  maxChatsPerDay: number;
  maxMessagesPerChat: number;
  nsfwAccess: boolean;
  prioritySupport: boolean;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  createdAt: Date;
  subscriptionType: string;
  paymentMethod: string;
}
