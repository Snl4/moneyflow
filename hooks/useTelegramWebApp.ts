"use client";

import { useEffect, useMemo, useState } from "react";
import {
  initTelegramWebApp,
  getTelegramUser,
  getThemeParams,
  getWebApp,
  isTelegramMiniApp,
} from "@/lib/telegram";
import type { User } from "@/types";
import { useFinanceStore } from "@/store/useFinanceStore";

const TG_VARS = [
  "--tg-theme-button-color",
  "--tg-theme-button-text-color",
  "--tg-theme-link-color",
  "--tg-theme-accent-text-color",
] as const;

function applyTelegramAccentColors(): void {
  if (!isTelegramMiniApp()) return;
  const p = getThemeParams();
  const root = document.documentElement;
  const hx = (c?: string) =>
    c ? (c.startsWith("#") ? c : `#${c}`) : undefined;
  if (p.button_color)
    root.style.setProperty("--tg-theme-button-color", hx(p.button_color)!);
  if (p.button_text_color)
    root.style.setProperty(
      "--tg-theme-button-text-color",
      hx(p.button_text_color)!
    );
  if (p.link_color)
    root.style.setProperty("--tg-theme-link-color", hx(p.link_color)!);
  if (p.accent_text_color)
    root.style.setProperty(
      "--tg-theme-accent-text-color",
      hx(p.accent_text_color)!
    );
}

function clearTelegramAccentOverrides(): void {
  const root = document.documentElement;
  for (const k of TG_VARS) {
    root.style.removeProperty(k);
  }
}

export function useTelegramWebApp() {
  const [ready, setReady] = useState(false);
  const setUserFromTelegram = useFinanceStore((s) => s.setUserFromTelegram);
  const themeSetting = useFinanceStore((s) => s.settings.theme);

  const tgUser = useMemo(() => getTelegramUser(), []);

  useEffect(() => {
    initTelegramWebApp();
    setReady(true);
  }, []);

  useEffect(() => {
    if (!tgUser) return;
    const u: User = {
      telegramId: tgUser.id,
      firstName: tgUser.first_name,
      lastName: tgUser.last_name,
      username: tgUser.username,
      photoUrl: tgUser.photo_url,
    };
    setUserFromTelegram(u);
  }, [tgUser, setUserFromTelegram]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeSetting === "dark");
  }, [themeSetting]);

  useEffect(() => {
    if (!ready) return;
    if (isTelegramMiniApp()) {
      applyTelegramAccentColors();
      return () => {
        clearTelegramAccentOverrides();
      };
    }
    clearTelegramAccentOverrides();
    return;
  }, [themeSetting, ready]);

  useEffect(() => {
    const W = getWebApp();
    if (!W || !isTelegramMiniApp()) return;
    const handler = () => {
      applyTelegramAccentColors();
    };
    try {
      W.onEvent("themeChanged", handler);
      return () => {
        W.offEvent("themeChanged", handler);
      };
    } catch {
      return;
    }
  }, [ready]);

  return { ready, webApp: getWebApp() };
}
