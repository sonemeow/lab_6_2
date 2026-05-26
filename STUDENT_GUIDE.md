# Гайд для студента

7 шагов от пустого репо до живого CV в продакшене.

## Шаг 1. Получить стартер

Жми "**Use this template**" → "Create a new repository". Назови как хочешь, но запомни имя — оно попадёт в URL.

Сделай репо **публичным**. GitHub Pages на бесплатном тарифе для приватных репо требует Pro.

## Шаг 2. Включить Pages

`Settings` → `Pages` → `Build and deployment` → **Source = GitHub Actions**.

Если оставишь "Deploy from a branch" — деплой провалится с ошибкой про permissions. Это пункт №1 в списке граблей.

## Шаг 3. Локальный setup

```bash
git clone <твой-репо>
cd <твой-репо>
npm install
npm run dev
```

Открой `http://localhost:5173`. Видишь стартовый CV — значит, всё ок.

## Шаг 4. Сделать CV своим

```bash
git checkout -b feature/my-cv
```

Правь `index.html`, `style.css`, опционально `src/main.js`. Минимум:

- Имя, контакты
- Summary
- 2+ пункта опыта/проектов
- Скиллы
- **Один нестандартный элемент** — переключатель темы, анимация, easter egg, что угодно

Можешь использовать LLM-ассистента. Записывай свои промпты — они пойдут в README.

Проверь линтер локально:

```bash
npm run lint
```

Если падает — чини. CI на PR будет ругаться так же.

## Шаг 5. Открыть PR

```bash
git add .
git commit -m "feat: my CV content"
git push -u origin feature/my-cv
```

На GitHub открой Pull Request `feature/my-cv` → `main`.

В табе **Checks** должны появиться `lint` и `build`. Если оба зелёные — мержь.

Если красные — открывай лог, читай ошибку, фикси, пушь снова. CI перезапустится автоматически.

## Шаг 6. Merge → Deploy

После merge в `main` запускается `deploy.yml`. Иди в **Actions**, найди свежий run "Deploy to GitHub Pages". Он должен:

1. Билднуть сайт
2. Загрузить артефакт
3. Задеплоить на Pages

В конце run-а появится ссылка вида `https://<username>.github.io/<repo>/`. Открой — должен быть твой CV.

Первый деплой иногда занимает до минуты после "успешного" статуса — Pages кэширует. Подожди.

## Шаг 7. Финализация

- Вставь Live URL в README.md
- Заполни секцию "Vibe coding log"
- Сдай ссылку на репо

---

## Грабли, на которые ты наступишь

### "Get Pages site failed" / 404 при деплое

Не включил Pages с источником "GitHub Actions". См. Шаг 2.

### Сайт открывается, но стили/JS не подгружаются (404 на assets)

Vite по умолчанию ставит абсолютные пути. На GitHub Pages для project-сайтов URL — `/<repo>/`, не корень.

В стартере уже стоит `base: './'` в `vite.config.js` — относительные пути работают везде. Если меняешь — знай, что делаешь.

### CI падает на `npm ci` с "lockfile" ошибкой

Закоммитил `package.json`, но не `package-lock.json`. Запусти `npm install` локально, закоммить лок-файл.

### Линтер ругается на сгенерированный LLM-ом код

Это нормально. Чини. В этом и смысл линтера — ловить такое до прода.

### Деплой green, но Pages показывает 404

Подожди 30–60 секунд. Если не помогло — проверь Settings → Pages: должно быть "Your site is live at …".

### `permissions` ошибка в deploy.yml

В стартере permissions проставлены. Если копировал workflow откуда-то — проверь:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### Хочу свой стек (React/Vue/Svelte/Astro)

Можно. Но:
- Линтер придётся настроить заново под свой стек
- Build-команда должна по-прежнему класть результат в `dist/` (или поправь workflow)
- `base path` в конфиге фреймворка должен соответствовать GitHub Pages URL

---

## Чек-лист перед сдачей

- [ ] Репо публичный
- [ ] README содержит Live URL и заполнен Vibe coding log
- [ ] Pages открывается, CV отображается корректно
- [ ] В Actions есть успешный CI run на PR
- [ ] В Actions есть успешный Deploy run на main
- [ ] В истории есть минимум один merged PR с зелёным CI
- [ ] `node_modules/` и `dist/` НЕ в репо (проверь `.gitignore`)
- [ ] Есть нестандартный элемент в CV
