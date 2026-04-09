"use client";

import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { formatMoney, formatDateDisplay } from "@/lib/format";
import type { Transaction, Category, CurrencyCode } from "@/types";
import { cn } from "@/lib/cn";

export function TransactionRow({
  t,
  category,
  currency,
  onClick,
}: {
  t: Transaction;
  category?: Category;
  currency: CurrencyCode;
  onClick?: () => void;
}) {
  const isInc = t.type === "income";
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl bg-surface-elevated px-4 py-3 text-left shadow-card border border-black/[0.04] dark:border-white/[0.06] active:scale-[0.99] transition-transform"
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: category ? `${category.color}22` : "rgb(0 0 0 / 0.06)",
        }}
      >
        {category ? (
          <CategoryIcon
            name={category.icon}
            className="h-5 w-5"
            style={{ color: category.color }}
          />
        ) : null}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-tg-text">{t.title}</p>
        <p className="truncate text-xs text-tg-hint">
          {category?.name ?? "—"} · {formatDateDisplay(t.date)}
        </p>
      </div>
      <p
        className={cn(
          "shrink-0 text-base font-bold tabular-nums",
          isInc ? "text-emerald-600 dark:text-emerald-400" : "text-tg-text"
        )}
      >
        {isInc ? "+" : "−"}
        {formatMoney(t.amount, currency)}
      </p>
    </button>
  );
}
