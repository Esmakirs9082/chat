import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  MessageCircle,
  Users,
  HardDrive,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { Button, Progress } from '../ui';
import {
  getUsageStats,
  shouldUpgrade,
  type UsageStats,
  type Subscription,
} from '../../services/subscriptionApi';
import { cn } from '../../utils';

interface UsageStatsProps {
  subscription?: Subscription | null;
  onUpgradeClick?: () => void;
  className?: string;
}

export const UsageStatsComponent: React.FC<UsageStatsProps> = ({
  subscription,
  onUpgradeClick,
  className,
}) => {
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsageStats();
  }, []);

  const loadUsageStats = async () => {
    try {
      setLoading(true);
      const stats = await getUsageStats();
      setUsage(stats);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Байт', 'КБ', 'МБ', 'ГБ'];
    if (bytes === 0) return '0 Байт';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className={cn('flex justify-center items-center py-8', className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('text-center py-8', className)}>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadUsageStats} variant="outline">
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (!usage) {
    return null;
  }

  const upgradeInfo = shouldUpgrade(usage);
  const isFreePlan = !subscription || subscription.plan.price === 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Статистика использования
        </h3>
        {upgradeInfo.shouldUpgrade && onUpgradeClick && (
          <Button onClick={onUpgradeClick} className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Улучшить план
          </Button>
        )}
      </div>

      {/* Upgrade Alert */}
      {upgradeInfo.shouldUpgrade && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800">
                Рекомендуем улучшить план
              </h4>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  {upgradeInfo.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Chats */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">
                Чаты сегодня
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {usage.chatsToday}
              </span>
              <span className="text-sm text-gray-500">
                из{' '}
                {usage.limits.maxChatsPerDay === -1
                  ? '∞'
                  : usage.limits.maxChatsPerDay}
              </span>
            </div>

            {usage.limits.maxChatsPerDay > 0 && (
              <Progress
                value={(usage.chatsToday / usage.limits.maxChatsPerDay) * 100}
                className="h-2"
                indicatorClassName={getProgressColor(
                  usage.chatsToday,
                  usage.limits.maxChatsPerDay
                )}
              />
            )}
          </div>
        </div>

        {/* Monthly Messages */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">
                Сообщения в месяце
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {usage.messagesThisMonth.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">
                из{' '}
                {usage.limits.maxMessagesPerMonth === -1
                  ? '∞'
                  : usage.limits.maxMessagesPerMonth.toLocaleString()}
              </span>
            </div>

            {usage.limits.maxMessagesPerMonth > 0 && (
              <Progress
                value={
                  (usage.messagesThisMonth / usage.limits.maxMessagesPerMonth) *
                  100
                }
                className="h-2"
                indicatorClassName={getProgressColor(
                  usage.messagesThisMonth,
                  usage.limits.maxMessagesPerMonth
                )}
              />
            )}
          </div>
        </div>

        {/* Characters Created */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">
                Персонажи
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {usage.charactersCreated}
              </span>
              <span className="text-sm text-gray-500">
                из{' '}
                {usage.limits.maxCharacters === -1
                  ? '∞'
                  : usage.limits.maxCharacters}
              </span>
            </div>

            {usage.limits.maxCharacters > 0 && (
              <Progress
                value={
                  (usage.charactersCreated / usage.limits.maxCharacters) * 100
                }
                className="h-2"
                indicatorClassName={getProgressColor(
                  usage.charactersCreated,
                  usage.limits.maxCharacters
                )}
              />
            )}
          </div>
        </div>

        {/* Storage Used */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <HardDrive className="h-5 w-5 text-orange-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">
                Хранилище
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {formatBytes(usage.storageUsed * 1024 * 1024)}
              </span>
              <span className="text-sm text-gray-500">
                из{' '}
                {usage.limits.maxStorageMB === -1
                  ? '∞'
                  : formatBytes(usage.limits.maxStorageMB * 1024 * 1024)}
              </span>
            </div>

            {usage.limits.maxStorageMB > 0 && (
              <Progress
                value={(usage.storageUsed / usage.limits.maxStorageMB) * 100}
                className="h-2"
                indicatorClassName={getProgressColor(
                  usage.storageUsed,
                  usage.limits.maxStorageMB
                )}
              />
            )}
          </div>
        </div>
      </div>

      {/* Reset Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Следующий сброс лимитов
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(usage.resetDate).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {isFreePlan && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Базовый план</p>
              <Button size="sm" onClick={onUpgradeClick} className="mt-1">
                Улучшить
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Plan Features (if subscription exists) */}
      {subscription && (
        <div className="bg-white rounded-lg border p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Возможности вашего плана: {subscription.plan.displayName}
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <div
                className={cn(
                  'w-2 h-2 rounded-full mr-2',
                  subscription.plan.features.nsfwContent
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                )}
              />
              <span
                className={
                  subscription.plan.features.nsfwContent
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }
              >
                NSFW контент
              </span>
            </div>

            <div className="flex items-center">
              <div
                className={cn(
                  'w-2 h-2 rounded-full mr-2',
                  subscription.plan.features.customCharacters
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                )}
              />
              <span
                className={
                  subscription.plan.features.customCharacters
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }
              >
                Свои персонажи
              </span>
            </div>

            <div className="flex items-center">
              <div
                className={cn(
                  'w-2 h-2 rounded-full mr-2',
                  subscription.plan.features.voiceMessages
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                )}
              />
              <span
                className={
                  subscription.plan.features.voiceMessages
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }
              >
                Голосовые сообщения
              </span>
            </div>

            <div className="flex items-center">
              <div
                className={cn(
                  'w-2 h-2 rounded-full mr-2',
                  subscription.plan.features.imageGeneration
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                )}
              />
              <span
                className={
                  subscription.plan.features.imageGeneration
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }
              >
                Генерация изображений
              </span>
            </div>

            <div className="flex items-center">
              <div
                className={cn(
                  'w-2 h-2 rounded-full mr-2',
                  subscription.plan.features.prioritySupport
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                )}
              />
              <span
                className={
                  subscription.plan.features.prioritySupport
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }
              >
                Приоритетная поддержка
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageStatsComponent;
