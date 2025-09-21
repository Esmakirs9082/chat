import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, Check, Edit3 } from 'lucide-react';
import { Button, Modal, Input } from '../ui';
import {
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  type PaymentMethod,
  type PaymentMethodData,
} from '../../services/subscriptionApi';
import { cn } from '../../utils';

interface PaymentMethodsProps {
  onPaymentMethodUpdate?: (methods: PaymentMethod[]) => void;
  className?: string;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  onPaymentMethodUpdate,
  className,
}) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const paymentMethods = await getPaymentMethods();
      setMethods(paymentMethods);
      if (onPaymentMethodUpdate) {
        onPaymentMethodUpdate(paymentMethods);
      }
    } catch (err) {
      setError('Ошибка загрузки методов оплаты');
      console.error('Error loading payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMethod = async (methodId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот метод оплаты?')) {
      return;
    }

    try {
      setActionLoading(methodId);
      await deletePaymentMethod(methodId);
      await loadPaymentMethods();
    } catch (err: any) {
      setError(err.message || 'Ошибка удаления метода оплаты');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      setActionLoading(methodId);
      await setDefaultPaymentMethod(methodId);
      await loadPaymentMethods();
    } catch (err: any) {
      setError(err.message || 'Ошибка установки метода по умолчанию');
    } finally {
      setActionLoading(null);
    }
  };

  const getCardBrandIcon = (brand: string) => {
    // В реальном приложении здесь будут иконки карт (Visa, MasterCard и т.д.)
    return <CreditCard className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className={cn('flex justify-center items-center py-8', className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Методы оплаты</h3>
        <Button
          onClick={() => setShowAddModal(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Добавить карту
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Payment Methods List */}
      {methods.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">
            У вас пока нет сохраненных методов оплаты
          </p>
          <Button onClick={() => setShowAddModal(true)}>
            Добавить первую карту
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {methods.map((method) => (
            <div
              key={method.id}
              className={cn(
                'border rounded-lg p-4 transition-all duration-200',
                method.isDefault
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Card Icon */}
                  <div
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-lg',
                      method.isDefault
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {method.card ? (
                      getCardBrandIcon(method.card.brand)
                    ) : (
                      <CreditCard className="h-5 w-5" />
                    )}
                  </div>

                  {/* Card Info */}
                  <div>
                    <div className="flex items-center space-x-2">
                      {method.card && (
                        <>
                          <span className="font-medium text-gray-900 capitalize">
                            {method.card.brand}
                          </span>
                          <span className="text-gray-600">
                            •••• {method.card.last4}
                          </span>
                          <span className="text-sm text-gray-500">
                            {method.card.expMonth}/{method.card.expYear}
                          </span>
                        </>
                      )}
                      {method.paypal && (
                        <>
                          <span className="font-medium text-gray-900">
                            PayPal
                          </span>
                          <span className="text-gray-600">
                            {method.paypal.email}
                          </span>
                        </>
                      )}
                    </div>

                    {method.isDefault && (
                      <div className="flex items-center mt-1">
                        <Check className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-600 font-medium">
                          Метод по умолчанию
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetDefault(method.id)}
                      disabled={actionLoading === method.id}
                    >
                      По умолчанию
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteMethod(method.id)}
                    disabled={actionLoading === method.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadPaymentMethods}
      />
    </div>
  );
};

interface AddPaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const paymentMethodData: PaymentMethodData = {
        type: 'card',
        card: {
          number: formData.number,
          expMonth: parseInt(formData.expMonth),
          expYear: parseInt(formData.expYear),
          cvc: formData.cvc,
        },
        billingDetails: {
          name: formData.name,
          email: formData.email,
        },
      };

      await addPaymentMethod(paymentMethodData);
      onSuccess();
      onClose();

      // Reset form
      setFormData({
        number: '',
        expMonth: '',
        expYear: '',
        cvc: '',
        name: '',
        email: '',
      });
    } catch (err: any) {
      setError(err.message || 'Ошибка добавления карты');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Добавить карту">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Номер карты
          </label>
          <Input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={formData.number}
            onChange={(e) =>
              setFormData({ ...formData, number: e.target.value })
            }
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Месяц
            </label>
            <Input
              type="text"
              placeholder="12"
              value={formData.expMonth}
              onChange={(e) =>
                setFormData({ ...formData, expMonth: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Год
            </label>
            <Input
              type="text"
              placeholder="2025"
              value={formData.expYear}
              onChange={(e) =>
                setFormData({ ...formData, expYear: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVC
            </label>
            <Input
              type="text"
              placeholder="123"
              value={formData.cvc}
              onChange={(e) =>
                setFormData({ ...formData, cvc: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Имя владельца карты
          </label>
          <Input
            type="text"
            placeholder="Иван Иванов"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            type="email"
            placeholder="ivan@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Отмена
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            Добавить карту
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentMethods;
