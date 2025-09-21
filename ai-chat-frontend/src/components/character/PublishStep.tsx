import React, { useState } from 'react';
import { CharacterFormData } from './types';

interface PublishStepProps {
  data: CharacterFormData;
  onPublish: (data: CharacterFormData) => Promise<void> | void;
}

/**
 * PublishStep: финал мастера, имитация публикации
 */
export const PublishStep: React.FC<PublishStepProps> = ({
  data,
  onPublish,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    setLoading(true);
    setError(null);
    try {
      // MVP имитация
      await new Promise((res) => setTimeout(res, 900));
      await onPublish({ ...data, published: true });
      setSuccess(true);
    } catch (e: any) {
      setError(e?.message || 'Ошибка публикации');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="font-semibold mb-2">Персонаж опубликован</h3>
        <p className="text-xs opacity-70 max-w-sm">
          Теперь персонаж доступен (в рамках MVP локально). Добавьте реальный
          API для сохранения.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-2">Финальная проверка</h3>
        <p className="text-xs opacity-70 leading-relaxed">
          Нажмите Publish чтобы завершить. В реальной интеграции здесь будет
          обращение к backend API со всеми данными.
        </p>
      </div>

      {error && <div className="text-xs text-red-500">{error}</div>}

      <div>
        <button
          type="button"
          onClick={handlePublish}
          disabled={loading}
          className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm disabled:opacity-50"
        >
          {loading ? 'Публикация...' : 'Publish'}
        </button>
      </div>
    </div>
  );
};

export default PublishStep;
