# Піддомен показує не MoneyFlow (наприклад портфоліо)

## Причина

У nginx **два** блоки `server` з однаковим `server_name moneyflow.vladdev.pp.ua`. Працює **перший** завантажений; другий **ігнорується** (`conflicting server name … ignored`). Certbot часто дописує SSL у файл **`portfolioweb`**, де для moneyflow може стояти **`proxy_pass` на порт портфоліо** (наприклад 3000), а не **3010**.

MoneyFlow у PM2 має бути на **`127.0.0.1:3010`**.

## Перевірка з VPS

```bash
curl -sS http://127.0.0.1:3010/ | head -5
```

Має бути HTML від Next (MoneyFlow). Якщо так — бекенд ок, ламає **nginx**.

```bash
sudo grep -rn "moneyflow" /etc/nginx/
```

Подивись усі `server_name` і всі `proxy_pass` для цього домену.

## Виправлення (обери один підхід)

### Варіант A — виправити в `portfolioweb` (швидко)

Відкрий файл, куди вказує certbot (часто `/etc/nginx/sites-enabled/portfolioweb`):

```bash
sudo nano /etc/nginx/sites-enabled/portfolioweb
```

Знайди блок `server { ... server_name moneyflow.vladdev.pp.ua ...` (і для `:80`, і для `:443`).

У **`location /`** має бути:

```nginx
proxy_pass http://127.0.0.1:3010;
```

(не порт портфоліо / головного сайту).

Збережи:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### Варіант B — один конфіг тільки для MoneyFlow

1. Прибери з `portfolioweb` **усі** блоки `server { ... }`, де є `server_name moneyflow.vladdev.pp.ua` (і 80, і 443).
2. Залиш окремий файл з репозиторію і SSL:

```bash
sudo cp /var/www/moneyflow/deploy/nginx-moneyflow.conf /etc/nginx/sites-available/moneyflow.vladdev.pp.ua
sudo ln -sf /etc/nginx/sites-available/moneyflow.vladdev.pp.ua /etc/nginx/sites-enabled/
sudo certbot --nginx -d moneyflow.vladdev.pp.ua
```

3. `sudo nginx -t && sudo systemctl reload nginx`

## Перевірка після правок

```bash
curl -sS -H "Host: moneyflow.vladdev.pp.ua" http://127.0.0.1/ | head -c 200
```

У відповіді не має бути тексту портфоліо; для MoneyFlow зазвичай видно `Next.js` / структуру твого застосунку.

У браузері: примусове оновлення **Ctrl+F5** або очистити кеш Cloudflare (Caching → Purge) якщо довго показує стару сторінку.
