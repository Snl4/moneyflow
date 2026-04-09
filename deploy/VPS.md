# Деплой MoneyFlow на VPS (moneyflow.vladdev.pp.ua)

## Швидкий старт (npm, без Docker)

На VPS після `git clone` у `/var/www/moneyflow`:

```bash
cd /var/www/moneyflow
cp .env.example .env
nano .env   # NEXT_PUBLIC_APP_URL=https://moneyflow.vladdev.pp.ua
chmod +x deploy/vps-npm.sh
./deploy/vps-npm.sh           # npm ci, build, PM2 на 127.0.0.1:3010
# опційно одразу nginx (потрібен sudo):
./deploy/vps-npm.sh --nginx
```

### Оновлення з Git (що вже є в скрипті)

Команда **`./deploy/vps-npm.sh update`** (з SSH на VPS) робить по черзі:

1. **`git pull`** — підтягує останній код з `origin` (якщо є папка `.git`);
2. **`npm ci`** → **`npm run build`**;
3. перезапуск **PM2** (`moneyflow`).

Тобто після **`git push`** з ПК на сервері достатньо один раз виконати **`./deploy/vps-npm.sh update`**. Це **не** «само по собі» у фоні — потрібен ручний запуск або cron (нижче).

### Опційно: автоматично по розкладу (cron)

Якщо хочеш, щоб сервер сам підтягував з Git (наприклад, раз на добу):

```bash
crontab -e
```

Додай рядок (підстав свій шлях; для Node з **nvm** краще обгортка з `bash -l -c`):

```cron
15 4 * * * cd /var/www/moneyflow && ./deploy/vps-npm.sh update >> /var/log/moneyflow-deploy.log 2>&1
```

Переконайся, що в cron є **`git`** і **`node`/`npm`** у `PATH` (у системному cron інколи потрібно вказати повний шлях до `node` або додати `PATH=...` у початок crontab).

### PM2: «In-memory PM2 is out-of-date» / різні версії

Глобальний демон (`sudo npm i -g pm2`) і **`npx pm2`** з проєкту мали різні версії (5.x vs 6.x). Скрипт **`deploy/vps-npm.sh`** тепер викликає **`pm2` з PATH**, якщо він є (зазвичай глобальний 6.x), інакше — `npx pm2`. Рекомендація на VPS: `sudo npm i -g pm2@latest`, потім **`pm2 save`**. Команди деплою — **`pm2`**, не `npx pm2 save` окремо, якщо вже стоїть глобальний.

### Nginx: `conflicting server name "moneyflow..."` / на піддомені **не MoneyFlow**

Якщо certbot прив’язав сертифікат до **`portfolioweb`**, а ти ще додав окремий файл **`moneyflow.vladdev.pp.ua`** — буде **два** `server_name`; nginx лишає **перший** блок — часто там **`proxy_pass` на портфоліо (3000)**, а не на MoneyFlow (**3010**). Детально: [NGINX-SUBDOMAIN-FIX.md](NGINX-SUBDOMAIN-FIX.md). Швидка перевірка: `sudo grep -rn moneyflow /etc/nginx/` і переконайся, що для moneyflow скрізь **`proxy_pass http://127.0.0.1:3010`**.

---

**Важливо:** на сервері **не** використовуйте `npm run dev` — це режим розробки (HMR, без продакшен-оптимізацій). Для VPS потрібен **production-збірка**: або **Docker**, або **`npm run build` + `npm run start`** / скрипт вище.

