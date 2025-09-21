module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // новая функциональность
        'fix',      // исправление багов
        'docs',     // изменения в документации
        'style',    // форматирование, отсутствующие точки с запятой и т.д.
        'refactor', // рефакторинг кода
        'perf',     // улучшения производительности
        'test',     // добавление тестов
        'chore',    // изменения в build процессе или вспомогательных инструментах
        'ci',       // изменения в CI конфигурации
        'build',    // изменения в системе сборки
        'revert',   // откат изменений
      ],
    ],
    'subject-case': [2, 'never', ['pascal-case', 'upper-case']],
    'subject-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
  },
};