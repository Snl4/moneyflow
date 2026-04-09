"use client";

import { useTelegramWebApp } from "@/hooks/useTelegramWebApp";
import { useHydration } from "@/hooks/useHydration";
import { ToastHost } from "@/components/ui/ToastHost";

function Splash() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-tg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg" />
        <p className="text-sm text-tg-hint">MoneyFlow</p>
      </div>
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  useTelegramWebApp();
  const hydrated = useHydration();

  if (!hydrated) {
    return (
      <>
        <Splash />
        <ToastHost />
      </>
    );
  }

  return (
    <>
      {children}
      <ToastHost />
    </>
  );
}
