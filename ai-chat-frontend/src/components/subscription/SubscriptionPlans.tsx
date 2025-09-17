import React, { useState, useEffect } from 'react';
import { Check, Crown, Zap, Star, CreditCard } from 'lucide-react';
import { Button } from '../ui';
import { 
  getPlans, 
  getSubscription, 
  subscribe, 
  formatPrice,
  type SubscriptionPlan,
  type Subscription 
} from '../../services/subscriptionApi';
import { cn } from '../../utils';

interface SubscriptionPlansProps {
  onPlanSelected?: (planId: string) => void;
  onSubscriptionUpdate?: (subscription: Subscription) => void;
  className?: string;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  onPlanSelected,
  onSubscriptionUpdate,
  className
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansData, subscriptionData] = await Promise.all([
        getPlans(),
        getSubscription()
      ]);
      setPlans(plansData);
      setCurrentSubscription(subscriptionData);
    } catch (err) {
      setError('Ошибка загрузки планов подписки');
      console.error('Error loading subscription data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string, paymentMethodId: string) => {
    try {
      setSubscribing(planId);
      setError(null);
      
      const subscription = await subscribe(planId, paymentMethodId);
      setCurrentSubscription(subscription);
      
      if (onSubscriptionUpdate) {
        onSubscriptionUpdate(subscription);
      }
      
      if (onPlanSelected) {
        onPlanSelected(planId);
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при оформлении подписки');
    } finally {
      setSubscribing(null);
    }
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('premium') || name.includes('pro')) return Crown;
    if (name.includes('plus')) return Zap;
    if (name.includes('basic') || name.includes('standard')) return Star;
    return CreditCard;
  };

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.planId === planId && currentSubscription?.status === 'active';
  };

  const getButtonText = (plan: SubscriptionPlan) => {
    if (isCurrentPlan(plan.id)) {
      return 'Текущий план';
    }
    if (currentSubscription?.status === 'active') {
      return 'Сменить план';
    }
    if (plan.name.toLowerCase().includes('free')) {
      return 'Выбрать бесплатный';
    }
    return 'Подписаться';
  };

  const getButtonVariant = (plan: SubscriptionPlan) => {
    if (isCurrentPlan(plan.id)) return 'secondary';
    if (plan.isPopular) return 'primary';
    return 'outline';
  };

  if (loading) {
    return (
      <div className={cn("flex justify-center items-center py-8", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadData} variant="outline">
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Выберите подходящий план
        </h2>
        <p className="text-gray-600">
          Получите доступ ко всем возможностям AI-чата
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = getPlanIcon(plan.name);
          const isActive = isCurrentPlan(plan.id);
          const isPopular = plan.isPopular;

          return (
            <div
              key={plan.id}
              className={cn(
                "relative bg-white rounded-lg border-2 p-6 transition-all duration-200",
                isActive && "border-green-500 bg-green-50",
                isPopular && !isActive && "border-purple-500 shadow-lg",
                !isActive && !isPopular && "border-gray-200 hover:border-gray-300"
              )}
            >
              {/* Popular Badge */}
              {isPopular && !isActive && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Популярный
                  </span>
                </div>
              )}

              {/* Active Badge */}
              {isActive && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Активный
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <Icon 
                  className={cn(
                    "h-8 w-8 mx-auto mb-3",
                    isActive && "text-green-600",
                    isPopular && !isActive && "text-purple-600",
                    !isActive && !isPopular && "text-gray-600"
                  )}
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {plan.displayName}
                </h3>
                <p className="text-gray-600 text-sm">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatPrice(plan.price, plan.currency)}
                  <span className="text-lg font-normal text-gray-600">
                    /{plan.interval === 'month' ? 'мес' : 'год'}
                  </span>
                </div>
                {plan.interval === 'year' && (
                  <p className="text-sm text-green-600">
                    Экономия 20% при годовой оплате
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  <span>
                    {plan.features.maxChatsPerDay === -1 
                      ? 'Неограниченные чаты' 
                      : `${plan.features.maxChatsPerDay} чатов в день`
                    }
                  </span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  <span>
                    {plan.features.maxMessagesPerMonth === -1 
                      ? 'Неограниченные сообщения' 
                      : `${plan.features.maxMessagesPerMonth} сообщений в месяц`
                    }
                  </span>
                </li>
                {plan.features.nsfwContent && (
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span>NSFW контент</span>
                  </li>
                )}
                {plan.features.customCharacters && (
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span>Создание персонажей</span>
                  </li>
                )}
                {plan.features.voiceMessages && (
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span>Голосовые сообщения</span>
                  </li>
                )}
                {plan.features.imageGeneration && (
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span>Генерация изображений</span>
                  </li>
                )}
                {plan.features.prioritySupport && (
                  <li className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span>Приоритетная поддержка</span>
                  </li>
                )}
              </ul>

              {/* Action Button */}
              <Button
                className="w-full"
                variant={getButtonVariant(plan)}
                disabled={isActive || subscribing === plan.id}
                loading={subscribing === plan.id}
                onClick={() => {
                  // В реальном приложении здесь будет открываться модал выбора способа оплаты
                  // Для демонстрации используем фиктивный ID метода оплаты
                  if (!isActive && plan.price > 0) {
                    handleSubscribe(plan.id, 'demo-payment-method');
                  }
                }}
              >
                {getButtonText(plan)}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Current Subscription Info */}
      {currentSubscription && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">
            Информация о подписке
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Статус:</span>
              <span className="ml-2 font-medium">
                {currentSubscription.status === 'active' ? 'Активна' : 'Неактивна'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Следующее списание:</span>
              <span className="ml-2 font-medium">
                {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('ru-RU')}
              </span>
            </div>
          </div>
          {currentSubscription.cancelAtPeriodEnd && (
            <p className="text-yellow-600 text-sm mt-2">
              Подписка будет отменена {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('ru-RU')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;