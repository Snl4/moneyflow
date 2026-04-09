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

## VPS: GitHub через SSH (замість пароля HTTPS)

GitHub **не приймає пароль** для `git push` / `git pull` по HTTPS — потрібен **Personal Access Token** або **SSH**. На сервері зручніше SSH.

### Крок 1 — ключ на VPS

Під тим користувачем, під яким працюєш з репозиторієм (у тебе часто `root`):

```bash
ssh-keygen -t ed25519 -C "moneyflow-vps" -f ~/.ssh/id_ed25519 -N ""
```

(Якщо ключ уже є — пропусти або використай інший `-f`.)

Покажи **публічний** ключ (його весь вміст одним блоком):

```bash
cat ~/.ssh/id_ed25519.pub
```

### Крок 2 — додати ключ у GitHub

1. GitHub → **Settings** → **SSH and GPG keys** → **New SSH key**.
2. **Title:** наприклад `moneyflow VPS`.
3. **Key type:** Authentication Key.
4. У поле **Key** встав вміст з `id_ed25519.pub` (починається з `ssh-ed25519 ...`).
5. **Add SSH key**.

### Крок 3 — перевірити з’єднання

```bash
ssh -o StrictHostKeyChecking=accept-new -T git@github.com
```

Очікуй повідомлення на кшталт: `Hi USERNAME! You've successfully authenticated...`

### Крок 4 — перевести репозиторій на SSH

У папці проєкту (приклад: `Snl4/moneyflow`):

```bash
cd /var/www/moneyflow
git remote -v
git remote set-url origin git@github.com:Snl4/moneyflow.git
git remote -v
git pull
```

Після `git pull` з’являться оновлення з репо (зокрема `deploy/vps-npm.sh`, якщо їх ще не було після клону).

### Якщо `Permission denied (publickey)`

- Ключ додано не в той акаунт GitHub (репозиторій має бути доступний цьому акаунту).
- Клон був під іншим користувачем — генеруй ключ для **того ж** user, що робить `git pull`.
- Перевір: `ssh -vT git@github.com` (див. який ключ пропонується).

---

## Приватний репозиторій / альтернатива

- **Deploy key** (тільки один репо): Repo → Settings → Deploy keys → додати той самий `*.pub`.
- **HTTPS + PAT:** Personal Access Token замість пароля при `git pull` (Fine-grained або classic `repo`) — менш зручно на сервері, ніж SSH.
