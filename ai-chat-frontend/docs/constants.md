# Application Constants

Централизованная система констант для AI Chat приложения с полной типизацией и утилитами.

## Структура констант

### 🏷️ Основные константы

#### Планы подписки (`SUBSCRIPTION_PLANS`)
```typescript
import { SUBSCRIPTION_PLANS, getSubscriptionPlan } from '@/constants';

// Доступ к планам
const basicPlan = SUBSCRIPTION_PLANS.BASIC;
const premiumPlan = getSubscriptionPlan('PREMIUM');

// Проверка лимитов
if (basicPlan.limits.messagesPerDay > 0) {
  console.log(`Basic план: ${basicPlan.limits.messagesPerDay} сообщений/день`);
}
```

**Доступные планы:**
- `FREE` - Бесплатный (10 сообщений/день)
- `BASIC` - Базовый $9.99 (100 сообщений/день) 
- `PREMIUM` - Премиум $19.99 (безлимитно)

#### Категории персонажей (`CHARACTER_CATEGORIES`)
```typescript
import { CHARACTER_CATEGORIES, getCharacterCategory } from '@/constants';

// Список категорий
Object.entries(CHARACTER_CATEGORIES).map(([id, category]) => (
  <div key={id}>
    {category.icon} {category.displayName}
    {category.nsfw && <span>18+</span>}
  </div>
));

// Фильтрация NSFW
const safeCategories = Object.values(CHARACTER_CATEGORIES)
  .filter(category => !category.nsfw);
```

**Доступные категории:**
- Romance (💕) - NSFW
- Fantasy (🔮)
- Anime (🎌)
- Historical (🏛️)
- Horror (👻)
- Comedy (😂)
- Business (💼)
- Educational (📚)
- Gaming (🎮)
- Celebrities (⭐)

#### Черты личности (`PERSONALITY_TRAITS`)
```typescript
import { PERSONALITY_TRAITS, getPersonalityTrait } from '@/constants';

// Создание селектора черт
const TraitSelector = () => (
  <select>
    {Object.entries(PERSONALITY_TRAITS).map(([id, trait]) => (
      <option key={id} value={id}>
        {trait.displayName} - {trait.description}
      </option>
    ))}
  </select>
);

// Поиск противоположных черт
const trait = PERSONALITY_TRAITS.FRIENDLY;
const opposite = trait.opposite ? PERSONALITY_TRAITS[trait.opposite] : null;
```

#### Поддерживаемые языки (`SUPPORTED_LANGUAGES`)
```typescript
import { SUPPORTED_LANGUAGES, isLanguageCode } from '@/constants';

// Языковой переключатель
const LanguageSwitcher = () => (
  <div>
    {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
      <button key={code}>
        {lang.flag} {lang.displayName}
      </button>
    ))}
  </div>
);

// Проверка языка
if (isLanguageCode('ru')) {
  setLanguage('ru');
}
```

### 📁 Загрузка файлов (`FILE_UPLOAD_LIMITS`)
```typescript
import { FILE_UPLOAD_LIMITS, isFileTypeSupported, formatFileSize } from '@/constants';

// Проверка типа файла
const handleFileUpload = (file: File) => {
  if (!isFileTypeSupported(file.type, 'AVATAR')) {
    alert('Неподдерживаемый тип файла');
    return;
  }
  
  const limits = FILE_UPLOAD_LIMITS.AVATAR;
  if (file.size > limits.maxSize) {
    alert(`Файл слишком большой. Макс: ${formatFileSize(limits.maxSize)}`);
    return;
  }
  
  // Загружаем файл
};

// Ограничения по тарифам
import { UPLOAD_LIMITS_BY_TIER } from '@/constants';

const canUploadVoice = (userTier: string) => {
  return UPLOAD_LIMITS_BY_TIER[userTier]?.voice || false;
};
```

### ✅ Валидация (`REGEX_PATTERNS`)
```typescript
import { validateValue, REGEX_PATTERNS } from '@/constants';

// Валидация форм
const validateForm = (data: any) => {
  const errors = {};
  
  if (!validateValue(data.email, 'EMAIL')) {
    errors.email = REGEX_PATTERNS.EMAIL.message;
  }
  
  if (!validateValue(data.password, 'PASSWORD')) {
    errors.password = REGEX_PATTERNS.PASSWORD.message;
  }
  
  return errors;
};

// Живая валидация
const [email, setEmail] = useState('');
const isValidEmail = validateValue(email, 'EMAIL');

<input 
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className={isValidEmail ? 'border-green-500' : 'border-red-500'}
/>
```

### 🌐 API Endpoints (`API_ENDPOINTS`)
```typescript
import { API_ENDPOINTS } from '@/constants';

// Использование в API клиенте
const login = (credentials) => {
  return fetch(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

// Динамические пути
const getCharacter = (id: string) => {
  const url = API_ENDPOINTS.CHARACTERS.GET.replace(':id', id);
  return fetch(url);
};
```

## 📦 Групповые константы (Barrel Pattern)

### Subscription - Подписки
```typescript
import { Subscription } from '@/constants';

// Доступ через группу
const plans = Subscription.PLANS;
const limits = Subscription.MESSAGE_LIMITS;
const uploadLimits = Subscription.UPLOAD_LIMITS_BY_TIER;
```

### Characters - Персонажи
```typescript
import { Characters } from '@/constants';

const categories = Characters.CATEGORIES;
const traits = Characters.PERSONALITY_TRAITS;
```

