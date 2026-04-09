"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/Input";
import { GoalFormSheet } from "@/components/goals/GoalFormSheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { Target } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { formatMoney, formatDateDisplay } from "@/lib/format";
import { useToastStore } from "@/store/useToastStore";
import type { Goal } from "@/types";

export default function GoalsPage() {
  const goals = useFinanceStore((s) => s.goals);
  const currency = useFinanceStore((s) => s.settings.currency);
  const updateGoal = useFinanceStore((s) => s.updateGoal);
  const removeGoal = useFinanceStore((s) => s.removeGoal);
  const showToast = useToastStore((s) => s.show);

  const [createOpen, setCreateOpen] = useState(false);
  const [edit, setEdit] = useState<Goal | null>(null);
  const [addAmount, setAddAmount] = useState("");

  const pct = (g: Goal) =>
    g.targetAmount > 0
      ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100))
      : 0;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <AppHeader title="Цілі" subtitle="Назбирайте на мрії" />

      <Button fullWidth onClick={() => setCreateOpen(true)}>
        + Нова ціль
      </Button>

      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Ще немає цілей"
          description="Створіть ціль і відстежуйте прогрес"
          actionLabel="Додати ціль"
          onAction={() => setCreateOpen(true)}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {goals.map((g) => (
            <Card
              key={g.id}
              className="cursor-pointer active:scale-[0.99] transition-transform"
              onClick={() => setEdit(g)}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-tg-text">{g.name}</h3>
                  {g.deadline ? (
                    <p className="text-xs text-tg-hint">
                      До {formatDateDisplay(g.deadline)}
                    </p>
                  ) : (
                    <p className="text-xs text-tg-hint">Без дедлайну</p>
                  )}
                </div>
                <span className="text-sm font-bold text-tg-button tabular-nums">
                  {pct(g)}%
                </span>
              </div>
              <ProgressBar value={g.currentAmount} max={g.targetAmount} />
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-tg-hint">Зібрано</span>
                <span className="font-semibold tabular-nums text-tg-text">
                  {formatMoney(g.currentAmount, currency)} /{" "}
                  {formatMoney(g.targetAmount, currency)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <GoalFormSheet
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={() => {
          setCreateOpen(false);
          showToast("Ціль створено", "success");
        }}
      />

      <BottomSheet open={!!edit} onClose={() => setEdit(null)} title="Ціль">
        {edit ? (
          <div className="flex flex-col gap-4 pb-6">
            <Input
              label="Додати до зібраного"
              inputMode="decimal"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              placeholder="0"
            />
            <Button
              onClick={() => {
                const n = Number(String(addAmount).replace(",", "."));
                if (!Number.isFinite(n) || n <= 0) return;
                const next = Math.min(
                  edit.targetAmount,
                  edit.currentAmount + n
                );
                updateGoal(edit.id, { currentAmount: next });
                setAddAmount("");
                showToast("Оновлено", "success");
              }}
            >
              Зарахувати внесок
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                updateGoal(edit.id, {
                  currentAmount: edit.targetAmount,
                });
                showToast("Ціль досягнуто!", "success");
              }}
            >
              Позначити як виконану
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                removeGoal(edit.id);
                setEdit(null);
                showToast("Видалено", "default");
              }}
            >
              Видалити ціль
            </Button>
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}
