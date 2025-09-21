import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import {
  Subscription,
  SubscriptionPlan,
  PaymentHistory,
} from '../types/subscription';

// Интерфейс для текущего использования
interface CurrentUsage {
  chatsToday: number;
  messagesThisMonth: number;
}

// Состояние store
interface SubscriptionState {
  subscription: Subscription | null;
  plans: SubscriptionPlan[];
  paymentHistory: PaymentHistory[];
  isLoading: boolean;
  currentUsage: CurrentUsage;
}

// Действия store
interface SubscriptionActions {
  loadSubscription: () => Promise<void>;
  loadPlans: () => Promise<void>;
  subscribe: (planId: string, paymentMethod: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  loadPaymentHistory: () => Promise<void>;
  checkUsageLimits: () => boolean;
  updatePaymentMethod: (method: string) => Promise<void>;
  reset: () => void;
}

// Computed properties
interface SubscriptionComputed {
  isActive: boolean;
  isPremium: boolean;
  canAccessNSFW: boolean;
  remainingChats: number;
  remainingMessages: number;
}

export const useSubscriptionStore = create<
  SubscriptionState & SubscriptionActions & SubscriptionComputed
>()(
  persist(
    immer((set, get) => ({
      // State
      subscription: null,
      plans: [],
      paymentHistory: [],
      isLoading: false,
      currentUsage: {
        chatsToday: 0,
        messagesThisMonth: 0,
      },

      // Computed properties
      get isActive() {
        const { subscription } = get();
        return subscription?.isActive || false;
      },

      get isPremium() {
        const { subscription } = get();
        return subscription?.type === 'premium' && get().isActive;
      },

      get canAccessNSFW() {
        const { subscription } = get();
        if (!subscription || !get().isActive) return false;
        return subscription.type === 'basic' || subscription.type === 'premium';
      },

      get remainingChats() {
        const { subscription, currentUsage } = get();
        if (!subscription || !get().isActive) return 0;

        const plan = get().plans.find((p) => p.id === subscription.type);
        if (!plan) return 0;

        return Math.max(0, plan.maxChatsPerDay - currentUsage.chatsToday);
      },

      get remainingMessages() {
        const { subscription, currentUsage } = get();
        if (!subscription || !get().isActive) return 0;

        const plan = get().plans.find((p) => p.id === subscription.type);
        if (!plan) return 0;

        return Math.max(
          0,
          plan.maxMessagesPerChat - currentUsage.messagesThisMonth
        );
      },

      // Actions
      loadSubscription: async () => {
        set({ isLoading: true });

        try {
          // TODO: Реальный API вызов
          // const subscription = await subscriptionApi.getCurrentSubscription();

          // Мок данные для демонстрации
          const mockSubscription: Subscription | null = {
            type: 'basic',
            isActive: true,
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 дней назад
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // через 30 дней
            autoRenew: true,
            paymentMethod: 'card',
          };

          set({ subscription: mockSubscription });
        } catch (error) {
          console.error('Failed to load subscription:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      loadPlans: async () => {
        set({ isLoading: true });

        try {
          // TODO: Реальный API вызов
          // const plans = await subscriptionApi.getPlans();

          // Мок данные для демонстрации
          const mockPlans: SubscriptionPlan[] = [
            {
              id: 'free',
              name: 'Бесплатный',
              price: 0,
              currency: 'USD',
              features: ['3 чата в день', '100 сообщений в месяц'],
              maxChatsPerDay: 3,
              maxMessagesPerChat: 100,
              nsfwAccess: false,
              prioritySupport: false,
            },
            {
              id: 'basic',
              name: 'Базовый',
              price: 9.99,
              currency: 'USD',
              features: [
                '50 чатов в день',
                '2000 сообщений в месяц',
                'NSFW контент',
                'Создание персонажей',
              ],
              maxChatsPerDay: 50,
              maxMessagesPerChat: 2000,
              nsfwAccess: true,
              prioritySupport: false,
            },
            {
              id: 'premium',
              name: 'Премиум',
              price: 19.99,
              currency: 'USD',
              features: [
                'Безлимитные чаты',
                'Безлимитные сообщения',
                'NSFW контент',
                'Приоритетная поддержка',
              ],
              maxChatsPerDay: -1, // безлимит
              maxMessagesPerChat: -1, // безлимит
              nsfwAccess: true,
              prioritySupport: true,
            },
          ];

          set({ plans: mockPlans });
        } catch (error) {
          console.error('Failed to load plans:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      subscribe: async (planId: string, paymentMethod: string) => {
        set({ isLoading: true });

        try {
          // TODO: Реальный API вызов
          // const subscription = await subscriptionApi.subscribe(planId, paymentMethod);

          // Мок создания подписки
          const newSubscription: Subscription = {
            type: planId as 'free' | 'basic' | 'premium',
            isActive: true,
            startDate: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // через 30 дней
            autoRenew: true,
            paymentMethod: paymentMethod as 'card' | 'paypal' | 'crypto',
          };

          set({ subscription: newSubscription });

          // Добавляем запись в историю платежей
          const paymentRecord: PaymentHistory = {
            id: `payment-${Date.now()}`,
            amount: get().plans.find((p) => p.id === planId)?.price || 0,
            currency: 'USD',
            status: 'paid',
            paymentMethod,
            createdAt: new Date(),
            subscriptionType: planId,
          };

          set((state) => {
            state.paymentHistory.unshift(paymentRecord);
          });
        } catch (error) {
          console.error('Failed to subscribe:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      cancelSubscription: async () => {
        set({ isLoading: true });

        try {
          // TODO: Реальный API вызов
          // await subscriptionApi.cancelSubscription();

          set((state) => {
            if (state.subscription) {
              state.subscription.isActive = false;
              state.subscription.autoRenew = false;
            }
          });
        } catch (error) {
          console.error('Failed to cancel subscription:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      loadPaymentHistory: async () => {
        set({ isLoading: true });

        try {
          // TODO: Реальный API вызов
          // const history = await subscriptionApi.getPaymentHistory();

          // Мок данные для демонстрации
          const mockHistory: PaymentHistory[] = [
            {
              id: 'payment-1',
              amount: 9.99,
              currency: 'USD',
              status: 'paid',
              paymentMethod: 'card_****1234',
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // неделю назад
              subscriptionType: 'basic',
            },
            {
              id: 'payment-2',
              amount: 9.99,
              currency: 'USD',
              status: 'paid',
              paymentMethod: 'card_****1234',
              createdAt: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000), // месяц назад
              subscriptionType: 'basic',
            },
          ];

          set({ paymentHistory: mockHistory });
        } catch (error) {
          console.error('Failed to load payment history:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      checkUsageLimits: () => {
        const { subscription, currentUsage } = get();

        if (!subscription || !get().isActive) {
          return false; // нет активной подписки
        }

        const plan = get().plans.find((p) => p.id === subscription.type);
        if (!plan) return false;

        // Проверяем лимиты (если -1, то безлимит)
        const chatsLimitExceeded =
          plan.maxChatsPerDay !== -1 &&
          currentUsage.chatsToday >= plan.maxChatsPerDay;

        const messagesLimitExceeded =
          plan.maxMessagesPerChat !== -1 &&
          currentUsage.messagesThisMonth >= plan.maxMessagesPerChat;

        return !chatsLimitExceeded && !messagesLimitExceeded;
      },

      updatePaymentMethod: async (method: string) => {
        set({ isLoading: true });

        try {
          // TODO: Реальный API вызов
          // await subscriptionApi.updatePaymentMethod(method);

          set((state) => {
            if (state.subscription) {
              state.subscription.paymentMethod = method as
                | 'card'
                | 'paypal'
                | 'crypto';
            }
          });
        } catch (error) {
          console.error('Failed to update payment method:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Utility methods (не в интерфейсе, но полезные)
      incrementUsage: (type: 'chat' | 'message') => {
        set((state) => {
          if (type === 'chat') {
            state.currentUsage.chatsToday += 1;
          } else {
            state.currentUsage.messagesThisMonth += 1;
          }
        });
      },

      resetDailyUsage: () => {
        set((state) => {
          state.currentUsage.chatsToday = 0;
        });
      },

      resetMonthlyUsage: () => {
        set((state) => {
          state.currentUsage.messagesThisMonth = 0;
        });
      },

      reset: () => {
        set({
          subscription: null,
          plans: [],
          paymentHistory: [],
          isLoading: false,
          currentUsage: {
            chatsToday: 0,
            messagesThisMonth: 0,
          },
        });
      },
    })),
    {
      name: 'subscription-store',
      partialize: (state) => ({
        subscription: state.subscription,
        currentUsage: state.currentUsage,
      }),
    }
  )
);
