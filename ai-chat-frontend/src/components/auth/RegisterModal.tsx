import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  Check,
  AlertCircle,
  Shield,
  X,
} from 'lucide-react';
// SVG-иконки Google и Apple
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <g>
      <path
        fill="#4285F4"
        d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.9-6.9C35.64 2.36 30.14 0 24 0 14.64 0 6.4 5.64 2.44 14.02l8.06 6.27C12.8 14.02 17.96 9.5 24 9.5z"
      />
      <path
        fill="#34A853"
        d="M46.1 24.5c0-1.64-.14-3.22-.4-4.76H24v9.06h12.44c-.54 2.92-2.16 5.4-4.6 7.08l7.18 5.6C43.96 37.36 46.1 31.44 46.1 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.5 28.29c-1.04-3.12-1.04-6.46 0-9.58l-8.06-6.27C.86 16.36 0 20.06 0 24c0 3.94.86 7.64 2.44 11.56l8.06-6.27z"
      />
      <path
        fill="#EA4335"
        d="M24 48c6.14 0 11.64-2.02 15.82-5.52l-7.18-5.6c-2.02 1.36-4.62 2.16-7.64 2.16-6.04 0-11.2-4.52-13.02-10.56l-8.06 6.27C6.4 42.36 14.64 48 24 48z"
      />
    </g>
  </svg>
);
const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M16.365 1.43c0 1.14-.93 2.07-2.07 2.07-.03 0-.06 0-.09-.01-.02-.02-.03-.04-.03-.07 0-1.13.93-2.06 2.07-2.06.03 0 .06 0 .09.01.02.02.03.04.03.07zm2.13 4.37c-1.16-.02-2.68.67-3.55.67-.89 0-2.26-.65-3.72-.63-1.91.03-3.67 1.11-4.65 2.81-2 3.47-.51 8.61 1.43 11.44.95 1.37 2.08 2.91 3.57 2.86 1.43-.06 1.97-.92 3.7-.92 1.72 0 2.21.92 3.7.89 1.53-.03 2.5-1.39 3.44-2.77.6-.87.84-1.33 1.32-2.33-3.47-1.32-4.01-6.36.85-7.47-.53-2.13-2.19-3.55-4.09-3.58zm-3.47-3.13c.38-.46.64-1.1.57-1.74-.55.02-1.21.37-1.6.83-.35.41-.66 1.07-.54 1.7.59.05 1.19-.3 1.57-.79z"
    />
  </svg>
);
import { Modal, Button, Input } from '../ui';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../utils';

// --- Типы и схемы ---
const registerSchema = z
  .object({
    email: z.string().min(1, 'Email обязателен').email('Некорректный email'),
    username: z
      .string()
      .min(3, 'Минимум 3 символа')
      .max(20, 'Максимум 20 символов')
      .regex(/^[a-zA-Z0-9]+$/, 'Только латиница и цифры'),
    password: z
      .string()
      .min(8, 'Минимум 8 символов')
      .regex(/(?=.*[a-zA-Z])(?=.*\d)/, 'Должен содержать буквы и цифры'),
    confirmPassword: z.string(),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: 'Необходимо согласиться с условиями использования',
      }),
    isOver18: z
      .boolean()
      .refine((val) => val === true, { message: 'Подтвердите, что вам 18+' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;
interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  if (score <= 2) return { label: 'Слабый', color: 'bg-red-500', percent: 20 };
  if (score === 3)
    return { label: 'Средний', color: 'bg-yellow-500', percent: 60 };
  if (score === 4)
    return { label: 'Хороший', color: 'bg-blue-500', percent: 80 };
  return { label: 'Отличный', color: 'bg-green-500', percent: 100 };
}

// --- Компонент ---
const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  const { register: registerUser, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });
  const password = watch('password', '');
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        email: data.email,
        username: data.username,
        password: data.password,
        confirmPassword: data.confirmPassword,
        agreeToTerms: data.agreeToTerms,
        isOver18: data.isOver18,
      });
      reset();
      onClose();
    } catch (e) {
      // Ошибка обрабатывается в store
    }
  };

  const handleSocialRegister = async (provider: 'google' | 'apple') => {
    try {
      // TODO: Implement social registration
      console.log(`Register with ${provider}`);
    } catch (error) {
      console.error('Social registration failed:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Создать аккаунт">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div>
          <Input
            {...register('email')}
            type="email"
            placeholder="Email"
            error={errors.email?.message}
            leftIcon={<Mail className="text-gray-400" size={18} />}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        {/* Username */}
        <div>
          <Input
            {...register('username')}
            type="text"
            placeholder="Имя пользователя"
            error={errors.username?.message}
            leftIcon={<User className="text-gray-400" size={18} />}
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Пароль"
              error={errors.password?.message}
              leftIcon={<Lock className="text-gray-400" size={18} />}
              rightIcon={
                showPassword ? (
                  <EyeOff
                    className="cursor-pointer text-gray-400"
                    size={18}
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Eye
                    className="cursor-pointer text-gray-400"
                    size={18}
                    onClick={() => setShowPassword(true)}
                  />
                )
              }
            />
          </div>
          {/* Password strength meter */}
          {password && (
            <div className="mt-2">
              <div className="w-full h-2 rounded bg-gray-200">
                <div
                  className={cn(
                    'h-2 rounded',
                    getPasswordStrength(password).color
                  )}
                  style={{ width: `${getPasswordStrength(password).percent}%` }}
                />
              </div>
              <div className="text-xs mt-1 text-gray-500">
                {getPasswordStrength(password).label}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Повторите пароль"
            error={errors.confirmPassword?.message}
            leftIcon={<Lock className="text-gray-400" size={18} />}
            rightIcon={
              showConfirmPassword ? (
                <EyeOff
                  className="cursor-pointer text-gray-400"
                  size={18}
                  onClick={() => setShowConfirmPassword(false)}
                />
              ) : (
                <Eye
                  className="cursor-pointer text-gray-400"
                  size={18}
                  onClick={() => setShowConfirmPassword(true)}
                />
              )
            }
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...register('agreeToTerms')}
              className="accent-purple-500"
            />
            <span>
              Согласен с{' '}
              <a href="#" className="underline">
                условиями использования
              </a>
            </span>
            {errors.agreeToTerms && (
              <AlertCircle className="text-red-500 ml-2" size={16} />
            )}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...register('isOver18')}
              className="accent-purple-500"
            />
            <span>Мне исполнилось 18 лет (для NSFW)</span>
            {errors.isOver18 && (
              <AlertCircle className="text-red-500 ml-2" size={16} />
            )}
          </label>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-2 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          loading={isLoading}
          className="w-full text-base font-semibold"
        >
          Создать аккаунт
        </Button>

        {/* Social registration */}
        <div className="flex flex-col gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleSocialRegister('google')}
          >
            {' '}
            <GoogleIcon /> Google{' '}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleSocialRegister('apple')}
          >
            {' '}
            <AppleIcon /> Apple{' '}
          </Button>
        </div>

        {/* Switch to login */}
        <div className="text-center mt-6">
          <span className="text-sm text-gray-600">
            Уже есть аккаунт?{' '}
            <button
              type="button"
              className="text-purple-600 underline font-medium"
              onClick={onSwitchToLogin}
            >
              Войти
            </button>
          </span>
        </div>
      </form>
    </Modal>
  );
};

export default RegisterModal;
