import React, { useState } from 'react';
import { Crown, Shield, Zap, AlertTriangle, Check, X } from 'lucide-react';
import { useSubscription, FeatureType } from '../hooks/useSubscription';
import Button from '../components/ui/Button';

const SubscriptionDemo: React.FC = () => {
  const [selectedFeature, setSelectedFeature] =
    useState<FeatureType>('nsfw_content');

  const {
    subscription,
    plans,
    isLoading,
    isPremium,
    isActive,
    isTrial,
    isExpired,
    daysUntilExpiry,
    canAccessNSFW,
    checkFeatureAccess,
    remainingMessages,
    remainingChats,
    messageUsage,
    chatUsage,
    showUpgradePrompt,
    startFreeTrial,
    upgrade,
    cancelSubscription,
    lastError,
    clearError,
    trialDaysRemaining,
    canStartTrial,
  } = useSubscription({
    autoLoad: true,
    checkUsageInterval: 30000, // 30 seconds
    trialDuration: 7,
  });

  const features: { key: FeatureType; label: string; icon: React.ReactNode }[] =
    [
      {
        key: 'nsfw_content',
        label: 'NSFW Content',
        icon: <Shield className="w-4 h-4" />,
      },
      {
        key: 'unlimited_messages',
        label: 'Unlimited Messages',
        icon: <Zap className="w-4 h-4" />,
      },
      {
        key: 'character_creation',
        label: 'Character Creation',
        icon: <Crown className="w-4 h-4" />,
      },
      {
        key: 'priority_support',
        label: 'Priority Support',
        icon: <AlertTriangle className="w-4 h-4" />,
      },
      {
        key: 'custom_characters',
        label: 'Custom Characters',
        icon: <Crown className="w-4 h-4" />,
      },
      {
        key: 'voice_messages',
        label: 'Voice Messages',
        icon: <Zap className="w-4 h-4" />,
      },
      {
        key: 'advanced_ai',
        label: 'Advanced AI',
        icon: <Shield className="w-4 h-4" />,
      },
      {
        key: 'group_chats',
        label: 'Group Chats',
        icon: <Crown className="w-4 h-4" />,
      },
      {
        key: 'image_generation',
        label: 'Image Generation',
        icon: <Zap className="w-4 h-4" />,
      },
      {
        key: 'export_chats',
        label: 'Export Chats',
        icon: <Shield className="w-4 h-4" />,
      },
    ];

  const handleStartTrial = async () => {
    const success = await startFreeTrial();
    if (success) {
      alert('Free trial started successfully!');
    }
  };

  const handleUpgrade = async (planId: string) => {
    const success = await upgrade(planId);
    if (success) {
      alert('Subscription upgraded successfully!');
    }
  };

  const handleCancel = async () => {
    const success = await cancelSubscription();
    if (success) {
      alert('Subscription cancelled successfully!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Subscription Management Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test subscription features and usage limits
        </p>
      </div>

      {/* Error Display */}
      {lastError && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-700 dark:text-red-300">{lastError}</p>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600 dark:hover:text-red-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Subscription Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Status
          </h3>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isActive
                  ? 'bg-green-500'
                  : isExpired
                    ? 'bg-red-500'
                    : 'bg-gray-400'
              }`}
            />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {subscription?.type || 'Free'}
            </span>
          </div>
          {isTrial && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Trial: {trialDaysRemaining} days left
            </p>
          )}
          {isExpired && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Expired {Math.abs(daysUntilExpiry)} days ago
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Messages
          </h3>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              {messageUsage.unlimited ? '∞' : remainingMessages}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {messageUsage.unlimited ? '' : `/ ${messageUsage.limit}`}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${messageUsage.percentage}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Chats
          </h3>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              {chatUsage.unlimited ? '∞' : remainingChats}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {chatUsage.unlimited ? '' : `/ ${chatUsage.limit}`}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${chatUsage.percentage}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Premium Status
          </h3>
          <div className="flex items-center space-x-2">
            {isPremium ? (
              <Crown className="w-5 h-5 text-yellow-500" />
            ) : (
              <Crown className="w-5 h-5 text-gray-400" />
            )}
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {isPremium ? 'Premium' : 'Standard'}
            </span>
          </div>
          {daysUntilExpiry > 0 && subscription?.expiresAt && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Expires in {daysUntilExpiry} days
            </p>
          )}
        </div>
      </div>

      {/* Feature Access Test */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Feature Access Test
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Feature to Test:
          </label>
          <select
            value={selectedFeature}
            onChange={(e) => setSelectedFeature(e.target.value as FeatureType)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            {features.map((feature) => (
              <option key={feature.key} value={feature.key}>
                {feature.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.key}
              className={`p-3 border rounded-lg ${
                checkFeatureAccess(feature.key)
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                  : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {feature.icon}
                  <span className="text-sm font-medium">{feature.label}</span>
                </div>
                {checkFeatureAccess(feature.key) ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <X className="w-4 h-4 text-red-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Subscription Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          {canStartTrial && (
            <Button
              onClick={handleStartTrial}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Free Trial
            </Button>
          )}

          <Button
            onClick={() => handleUpgrade('premium')}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Upgrade to Premium
          </Button>

          <Button onClick={showUpgradePrompt} variant="outline">
            Show Upgrade Prompt
          </Button>

          {subscription && subscription.type !== 'free' && (
            <Button
              onClick={handleCancel}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Cancel Subscription
            </Button>
          )}
        </div>
      </div>

      {/* Subscription Plans */}
      {plans.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Available Plans
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="text-2xl font-bold text-primary mb-4">
                  ${plan.price}
                  <span className="text-sm text-gray-500 font-normal">
                    /{plan.currency}
                  </span>
                </div>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                    >
                      <Check className="w-3 h-3 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  variant="outline"
                  className="w-full"
                  disabled={subscription?.type === plan.name.toLowerCase()}
                >
                  {subscription?.type === plan.name.toLowerCase()
                    ? 'Current Plan'
                    : 'Select Plan'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionDemo;
