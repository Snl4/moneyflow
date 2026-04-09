# Деплой MoneyFlow на VPS (moneyflow.vladdev.pp.ua)

Передумови: Ubuntu/Debian, Docker + Docker Compose, nginx. DNS **A** (або **AAAA**) запис `moneyflow` → IP VPS. У Cloudflare для certbot відкрийте порти на сервері: `sudo ufw allow 80,443/tcp` (якщо ufw увімкнено).

## 1. Папка на сервері

```bash
ssh user@YOUR_VPS_IP
sudo mkdir -p /var/www/moneyflow
sudo chown $USER:$USER /var/www/moneyflow
```

## 2. Завантажити код

**Рекомендовано:** репозиторій на GitHub/GitLab, на VPS — `git clone` (детально в [GIT.md](GIT.md)).

```bash
cd /var/www/moneyflow
git clone https://github.com/YOUR_USER/moneyflow.git .
```

Альтернатива без Git — `rsync` з ПК:

```bash
rsync -avz --exclude node_modules --exclude .git --exclude .next ./ user@YOUR_VPS_IP:/var/www/moneyflow/
```

## 3. Docker (рекомендовано)

На VPS:

```bash
cd /var/www/moneyflow
cp .env.example .env
# Відредагуйте .env — головне NEXT_PUBLIC_APP_URL
echo 'NEXT_PUBLIC_APP_URL=https://moneyflow.vladdev.pp.ua' >> .env

docker compose build
docker compose up -d
```

Контейнер слухає лише `127.0.0.1:3000` (див. `docker-compose.yml`).

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

У Cloudflare для origin: **SSL/TLS → Full (strict)** (після успішного certbot).

Якщо тимчасово без HTTPS: у BotFather можна вказати `http://...` лише для тесту; для Mini App краще **HTTPS**.

## 5. Telegram Bot

1. Відкрийте [@BotFather](https://t.me/BotFather) → ваш бот → **Bot Settings** → **Menu Button** / **Configure Mini App**.
2. URL: `https://moneyflow.vladdev.pp.ua`
3. Або кнопка з `web_app`: `{ "url": "https://moneyflow.vladdev.pp.ua" }`

## Оновлення після змін у коді

Після `git push` на VPS:

```bash
cd /var/www/moneyflow
git pull
docker compose build
docker compose up -d
```

Див. також [GIT.md](GIT.md).
