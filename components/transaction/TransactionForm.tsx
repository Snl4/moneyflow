"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getWebApp } from "@/lib/telegram";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { useFinanceStore } from "@/store/useFinanceStore";
import type { Transaction, TransactionType } from "@/types";
import { cn } from "@/lib/cn";
import { setMainButton, hapticSuccess } from "@/lib/telegram";

export function TransactionForm({
  initial,
  defaultType,
  onSaved,
  onCancel,
  useTelegramMainButton,
}: {
  initial?: Transaction | null;
  defaultType?: TransactionType;
  onSaved: () => void;
  onCancel?: () => void;
  useTelegramMainButton?: boolean;
}) {
  const categories = useFinanceStore((s) => s.categories);
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const updateTransaction = useFinanceStore((s) => s.updateTransaction);

  const [type, setType] = useState<TransactionType>(
    initial?.type ?? defaultType ?? "expense"
  );
  const [title, setTitle] = useState(initial?.title ?? "");
  const [amount, setAmount] = useState(
    initial ? String(initial.amount) : ""
  );
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? ""
  );
  const [note, setNote] = useState(initial?.note ?? "");

  const filteredCats = useMemo(
    () => categories.filter((c) => c.type === type),
    [categories, type]
  );

  useEffect(() => {
    if (!categoryId || !filteredCats.some((c) => c.id === categoryId)) {
      setCategoryId(filteredCats[0]?.id ?? "");
    }
  }, [type, filteredCats, categoryId]);

  const submit = useCallback(() => {
    const n = Number(String(amount).replace(",", "."));
    if (!title.trim() || !Number.isFinite(n) || n <= 0 || !categoryId) return;
    if (initial) {
      updateTransaction(initial.id, {
        title: title.trim(),
        amount: n,
        date,
        categoryId,
        note: note.trim(),
        type,
      });
    } else {
      addTransaction({
        title: title.trim(),
        amount: n,
        date,
        categoryId,
        note: note.trim(),
        type,
      });
    }
    hapticSuccess();
    onSaved();
  }, [
    addTransaction,
    amount,
    categoryId,
    date,
    initial,
    note,
    onSaved,
    title,
    type,
    updateTransaction,
  ]);

  const valid =
    title.trim().length > 0 &&
    Number.isFinite(Number(String(amount).replace(",", "."))) &&
    Number(String(amount).replace(",", ".")) > 0 &&
    !!categoryId;

  useEffect(() => {
    if (!useTelegramMainButton) return;
    const W = getWebApp();
    try {
      if (valid) W?.MainButton.enable();
      else W?.MainButton.disable();
    } catch {
      /* not in Telegram */
    }
    return setMainButton(
      initial ? "Зберегти" : "Додати",
      () => {
        submit();
      },
      true
    );
  }, [useTelegramMainButton, initial, valid, submit]);

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex gap-2 rounded-2xl bg-tg-secondary p-1">
        {(
          [
            ["expense", "Витрата"],
            ["income", "Дохід"],
          ] as const
        ).map(([v, label]) => (
          <button
            key={v}
            type="button"
            onClick={() => setType(v)}
            className={cn(
              "flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all",
              type === v
                ? "bg-tg-bg text-tg-text shadow-sm"
                : "text-tg-hint"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <Input
        label="Назва"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Наприклад, Продукти"
      />
      <Input
        label="Сума"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0"
      />
      <Input
        label="Дата"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <div>
        <p className="mb-2 text-sm font-medium text-tg-hint">Категорія</p>
        <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto">
          {filteredCats.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryId(c.id)}
              className={cn(
                "flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-left text-sm font-medium transition-all",
                categoryId === c.id
                  ? "border-tg-button bg-tg-button/10"
                  : "border-black/8 bg-tg-secondary dark:border-white/10"
              )}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${c.color}22` }}
              >
                <CategoryIcon name={c.icon} className="h-4 w-4" style={{ color: c.color }} />
              </span>
              <span className="truncate text-tg-text">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <Textarea
        label="Коментар"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Необов’язково"
      />

      {!useTelegramMainButton ? (
        <div className="flex gap-2 pt-2">
          {onCancel ? (
            <Button variant="secondary" className="flex-1" onClick={onCancel}>
              Скасувати
            </Button>
          ) : null}
          <Button
            className="flex-1"
            disabled={!valid}
            onClick={submit}
          >
            {initial ? "Зберегти" : "Додати"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