### Validation - Валидация
```typescript
import { Validation } from '@/constants';

const patterns = Validation.PATTERNS;
const fileLimits = Validation.FILE_UPLOAD_LIMITS;
```

### UI - Интерфейс
```typescript
import { UI } from '@/constants';

// Использование в стилизации
const Modal = styled.div`
  z-index: ${UI.Z_INDEX.MODAL};
  transition: all ${UI.ANIMATION_DURATION.NORMAL}ms ease;
  
  @media (min-width: ${UI.BREAKPOINTS.MD}px) {
    // Стили для больших экранов
  }
`;
```

## 🛠️ Утилитарные функции

### Валидация
```typescript
import { validateValue, isFileTypeSupported } from '@/constants';

// Валидация значений
const isValid = validateValue('user@example.com', 'EMAIL');

// Проверка файлов
const isSupported = isFileTypeSupported('image/jpeg', 'AVATAR');
```

### Форматирование
```typescript
import { formatFileSize } from '@/constants';

const size = formatFileSize(1024 * 1024); // "1 МБ"
const largeSize = formatFileSize(5 * 1024 * 1024); // "5 МБ"
```

### Type Guards
```typescript
import { isSubscriptionPlanId, isLanguageCode } from '@/constants';

if (isSubscriptionPlanId(planId)) {
  // TypeScript знает, что planId имеет правильный тип
  const plan = SUBSCRIPTION_PLANS[planId];
}
```

## 🎯 Типы

### Основные типы
```typescript
import type {
  SubscriptionPlanId,
  CharacterCategoryId,
  PersonalityTraitId,
  LanguageCode,
  FileUploadType,
  ValidationPatternType,
} from '@/constants';

// Использование в компонентах
interface Props {
  planId: SubscriptionPlanId;
  category: CharacterCategoryId;
  language: LanguageCode;
}
```

### Интерфейсы
```typescript
import type {
  SubscriptionPlan,
  CharacterCategory,
  PersonalityTrait,
  Language,
  FileUploadConfig,
  ValidationPattern,
} from '@/constants';

// Расширение типов
interface ExtendedPlan extends SubscriptionPlan {
  customFeatures: string[];
}
```

## 📱 Примеры использования

### Компонент выбора плана
```tsx
import { SUBSCRIPTION_PLANS, type SubscriptionPlanId } from '@/constants';

const PlanSelector = () => {
  const [selected, setSelected] = useState<SubscriptionPlanId>('BASIC');
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(SUBSCRIPTION_PLANS).map(([id, plan]) => (
        <div 
          key={id}
          className={`p-4 border rounded ${plan.popular ? 'border-gold' : ''}`}
          onClick={() => setSelected(id as SubscriptionPlanId)}
        >
          <h3>{plan.displayName}</h3>
          <p>${plan.price}/месяц</p>
          <ul>
            {plan.features.map(feature => (
              <li key={feature}>✓ {feature}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
```

### Форма с валидацией
```tsx
import { validateValue, REGEX_PATTERNS, ERROR_MESSAGES } from '@/constants';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const validateField = (name: string, value: string) => {
    let isValid = false;
    
    switch (name) {
      case 'email':
        isValid = validateValue(value, 'EMAIL');
        break;
      case 'password':
        isValid = validateValue(value, 'PASSWORD');
        break;
      case 'username':
        isValid = validateValue(value, 'USERNAME');
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: isValid ? null : REGEX_PATTERNS[name.toUpperCase()].message
    }));
  };
  
  return (
    <form>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => {
          setFormData(prev => ({ ...prev, email: e.target.value }));
          validateField('email', e.target.value);
        }}
        className={errors.email ? 'border-red-500' : 'border-gray-300'}
      />
      {errors.email && <p className="text-red-500">{errors.email}</p>}
    </form>
  );
};
```

## ⚙️ Расширение константы

### Добавление новой категории
```typescript
// В src/constants/index.ts
export const CHARACTER_CATEGORIES = {
  // ... существующие категории
  SCIFI: {
    id: 'scifi',
    name: 'scifi',
    displayName: 'Научная фантастика',
    description: 'Персонажи из мира будущего и космоса',
    icon: '🚀',
    nsfw: false
  }
} as const;
```

### Добавление нового паттерна валидации
```typescript
export const REGEX_PATTERNS = {
  // ... существующие паттерны
  CREDIT_CARD: {
    pattern: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/,
    message: 'Введите корректный номер карты',
    example: '1234 5678 9012 3456'
  }
} as const;
```

## 📊 Статистика констант

- **Планы подписки:** 3 (Free, Basic, Premium)
- **Категории персонажей:** 10 (включая NSFW)
- **Черты личности:** 16 с противоположными парами
- **Поддерживаемые языки:** 10 (основные мировые языки)
- **Типы файлов:** 4 (Avatar, Character, Document, Voice)
- **Паттерны валидации:** 10 (Email, Password, URL и др.)
- **API endpoints:** 25+ организованных по группам
- **UI константы:** Темы, анимации, breakpoints, z-index
- **Утилитарные функции:** 10+ для работы с константами

## 🔧 TypeScript поддержка

Все константы полностью типизированы и поддерживают:
- Автокомплит в IDE
- Type checking во время компиляции
- IntelliSense подсказки
- Рефакторинг с сохранением типов
- Type guards для runtime проверок

## 📝 Лучшие практики

1. **Используйте типизированные константы** вместо магических строк
2. **Применяйте утилитарные функции** для валидации и проверок
3. **Группируйте связанные константы** через barrel pattern
4. **Расширяйте константы** через существующие интерфейсы
5. **Документируйте изменения** при добавлении новых констант