import type { TelegramUserLite } from "@/types";

type WebAppInstance = typeof import("@twa-dev/sdk").default;

let webAppCache: WebAppInstance | null | undefined;

function getWebApp(): WebAppInstance | null {
  if (typeof window === "undefined") return null;
  if (webAppCache !== undefined) return webAppCache;
  try {
    // require замість import — щоб не виконувати SDK під час SSR
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    webAppCache = require("@twa-dev/sdk").default as WebAppInstance;
  } catch {
    webAppCache = null;
  }
  return webAppCache;
}

export function isTelegramMiniApp(): boolean {
  if (typeof window === "undefined") return false;
  const W = getWebApp();
  return Boolean(
    window.Telegram?.WebApp?.initDataUnsafe?.user ?? W?.initDataUnsafe?.user
  );
}

export function getTelegramUser(): TelegramUserLite | null {
  if (typeof window === "undefined") return null;
  const W = getWebApp();
  const u = W?.initDataUnsafe?.user;
  if (!u) return null;
  return {
    id: u.id,
    first_name: u.first_name,
    last_name: u.last_name,
    username: u.username,
    language_code: u.language_code,
    photo_url: u.photo_url,
  };
}

export function initTelegramWebApp(): void {
  const W = getWebApp();
  if (!W) return;
  try {
    W.ready();
    W.expand();
  } catch {
    /* not in Telegram */
  }
}

export function setMainButton(
  text: string,
  onClick: () => void,
  visible: boolean
): () => void {
  const W = getWebApp();
  if (!W) return () => {};
  try {
    W.MainButton.setText(text);
    W.MainButton.onClick(onClick);
    if (visible) W.MainButton.show();
    else W.MainButton.hide();
    return () => {
      try {
        W.MainButton.offClick(onClick);
        W.MainButton.hide();
      } catch {
        /* ignore */
      }
    };
  } catch {
    return () => {};
  }
}

export function hapticLight(): void {
  const W = getWebApp();
  if (!W) return;
  try {
    W.HapticFeedback?.impactOccurred?.("light");
  } catch {
    /* ignore */
  }
}

export function hapticMedium(): void {
  const W = getWebApp();
  if (!W) return;
  try {
    W.HapticFeedback?.impactOccurred?.("medium");
  } catch {
    /* ignore */
  }
}

export function hapticSuccess(): void {
  const W = getWebApp();
  if (!W) return;
  try {
    W.HapticFeedback?.notificationOccurred?.("success");
  } catch {
    /* ignore */
  }
}

export function hapticWarning(): void {
  const W = getWebApp();
  if (!W) return;
  try {
    W.HapticFeedback?.notificationOccurred?.("warning");
  } catch {
    /* ignore */
  }
}

export type ThemeParams = {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  accent_text_color?: string;
};

export function getThemeParams(): ThemeParams {
  const W = getWebApp();
  try {
    return W?.themeParams ?? {};
  } catch {
    return {};
  }
}

export function getColorScheme(): "light" | "dark" {
  const W = getWebApp();
  try {
    return W?.colorScheme === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export { getWebApp };
