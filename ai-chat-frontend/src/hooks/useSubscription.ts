import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { Subscription, SubscriptionPlan } from '../types/subscription';

export type FeatureType =
  | 'nsfw_content'
  | 'unlimited_messages'
  | 'character_creation'
  | 'priority_support'
  | 'custom_characters'
  | 'voice_messages'
  | 'advanced_ai'
  | 'group_chats'
  | 'image_generation'
  | 'export_chats';

export interface UsageStatus {
  used: number;
  limit: number;
  unlimited: boolean;
  percentage: number;
}

export interface SubscriptionLimits {
  messagesPerDay: number;
  chatsPerDay: number;
  charactersCreated: number;
  voiceMinutesPerDay: number;
  imageGenerationsPerDay: number;
}

export interface UseSubscriptionOptions {
  autoLoad?: boolean;
  checkUsageInterval?: number; // ms
  trialDuration?: number; // days
}

export interface UseSubscriptionReturn {
  // Subscription data
  subscription: Subscription | null;
  plans: SubscriptionPlan[];
  isLoading: boolean;

  // Status checks
  isPremium: boolean;
  isActive: boolean;
  isTrial: boolean;
  isExpired: boolean;
  daysUntilExpiry: number;

  // Access controls
  canAccessNSFW: boolean;
  checkFeatureAccess: (feature: FeatureType) => boolean;

  // Usage tracking
  remainingMessages: number;
  remainingChats: number;
  messageUsage: UsageStatus;
  chatUsage: UsageStatus;

  // Actions
  showUpgradePrompt: () => void;
  startFreeTrial: () => Promise<boolean>;
  upgrade: (planId: string) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;

  // Error handling
  lastError: string | null;
  clearError: () => void;

  // Trial management
  trialDaysRemaining: number;
  canStartTrial: boolean;
}

// Default limits for different subscription types
const SUBSCRIPTION_LIMITS: Record<string, SubscriptionLimits> = {
  free: {
    messagesPerDay: 50,
    chatsPerDay: 3,
    charactersCreated: 1,
    voiceMinutesPerDay: 0,
    imageGenerationsPerDay: 0,
  },
  basic: {
    messagesPerDay: 500,
    chatsPerDay: 20,
    charactersCreated: 5,
    voiceMinutesPerDay: 30,
    imageGenerationsPerDay: 20,
  },
  premium: {
    messagesPerDay: -1, // unlimited
    chatsPerDay: -1, // unlimited
    charactersCreated: -1, // unlimited
    voiceMinutesPerDay: -1, // unlimited
    imageGenerationsPerDay: 100,
  },
};

// Feature access matrix
const FEATURE_ACCESS: Record<string, FeatureType[]> = {
  free: ['character_creation'],
  basic: [
    'character_creation',
    'voice_messages',
    'custom_characters',
    'image_generation',
  ],
  premium: [
    'nsfw_content',
    'unlimited_messages',
    'character_creation',
    'priority_support',
    'custom_characters',
    'voice_messages',
    'advanced_ai',
    'group_chats',
    'image_generation',
    'export_chats',
  ],
};

