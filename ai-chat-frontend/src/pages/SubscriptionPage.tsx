import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  Check,
  X,
  CreditCard,
  Download,
  Calendar,
  Shield,
  Star,
  Zap,
  Users,
  MessageCircle,
  Heart,
  Plus,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import AuthGuard from '../components/auth/AuthGuard';
import { Button } from '../components/ui';
import { cn } from '../utils/index';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useSettingsStore();
  const { user, subscription } = useAuthStore();

  // Mock payment methods and billing history
  const [paymentMethods] = useState([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: '2',
      type: 'card',
      last4: '5555',
      brand: 'mastercard',
      expiryMonth: 8,
      expiryYear: 2024,
      isDefault: false,
    },
  ]);

  const [billingHistory] = useState([
    {
      id: '1',
      date: '2024-09-01',
      amount: 19.99,
      status: 'paid',
      plan: 'Premium Plan',
      invoiceUrl: '#',
    },
    {
      id: '2',
      date: '2024-08-01',
      amount: 19.99,
      status: 'paid',
      plan: 'Premium Plan',
      invoiceUrl: '#',
    },
    {
      id: '3',
      date: '2024-07-01',
      amount: 9.99,
      status: 'paid',
      plan: 'Basic Plan',
      invoiceUrl: '#',
    },
  ]);

  // FAQ state
  const [openFaqItem, setOpenFaqItem] = useState<string | null>(null);

  const faqItems = [
    {
      id: '1',
      question: 'Можно ли изменить план в любое время?',
      answer:
        'Да, вы можете повысить или понизить свой план в любое время. При повышении плана изменения вступают в силу немедленно, при понижении - с начала следующего периода.',
    },
    {
      id: '2',
      question: 'Что происходит при отмене подписки?',
      answer:
        'При отмене подписки вы сохраняете доступ ко всем премиум функциям до конца текущего периода. После этого ваш аккаунт будет переведен на бесплатный план.',
    },
    {
      id: '3',
      question: 'Возможен ли возврат средств?',
      answer:
        'Мы предоставляем полный возврат средств в течение 14 дней с момента покупки, если вы не удовлетворены сервисом. Обратитесь в поддержку для оформления возврата.',
    },
    {
      id: '4',
      question: 'Какие способы оплаты принимаются?',
      answer:
        'Мы принимаем все основные банковские карты (Visa, Mastercard, American Express), а также PayPal. Все платежи обрабатываются через защищенные каналы Stripe.',
    },
    {
      id: '5',
      question: 'Как защищены мои данные?',
      answer:
        'Мы используем современные методы шифрования для защиты ваших данных. Вся личная информация хранится в соответствии с GDPR и другими международными стандартами.',
    },
  ];

  return (
    <AuthGuard requirePremium={false}>
      <div
        className={cn(
          'min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200',
          theme === 'dark' && 'dark'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Управление подпиской
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Выберите план, который подходит именно вам. Получите доступ к
              премиум функциям и безлимитным возможностям.
            </p>
          </header>

          {/* Current Subscription Status */}
          {subscription && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6 mb-12">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  {subscription.plan === 'premium' ? (
                    <Crown className="w-8 h-8 text-purple-500" />
                  ) : (
                    <Shield className="w-8 h-8 text-blue-500" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {subscription.plan === 'premium'
                        ? 'Premium Plan'
                        : 'Basic Plan'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {subscription.status === 'active'
                        ? 'Активная подписка'
                        : subscription.status === 'canceled'
                          ? 'Подписка отменена'
                          : 'Подписка истекла'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${subscription.plan === 'premium' ? '19.99' : '9.99'}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Следующее списание:{' '}
                    {subscription.nextBillingDate
                      ? new Date(
                          subscription.nextBillingDate
                        ).toLocaleDateString('ru-RU')
                      : 'Не запланировано'}
                  </div>
                </div>
              </div>

              {subscription.status === 'active' && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      /* TODO: Handle plan change */
                    }}
                  >
                    {subscription.plan === 'premium'
                      ? 'Понизить до Basic'
                      : 'Повысить до Premium'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      /* TODO: Handle subscription management */
                    }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Управление подпиской
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Basic Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8 relative">
              <div className="text-center mb-6">
                <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Basic Plan
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    $9.99
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    /месяц
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    500 сообщений в месяц
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Доступ ко всем персонажам
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Создание 3 персонажей
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    История чатов
                  </span>
                </li>
                <li className="flex items-center">
                  <X className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-400">NSFW контент</span>
                </li>
                <li className="flex items-center">
                  <X className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-400">Приоритетная поддержка</span>
                </li>
              </ul>

              <Button
                className="w-full"
                variant={
                  subscription?.plan === 'basic' ? 'secondary' : 'primary'
                }
                disabled={subscription?.plan === 'basic'}
              >
                {subscription?.plan === 'basic'
                  ? 'Текущий план'
                  : 'Выбрать Basic'}
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-purple-500 p-8 relative">
              {/* Popular badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Популярный
                </div>
              </div>

              <div className="text-center mb-6">
                <Crown className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Premium Plan
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    $19.99
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    /месяц
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Безлимитные сообщения
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Доступ ко всем персонажам
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Безлимитное создание персонажей
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Полная история чатов
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    NSFW контент
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Приоритетная поддержка
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Эксклюзивные функции
                  </span>
                </li>
              </ul>

              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                variant={
                  subscription?.plan === 'premium' ? 'secondary' : 'primary'
                }
                disabled={subscription?.plan === 'premium'}
              >
                {subscription?.plan === 'premium'
                  ? 'Текущий план'
                  : 'Выбрать Premium'}
              </Button>
            </div>
          </div>

          {/* Feature Comparison Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Сравнение планов
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Выберите план, который подходит вашим потребностям
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">
                      Функция
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900 dark:text-white">
                      Basic Plan
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900 dark:text-white">
                      Premium Plan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  <tr>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <MessageCircle className="w-5 h-5 mr-3 text-blue-500" />
                        Количество сообщений
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                        500/месяц
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                        Безлимитно
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-3 text-purple-500" />
                        Создание персонажей
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                        До 3
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                        Безлимитно
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <Heart className="w-5 h-5 mr-3 text-red-500" />
                        NSFW контент
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <X className="w-5 h-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-3 text-indigo-500" />
                        История чатов
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                        30 дней
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                        Навсегда
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <Zap className="w-5 h-5 mr-3 text-yellow-500" />
                        Приоритетная поддержка
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <X className="w-5 h-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 mr-3 text-amber-500" />
                        Эксклюзивные функции
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <X className="w-5 h-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Methods & Billing Sections Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Payment Methods Management */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Способы оплаты
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    /* TODO: Add payment method */
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить карту
                </Button>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-8 h-8 text-gray-400" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            •••• •••• •••• {method.last4}
                          </span>
                          {method.isDefault && (
                            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs font-medium">
                              По умолчанию
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {method.brand.toUpperCase()} • Expires{' '}
                          {method.expiryMonth.toString().padStart(2, '0')}/
                          {method.expiryYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!method.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            /* TODO: Set as default */
                          }}
                        >
                          Основная
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          /* TODO: Remove payment method */
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancel/Resume Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Управление подпиской
              </h3>

              {subscription?.status === 'active' ? (
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-medium text-red-900 dark:text-red-200 mb-2">
                      Отменить подписку
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                      Ваша подписка будет активна до конца текущего периода.
                      После этого доступ к премиум функциям будет ограничен.
                    </p>
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                      onClick={() => {
                        /* TODO: Handle cancel subscription */
                      }}
                    >
                      Отменить подписку
                    </Button>
                  </div>
                </div>
              ) : subscription?.status === 'canceled' ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                      Возобновить подписку
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                      Восстановите доступ ко всем премиум функциям. Списание
                      произойдет сразу после подтверждения.
                    </p>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        /* TODO: Handle resume subscription */
                      }}
                    >
                      Возобновить подписку
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    Выберите план выше для активации подписки
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Billing History Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 mb-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                История платежей
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  /* TODO: Export billing history */
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Дата
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      План
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Сумма
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Статус
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {billingHistory.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                        {new Date(payment.date).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                        {payment.plan}
                      </td>
                      <td className="py-4 px-4 text-gray-900 dark:text-white font-semibold">
                        ${payment.amount}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={cn(
                            'inline-flex px-2 py-1 rounded-full text-xs font-medium',
                            payment.status === 'paid'
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : payment.status === 'pending'
                                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          )}
                        >
                          {payment.status === 'paid'
                            ? 'Оплачен'
                            : payment.status === 'pending'
                              ? 'Ожидает'
                              : 'Отклонен'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            /* TODO: Download invoice */
                          }}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Счет
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {billingHistory.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    История платежей пуста
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Часто задаваемые вопросы
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Ответы на самые популярные вопросы о подписке
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqItems.map((item) => (
                <div
                  key={item.id}
                  className="border dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    onClick={() =>
                      setOpenFaqItem(openFaqItem === item.id ? null : item.id)
                    }
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.question}
                    </span>
                    {openFaqItem === item.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaqItem === item.id && (
                    <div className="px-4 pb-4 text-gray-600 dark:text-gray-300">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-8 pt-8 border-t dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Не нашли ответ на свой вопрос?
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  /* TODO: Contact support */
                }}
              >
                Связаться с поддержкой
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default SubscriptionPage;
