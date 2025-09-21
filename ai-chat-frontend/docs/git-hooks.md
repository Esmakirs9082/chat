# Git Hooks Configuration

## 🎣 Обзор Git Hooks

Проект настроен с **Husky** для автоматической проверки качества кода перед коммитами и пушами.

## 🔧 Установленные хуки

### Pre-commit Hook
**Файл**: `.husky/pre-commit`

Выполняется перед каждым коммитом:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run type checking first
npm run type-check

# Run lint-staged for linting and formatting
npx lint-staged
```

**Что проверяется:**
- ✅ **TypeScript типы** - `tsc --noEmit`
- ✅ **ESLint** - автоматическое исправление ошибок
- ✅ **Prettier** - автоматическое форматирование
- ✅ **Только staged файлы** - через lint-staged

### Commit-msg Hook
**Файл**: `.husky/commit-msg`

Валидирует формат сообщения коммита:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Validate commit message format
npx --no-install commitlint --edit $1
```

**Поддерживаемые типы коммитов:**
- `feat:` - новая функциональность
- `fix:` - исправление багов
- `docs:` - изменения в документации
- `style:` - форматирование кода
- `refactor:` - рефакторинг
- `perf:` - улучшения производительности
- `test:` - добавление тестов
- `chore:` - служебные изменения
- `ci:` - изменения в CI
- `build:` - изменения в сборке
- `revert:` - откат изменений

**Примеры валидных коммитов:**
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve memory leak in chat component"
git commit -m "docs: update deployment guide"
git commit -m "refactor: simplify state management logic"
```

### Pre-push Hook
**Файл**: `.husky/pre-push`

Выполняется перед пушем:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run tests before pushing
echo "🧪 Running tests before push..."
npm run test:ci

# Check if build passes
echo "🏗️ Checking if build passes..."
npm run build
```

**Что проверяется:**
- ✅ **Все тесты** проходят
- ✅ **Production build** успешен
- ✅ **No TypeScript errors** в production сборке

## ⚙️ Конфигурация lint-staged

**Файл**: `package.json` (секция `lint-staged`)

```json
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "src/**/*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

**Обработка файлов:**
- **TypeScript файлы** (`.ts`, `.tsx`):
  - ESLint с автоматическим исправлением
  - Prettier форматирование
- **JSON и Markdown** файлы:
  - Prettier форматирование

## 🎯 Commitlint Configuration

**Файл**: `commitlint.config.js`

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'perf', 'test', 'chore', 'ci', 'build', 'revert'
    ]],
    'subject-case': [2, 'never', ['pascal-case', 'upper-case']],
    'subject-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
  }
};
```

## 🛠️ Полезные команды

### Управление хуками
```bash
# Переустановить хуки (после клонирования)
npm run hooks:install

# Отключить хуки (временно)
npm run hooks:uninstall

# Полная валидация проекта
npm run validate
```

### Обход хуков (для экстренных случаев)
```bash
# Коммит без pre-commit проверок
git commit --no-verify -m "emergency fix"

# Пуш без pre-push проверок  
git push --no-verify
```

### Ручной запуск проверок
```bash
# Проверка только staged файлов
npx lint-staged

# Проверка сообщения коммита
echo "feat: new feature" | npx commitlint

# Полная проверка перед коммитом
npm run type-check && npm run lint && npm run test
```

## 🐛 Troubleshooting

### Проблема: "husky command not found"
```bash
# Решение: переустановить husky
npm install husky --save-dev
npx husky install
```

### Проблема: "hooks not executing"
```bash
# Проверить права доступа
ls -la .husky/
chmod +x .husky/*
```

### Проблема: "commitlint fails"
```bash
# Проверить формат коммита
git log --oneline -5

# Исправить последний коммит
git commit --amend -m "feat: correct commit message"
```

### Проблема: "lint-staged hangs"
```bash
# Очистить кэш
npm run lint -- --cache false
rm -rf node_modules/.cache
```

## 🚀 Workflow

### Обычный workflow разработчика:

1. **Разработка**:
   ```bash
   git add .
   git commit -m "feat: implement user profile page"
   # → Автоматически запустятся pre-commit проверки
   ```

2. **Push в репозиторий**:
   ```bash
   git push origin feature/user-profile
   # → Автоматически запустятся pre-push проверки
   ```

3. **Если проверки не прошли**:
   - Исправить ошибки
   - Добавить исправления: `git add .`
   - Коммитнуть снова: `git commit -m "fix: resolve linting issues"`

### Командная работа:

- **Все коммиты** имеют единый стиль благодаря commitlint
- **Код автоматически** форматируется при коммите
- **Ошибки линтера** исправляются автоматически
- **Типы проверяются** перед каждым коммитом
- **Тесты гарантированно** проходят перед пушем

## 📋 Checklist для новых участников команды

- [ ] Клонировать репозиторий
- [ ] Запустить `npm install`
- [ ] Убедиться, что хуки установлены: `ls .husky/`
- [ ] Сделать тестовый коммит для проверки хуков
- [ ] Ознакомиться с форматом коммитов
- [ ] Настроить IDE для автоматического форматирования

---

**Результат**: Полностью автоматизированный workflow с гарантией качества кода! 🎉