import React, { useRef, useState, useEffect } from 'react';
import { CharacterFormData, StepErrors } from './types';

interface AvatarStepProps {
  data: CharacterFormData;
  onUpdate: (partial: Partial<CharacterFormData>) => void;
  setStepErrors: (errors: StepErrors) => void;
}

/**
 * AvatarStep: выбор изображения через URL или (пока) псевдо-загрузку файла
 */
export const AvatarStep: React.FC<AvatarStepProps> = ({
  data,
  onUpdate,
  setStepErrors,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(data.avatarUrl);
  const [urlInput, setUrlInput] = useState(data.avatarUrl || '');

  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.avatarUrl, data.avatarFileName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Для MVP не сохраняем blob, только имя
    onUpdate({ avatarFileName: file.name, avatarUrl: undefined });
    // Генерируем временный preview
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const applyUrl = () => {
    if (!urlInput.trim()) return;
    onUpdate({ avatarUrl: urlInput.trim(), avatarFileName: undefined });
    setPreview(urlInput.trim());
  };

  const clearAvatar = () => {
    onUpdate({ avatarUrl: undefined, avatarFileName: undefined });
    setPreview(undefined);
    setUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const errors: StepErrors = {};
    if (!data.avatarUrl && !data.avatarFileName) {
      errors.avatar = 'Выберите файл или укажите URL';
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Выбор файла</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePickFile}
            className="px-3 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700"
          >
            Загрузить файл
          </button>
          {data.avatarFileName && (
            <span className="text-xs text-indigo-600 dark:text-indigo-300">
              {data.avatarFileName}
            </span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Или URL изображения
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://example.com/image.png"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button
            type="button"
            onClick={applyUrl}
            disabled={!urlInput.trim()}
            className="px-3 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            Применить
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Предпросмотр</label>
        <div className="w-full aspect-video flex items-center justify-center border border-dashed rounded bg-gray-50 dark:bg-gray-800/40 overflow-hidden relative">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-xs opacity-60">Нет изображения</span>
          )}
          {preview && (
            <button
              type="button"
              onClick={clearAvatar}
              className="absolute top-2 right-2 text-xs bg-white/80 dark:bg-black/50 backdrop-blur px-2 py-1 rounded hover:bg-white dark:hover:bg-black"
            >
              Очистить
            </button>
          )}
        </div>
        {!data.avatarUrl && !data.avatarFileName && (
          <p className="mt-1 text-xs text-red-500">Добавьте файл или URL.</p>
        )}
      </div>
    </div>
  );
};

export default AvatarStep;
