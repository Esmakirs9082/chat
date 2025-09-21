import React, { useState, useEffect, FormEvent } from 'react';
import { CharacterFormData, ConversationStyle, StepErrors } from './types';

interface PersonalityStepProps {
  data: CharacterFormData;
  onUpdate: (partial: Partial<CharacterFormData>) => void;
  setStepErrors: (errors: StepErrors) => void;
}

const CONVERSATION_STYLES: {
  value: ConversationStyle;
  label: string;
  hint: string;
}[] = [
  { value: 'friendly', label: 'Friendly', hint: 'Теплый, поддерживающий тон' },
  { value: 'sarcastic', label: 'Sarcastic', hint: 'Острые, ироничные ответы' },
  {
    value: 'romantic',
    label: 'Romantic',
    hint: 'Ласковые и флиртующие ответы',
  },
  { value: 'mysterious', label: 'Mysterious', hint: 'Загадочные полутона' },
  {
    value: 'formal',
    label: 'Formal',
    hint: 'Строгий, структурированный стиль',
  },
];

/**
 * PersonalityStep: позволяет задать поведенческие элементы персонажа
 */
export const PersonalityStep: React.FC<PersonalityStepProps> = ({
  data,
  onUpdate,
  setStepErrors,
}) => {
  const [traitInput, setTraitInput] = useState('');

  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.traits, data.greeting, data.conversationStyle]);

  const addTrait = () => {
    const trimmed = traitInput.trim();
    if (!trimmed) return;
    if (data.traits.includes(trimmed)) return;
    onUpdate({ traits: [...data.traits, trimmed] });
    setTraitInput('');
  };

  const removeTrait = (t: string) => {
    onUpdate({ traits: data.traits.filter((tr) => tr !== t) });
  };

  const validate = () => {
    const errors: StepErrors = {};
    if (!data.traits || data.traits.length === 0) {
      errors.traits = 'Добавьте хотя бы одну черту';
    }
    if (!data.greeting || data.greeting.trim().length < 5) {
      errors.greeting = 'Приветствие слишком короткое';
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    validate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Черты (traits)</label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Введите черту и нажмите +"
            value={traitInput}
            onChange={(e) => setTraitInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTrait();
              }
            }}
          />
          <button
            type="button"
            onClick={addTrait}
            className="px-3 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            disabled={!traitInput.trim()}
          >
            +
          </button>
        </div>
        {data.traits.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {data.traits.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-800/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 text-xs"
              >
                {t}
                <button
                  type="button"
                  onClick={() => removeTrait(t)}
                  className="text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {data.traits.length === 0 && (
          <p className="mt-1 text-xs text-red-500">
            Добавьте минимум одну черту.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Приветственное сообщение (Greeting)
        </label>
        <textarea
          className="w-full rounded border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
          placeholder="Например: Привет! Я Лира — твой загадочный спутник. Чем займёмся?"
          value={data.greeting}
          onChange={(e) => onUpdate({ greeting: e.target.value })}
        />
        {(!data.greeting || data.greeting.trim().length < 5) && (
          <p className="mt-1 text-xs text-red-500">
            Введите более развёрнутое приветствие.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Стиль общения</label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CONVERSATION_STYLES.map((style) => {
            const active = data.conversationStyle === style.value;
            return (
              <button
                type="button"
                key={style.value}
                onClick={() => onUpdate({ conversationStyle: style.value })}
                className={`text-left border rounded p-3 transition text-sm hover:border-indigo-400 ${active ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40' : 'border-gray-300 dark:border-gray-600'}`}
              >
                <div className="font-medium">{style.label}</div>
                <div className="text-xs opacity-70">{style.hint}</div>
              </button>
            );
          })}
        </div>
      </div>
    </form>
  );
};

export default PersonalityStep;
