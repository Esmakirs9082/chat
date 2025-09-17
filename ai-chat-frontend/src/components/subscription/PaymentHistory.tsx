import React, { useState, useEffect } from 'react';
import { Download, Receipt, RefreshCw, Filter, Calendar } from 'lucide-react';
import { Button, Badge } from '../ui';
import {
  getPaymentHistory,
  downloadInvoice,
  formatPrice,
  type PaymentHistory
} from '../../services/subscriptionApi';
import { PaginatedResponse } from '../../types/index';
import { cn, formatDate } from '../../utils';

interface PaymentHistoryProps {
  className?: string;
}

export const PaymentHistoryComponent: React.FC<PaymentHistoryProps> = ({ className }) => {
  const [history, setHistory] = useState<PaginatedResponse<PaymentHistory> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PaymentHistory['status'] | 'all'>('all');
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [currentPage, statusFilter]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getPaymentHistory(
        currentPage,
        10,
        statusFilter === 'all' ? undefined : statusFilter
      );
      setHistory(response);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки истории платежей');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string, paymentId: string) => {
    try {
      setDownloading(paymentId);
      const blob = await downloadInvoice(invoiceId);
      
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Ошибка скачивания инвойса');
    } finally {
      setDownloading(null);
    }
  };

  const getStatusBadge = (status: PaymentHistory['status']) => {
    const variants: Record<PaymentHistory['status'], { color: string; text: string }> = {
      succeeded: { color: 'bg-green-100 text-green-800', text: 'Успешно' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'В обработке' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Не удался' },
      canceled: { color: 'bg-gray-100 text-gray-800', text: 'Отменен' },
      refunded: { color: 'bg-blue-100 text-blue-800', text: 'Возврат' }
    };
    
    const variant = variants[status];
    return (
      <Badge className={variant.color}>
        {variant.text}
      </Badge>
    );
  };

  const getPaymentMethodText = (paymentMethod: PaymentHistory['paymentMethod']) => {
    if (paymentMethod.card) {
      return `${paymentMethod.card.brand} •••• ${paymentMethod.card.last4}`;
    }
    if (paymentMethod.paypal) {
      return `PayPal (${paymentMethod.paypal.email})`;
    }
    return 'Неизвестно';
  };

  if (loading && !history) {
    return (
      <div className={cn("flex justify-center items-center py-8", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error && !history) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadHistory} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-lg font-medium text-gray-900">
          История платежей
        </h3>
        
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Все статусы</option>
              <option value="succeeded">Успешные</option>
              <option value="pending">В обработке</option>
              <option value="failed">Неудачные</option>
              <option value="canceled">Отмененные</option>
              <option value="refunded">Возвраты</option>
            </select>
          </div>
          
          <Button
            onClick={loadHistory}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Payment History */}
      {!history?.data?.length ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">
            История платежей пуста
          </p>
          <p className="text-sm text-gray-500">
            Здесь будут отображаться ваши платежи
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Описание
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сумма
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Способ оплаты
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.data?.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {formatDate(new Date(payment.createdAt))}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{payment.description}</p>
                        {payment.failureReason && (
                          <p className="text-xs text-red-600 mt-1">
                            {payment.failureReason}
                          </p>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.status === 'refunded' && (
                        <span className="text-red-600">-</span>
                      )}
                      {formatPrice(payment.amount, payment.currency)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {getPaymentMethodText(payment.paymentMethod)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        {payment.invoiceId && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadInvoice(payment.invoiceId!, payment.id)}
                            disabled={downloading === payment.id}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Инвойс
                          </Button>
                        )}
                        
                        {payment.receiptUrl && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(payment.receiptUrl, '_blank')}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            <Receipt className="h-3 w-3 mr-1" />
                            Чек
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {history.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                Страница {history.pagination.page} из {history.pagination.totalPages}
                <span className="ml-2">
                  (всего {history.pagination.total} платежей)
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={!history.pagination.hasPrev || loading}
                >
                  Назад
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(history.pagination.totalPages, prev + 1))}
                  disabled={!history.pagination.hasNext || loading}
                >
                  Далее
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryComponent;