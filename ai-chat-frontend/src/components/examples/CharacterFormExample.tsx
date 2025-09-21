import React, { useState } from 'react';
import {
  createCharacter,
  updateCharacter,
  cloneCharacter,
  exportCharacter,
  importCharacter,
  getCharacterTags,
  getCharacterCategories,
  uploadCharacterImages,
} from '../../services/characterApi';
import { CharacterCreateForm } from '../../types';

// Пример компонента создания/редактирования персонажа
export const CharacterFormExample: React.FC = () => {
  const [formData, setFormData] = useState<CharacterCreateForm>({
    name: '',
    description: '',
    personality: [],
    tags: [],
    avatar: undefined,
    isNsfw: false,
  });

  const [loading, setLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Загрузка доступных тегов и категорий
  React.useEffect(() => {
    const loadOptions = async () => {
      try {
        const [tags, cats] = await Promise.all([
          getCharacterTags(),
          getCharacterCategories(),
        ]);
        setAvailableTags(tags);
        setCategories(cats);
      } catch (error) {
        console.error('Ошибка загрузки опций:', error);
      }
    };

    loadOptions();
  }, []);

  // Создание персонажа
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Заполните обязательные поля');
      return;
    }

    try {
      setLoading(true);
      const newCharacter = await createCharacter(formData);

      // Если есть дополнительные изображения, загружаем их
      if (selectedFiles.length > 0) {
        await uploadCharacterImages(
          newCharacter.id,
          selectedFiles,
          (progress) => console.log(`Загрузка изображений: ${progress}%`)
        );
      }

      alert('Персонаж успешно создан!');

      // Сбрасываем форму
      setFormData({
        name: '',
        description: '',
        personality: [],
        tags: [],
        avatar: undefined,
        isNsfw: false,
      });
      setSelectedFiles([]);
      setSelectedCategory('');
    } catch (error) {
      console.error('Ошибка создания персонажа:', error);
      alert('Ошибка при создании персонажа');
    } finally {
      setLoading(false);
    }
  };

  // Клонирование персонажа
  const handleClone = async (characterId: string) => {
    try {
      setLoading(true);
      const clonedCharacter = await cloneCharacter(
        characterId,
        `${formData.name} (копия)`
      );
      alert(`Персонаж склонирован: ${clonedCharacter.name}`);
    } catch (error) {
      console.error('Ошибка клонирования:', error);
    } finally {
      setLoading(false);
    }
  };

  // Экспорт персонажа
  const handleExport = async (
    characterId: string,
    format: 'json' | 'tavern' | 'characterai'
  ) => {
    try {
      const result = await exportCharacter(characterId, format);
      // Открываем ссылку для скачивания
      window.open(result.downloadUrl, '_blank');
    } catch (error) {
      console.error('Ошибка экспорта:', error);
    }
  };

  // Импорт персонажа
  const handleImport = async (
    file: File,
    format: 'json' | 'tavern' | 'characterai'
  ) => {
    try {
      setLoading(true);
      const importedCharacter = await importCharacter(file, format);

      // Заполняем форму данными из импортированного персонажа
      setFormData({
        name: importedCharacter.name,
        description: importedCharacter.description,
        personality: importedCharacter.personality || [],
        tags: importedCharacter.tags || [],
        avatar: undefined,
        isNsfw: importedCharacter.isNsfw || false,
      });

      alert('Персонаж успешно импортирован!');
    } catch (error) {
      console.error('Ошибка импорта:', error);
      alert('Ошибка при импорте персонажа');
    } finally {
      setLoading(false);
    }
  };

  // Добавление/удаление тегов
  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...(prev.tags || []), tag],
    }));
  };

  // Добавление/удаление черт характера
  const handlePersonalityToggle = (trait: string) => {
    setFormData((prev) => ({
      ...prev,
      personality: prev.personality?.some((p) => p.trait === trait)
        ? prev.personality.filter((p) => p.trait !== trait)
        : [...(prev.personality || []), { trait, value: 0.8 }], // Добавляем со значением по умолчанию
    }));
  };

  const commonPersonalityTraits = [
    'дружелюбный',
    'застенчивый',
    'уверенный',
    'игривый',
    'серьезный',
    'умный',
    'забавный',
    'загадочный',
    'энергичный',
    'спокойный',
    'романтичный',
    'циничный',
    'оптимистичный',
    'пессимистичный',
    'храбрый',
  ];

  return (
    <div className="character-form max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Создание персонажа</h1>

      {/* Импорт персонажа */}
      <div className="import-section mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Импорт персонажа</h3>
        <div className="flex gap-4 items-center">
          <input
            type="file"
            accept=".json,.png,.card"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const format = file.name.endsWith('.json')
                  ? 'json'
                  : file.name.endsWith('.png')
                    ? 'tavern'
                    : 'characterai';
                handleImport(file, format);
              }
            }}
            className="text-sm"
          />
          <span className="text-sm text-gray-600">
            Поддерживаются форматы: JSON, Tavern AI (.png), Character.AI
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="basic-info grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Имя персонажа *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Введите имя персонажа"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Категория</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Выберите категорию</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Описание */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Описание персонажа *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg h-32"
            placeholder="Опишите внешность, характер, предысторию персонажа..."
            required
          />
        </div>

        {/* Аватар */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Аватар персонажа
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setAvatarFile(file || null);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          {avatarFile && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(avatarFile)}
                alt="Предпросмотр"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Дополнительные изображения */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Дополнительные изображения
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setSelectedFiles(files);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          {selectedFiles.length > 0 && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {selectedFiles.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`Изображение ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        {/* Черты характера */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Черты характера
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {commonPersonalityTraits.map((trait) => (
              <button
                key={trait}
                type="button"
                onClick={() => handlePersonalityToggle(trait)}
                className={`p-2 text-sm rounded-full border transition-colors ${
                  formData.personality?.some((p) => p.trait === trait)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {trait}
              </button>
            ))}
          </div>
        </div>

        {/* Теги */}
        <div>
          <label className="block text-sm font-medium mb-2">Теги</label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto">
            {availableTags.slice(0, 30).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`p-2 text-sm rounded-full border transition-colors ${
                  formData.tags?.includes(tag)
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Выбранные теги */}
          {formData.tags && formData.tags.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Выбранные теги:</p>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className="text-green-500 hover:text-green-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* NSFW флаг */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isNsfw}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isNsfw: e.target.checked }))
              }
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">
              Содержит контент для взрослых (NSFW)
            </span>
          </label>
        </div>

        {/* Кнопки действий */}
        <div className="actions flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Создание...' : 'Создать персонажа'}
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                name: '',
                description: '',
                personality: [],
                tags: [],
                avatar: undefined,
                isNsfw: false,
              });
              setSelectedFiles([]);
              setSelectedCategory('');
              setAvatarFile(null);
            }}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            Очистить форму
          </button>
        </div>
      </form>

      {/* Экспорт (показываем только если персонаж создан) */}
      <div className="export-section mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Экспорт персонажа</h3>
        <p className="text-sm text-gray-600 mb-4">
          После создания персонажа вы сможете экспортировать его в различных
          форматах
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('demo-id', 'json')}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
            disabled
          >
            JSON формат
          </button>
          <button
            onClick={() => handleExport('demo-id', 'tavern')}
            className="bg-purple-500 text-white px-4 py-2 rounded text-sm"
            disabled
          >
            Tavern AI
          </button>
          <button
            onClick={() => handleExport('demo-id', 'characterai')}
            className="bg-green-500 text-white px-4 py-2 rounded text-sm"
            disabled
          >
            Character.AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterFormExample;
