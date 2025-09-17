
import React, { useEffect, useState, ReactNode } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import Modal from '../ui/Modal';
import LoginModal from './LoginModal';

// Лоадер с логотипом и текстом
const AppLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
    <div className="mb-6 animate-spin">
      {/* SVG логотип */}
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="#6366F1" strokeWidth="4" />
        <path d="M24 8a16 16 0 1 1-16 16" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
    <div className="text-lg font-medium">Проверка авторизации...</div>
  </div>
);

// Кеширование результата подписки на 5 минут
const useCachedPremium = (userId?: string, enabled?: boolean) => {
  const { isPremium } = useSubscriptionStore();
  const [loading, setLoading] = useState(enabled);
  const [cached, setCached] = useState<boolean | null>(null);

  useEffect(() => {
    if (!enabled || !userId) return;
    const cacheKey = `premium_${userId}`;
    const cache = localStorage.getItem(cacheKey);
    if (cache) {
      const { value, ts } = JSON.parse(cache);
      if (Date.now() - ts < 5 * 60 * 1000) {
        setCached(value);
        setLoading(false);
        return;
      }
    }
    setLoading(false); // TODO: добавить реальную проверку премиума через API
  }, [userId, enabled]);

  return { isPremium: cached, loading };
};

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requirePremium?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback, requirePremium }) => {
  const { isAuthenticated, user } = useAuthStore();
  const authLoading = false; // TODO: если нужен лоадер, добавить в стор
  const [showLogin, setShowLogin] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const { isPremium, loading: premiumLoading } = useCachedPremium(user?.id, requirePremium);

  // Если идет загрузка авторизации или подписки
  if (authLoading || (requirePremium && premiumLoading)) {
    return fallback || <AppLoader />;
  }

  // Не авторизован — показываем LoginModal
  if (!isAuthenticated) {
    return <Modal isOpen={true} onClose={() => setShowLogin(false)}>
      <LoginModal isOpen={true} onClose={() => setShowLogin(false)} onSwitchToRegister={() => {}} onForgotPassword={() => {}} />
    </Modal>;
  }

  // Требуется премиум, но нет подписки — показываем SubscriptionModal
  if (requirePremium && isPremium === false) {
  return <Modal isOpen={true} onClose={() => setShowSubscription(false)}>
      {/* TODO: заменить на реальный SubscriptionModal */}
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Требуется премиум-подписка</h2>
        <p className="mb-6">Для доступа к этому разделу нужна активная подписка.</p>
        <a href="/profile/subscription" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Оформить подписку</a>
      </div>
    </Modal>;
  }

  // Всё ок — рендерим детей (nested routes поддерживаются)
  return <>{children}</>;
};

export default ProtectedRoute;