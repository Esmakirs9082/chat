import React, { useState, useRef, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { z } from 'zod';
import { authApi } from '../../services/authApi';

const emailSchema = z.string().email({ message: 'Введите корректный email' });

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

const RESEND_TIMEOUT = 60; // секунд

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onBackToLogin,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Некорректный email');
      return;
    }
    if (timer > 0) return;
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSuccess(true);
      setTimer(RESEND_TIMEOUT);
    } catch (err: any) {
      setError(err?.message || 'Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setError(null);
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setTimer(RESEND_TIMEOUT);
    } catch (err: any) {
      setError(err?.message || 'Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError(null);
    setSuccess(false);
    setTimer(0);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      title="Восстановление пароля"
    >
      <div className="p-4">
        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-gray-700 mb-2">
              Мы отправим ссылку для восстановления на ваш email.
            </div>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error ?? undefined}
              required
              autoFocus
            />
            <Button
              type="submit"
              disabled={loading || timer > 0}
              className="w-full"
            >
              {timer > 0
                ? `Отправить повторно через ${timer} сек`
                : 'Отправить ссылку'}
            </Button>
            <div className="flex justify-between mt-2">
              <button
                type="button"
                className="text-indigo-600 hover:underline"
                onClick={onBackToLogin}
              >
                Вернуться к входу
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center py-6">
            <div className="mb-4">
              <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="22" fill="#e6fbe6" />
                <path
                  d="M16 24l6 6 10-10"
                  stroke="#22c55e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-green-600 mb-2">
              Проверьте почту
            </h2>
            <div className="text-gray-700 mb-4">
              Ссылка для восстановления отправлена на{' '}
              <span className="font-medium">{email}</span>.
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Следуйте инструкции в письме для сброса пароля.
            </div>
            <Button
              type="button"
              disabled={timer > 0 || loading}
              onClick={handleResend}
              className="mb-2"
            >
              {timer > 0
                ? `Отправить повторно через ${timer} сек`
                : 'Не пришло письмо? Отправить повторно'}
            </Button>
            <button
              type="button"
              className="text-indigo-600 hover:underline mt-2"
              onClick={onBackToLogin}
            >
              Вернуться к входу
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ForgotPasswordModal;
