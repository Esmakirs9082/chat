import React from 'react';
import { CharacterFormData } from './types';

interface PreviewStepProps {
  data: CharacterFormData;
}

/**
 * PreviewStep: сводка перед публикацией
 */
export const PreviewStep: React.FC<PreviewStepProps> = ({ data }) => {
  return (
    <div className="space-y-6 text-sm">
      <section>
        <h3 className="text-sm font-semibold mb-2">Основное</h3>
        <div className="grid gap-1">
          <div>
            <span className="font-medium">Имя:</span> {data.name}
          </div>
          <div>
            <span className="font-medium">Категория:</span> {data.category}
          </div>
          <div>
            <span className="font-medium">NSFW:</span>{' '}
            {data.isNsfw ? 'Да' : 'Нет'}
          </div>
        </div>
        <div className="mt-2">
          <div className="font-medium mb-1">Описание:</div>
          <p className="whitespace-pre-wrap text-xs opacity-80 leading-relaxed">
            {data.description}
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-2">Теги</h3>
        {data.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-xs"
              >
                {t}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs opacity-60">Нет тегов</p>
        )}
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-2">Личность</h3>
        <div className="mb-2">
          <span className="font-medium">Стиль общения:</span>{' '}
          {data.conversationStyle}
        </div>
        <div className="mb-3">
          <div className="font-medium mb-1">Greeting:</div>
          <p className="text-xs opacity-80 whitespace-pre-wrap">
            {data.greeting}
          </p>
        </div>
        <div>
          <div className="font-medium mb-1">Черты:</div>
          {data.traits.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.traits.map((tr) => (
                <span
                  key={tr}
                  className="px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-800/40 text-indigo-700 dark:text-indigo-300 text-xs"
                >
                  {tr}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs opacity-60">Нет</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-2">Аватар</h3>
        {data.avatarUrl || data.avatarFileName ? (
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {data.avatarUrl ? (
                <img
                  src={data.avatarUrl}
                  alt="avatar preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-[10px] text-center px-1">
                  {data.avatarFileName}
                </span>
              )}
            </div>
            <div className="text-xs opacity-70">
              {data.avatarUrl
                ? 'Источник: URL'
                : 'Источник: Файл (MVP placeholder)'}
            </div>
          </div>
        ) : (
          <p className="text-xs opacity-60">Не выбран</p>
        )}
      </section>
    </div>
  );
};

export default PreviewStep;
