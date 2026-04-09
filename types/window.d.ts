export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: { user?: Record<string, unknown> };
      };
    };
  }
}
