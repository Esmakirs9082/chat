import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Character } from '../../types';
import Button from '../ui/Button';
import BasicInfoStep from './steps/BasicInfoStep';
import { CharacterFormData, StepErrors } from './types';
import PersonalityStep from './PersonalityStep';
import AvatarStep from './AvatarStep';
import PreviewStep from './PreviewStep';
import PublishStep from './PublishStep';

interface CharacterCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (character: Character) => void;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const makeInitialData = (): CharacterFormData => ({
    name: '',
    description: '',
    tags: [],
    category: '',
    isNsfw: false,
    personality: [
      { trait: 'openness', value: 50 },
      { trait: 'conscientiousness', value: 50 },
      { trait: 'extraversion', value: 50 },
      { trait: 'agreeableness', value: 50 },
      { trait: 'neuroticism', value: 50 },
    ],
    traits: [],
    greeting: '',
    conversationStyle: 'friendly',
    avatarUrl: undefined,
    avatarFileName: undefined,
    published: false,
  });

  const [formData, setFormData] =
    useState<CharacterFormData>(makeInitialData());
  const [errors, setErrors] = useState<StepErrors>({});

  const steps = [
    {
      id: 1,
      title: 'Основная информация',
      description: 'Имя, описание и теги',
    },
    { id: 2, title: 'Личность', description: 'Черты, стиль общения' },
    { id: 3, title: 'Аватар', description: 'Изображение персонажа' },
    { id: 4, title: 'Предпросмотр', description: 'Финальная проверка' },
    { id: 5, title: 'Публикация', description: 'Завершение создания' },
  ];

  if (!isOpen) return null;

  const validateStep = (step: number): boolean => {
    const stepErrors: StepErrors = {};

    if (step === 1) {
      if (
        !formData.name.trim() ||
        formData.name.length < 2 ||
        formData.name.length > 50
      ) {
        stepErrors.name = 'Имя должно быть от 2 до 50 символов';
      }
      if (
        !formData.description.trim() ||
        formData.description.length < 10 ||
        formData.description.length > 500
      ) {
        stepErrors.description = 'Описание должно быть от 10 до 500 символов';
      }
      if (!formData.category) {
        stepErrors.category = 'Выберите категорию';
      }
    }
    if (step === 2) {
      if (!formData.traits || formData.traits.length === 0) {
        stepErrors.traits = 'Добавьте хотя бы одну черту';
      }
      if (!formData.greeting || formData.greeting.trim().length < 5) {
        stepErrors.greeting = 'Приветствие слишком короткое';
      }
    }
    if (step === 3) {
      if (!formData.avatarUrl && !formData.avatarFileName) {
        stepErrors.avatar = 'Выберите файл или URL';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finalize = (publishedData?: CharacterFormData) => {
    const src = publishedData || formData;
    const character: Character = {
      id: Math.random().toString(36).substr(2, 9),
      name: src.name,
      description: src.description,
      tags: src.tags,
      isNsfw: src.isNsfw,
      personality: src.personality,
      avatar: src.avatarUrl || src.avatarFileName || undefined,
      isPublic: true,
      createdBy: 'current-user',
      messageCount: 0,
      favoriteCount: 0,
      createdAt: new Date(),
      lastUsed: undefined,
    };
    onSuccess(character);
    onClose();
    setCurrentStep(1);
    setFormData(makeInitialData());
    setErrors({});
  };

  const handlePublish = async (dataForPublish: CharacterFormData) => {
    // Здесь могла бы быть интеграция с API
    finalize({ ...dataForPublish, published: true });
  };

  const updateFormData = (data: Partial<CharacterFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            data={formData}
            errors={errors}
            onChange={updateFormData}
          />
        );
      case 2:
        return (
          <PersonalityStep
            data={formData}
            onUpdate={updateFormData}
            setStepErrors={setErrors}
          />
        );
      case 3:
        return (
          <AvatarStep
            data={formData}
            onUpdate={updateFormData}
            setStepErrors={setErrors}
          />
        );
      case 4:
        return <PreviewStep data={formData} />;
      case 5:
        return <PublishStep data={formData} onPublish={handlePublish} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Создание персонажа</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id === currentStep
                      ? 'bg-blue-600 text-white'
                      : step.id < currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-gray-500">
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">{renderStep()}</div>
        </div>

        {/* Footer (не показываем кнопку Publish из футера, используем внутри PublishStep) */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <Button
            variant="secondary"
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Назад
          </Button>

          <div className="text-sm text-gray-500">
            Шаг {currentStep} из {steps.length}
          </div>

          {currentStep < steps.length && (
            <Button onClick={handleNext} disabled={!validateStep(currentStep)}>
              Далее
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
          {currentStep === steps.length && (
            <div className="text-xs opacity-70">
              Используйте кнопку внутри шага для публикации
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCreator;
