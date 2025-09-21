# AI Chat Frontend - Production Dockerfile
# Multi-stage build для оптимизации размера образа

# Stage 1: Build stage
FROM node:18-alpine AS builder

# Установка рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json для кэширования слоев
COPY package*.json ./

# Установка всех зависимостей (включая dev) для сборки
RUN npm ci

# Копирование исходного кода
COPY . .

# Сборка приложения для production
RUN npm run build

# Stage 2: Production stage
FROM nginx:alpine

# Установка автора и описания
LABEL maintainer="AI Chat Team"
LABEL description="AI Chat Frontend - React TypeScript App"

# Копирование собранного приложения из builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Копирование конфигурации nginx (можно выбрать nginx.conf или nginx-simple.conf)
COPY nginx-simple.conf /etc/nginx/conf.d/default.conf

# Создание пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Установка правильных разрешений
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d

# Создание директорий для nginx с правильными разрешениями
RUN touch /var/run/nginx.pid && \
    chown -R nextjs:nodejs /var/run/nginx.pid

# Переключение на непривилегированного пользователя
USER nextjs

# Открытие порта 80
EXPOSE 80

# Проверка здоровья
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]