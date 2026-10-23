# 🚀 Инструкция по деплою на GitHub Pages

## Быстрый старт (автоматический деплой)

### 1. Запушьте код в GitHub

```bash
# Добавьте все файлы
git add .

# Создайте коммит
git commit -m "Add GitHub Pages deployment"

# Запушьте в ветку mediakomi-service-prototype-06627
git push origin mediakomi-service-prototype-06627
```

### 2. Включите GitHub Pages

1. Откройте репозиторий на GitHub: https://github.com/yudinavio/mediakomi
2. Перейдите в **Settings** (Настройки)
3. В левом меню выберите **Pages**
4. В разделе **Source** выберите **GitHub Actions**
5. Сохраните настройки

### 3. Дождитесь деплоя

- GitHub Actions автоматически запустит workflow
- Перейдите во вкладку **Actions** для отслеживания статуса
- Через 2-3 минуты сайт будет доступен по адресу:

```
https://yudinavio.github.io/mediakomi/
```

---

## ⚠️ Если сайт не открывается (404 ошибка)

Если ваш сайт доступен по адресу `username.github.io/mediakomi/` (а не просто `username.github.io`), нужно добавить base path:

### Шаг 1: Отредактируйте `vite.config.js`

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: '/mediakomi/', // ← ДОБАВЬТЕ ЭТУ СТРОКУ
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
```

### Шаг 2: Пересоберите и запушьте

```bash
npm run build
git add .
git commit -m "Fix base path for GitHub Pages"
git push origin mediakomi-service-prototype-06627
```

---

## Альтернативный способ: ручной деплой через gh-pages

Если автоматический деплой не работает, используйте ручной способ:

### 1. Установите gh-pages

```bash
npm install -D gh-pages
```

### 2. Задеплойте

```bash
npm run build
npx gh-pages -d dist
```

### 3. Включите GitHub Pages

1. **Settings** → **Pages**
2. **Source**: выберите ветку `gh-pages` и папку `/ (root)`
3. Сохраните

---

## Проверка деплоя

После успешного деплоя откройте:

```
https://yudinavio.github.io/mediakomi/
```

Вы должны увидеть главную страницу приложения «Медиакоми» с кнопкой «Запустить игру».

---

## Устранение проблем

### Проблема: Белый экран или 404

**Решение:** Добавьте `base: '/mediakomi/'` в `vite.config.js` (см. выше)

### Проблема: Стили не загружаются

**Решение:** 
1. Проверьте, что base path указан правильно
2. Пересоберите проект: `npm run build`
3. Запушьте изменения

### Проблема: GitHub Actions не запускается

**Решение:**
1. Убедитесь, что workflow файл находится в `.github/workflows/deploy.yml`
2. Проверьте, что вы пушите в правильную ветку
3. Проверьте настройки репозитория: **Settings** → **Actions** → **General** → **Allow all actions**

---

## Готово! 🎉

Теперь ваше приложение «Медиакоми» доступно всему миру по адресу GitHub Pages!
