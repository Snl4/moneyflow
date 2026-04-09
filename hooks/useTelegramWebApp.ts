"use client";

import { useEffect, useMemo, useState } from "react";
import {
  initTelegramWebApp,
  getTelegramUser,
  getThemeParams,
  getColorScheme,
  getWebApp,
} from "@/lib/telegram";
import type { User } from "@/types";
import { useFinanceStore } from "@/store/useFinanceStore";

export function useTelegramWebApp() {
  const [ready, setReady] = useState(false);
  const setUserFromTelegram = useFinanceStore((s) => s.setUserFromTelegram);
  const updateSettings = useFinanceStore((s) => s.updateSettings);
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
    if (themeSetting !== "telegram") return;
    const scheme = getColorScheme();
    document.documentElement.classList.toggle("dark", scheme === "dark");
    const p = getThemeParams();
    const root = document.documentElement;
    const hx = (c?: string) =>
      c ? (c.startsWith("#") ? c : `#${c}`) : undefined;
    if (p.bg_color) root.style.setProperty("--tg-theme-bg-color", hx(p.bg_color)!);
    if (p.text_color) root.style.setProperty("--tg-theme-text-color", hx(p.text_color)!);
    if (p.hint_color) root.style.setProperty("--tg-theme-hint-color", hx(p.hint_color)!);
    if (p.link_color) root.style.setProperty("--tg-theme-link-color", hx(p.link_color)!);
    if (p.button_color) root.style.setProperty("--tg-theme-button-color", hx(p.button_color)!);
    if (p.button_text_color)
      root.style.setProperty("--tg-theme-button-text-color", hx(p.button_text_color)!);
    if (p.secondary_bg_color)
      root.style.setProperty("--tg-theme-secondary-bg-color", hx(p.secondary_bg_color)!);
  }, [themeSetting, ready]);

  useEffect(() => {
    if (themeSetting === "light") {
      document.documentElement.classList.remove("dark");
      return;
    }
    if (themeSetting === "dark") {
      document.documentElement.classList.add("dark");
      return;
    }
    const scheme = getColorScheme();
    document.documentElement.classList.toggle("dark", scheme === "dark");
  }, [themeSetting]);

  useEffect(() => {
    const W = getWebApp();
    if (!W) return;
    const handler = () => {
      if (themeSetting !== "telegram") return;
      const scheme = W.colorScheme;
      document.documentElement.classList.toggle("dark", scheme === "dark");
    };
    try {
      W.onEvent("themeChanged", handler);
      return () => {
        W.offEvent("themeChanged", handler);
      };
    } catch {
      return;
    }
  }, [themeSetting]);

  return { ready, webApp: getWebApp() };
}
