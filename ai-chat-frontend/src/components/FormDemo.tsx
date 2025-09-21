import React, { useState } from 'react';
import {
  useAuthForm,
  useCharacterForm,
  useSettingsForm,
  getFieldError,
  hasFieldError,
  type LoginFormData,
  type RegisterFormData,
  type CharacterFormData,
  type SettingsFormData,
} from '../hooks/useForm';

const FormDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'auth' | 'character' | 'settings'>(
    'auth'
  );
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Инициализация форм
  const loginForm = useAuthForm('login');
  const registerForm = useAuthForm('register');
  const characterForm = useCharacterForm();
  const settingsForm = useSettingsForm();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8">useForm Hook Demo</h1>

      {/* Навигация по табам */}
      <div className="flex border-b mb-6">
        {[
          { key: 'auth', label: 'Authentication Forms' },
          { key: 'character', label: 'Character Form' },
          { key: 'settings', label: 'Settings Form' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Auth Forms */}
      {activeTab === 'auth' && (
        <div>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setAuthMode('login')}
              className={`px-4 py-2 rounded transition-colors ${
                authMode === 'login'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`px-4 py-2 rounded transition-colors ${
                authMode === 'register'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Register
            </button>
          </div>

          {authMode === 'login' ? (
            <LoginForm form={loginForm} />
          ) : (
            <RegisterForm form={registerForm} />
          )}
        </div>
      )}

      {/* Character Form */}
      {activeTab === 'character' && (
        <CharacterFormComponent form={characterForm} />
      )}

      {/* Settings Form */}
      {activeTab === 'settings' && (
        <SettingsFormComponent form={settingsForm} />
      )}
    </div>
  );
};

// Компонент формы логина
const LoginForm: React.FC<{ form: ReturnType<typeof useAuthForm> }> = ({
  form,
}) => {
  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          {...form.register('email')}
          type="email"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            hasFieldError(form.formState.errors, 'email')
              ? 'border-red-500'
              : ''
          }`}
          placeholder="Enter your email"
        />
        {hasFieldError(form.formState.errors, 'email') && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldError(form.formState.errors, 'email')}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          {...form.register('password')}
          type="password"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            hasFieldError(form.formState.errors, 'password')
              ? 'border-red-500'
              : ''
          }`}
          placeholder="Enter your password"
        />
        {hasFieldError(form.formState.errors, 'password') && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldError(form.formState.errors, 'password')}
          </p>
        )}
      </div>

      <div className="flex items-center">
        <input
          {...form.register('rememberMe')}
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">Remember me</label>
      </div>

      {form.submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{form.submitError}</p>
          <button
            type="button"
            onClick={form.clearSubmitError}
            className="mt-1 text-xs text-red-500 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {form.submitSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{form.submitSuccess}</p>
          <button
            type="button"
            onClick={form.clearSubmitSuccess}
            className="mt-1 text-xs text-green-500 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={form.isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {form.isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
};

// Компонент формы регистрации
const RegisterForm: React.FC<{ form: ReturnType<typeof useAuthForm> }> = ({
  form,
}) => {
  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          {...form.register('username')}
          type="text"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            hasFieldError(form.formState.errors, 'username')
              ? 'border-red-500'
              : ''
          }`}
          placeholder="Choose a username"
        />
        {hasFieldError(form.formState.errors, 'username') && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldError(form.formState.errors, 'username')}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          {...form.register('email')}
          type="email"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            hasFieldError(form.formState.errors, 'email')
              ? 'border-red-500'
              : ''
          }`}
          placeholder="Enter your email"
        />
        {hasFieldError(form.formState.errors, 'email') && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldError(form.formState.errors, 'email')}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          {...form.register('password')}
          type="password"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            hasFieldError(form.formState.errors, 'password')
              ? 'border-red-500'
              : ''
          }`}
          placeholder="Create a password"
        />
        {hasFieldError(form.formState.errors, 'password') && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldError(form.formState.errors, 'password')}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          {...form.register('confirmPassword')}
          type="password"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            hasFieldError(form.formState.errors, 'confirmPassword')
              ? 'border-red-500'
              : ''
          }`}
          placeholder="Confirm your password"
        />
        {hasFieldError(form.formState.errors, 'confirmPassword') && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldError(form.formState.errors, 'confirmPassword')}
          </p>
        )}
      </div>

      <div className="flex items-center">
        <input
          {...form.register('acceptTerms')}
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          I accept the Terms and Conditions
        </label>
      </div>
      {hasFieldError(form.formState.errors, 'acceptTerms') && (
        <p className="text-sm text-red-600">
          {getFieldError(form.formState.errors, 'acceptTerms')}
        </p>
      )}

      {form.submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{form.submitError}</p>
          <button
            type="button"
            onClick={form.clearSubmitError}
            className="mt-1 text-xs text-red-500 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {form.submitSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{form.submitSuccess}</p>
          <button
            type="button"
            onClick={form.clearSubmitSuccess}
            className="mt-1 text-xs text-green-500 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={form.isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {form.isSubmitting ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
};

