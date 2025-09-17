import React, { useState } from 'react';
import { Settings, CreditCard, Receipt, BarChart3 } from 'lucide-react';
import { 
  SubscriptionPlans, 
  PaymentMethods, 
  PaymentHistory, 
  UsageStats,
  type Subscription 
} from '../components/subscription';
import { Button } from '../components/ui';
import { cn } from '../utils';

type TabType = 'overview' | 'plans' | 'payments' | 'history';

const SubscriptionManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);

  const tabs = [
    { id: 'overview' as TabType, label: 'Обзор', icon: BarChart3 },
    { id: 'plans' as TabType, label: 'Планы', icon: Settings },
    { id: 'payments' as TabType, label: 'Способы оплаты', icon: CreditCard },
    { id: 'history' as TabType, label: 'История', icon: Receipt }
  ];

  const handleSubscriptionUpdate = (subscription: Subscription) => {
    setCurrentSubscription(subscription);
  };

  const handleUpgradeClick = () => {
    setActiveTab('plans');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Управление подпиской
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Управляйте своей подпиской, способами оплаты и следите за использованием
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Current Subscription Status */}
              {currentSubscription && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Текущая подписка
                  </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {currentSubscription.plan.displayName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Активна до: {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${currentSubscription.plan.price}/{currentSubscription.plan.interval === 'month' ? 'мес' : 'год'}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveTab('plans')}
                      >
                        Изменить план
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Usage Statistics */}
              <UsageStats
                subscription={currentSubscription}
                onUpgradeClick={handleUpgradeClick}
              />
            </div>
          )}

          {activeTab === 'plans' && (
            <SubscriptionPlans
              onPlanSelected={(planId) => {
                console.log('Selected plan:', planId);
                // В реальном приложении здесь будет логика обработки выбора плана
              }}
              onSubscriptionUpdate={handleSubscriptionUpdate}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentMethods
              onPaymentMethodUpdate={(methods) => {
                console.log('Payment methods updated:', methods);
                // В реальном приложении здесь будет логика обработки обновления методов оплаты
              }}
            />
          )}

          {activeTab === 'history' && (
            <PaymentHistory />
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Быстрые действия
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center py-3"
              onClick={() => setActiveTab('plans')}
            >
              <Settings className="h-5 w-5 mr-2" />
              Изменить план
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center py-3"
              onClick={() => setActiveTab('payments')}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Добавить карту
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center py-3"
              onClick={() => setActiveTab('history')}
            >
              <Receipt className="h-5 w-5 mr-2" />
              Скачать счета
            </Button>
          </div>
        </div>

        {/* Support Information */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Нужна помощь?
          </h3>
          <p className="text-blue-700 mb-4">
            Если у вас есть вопросы по подписке или оплате, наша служба поддержки готова помочь.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              Связаться с поддержкой
            </Button>
            <Button
              variant="ghost"
              className="text-blue-600 hover:bg-blue-100"
            >
              Перейти в справочный центр
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagementPage;