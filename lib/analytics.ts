import { parseISO, eachDayOfInterval, formatISO } from "date-fns";
import type { Transaction, Category } from "@/types";
import { getMonthRange } from "@/store/useFinanceStore";

export function dailySeriesInMonth(
  transactions: Transaction[],
  year: number,
  month: number
): { date: string; income: number; expense: number }[] {
  const { start, end } = getMonthRange(year, month);
  const days = eachDayOfInterval({ start, end });
  const map = new Map<string, { income: number; expense: number }>();
  for (const d of days) {
    map.set(formatISO(d, { representation: "date" }), { income: 0, expense: 0 });
  }
  for (const t of transactions) {
    const d = parseISO(t.date + "T12:00:00");
    if (d < start || d > end) continue;
    const key = t.date;
    const cur = map.get(key) ?? { income: 0, expense: 0 };
    if (t.type === "income") cur.income += t.amount;
    else cur.expense += t.amount;
    map.set(key, cur);
  }
  return Array.from(map.entries()).map(([date, v]) => ({ date, ...v }));
}

export function expensesByCategory(
  transactions: Transaction[],
  categories: Category[],
  year: number,
  month: number
): { name: string; value: number; color: string; categoryId: string }[] {
  const { start, end } = getMonthRange(year, month);
  const catMap = new Map(categories.map((c) => [c.id, c]));
  const sums = new Map<string, number>();

  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const d = parseISO(t.date + "T12:00:00");
    if (d < start || d > end) continue;
    sums.set(t.categoryId, (sums.get(t.categoryId) ?? 0) + t.amount);
  }

  return Array.from(sums.entries())
    .map(([categoryId, value]) => {
      const c = catMap.get(categoryId);
      return {
        categoryId,
        name: c?.name ?? "Інше",
        value,
        color: c?.color ?? "#64748b",
      };
    })
    .filter((x) => x.value > 0)
    .sort((a, b) => b.value - a.value);
}

export function averageExpensePerDay(
  transactions: Transaction[],
  year: number,
  month: number
): number {
  const { start, end } = getMonthRange(year, month);
  const dayCount = eachDayOfInterval({ start, end }).length || 1;
  let total = 0;
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const d = parseISO(t.date + "T12:00:00");
    if (d < start || d > end) continue;
    total += t.amount;
  }
  return total / dayCount;
}

export function topExpenseTransactions(
  transactions: Transaction[],
  year: number,
  month: number,
  limit = 5
): Transaction[] {
  const { start, end } = getMonthRange(year, month);
  return transactions
    .filter((t) => {
      if (t.type !== "expense") return false;
      const d = parseISO(t.date + "T12:00:00");
      return d >= start && d <= end;
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}