Передумови: Ubuntu/Debian, nginx. DNS **A**/**AAAA** на IP VPS. Порти **80/443** для certbot: `sudo ufw allow 80,443/tcp` (якщо ufw увімкнено).

**Порт 3000 зайнятий** (наприклад головний сайт **vladdev.pp.ua**): MoneyFlow за замовчуванням піднімаємо на **127.0.0.1:3010** (окремо від **3000** і **3001**, якщо там уже інші Node) — nginx для піддомену `moneyflow.vladdev.pp.ua` проксує саме туди (див. `deploy/nginx-moneyflow.conf`). Один порт = один процес; зовні все одно **тільки 80/443** через nginx.

## 1. Папка на сервері

```bash
ssh user@YOUR_VPS_IP
sudo mkdir -p /var/www/moneyflow
sudo chown $USER:$USER /var/www/moneyflow
```

## 2. Завантажити код

**Рекомендовано:** Git — [GIT.md](GIT.md).

```bash
cd /var/www/moneyflow
git clone https://github.com/YOUR_USER/moneyflow.git .
```

Альтернатива — `rsync` з ПК (без `.git`, `node_modules`, `.next`).

## 3. Запуск застосунку (оберіть один варіант)

Спочатку `.env` (один раз):

```bash
cd /var/www/moneyflow
cp .env.example .env
nano .env   # NEXT_PUBLIC_APP_URL=https://moneyflow.vladdev.pp.ua
```

`NEXT_PUBLIC_*` потрапляють у клієнтський білд — після зміни URL **перезберіть** проєкт.

### Варіант A: Docker (зручно для ізоляції та однакового середовища)

Потрібні Docker + Docker Compose.

```bash
docker compose build
docker compose up -d
```

Додаток ззовні контейнера доступний на **`127.0.0.1:3010`** (у контейнері лишається 3000; див. `docker-compose.yml`).

### Варіант B: Node.js без Docker

Потрібен **Node.js 20+** (LTS).

```bash
cd /var/www/moneyflow
npm ci
npm run build
```

Запуск у продакшені (лише **localhost**, зовні — nginx). Порт **3010**, щоб не чіпати **3000** / **3001**:

```bash
HOSTNAME=127.0.0.1 npm run start:vps
```

Або еквівалент: `HOSTNAME=127.0.0.1 PORT=3010 npm run start` (у `package.json` скрипт `start` без жорсткого `-p`).

Краще **PM2** або **systemd**:

```bash
sudo npm i -g pm2
cd /var/www/moneyflow
HOSTNAME=127.0.0.1 pm2 start npm --name moneyflow -- run start:vps
pm2 save && sudo pm2 startup
```

Переконайтеся, що nginx для MoneyFlow вказує на **3010** (`proxy_pass` у `deploy/nginx-moneyflow.conf`).

## 4. Nginx + HTTPS

```bash
sudo cp deploy/nginx-moneyflow.conf /etc/nginx/sites-available/moneyflow.vladdev.pp.ua
sudo ln -sf /etc/nginx/sites-available/moneyflow.vladdev.pp.ua /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Сертифікат:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d moneyflow.vladdev.pp.ua
```

У Cloudflare: **SSL/TLS → Full (strict)** після certbot.

### Cloudflare **526** — «Invalid SSL certificate»

З’являється в режимі **Full (strict)**, якщо на VPS **немає валідного** сертифіката для `moneyflow.vladdev.pp.ua` (не встановлено certbot, прострочено, не той домен). **Виправлення:** випустити Let's Encrypt на сервері (`certbot --nginx -d moneyflow.vladdev.pp.ua`) і перезавантажити nginx. Тимчасово для діагностики можна поставити **SSL/TLS → Full** (без strict), але для продакшену залишай **Full (strict)** після валідного сертифіката на origin.

## 5. Telegram Bot

1. [@BotFather](https://t.me/BotFather) → **Menu Button** / **Mini App**.
2. URL: `https://moneyflow.vladdev.pp.ua`

## Оновлення після змін у коді

```bash
cd /var/www/moneyflow
git pull
```

**Docker:**

```bash
docker compose build
docker compose up -d
```

**Без Docker:**

```bash
./deploy/vps-npm.sh update
```

або вручну: `npm ci`, `npm run build`, `npx pm2 restart moneyflow`.

Див. [GIT.md](GIT.md).
