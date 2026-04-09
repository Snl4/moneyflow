#!/usr/bin/env bash
# MoneyFlow — деплой на VPS без Docker (npm + PM2).
# Використання:
#   chmod +x deploy/vps-npm.sh
#   cp .env.example .env && nano .env
#   ./deploy/vps-npm.sh              # перший запуск: ci, build, pm2
#   ./deploy/vps-npm.sh --nginx      # те саме + копіювання nginx (sudo)
#   ./deploy/vps-npm.sh update       # git pull → npm ci → build → pm2 (оновлення з origin)
#   ./deploy/vps-npm.sh update --nginx
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

WITH_NGINX=false
ACTION="install"

for arg in "$@"; do
  case "$arg" in
    --nginx) WITH_NGINX=true ;;
    update) ACTION="update" ;;
  esac
done

require_env() {
  if [ ! -f .env ]; then
    if [ -f .env.example ]; then
      cp .env.example .env
    fi
    echo ""
    echo ">>> Створено .env — обов'язково вкажіть NEXT_PUBLIC_APP_URL (наприклад https://moneyflow.vladdev.pp.ua)"
    echo ">>> Потім знову:  $0"
    echo ""
    exit 1
  fi
}

check_node() {
  command -v node >/dev/null 2>&1 || {
    echo "Потрібен Node.js 20+. Встановіть з https://nodejs.org або через nvm."
    exit 1
  }
  local major
  major="$(node -p "parseInt(process.versions.node.split('.')[0],10)" 2>/dev/null || echo 0)"
  if [ "$major" -lt 20 ]; then
    echo "Потрібен Node.js 20+. Зараз: $(node -v)"
    exit 1
  fi
}

install_nginx() {
  if [ "$WITH_NGINX" != true ]; then
    return 0
  fi
  echo ">>> nginx (потрібен sudo)..."
  sudo cp "$ROOT/deploy/nginx-moneyflow.conf" /etc/nginx/sites-available/moneyflow.vladdev.pp.ua
  sudo ln -sf /etc/nginx/sites-available/moneyflow.vladdev.pp.ua /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo systemctl reload nginx
  echo ">>> Nginx OK. HTTPS: sudo certbot --nginx -d moneyflow.vladdev.pp.ua"
}

do_install() {
  require_env
  check_node

  echo ">>> npm ci"
  npm ci

  echo ">>> npm run build"
  npm run build

  echo ">>> PM2"
  if npx pm2 describe moneyflow >/dev/null 2>&1; then
    npx pm2 delete moneyflow || true
  fi
  npx pm2 start "$ROOT/ecosystem.config.cjs"
  npx pm2 save

  echo ""
  echo ">>> Локальна перевірка (очікуй 200):"
  curl -sS -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:3001/ || true
  echo ""
  echo ">>> Автозапуск PM2 після reboot (один раз на сервері):"
  echo "    npx pm2 startup"
  echo "    (виконай згенеровану sudo-команду, потім npx pm2 save)"

  install_nginx
  echo ""
  echo "Готово."
}

do_update() {
  require_env
  check_node

  if [ -d .git ]; then
    echo ">>> git pull"
    git pull
  fi

  echo ">>> npm ci"
  npm ci

  echo ">>> npm run build"
  npm run build

  echo ">>> PM2 restart"
  if npx pm2 describe moneyflow >/dev/null 2>&1; then
    npx pm2 restart moneyflow
  else
    npx pm2 start "$ROOT/ecosystem.config.cjs"
  fi
  npx pm2 save

  install_nginx
  echo "Оновлення завершено."
}

case "$ACTION" in
  install) do_install ;;
  update) do_update ;;
esac