// Компонент формы персонажа (упрощенный)
const CharacterFormComponent: React.FC<{
  form: ReturnType<typeof useCharacterForm>;
}> = ({ form }) => {
  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Character Name
        </label>
        <input
          {...form.register('name')}
          type="text"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            hasFieldError(form.formState.errors, 'name') ? 'border-red-500' : ''
          }`}
          placeholder="Enter character name"
        />
        {hasFieldError(form.formState.errors, 'name') && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldError(form.formState.errors, 'name')}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...form.register('description')}
          rows={3}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            hasFieldError(form.formState.errors, 'description')
              ? 'border-red-500'
              : ''
          }`}
          placeholder="Describe your character..."
        />
        {hasFieldError(form.formState.errors, 'description') && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldError(form.formState.errors, 'description')}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Personality
        </label>
        <textarea
          {...form.register('personality')}
          rows={2}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            hasFieldError(form.formState.errors, 'personality')
              ? 'border-red-500'
              : ''
          }`}
          placeholder="Character's personality..."
        />
        {hasFieldError(form.formState.errors, 'personality') && (
          <p className="mt-1 text-sm text-red-600">
            {getFieldError(form.formState.errors, 'personality')}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          {...form.register('category')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="anime">Anime</option>
          <option value="realistic">Realistic</option>
          <option value="fantasy">Fantasy</option>
          <option value="historical">Historical</option>
          <option value="sci-fi">Sci-Fi</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center">
          <input
            {...form.register('isNSFW')}
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            NSFW Content
          </label>
        </div>

        <div className="flex items-center">
          <input
            {...form.register('isPublic')}
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Public Character
          </label>
        </div>
      </div>

      {form.submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{form.submitError}</p>
        </div>
      )}

      {form.submitSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{form.submitSuccess}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={form.isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {form.isSubmitting ? 'Creating character...' : 'Create Character'}
      </button>
    </form>
  );
};

// Компонент формы настроек (упрощенный)
const SettingsFormComponent: React.FC<{
  form: ReturnType<typeof useSettingsForm>;
}> = ({ form }) => {
  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Profile Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <input
              {...form.register('profile.displayName')}
              type="text"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                hasFieldError(form.formState.errors, 'profile.displayName')
                  ? 'border-red-500'
                  : ''
              }`}
              placeholder="Your display name"
            />
            {hasFieldError(form.formState.errors, 'profile.displayName') && (
              <p className="mt-1 text-sm text-red-600">
                {getFieldError(form.formState.errors, 'profile.displayName')}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <select
              {...form.register('preferences.language')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="ru">Russian</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Theme
            </label>
            <select
              {...form.register('preferences.theme')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              {...form.register('preferences.nsfwEnabled')}
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Enable NSFW content
            </label>
          </div>
        </div>
      </div>

      {form.submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{form.submitError}</p>
        </div>
      )}

      {form.submitSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{form.submitSuccess}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={form.isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {form.isSubmitting ? 'Saving settings...' : 'Save Settings'}
      </button>
    </form>
  );
};

export default FormDemo;
