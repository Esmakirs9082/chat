import React from 'react';
import { Crown, Zap, CreditCard, Check, XCircle, ArrowRight } from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { useAuthStore } from '../stores/authStore';

const features = [
  { label: 'Неограниченные сообщения', basic: true, premium: true },
  { label: 'Доступ ко всем персонажам', basic: true, premium: true },
  { label: 'NSFW контент', basic: false, premium: true },
  { label: 'Создание собственных персонажей', basic: false, premium: true },
  { label: 'Приоритетная поддержка', basic: false, premium: true },
  { label: 'История биллинга', basic: true, premium: true },
];

const billingHistory = [
  { id: '1', date: '2025-09-01', plan: 'Premium', amount: '$19.99', status: 'Успешно' },
  { id: '2', date: '2025-08-01', plan: 'Premium', amount: '$19.99', status: 'Успешно' },
  { id: '3', date: '2025-07-01', plan: 'Basic', amount: '$9.99', status: 'Успешно' },
];

const SubscriptionPage: React.FC = () => {
  const { subscription } = useAuthStore();

  const handlePayment = (plan: 'basic' | 'premium') => {
    // TODO: Stripe integration
    alert(`Переход к оплате тарифа: ${plan === 'basic' ? 'Basic $9.99' : 'Premium $19.99'}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">Подписки и биллинг</h1>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Basic Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
            <Zap className="w-10 h-10 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Basic</h2>
            <div className="text-4xl font-bold text-gray-900 mb-2">$9.99</div>
            <div className="text-gray-500 mb-6">в месяц</div>
            <Button 
              variant="primary"
              className="w-full mb-2"
              onClick={() => handlePayment('basic')}
              disabled={subscription === 'basic'}
            >
              {subscription === 'basic' ? 'Активен' : 'Выбрать Basic'}
            </Button>
            <Badge variant="success">Стандартные возможности</Badge>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 flex flex-col items-center text-white">
            <Crown className="w-10 h-10 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Premium</h2>
            <div className="text-4xl font-bold mb-2">$19.99</div>
            <div className="opacity-80 mb-6">в месяц</div>
            <Button 
              variant="secondary"
              className="w-full mb-2"
              onClick={() => handlePayment('premium')}
              disabled={subscription === 'premium'}
            >
              {subscription === 'premium' ? 'Активен' : 'Выбрать Premium'}
            </Button>
            <Badge variant="warning">Максимум возможностей</Badge>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-2xl shadow p-8 mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Сравнение тарифов</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="py-3 px-4 font-semibold text-gray-700">Возможности</th>
                <th className="py-3 px-4 font-semibold text-blue-600 text-center">Basic</th>
                <th className="py-3 px-4 font-semibold text-purple-600 text-center">Premium</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-3 px-4 text-gray-700">{f.label}</td>
                  <td className="py-3 px-4 text-center">
                    {f.basic ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <XCircle className="w-5 h-5 text-gray-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {f.premium ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <XCircle className="w-5 h-5 text-gray-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">История биллинга</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="py-3 px-4 font-semibold text-gray-700">Дата</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Тариф</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Сумма</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Статус</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="py-3 px-4">{b.date}</td>
                  <td className="py-3 px-4">{b.plan}</td>
                  <td className="py-3 px-4">{b.amount}</td>
                  <td className="py-3 px-4">
                    <Badge variant={b.status === 'Успешно' ? 'success' : 'error'}>{b.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
