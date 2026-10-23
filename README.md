# 🏠 Медиакоми

Симулятор оценки недвижимости в Республике Коми. Угадайте цену квартиры по объявлению и узнайте свой инвестиционный профиль!

## 🎮 Как играть

1. Нажмите «Запустить игру»
2. Вам покажут 10 случайных объявлений о продаже квартир
3. Для каждого объявления передвиньте бегунок на предполагаемую цену
4. Нажмите «Оценить» и узнайте правильный ответ
5. После 10 раундов получите свой результат

## 📊 Система баллов

| Отклонение от цены | Баллы |
|---|---|
| ≤ 5% | 100 |
| ≤ 10% | 85 |
| ≤ 15% | 70 |
| ≤ 20% | 55 |
| ≤ 30% | 40 |
| ≤ 50% | 25 |
| > 50% | 10 |

## 🏆 Инвестиционные профили

- **🎯 Опытный инвестор** — средний балл ≥ 70. Вы отлично чувствуете рынок!
- **💰 Щедрый инвестор** — средний балл 45–69. Склонны переплачивать.
- **🪙 Скряга** — средний балл < 45. Экономный, но занижаете цены.

## 🚀 Запуск

```bash
# Установка зависимостей
npm install

# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Проверка типов
npm run typecheck
```

## 🌐 Деплой на GitHub Pages

### Автоматический деплой через GitHub Actions (рекомендуется)

1. **Запушьте код в ветку `mediakomi-service-prototype-06627`:**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin mediakomi-service-prototype-06627
   ```

2. **Включите GitHub Pages в настройках репозитория:**
   - Перейдите в **Settings** → **Pages**
   - В разделе **Source** выберите **GitHub Actions**
   - Workflow автоматически запустится при пуше

3. **Дождитесь завершения деплоя** (~2-3 минуты)
   - Статус можно посмотреть во вкладке **Actions**
   - После успешного деплоя сайт будет доступен по адресу:
     ```
     https://yudinavio.github.io/mediakomi/
     ```

### Ручной деплой через ветку `gh-pages`

```bash
# 1. Соберите проект
npm run build

# 2. Установите gh-pages
npm install -D gh-pages

# 3. Задеплойте папку dist
npx gh-pages -d dist
```

### Ручной деплой через ветку `main`

```bash
# 1. Соберите проект
npm run build

# 2. Добавьте и запушьте папку dist
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

После этого включите GitHub Pages в настройках репозитория:
- **Settings** → **Pages** → **Source**: выберите ветку `gh-pages` и папку `/ (root)`

### ⚠️ Важно для GitHub Pages

Если ваш сайт будет доступен по адресу `username.github.io/mediakomi/` (не `username.github.io`), необходимо добавить base path в `vite.config.js`:

```javascript
export default defineConfig({
  base: '/mediakomi/', // ← добавьте эту строку
  plugins: [react(), tailwindcss()],
  // ...
});
```

Затем пересоберите проект:
```bash
npm run build
```

### Другие платформы

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Netlify:**
```bash
npm run build
# Загрузите папку dist/ в Netlify
```

## 🛠 Технологии

- **React 18** — UI-библиотека
- **TypeScript** — типизация
- **Tailwind CSS 4** — стилизация
- **Vite** — сборщик
- Без тяжёлых зависимостей

## 🔒 Безопасность

Реализованы security headers:
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy

## 📱 Мобильная версия

Приложение разработано mobile-first:
- Один экран = одна карточка
- Адаптивный бегунок
- Safe area для iPhone
- Минимальный трафик (lazy loading изображений)

## 📄 Лицензия

MIT
