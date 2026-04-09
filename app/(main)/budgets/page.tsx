"use client";

import { useMemo, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import {
  useFinanceStore,
  filterTransactionsByMonth,
} from "@/store/useFinanceStore";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useToastStore } from "@/store/useToastStore";
import type { Budget } from "@/types";

export default function BudgetsPage() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;

  const transactions = useFinanceStore((s) => s.transactions);
  const categories = useFinanceStore((s) => s.categories);
  const budgets = useFinanceStore((s) => s.budgets);
  const upsertBudget = useFinanceStore((s) => s.upsertBudget);
  const currency = useFinanceStore((s) => s.settings.currency);
  const showToast = useToastStore((s) => s.show);

  const expenseCats = useMemo(
    () => categories.filter((c) => c.type === "expense"),
    [categories]
  );

  const monthExpenses = useMemo(
    () =>
      filterTransactionsByMonth(
        transactions.filter((t) => t.type === "expense"),
        y,
        m
      ),
    [transactions, y, m]
  );

  const spentByCategory = useMemo(() => {
    const map = new Map<string | null, number>();
    map.set(null, 0);
    for (const c of expenseCats) map.set(c.id, 0);
    for (const t of monthExpenses) {
      map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
    }
    return map;
  }, [monthExpenses, expenseCats]);

  const overallBudget = budgets.find(
    (b) => b.year === y && b.month === m && b.categoryId === null
  );
  const totalSpent = monthExpenses.reduce((s, t) => s + t.amount, 0);

  const [sheet, setSheet] = useState<null | "overall" | { categoryId: string }>(
    null
  );
  const [amountInput, setAmountInput] = useState("");

  const openEdit = (b: Budget | undefined, categoryId: string | null) => {
    setAmountInput(b ? String(b.amount) : "");
    setSheet(categoryId === null ? "overall" : { categoryId });
  };

  const saveBudget = () => {
    const n = Number(String(amountInput).replace(",", "."));
    if (!Number.isFinite(n) || n <= 0) return;
    if (sheet === "overall") {
      upsertBudget({
        id: overallBudget?.id,
        categoryId: null,
        amount: n,
        year: y,
        month: m,
      });
    } else if (sheet && typeof sheet === "object" && "categoryId" in sheet) {
      const existing = budgets.find(
        (b) =>
          b.year === y &&
          b.month === m &&
          b.categoryId === sheet.categoryId
      );
      upsertBudget({
        id: existing?.id,
        categoryId: sheet.categoryId,
        amount: n,
        year: y,
        month: m,
      });
    }
    setSheet(null);
    showToast("Бюджет збережено", "success");
  };

  const renderBar = (
    label: string,
    budget: number,
    spent: number,
    color?: string,
    icon?: { name: string; hex: string }
  ) => {
    const ratio = budget > 0 ? spent / budget : 0;
    const warn = ratio >= 1;
    const near = ratio >= 0.85 && ratio < 1;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {icon ? (
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${icon.hex}22` }}
              >
                <CategoryIcon
                  name={icon.name}
                  className="h-4 w-4"
                  style={{ color: icon.hex }}
                />
              </span>
            ) : null}
            <span className="truncate font-medium text-tg-text">{label}</span>
          </div>
          <span className="shrink-0 text-xs text-tg-hint tabular-nums">
            {formatMoney(spent, currency)} / {formatMoney(budget, currency)}
          </span>
        </div>
        <ProgressBar
          value={spent}
          max={budget || 1}
          barClassName={cn(
            warn && "from-red-500 to-rose-400",
            near && !warn && "from-amber-500 to-orange-400",
            !near && !warn && color
          )}
        />
        {warn ? (
          <p className="text-xs font-medium text-red-500">
            Бюджет перевищено на {formatMoney(spent - budget, currency)}
          </p>
        ) : near ? (
          <p className="text-xs font-medium text-amber-600">
            Залишилось {formatMoney(budget - spent, currency)}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <AppHeader title="Бюджети" subtitle={`${m}.${y}`} />

      <Card>
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-tg-text">
              Загальний бюджет
            </h2>
            <p className="text-xs text-tg-hint">На всі витрати місяця</p>
          </div>
          <Button
            size="md"
            variant="secondary"
            onClick={() => openEdit(overallBudget, null)}
          >
            {overallBudget ? "Змінити" : "Задати"}
          </Button>
        </div>
        {overallBudget ? (
          renderBar("Усі категорії", overallBudget.amount, totalSpent)
        ) : (
          <p className="text-sm text-tg-hint">
            Додайте загальний ліміт, щоб бачити прогрес по місяцю.
          </p>
        )}
      </Card>

      <div>
        <h2 className="mb-3 text-base font-semibold text-tg-text">
          По категоріях
        </h2>
        <div className="flex flex-col gap-4">
          {expenseCats.map((c) => {
            const b = budgets.find(
              (x) => x.year === y && x.month === m && x.categoryId === c.id
            );
            const spent = spentByCategory.get(c.id) ?? 0;
            if (!b) {
              return (
                <Card key={c.id} className="flex items-center justify-between gap-3 py-4">
                  <div className="flex items-center gap-2">
                    <CategoryIcon
                      name={c.icon}
                      className="h-5 w-5"
                      style={{ color: c.color }}
                    />
                    <span className="font-medium text-tg-text">{c.name}</span>
                  </div>
                  <Button
                    size="md"
                    variant="secondary"
                    onClick={() => openEdit(undefined, c.id)}
                  >
                    Бюджет
                  </Button>
                </Card>
              );
            }
            return (
              <Card key={c.id}>
                {renderBar(c.name, b.amount, spent, undefined, {
                  name: c.icon,
                  hex: c.color,
                })}
                <Button
                  className="mt-3"
                  variant="ghost"
                  size="md"
                  onClick={() => openEdit(b, c.id)}
                >
                  Редагувати ліміт
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      <BottomSheet
        open={sheet !== null}
        onClose={() => setSheet(null)}
        title={
          sheet === "overall"
            ? "Загальний бюджет"
            : sheet && typeof sheet === "object"
              ? "Бюджет категорії"
              : ""
        }
      >
        <div className="flex flex-col gap-4 pb-6">
          <Input
            label="Сума на місяць"
            inputMode="decimal"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
          />
          <Button fullWidth onClick={saveBudget}>
            Зберегти
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
