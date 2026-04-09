"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import { cn } from "@/lib/cn";

export function AppHeader({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  const user = useFinanceStore((s) => s.user);

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ")
    : "Гість";
  const avatar = user?.photoUrl;

  return (
    <header
      className={cn(
        "flex items-start justify-between gap-4 px-1 pt-1",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-tg-hint">{title}</p>
        {subtitle ? (
          <h1 className="mt-0.5 truncate text-2xl font-bold tracking-tight text-tg-text">
            {subtitle}
          </h1>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-surface-elevated px-3 py-2 shadow-card border border-black/[0.04] dark:border-white/[0.06]">
        <div className="text-right">
          <p className="max-w-[140px] truncate text-sm font-semibold text-tg-text">
            {displayName}
          </p>
          {user?.username ? (
            <p className="text-xs text-tg-hint">@{user.username}</p>
          ) : (
            <p className="text-xs text-tg-hint">Telegram</p>
          )}
        </div>
        <div className="relative h-11 w-11 overflow-hidden rounded-full bg-tg-secondary ring-2 ring-white/40 dark:ring-white/10">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-600 text-lg font-bold text-white">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
