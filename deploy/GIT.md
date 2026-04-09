# Git: репозиторій і оновлення на VPS

Репозиторій має бути **лише в папці проєкту** `NEUBLA/ios`, не в домашній теці користувача (інакше `git` підхопить зайві файли).

## 1. Локально (перший раз)

У каталозі проєкту (`ios`):

```bash
git init -b main
git add .
git commit -m "Initial commit: MoneyFlow"
```

Створіть **порожній** репозиторій на [GitHub](https://github.com/new) або GitLab (без README, якщо вже є локальний коміт).

Підключіть remote і надішліть код:

```bash
git remote add origin https://github.com/YOUR_USER/moneyflow.git
git push -u origin main
```

Якщо GitHub пропонує `master` замість `main` — або перейменуйте гілку (`git branch -M main`), або використовуйте `master` у `push`.

## 2. На VPS (клон замість rsync)

```bash
cd /var/www
sudo rm -rf moneyflow   # лише якщо туди вже щось клали вручну й папка не потрібна
sudo mkdir -p moneyflow && sudo chown $USER:$USER moneyflow
cd moneyflow
git clone https://github.com/YOUR_USER/moneyflow.git .
cp .env.example .env
nano .env   # NEXT_PUBLIC_APP_URL=https://moneyflow.vladdev.pp.ua
```

Далі без Docker (рекомендовано один скрипт): див. «Швидкий старт» у [VPS.md](VPS.md) — `./deploy/vps-npm.sh` (опційно `--nginx`). Альтернатива: Docker — той самий [VPS.md](VPS.md).

## 3. Оновлення після змін

**На ПК:** `git add` → `git commit` → `git push`.

**На VPS:**

```bash
cd /var/www/moneyflow
git pull
./deploy/vps-npm.sh update
```

Або Docker: `docker compose build && docker compose up -d` ([VPS.md](VPS.md)).

## Приватний репозиторій на VPS

- SSH-ключ на сервері + remote `git@github.com:USER/moneyflow.git`, або  
- **Deploy key** / **Personal Access Token** (HTTPS з токеном у URL не зберігайте в скриптах у відкритому вигляді).
