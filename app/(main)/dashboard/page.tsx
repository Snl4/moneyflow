"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  PieChart,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { TransactionForm } from "@/components/transaction/TransactionForm";
import { TransactionRow } from "@/components/transaction/TransactionRow";
import { useFinanceStore, selectMonthStats, filterTransactionsByMonth } from "@/store/useFinanceStore";
import { formatMoney } from "@/lib/format";
import { hapticLight } from "@/lib/telegram";
import { useToastStore } from "@/store/useToastStore";
import { GoalFormSheet } from "@/components/goals/GoalFormSheet";
import type { TransactionType } from "@/types";

export default function DashboardPage() {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const greeting =
    d.getHours() < 12
      ? "Доброго ранку"
      : d.getHours() < 18
        ? "Доброго дня"
        : "Доброго вечора";

  const transactions = useFinanceStore((s) => s.transactions);
  const categories = useFinanceStore((s) => s.categories);
  const currency = useFinanceStore((s) => s.settings.currency);
  const user = useFinanceStore((s) => s.user);
  const showToast = useToastStore((s) => s.show);

  const stats = useMemo(
    () => selectMonthStats(transactions, y, m),
    [transactions, y, m]
  );

  const recent = useMemo(() => {
    const inMonth = filterTransactionsByMonth(transactions, y, m);
    return [...inMonth].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  }, [transactions, y, m]);

  const catMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const [sheet, setSheet] = useState<
    null | "income" | "expense" | "goal"
  >(null);

  const openTx = (type: TransactionType) => {
    hapticLight();
    setSheet(type);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <AppHeader
        title={greeting}
        subtitle={
          user?.firstName
            ? `${user.firstName}, ваш баланс під контролем`
            : "Ваш баланс під контролем"
        }
      />

      <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-cyan-500/10">
        <p className="text-sm font-medium text-tg-hint">Поточний баланс (місяць)</p>
        <p className="mt-2 text-4xl font-bold tracking-tight text-tg-text tabular-nums">
          {formatMoney(stats.balance, currency)}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-tg-bg/60 px-3 py-3 dark:bg-black/20">
            <p className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" />
              Дохід
            </p>
            <p className="mt-1 text-lg font-bold tabular-nums text-tg-text">
              {formatMoney(stats.income, currency)}
            </p>
          </div>
          <div className="rounded-2xl bg-tg-bg/60 px-3 py-3 dark:bg-black/20">
            <p className="flex items-center gap-1 text-xs font-medium text-red-500">
              <ArrowDownRight className="h-3.5 w-3.5" />
              Витрати
            </p>
            <p className="mt-1 text-lg font-bold tabular-nums text-tg-text">
              {formatMoney(stats.expense, currency)}
            </p>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl" />
      </Card>

      <div>
        <p className="mb-3 text-sm font-semibold text-tg-hint">Швидкі дії</p>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            className="min-h-[56px] flex-col gap-1 py-3"
            onClick={() => openTx("income")}
          >
            <Plus className="h-5 w-5 text-emerald-600" />
            Додати дохід
          </Button>
          <Button
            variant="secondary"
            className="min-h-[56px] flex-col gap-1 py-3"
            onClick={() => openTx("expense")}
          >
            <Plus className="h-5 w-5 text-red-500" />
            Додати витрату
          </Button>
          <Button
            variant="secondary"
            className="min-h-[56px] flex-col gap-1 py-3"
            onClick={() => {
              hapticLight();
              setSheet("goal");
            }}
          >
            <Target className="h-5 w-5 text-tg-button" />
            Нова ціль
          </Button>
          <Link href="/analytics" className="block" onClick={() => hapticLight()}>
            <Button
              variant="secondary"
              fullWidth
              className="min-h-[56px] flex-col gap-1 py-3"
            >
              <PieChart className="h-5 w-5 text-tg-button" />
              Аналітика
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-tg-button" />
            <h2 className="text-base font-semibold text-tg-text">Коротко</h2>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-tg-hint">Залишок після витрат</span>
            <span className="font-semibold tabular-nums text-tg-text">
              {formatMoney(stats.income - stats.expense, currency)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-tg-hint">Операцій у місяці</span>
            <span className="font-semibold text-tg-text">{stats.count}</span>
          </div>
        </div>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-tg-text">
            Останні операції
          </h2>
          <Link
            href="/transactions"
            className="text-sm font-semibold text-tg-link"
            onClick={() => hapticLight()}
          >
            Усі
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {recent.length === 0 ? (
            <p className="rounded-2xl bg-tg-secondary px-4 py-8 text-center text-sm text-tg-hint">
              Ще немає операцій за цей місяць
            </p>
          ) : (
            recent.map((t) => (
              <TransactionRow
                key={t.id}
                t={t}
                category={catMap.get(t.categoryId)}
                currency={currency}
              />
            ))
          )}
        </div>
      </div>

      <BottomSheet
        open={sheet === "income" || sheet === "expense"}
        onClose={() => setSheet(null)}
        title={sheet === "income" ? "Новий дохід" : "Нова витрата"}
      >
        {sheet === "income" || sheet === "expense" ? (
          <TransactionForm
            key={sheet}
            initial={null}
            defaultType={sheet}
            useTelegramMainButton
            onSaved={() => {
              setSheet(null);
              showToast("Збережено", "success");
            }}
            onCancel={() => setSheet(null)}
          />
        ) : null}
      </BottomSheet>

      <GoalFormSheet
        open={sheet === "goal"}
        onClose={() => setSheet(null)}
        onSaved={() => {
          setSheet(null);
          showToast("Ціль додано", "success");
        }}
      />
    </div>
  );
}
