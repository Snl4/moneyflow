"use client";

import { useMemo } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/Card";
import {
  IncomeExpenseChart,
  CategoryPie,
  CategoryBarChart,
} from "@/components/charts/AnalyticsCharts";
import { useFinanceStore, selectMonthStats } from "@/store/useFinanceStore";
import { formatMoney } from "@/lib/format";
import {
  dailySeriesInMonth,
  expensesByCategory,
  averageExpensePerDay,
  topExpenseTransactions,
} from "@/lib/analytics";
import { TransactionRow } from "@/components/transaction/TransactionRow";
import { CategoryIcon } from "@/components/icons/CategoryIcon";

export default function AnalyticsPage() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;

  const transactions = useFinanceStore((s) => s.transactions);
  const categories = useFinanceStore((s) => s.categories);
  const currency = useFinanceStore((s) => s.settings.currency);

  const stats = useMemo(
    () => selectMonthStats(transactions, y, m),
    [transactions, y, m]
  );

  const series = useMemo(
    () => dailySeriesInMonth(transactions, y, m),
    [transactions, y, m]
  );

  const pieData = useMemo(
    () => expensesByCategory(transactions, categories, y, m),
    [transactions, categories, y, m]
  );

  const avgDay = useMemo(
    () => averageExpensePerDay(transactions, y, m),
    [transactions, y, m]
  );

  const top = useMemo(
    () => topExpenseTransactions(transactions, y, m, 5),
    [transactions, y, m]
  );

  const catMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const topCat = pieData[0];

  const hasAnyMovement = useMemo(
    () => series.some((d) => d.income > 0 || d.expense > 0),
    [series]
  );

  const hasExpenseBreakdown = pieData.length > 0;

  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-4">
      <AppHeader title="Аналітика" subtitle="За поточний місяць" />

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="text-xs font-medium text-tg-hint">Дохід</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {formatMoney(stats.income, currency)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-tg-hint">Витрати</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-red-500 dark:text-red-400">
            {formatMoney(stats.expense, currency)}
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="mb-1 text-base font-semibold text-tg-text">
          Динаміка доходів і витрат
        </h2>
        <p className="mb-4 text-xs text-tg-hint">По днях у межах місяця</p>
        <IncomeExpenseChart
          data={series}
          currency={currency}
          hasAnyMovement={hasAnyMovement}
        />
      </Card>

      <Card>
        <h2 className="mb-1 text-base font-semibold text-tg-text">
          Витрати за категоріями
        </h2>
        <p className="mb-2 text-xs text-tg-hint">Кругова діаграма</p>
        <CategoryPie
          data={pieData}
          currency={currency}
          hasData={hasExpenseBreakdown}
        />
      </Card>

      <Card>
        <h2 className="mb-1 text-base font-semibold text-tg-text">
          Порівняння категорій
        </h2>
        <p className="mb-2 text-xs text-tg-hint">Горизонтальні стовпчики</p>
        <CategoryBarChart
          data={pieData}
          currency={currency}
          hasData={hasExpenseBreakdown}
        />
      </Card>

      <Card>
        <h2 className="mb-3 text-base font-semibold text-tg-text">
          Куди йде найбільше грошей
        </h2>
        {topCat ? (
          <div className="flex items-center gap-3 rounded-2xl bg-tg-secondary p-4">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${topCat.color}22` }}
            >
              <CategoryIcon
                name={catMap.get(topCat.categoryId)?.icon ?? "Tag"}
                className="h-6 w-6"
                style={{ color: topCat.color }}
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-tg-text">{topCat.name}</p>
              <p className="text-sm text-tg-hint">
                {formatMoney(topCat.value, currency)} ·{" "}
                {stats.expense > 0
                  ? Math.round((topCat.value / stats.expense) * 100)
                  : 0}
                % від витрат
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-tg-hint">Поки немає витрат за місяць</p>
        )}
      </Card>

      <Card>
        <h2 className="mb-3 text-base font-semibold text-tg-text">
          Статистика по категоріях
        </h2>
        <div className="flex flex-col gap-3">
          {pieData.length === 0 ? (
            <p className="text-sm text-tg-hint">Немає витрат для відображення</p>
          ) : (
            pieData.map((row) => (
              <div key={row.categoryId} className="flex items-center gap-3">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: row.color }}
                />
                <span className="flex-1 truncate text-sm text-tg-text">
                  {row.name}
                </span>
                <span className="text-sm font-semibold tabular-nums text-tg-text">
                  {formatMoney(row.value, currency)}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card>
        <p className="text-sm text-tg-hint">Середні витрати за день</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-tg-text">
          {formatMoney(avgDay, currency)}
        </p>
      </Card>

      <Card>
        <h2 className="mb-3 text-base font-semibold text-tg-text">
          Найбільші витрати
        </h2>
        <div className="flex flex-col gap-2">
          {top.length === 0 ? (
            <p className="text-sm text-tg-hint">Поки порожньо</p>
          ) : (
            top.map((t) => (
              <TransactionRow
                key={t.id}
                t={t}
                category={catMap.get(t.categoryId)}
                currency={currency}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
