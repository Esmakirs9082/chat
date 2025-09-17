import { useState, useEffect, useCallback } from 'react';

export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface Subscription {
  tier: SubscriptionTier;
  expiresAt?: number; // timestamp
  isTrial: boolean;
}

const FEATURE_MAP: Record<string, SubscriptionTier> = {
  'chat-nsfw': 'pro',
  'gallery-unlimited': 'premium',
  'dashboard-advanced': 'pro',
  'character-creator': 'free',
};

export function useSubscription(userId: string) {
  const [subscription, setSubscription] = useState<Subscription>({ tier: 'free', isTrial: true });
  const [loading, setLoading] = useState(true);
  const [upgradePrompt, setUpgradePrompt] = useState<string | null>(null);

  // Имитация запроса статуса подписки
  useEffect(() => {
    setLoading(true);
    // Здесь должен быть реальный API-запрос
    setTimeout(() => {
      // Пример: пользователь на trial "pro"
      setSubscription({ tier: 'pro', expiresAt: Date.now() + 7 * 24 * 3600 * 1000, isTrial: true });
      setLoading(false);
    }, 500);
  }, [userId]);

  // Проверка доступа к фиче
  const hasAccess = useCallback((feature: string) => {
    const required = FEATURE_MAP[feature] || 'free';
    const tiers = ['free', 'pro', 'premium'];
    return tiers.indexOf(subscription.tier) >= tiers.indexOf(required);
  }, [subscription]);

  // Запрос апгрейда
  const requestUpgrade = useCallback((feature: string) => {
    const required = FEATURE_MAP[feature] || 'free';
    if (!hasAccess(feature)) {
      setUpgradePrompt(`Для доступа к "${feature}" требуется тариф: ${required}`);
    } else {
      setUpgradePrompt(null);
    }
  }, [hasAccess]);

  // Логика триала
  const isTrialActive = subscription.isTrial && subscription.expiresAt && subscription.expiresAt > Date.now();

  return {
    subscription,
    loading,
    hasAccess,
    requestUpgrade,
    upgradePrompt,
    isTrialActive,
  };
}
