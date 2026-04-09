import type { StateStorage } from "zustand/middleware";

/**
 * localStorage для Zustand persist: одна база «на пристрій» (браузер / WebView Telegram).
 * Без бекенду дані не синхронізуються між телефоном і ПК.
 */
export function createLocalPersistStorage(): StateStorage {
  return {
    getItem: (name) => {
      if (typeof window === "undefined") return null;
      try {
        return localStorage.getItem(name);
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem(name, value);
      } catch {
        /* приватний режим / переповнення — тихо ігноруємо */
      }
    },
    removeItem: (name) => {
      if (typeof window === "undefined") return;
      try {
        localStorage.removeItem(name);
      } catch {
        /* ignore */
      }
    },
  };
}
