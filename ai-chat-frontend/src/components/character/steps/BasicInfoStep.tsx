import React, { useState, useRef, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { CharacterFormData } from '../types';

interface BasicInfoStepProps {
  data: CharacterFormData;
  errors: { [key: string]: string };
  onChange: (data: Partial<CharacterFormData>) => void;
}

const CATEGORY_OPTIONS = [
  { value: 'fantasy', label: 'Фэнтези' },
  { value: 'sci-fi', label: 'Научная фантастика' },
  { value: 'anime', label: 'Аниме' },
  { value: 'realistic', label: 'Реалистичный' },
  { value: 'historical', label: 'Исторический' },
  { value: 'celebrity', label: 'Знаменитость' },
  { value: 'original', label: 'Оригинальный' },
];

const SUGGESTED_TAGS = [
  'дружелюбный',
  'загадочный',
  'романтичный',
  'умный',
  'сильный',
  'застенчивый',
  'харизматичный',
  'добрый',
  'смелый',
  'творческий',
  'лидер',
  'бунтарь',
  'защитник',
  'мечтатель',
  'реалист',
];

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  data,
  errors,
  onChange,
}) => {
  const [tagInput, setTagInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showNsfwWarning, setShowNsfwWarning] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tagInput.trim()) {
      const filtered = SUGGESTED_TAGS.filter(
        (tag) =>
          tag.toLowerCase().includes(tagInput.toLowerCase()) &&
          !data.tags.includes(tag)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [tagInput, data.tags]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ name: e.target.value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onChange({ description: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ category: e.target.value });
  };

  const handleTagAdd = (tag: string) => {
    if (
      tag.trim() &&
      !data.tags.includes(tag.trim()) &&
      data.tags.length < 10
    ) {
      onChange({ tags: [...data.tags, tag.trim()] });
      setTagInput('');
      setShowSuggestions(false);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleTagAdd(tagInput);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange({ tags: data.tags.filter((tag) => tag !== tagToRemove) });
  };

  const handleNsfwChange = (checked: boolean) => {
    if (checked && !data.isNsfw) {
      setShowNsfwWarning(true);
    } else {
      onChange({ isNsfw: checked });
    }
  };

  const confirmNsfw = () => {
    onChange({ isNsfw: true });
    setShowNsfwWarning(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Основная информация</h3>
        <p className="text-gray-600 mb-6">
          Расскажите о своем персонаже. Эта информация поможет ИИ лучше понять
          характер и поведение персонажа.
        </p>
      </div>

      {/* Имя персонажа */}
      <div>
        <Input
          label="Имя персонажа *"
          placeholder="Введите имя персонажа"
          value={data.name}
          onChange={handleNameChange}
          error={errors.name}
          maxLength={50}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>От 2 до 50 символов</span>
          <span>{data.name.length}/50</span>
        </div>
      </div>

      {/* Описание */}
      <div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Описание персонажа *
          </label>
          <textarea
            className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Опишите внешность, характер, историю персонажа..."
            value={data.description}
            onChange={handleDescriptionChange}
            rows={4}
            maxLength={500}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description}</p>
          )}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>От 10 до 500 символов</span>
          <span>{data.description.length}/500</span>
        </div>
      </div>

      {/* Теги */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Теги (до 10 тегов)
        </label>

        {/* Существующие теги */}
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {data.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Поле ввода тега */}
        <div className="relative">
          <Input
            ref={tagInputRef}
            placeholder="Введите тег и нажмите Enter"
            value={tagInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTagInput(e.target.value)
            }
            onKeyDown={handleTagKeyDown}
            disabled={data.tags.length >= 10}
          />

          {/* Автодополнение */}
          {showSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => handleTagAdd(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 mt-1">
          {data.tags.length}/10 тегов добавлено
        </div>
      </div>

      {/* Категория */}
      <div>
        <label className="block text-sm font-medium mb-2">Категория *</label>
        <select
          value={data.category}
          onChange={handleCategoryChange}
          className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.category ? 'border-red-500' : ''
          }`}
        >
          <option value="">Выберите категорию</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-sm text-red-600 mt-1">{errors.category}</p>
        )}
      </div>

      {/* NSFW переключатель */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">
              Контент для взрослых (18+)
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Персонаж может участвовать в романтических или интимных сценариях
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.isNsfw}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleNsfwChange(e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* NSFW предупреждение */}
      {showNsfwWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowNsfwWarning(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start mb-4">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Предупреждение о контенте 18+
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Вы собираетесь создать персонажа с контентом для взрослых.
                  Такой контент предназначен только для пользователей старше 18
                  лет.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Продолжая, вы подтверждаете, что вам исполнилось 18 лет.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowNsfwWarning(false)}
              >
                Отмена
              </Button>
              <Button
                variant="primary"
                onClick={confirmNsfw}
                className="bg-red-600 hover:bg-red-700"
              >
                Подтвердить (18+)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicInfoStep;
