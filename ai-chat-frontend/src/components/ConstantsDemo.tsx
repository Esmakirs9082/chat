/**
 * Constants Usage Demo
 * Демонстрация использования всех констант приложения
 */

import React, { useState } from 'react';
import {
  // Основные константы
  SUBSCRIPTION_PLANS,
  CHARACTER_CATEGORIES,
  PERSONALITY_TRAITS,
  SUPPORTED_LANGUAGES,
  FILE_UPLOAD_LIMITS,
  REGEX_PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,

  // Grouped exports
  Subscription,
  Characters,
  Validation,
  Localization,
  API,
  UI,
  App,

  // Utility functions
  getSubscriptionPlan,
  getCharacterCategory,
  validateValue,
  formatFileSize,
  isFileTypeSupported,

  // Types
  type SubscriptionPlanId,
  type CharacterCategoryId,
  type PersonalityTraitId,
  type LanguageCode,
  type FileUploadType,
} from '../constants';

interface ConstantsDemoProps {
  className?: string;
}

export default function ConstantsDemo({ className }: ConstantsDemoProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>('BASIC');
  const [selectedCategory, setSelectedCategory] =
    useState<CharacterCategoryId>('ROMANCE');
  const [validationInput, setValidationInput] = useState('');
  const [validationType, setValidationType] =
    useState<keyof typeof REGEX_PATTERNS>('EMAIL');

  // Демонстрация использования констант
  const currentPlan = getSubscriptionPlan(selectedPlan);
  const currentCategory = getCharacterCategory(selectedCategory);
  const isValid = validateValue(validationInput, validationType);

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🔧 Демонстрация констант приложения
        </h2>

        {/* Subscription Plans */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Планы подписки
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(SUBSCRIPTION_PLANS).map(([id, plan]) => (
              <div
                key={id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPlan === id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                } ${plan.popular ? 'ring-2 ring-green-400' : ''}`}
                onClick={() => setSelectedPlan(id as SubscriptionPlanId)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {plan.displayName}
                  </h4>
                  {plan.popular && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Популярный
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${plan.price}
                  <span className="text-sm text-gray-500">/месяц</span>
                </p>
                <div className="mt-2 space-y-1">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Сообщений в день:{' '}
                    {plan.limits.messagesPerDay === -1
                      ? '∞'
                      : plan.limits.messagesPerDay}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Символов в сообщении: {plan.limits.charactersPerMessage}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentPlan && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
              <h4 className="font-medium mb-2">
                Выбранный план: {currentPlan.displayName}
              </h4>
              <div className="space-y-1 text-sm">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Character Categories */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Категории персонажей
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(CHARACTER_CATEGORIES).map(([id, category]) => (
              <div
                key={id}
                className={`p-3 border rounded-lg cursor-pointer text-center transition-colors ${
                  selectedCategory === id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                } ${category.nsfw ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/20' : ''}`}
                onClick={() => setSelectedCategory(id as CharacterCategoryId)}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-medium text-sm">
                  {category.displayName}
                </div>
                {category.nsfw && (
                  <div className="text-xs text-orange-600 mt-1">18+</div>
                )}
              </div>
            ))}
          </div>

          {currentCategory && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
              <h4 className="font-medium mb-2">
                {currentCategory.icon} {currentCategory.displayName}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {currentCategory.description}
              </p>
            </div>
          )}
        </div>

        {/* Personality Traits */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Черты личности (первые 6)
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(PERSONALITY_TRAITS)
              .slice(0, 6)
              .map(([id, trait]) => (
                <div
                  key={id}
                  className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  <div className="font-medium text-sm">{trait.displayName}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {trait.description}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Languages */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Поддерживаемые языки
          </h3>

          <div className="flex flex-wrap gap-2">
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, language]) => (
              <span
                key={code}
                className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-600 rounded-full text-sm"
              >
                {language.flag} {language.displayName}
              </span>
            ))}
          </div>
        </div>

        {/* File Upload Limits */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Лимиты загрузки файлов
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(FILE_UPLOAD_LIMITS).map(([type, config]) => (
              <div
                key={type}
                className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                <h4 className="font-medium mb-2">{type.replace('_', ' ')}</h4>
                <div className="text-sm space-y-1">
                  <div>Макс. размер: {formatFileSize(config.maxSize)}</div>
                  <div>Типы: {config.extensions.join(', ')}</div>
                </div>

                {/* Демонстрация проверки типа файла */}
                <div className="mt-2 text-xs">
                  <div
                    className={
                      isFileTypeSupported('image/jpeg', type as FileUploadType)
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    JPEG:{' '}
                    {isFileTypeSupported('image/jpeg', type as FileUploadType)
                      ? '✓'
                      : '✗'}
                  </div>
                  <div
                    className={
                      isFileTypeSupported('video/mp4', type as FileUploadType)
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    MP4:{' '}
                    {isFileTypeSupported('video/mp4', type as FileUploadType)
                      ? '✓'
                      : '✗'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Demo */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Валидация в реальном времени
          </h3>

          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={validationType}
              onChange={(e) =>
                setValidationType(e.target.value as keyof typeof REGEX_PATTERNS)
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            >
              {Object.entries(REGEX_PATTERNS).map(([key, pattern]) => (
                <option key={key} value={key}>
                  {key} - {pattern.example}
                </option>
              ))}
            </select>

            <div className="flex-1">
              <input
                type="text"
                value={validationInput}
                onChange={(e) => setValidationInput(e.target.value)}
                placeholder={`Введите ${validationType}...`}
                className={`w-full px-3 py-2 border rounded-md ${
                  validationInput
                    ? isValid
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                }`}
              />

              {validationInput && (
                <div
                  className={`text-sm mt-1 ${isValid ? 'text-green-600' : 'text-red-600'}`}
                >
                  {isValid
                    ? '✓ Валидное значение'
                    : `✗ ${REGEX_PATTERNS[validationType].message}`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grouped Constants Demo */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Групповые константы (Barrel Pattern)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium mb-2">UI Constants</h4>
              <div className="text-sm space-y-1">
                <div>Темы: {Object.keys(UI.THEMES).join(', ')}</div>
                <div>Z-Index Modal: {UI.Z_INDEX.MODAL}</div>
                <div>Breakpoint MD: {UI.BREAKPOINTS.MD}px</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium mb-2">API Constants</h4>
              <div className="text-sm space-y-1">
                <div>Login: {API.ENDPOINTS.AUTH.LOGIN}</div>
                <div>Characters: {API.ENDPOINTS.CHARACTERS.LIST}</div>
                <div>Error Codes: {Object.keys(API.ERROR_CODES).length}</div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium mb-2">Messages</h4>
              <div className="text-sm space-y-1">
                <div className="text-green-600">
                  ✓ {SUCCESS_MESSAGES.PROFILE_UPDATED}
                </div>
                <div className="text-red-600">
                  ✗ {ERROR_MESSAGES.VALIDATION_ERROR}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
          <h4 className="font-medium mb-4">Статистика констант</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(SUBSCRIPTION_PLANS).length}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Планов подписки
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(CHARACTER_CATEGORIES).length}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Категорий персонажей
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.keys(PERSONALITY_TRAITS).length}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Черт личности
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Object.keys(SUPPORTED_LANGUAGES).length}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Языков</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