export const useSubscription = (
  options: UseSubscriptionOptions = {}
): UseSubscriptionReturn => {
  const {
    autoLoad = true,
    checkUsageInterval = 60000, // 1 minute
    trialDuration = 7, // days
  } = options;

  // State
  const [lastError, setLastError] = useState<string | null>(null);
  const [showingUpgradePrompt, setShowingUpgradePrompt] = useState(false);

  // Store hooks
  const {
    subscription,
    plans,
    isLoading,
    currentUsage,
    loadSubscription,
    loadPlans,
    subscribe,
    cancelSubscription: storeCancelSubscription,
  } = useSubscriptionStore();

  const { user } = useAuthStore();
  const { nsfwEnabled } = useSettingsStore();

  // Clear error
  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  // Computed values
  const subscriptionType = subscription?.type || 'free';
  const limits = SUBSCRIPTION_LIMITS[subscriptionType];
  const allowedFeatures = FEATURE_ACCESS[subscriptionType] || [];

  // Status checks
  const isPremium = useMemo(() => {
    return subscription?.type === 'premium' && subscription?.isActive;
  }, [subscription]);

  const isActive = useMemo(() => {
    if (!subscription) return false;
    if (!subscription.expiresAt) return subscription.isActive;
    return subscription.isActive && new Date() < subscription.expiresAt;
  }, [subscription]);

  const isTrial = useMemo(() => {
    // Check if trial period is active based on start date
    if (!subscription?.startDate || subscription.type !== 'basic') return false;
    const trialEnd = new Date(subscription.startDate);
    trialEnd.setDate(trialEnd.getDate() + trialDuration);
    return isActive && new Date() < trialEnd;
  }, [subscription, isActive, trialDuration]);

  const isExpired = useMemo(() => {
    if (!subscription?.expiresAt) return false;
    return new Date() > subscription.expiresAt;
  }, [subscription]);

  const daysUntilExpiry = useMemo(() => {
    if (!subscription?.expiresAt) return -1;
    const now = new Date();
    const expiry = subscription.expiresAt;
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [subscription]);

  const trialDaysRemaining = useMemo(() => {
    if (!isTrial || !subscription?.startDate) return 0;
    const trialEnd = new Date(subscription.startDate);
    trialEnd.setDate(trialEnd.getDate() + trialDuration);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }, [isTrial, subscription, trialDuration]);

  const canStartTrial = useMemo(() => {
    return Boolean(user && !subscription);
  }, [user, subscription]);

  // Access controls
  const canAccessNSFW = useMemo(() => {
    return nsfwEnabled && allowedFeatures.includes('nsfw_content');
  }, [nsfwEnabled, allowedFeatures]);

  const checkFeatureAccess = useCallback(
    (feature: FeatureType): boolean => {
      if (!isActive && feature !== 'character_creation') {
        return false;
      }
      return allowedFeatures.includes(feature);
    },
    [isActive, allowedFeatures]
  );

  // Usage calculations
  const messageUsage: UsageStatus = useMemo(() => {
    const used = currentUsage?.messagesThisMonth || 0;
    const limit = limits.messagesPerDay;
    const unlimited = limit === -1;

    return {
      used,
      limit: unlimited ? Infinity : limit,
      unlimited,
      percentage: unlimited ? 0 : Math.min(100, (used / limit) * 100),
    };
  }, [currentUsage, limits.messagesPerDay]);

  const chatUsage: UsageStatus = useMemo(() => {
    const used = currentUsage?.chatsToday || 0;
    const limit = limits.chatsPerDay;
    const unlimited = limit === -1;

    return {
      used,
      limit: unlimited ? Infinity : limit,
      unlimited,
      percentage: unlimited ? 0 : Math.min(100, (used / limit) * 100),
    };
  }, [currentUsage, limits.chatsPerDay]);

  const remainingMessages = useMemo(() => {
    if (messageUsage.unlimited) return Infinity;
    return Math.max(0, messageUsage.limit - messageUsage.used);
  }, [messageUsage]);

  const remainingChats = useMemo(() => {
    if (chatUsage.unlimited) return Infinity;
    return Math.max(0, chatUsage.limit - chatUsage.used);
  }, [chatUsage]);

  // Actions
  const showUpgradePrompt = useCallback(() => {
    setShowingUpgradePrompt(true);
    // You can add modal logic here or emit an event
    console.log('Showing upgrade prompt');
  }, []);

  const startFreeTrial = useCallback(async (): Promise<boolean> => {
    if (!canStartTrial) {
      setLastError('Free trial is not available');
      return false;
    }

    try {
      // Start with basic plan as trial
      await subscribe('basic', 'free');
      return true;
    } catch (error) {
      console.error('Failed to start free trial:', error);
      setLastError(
        error instanceof Error ? error.message : 'Failed to start trial'
      );
      return false;
    }
  }, [canStartTrial, subscribe]);

  const upgrade = useCallback(
    async (planId: string): Promise<boolean> => {
      try {
        await subscribe(planId, 'card'); // Default to card payment
        return true;
      } catch (error) {
        console.error('Failed to upgrade subscription:', error);
        setLastError(
          error instanceof Error ? error.message : 'Failed to upgrade'
        );
        return false;
      }
    },
    [subscribe]
  );

  const cancelSubscription = useCallback(async (): Promise<boolean> => {
    try {
      await storeCancelSubscription();
      return true;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      setLastError(
        error instanceof Error ? error.message : 'Failed to cancel subscription'
      );
      return false;
    }
  }, [storeCancelSubscription]);

  // Auto-load data
  useEffect(() => {
    if (autoLoad && user) {
      loadSubscription().catch((error) => {
        console.error('Failed to load subscription:', error);
        setLastError('Failed to load subscription data');
      });

      loadPlans().catch((error) => {
        console.error('Failed to load plans:', error);
        setLastError('Failed to load subscription plans');
      });
    }
  }, [autoLoad, user, loadSubscription, loadPlans]);

  // Periodic usage check
  useEffect(() => {
    if (!checkUsageInterval || !isActive) return;

    const interval = setInterval(() => {
      loadSubscription().catch((error) => {
        console.warn('Failed to refresh subscription data:', error);
      });
    }, checkUsageInterval);

    return () => clearInterval(interval);
  }, [checkUsageInterval, isActive, loadSubscription]);

  // Show upgrade prompts for limits
  useEffect(() => {
    if (remainingMessages <= 5 && remainingMessages > 0 && !isPremium) {
      console.log('Low message count - consider showing upgrade prompt');
    }

    if (remainingChats <= 1 && remainingChats > 0 && !isPremium) {
      console.log('Low chat count - consider showing upgrade prompt');
    }
  }, [remainingMessages, remainingChats, isPremium]);

  // Trial expiry warning
  useEffect(() => {
    if (isTrial && trialDaysRemaining <= 3 && trialDaysRemaining > 0) {
      console.log(
        `Trial expires in ${trialDaysRemaining} days - consider showing upgrade prompt`
      );
    }
  }, [isTrial, trialDaysRemaining]);

  return {
    // Subscription data
    subscription,
    plans,
    isLoading,

    // Status checks
    isPremium,
    isActive,
    isTrial,
    isExpired,
    daysUntilExpiry,

    // Access controls
    canAccessNSFW,
    checkFeatureAccess,

    // Usage tracking
    remainingMessages,
    remainingChats,
    messageUsage,
    chatUsage,

    // Actions
    showUpgradePrompt,
    startFreeTrial,
    upgrade,
    cancelSubscription,

    // Error handling
    lastError,
    clearError,

    // Trial management
    trialDaysRemaining,
    canStartTrial,
  };
};

export default useSubscription;
