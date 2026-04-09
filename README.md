# MoneyFlow — Telegram Mini App

Next.js застосунок для доходів, витрат, бюджетів і цілей. Дані в `localStorage` (Zustand persist), архітектура готова до підключення API (`lib/api/client.ts`).

## Локальний запуск

```bash
npm install
npm run dev
```

Відкрийте `http://localhost:3000`. Без Telegram аватар і theme params підставляються частково; повна поведінка — у клієнті Telegram.

### HTTPS для Telegram

Telegram вимагає **HTTPS** для Web App (крім `localhost` у деяких сценаріях тесту). Для тесту з телефона використайте тунель:

```bash
npx ngrok http 3000
```

Скопіюйте виданий `https://....ngrok-free.app` — це URL для поля Web App у BotFather.

## Підключення до бота

1. Створіть бота через [@BotFather](https://t.me/BotFather): `/newbot`.
2. Задайте Web App: `/mybots` → ваш бот → **Bot Settings** → **Menu Button** або **Edit Web App** / команда `/setmenubutton` (залежно від інтерфейсу).
3. Вкажіть URL продакшену або ngrok, наприклад `https://your-app.vercel.app`.
4. Опційно: **Settings** → увімкніть **Inline mode** / додайте кнопку з `web_app` у кастомній клавіатурі.

Приклад кнопки (Telegram Bot API, `reply_markup`):

```json
{
  "keyboard": [[{ "text": "Відкрити MoneyFlow", "web_app": { "url": "https://your-domain.com" } }]],
  "resize_keyboard": true
}
```

Після деплою задайте `NEXT_PUBLIC_APP_URL` у змінних середовища (для власних посилань у коді, якщо використовуєте).

Продакшен на власному VPS: [deploy/VPS.md](deploy/VPS.md) (Docker, nginx, HTTPS). Git і оновлення на сервері: [deploy/GIT.md](deploy/GIT.md).

## Стек

- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- `@twa-dev/sdk` — обгортка над Telegram WebApp
- Zustand + persist → `localStorage`
- Recharts — графіки
- Framer Motion — анімації модалок

## Структура

Див. дерево у відповіді репозиторію: `app/`, `components/`, `hooks/`, `store/`, `lib/`, `types/`, `data/`.
