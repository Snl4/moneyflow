/**
 * PM2: продакшен Next.js на 127.0.0.1:3001 (не конфліктує з іншим сервісом на :3000).
 * Запуск: npx pm2 start ecosystem.config.cjs
 */
const path = require("path");

const root = __dirname;

module.exports = {
  apps: [
    {
      name: "moneyflow",
      cwd: root,
      script: path.join(root, "node_modules", "next", "dist", "bin", "next"),
      args: "start -p 3001 -H 127.0.0.1",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "450M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
