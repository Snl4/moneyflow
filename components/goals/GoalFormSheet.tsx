"use client";

import { useCallback, useEffect, useState } from "react";
import { getWebApp } from "@/lib/telegram";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useFinanceStore } from "@/store/useFinanceStore";
import { setMainButton, hapticSuccess } from "@/lib/telegram";

export function GoalFormSheet({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const addGoal = useFinanceStore((s) => s.addGoal);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setTarget("");
      setCurrent("");
      setDeadline("");
    }
  }, [open]);

  const valid =
    name.trim().length > 0 &&
    Number.isFinite(Number(String(target).replace(",", "."))) &&
    Number(String(target).replace(",", ".")) > 0;

  const submit = useCallback(() => {
    const t = Number(String(target).replace(",", "."));
    const c = Number(String(current).replace(",", ".")) || 0;
    if (!name.trim() || !Number.isFinite(t) || t <= 0) return;
    addGoal({
      name: name.trim(),
      targetAmount: t,
      currentAmount: Math.min(c, t),
      deadline: deadline || null,
    });
    hapticSuccess();
    onSaved();
  }, [addGoal, current, deadline, name, onSaved, target]);

  useEffect(() => {
    const W = getWebApp();
    if (!open) {
      try {
        W?.MainButton.hide();
      } catch {
        /* */
      }
      return;
    }
    try {
      if (valid) W?.MainButton.enable();
      else W?.MainButton.disable();
    } catch {
      /* */
    }
    return setMainButton("Створити ціль", submit, true);
  }, [open, valid, submit]);

  return (
    <BottomSheet open={open} onClose={onClose} title="Нова фінансова ціль">
      <div className="flex flex-col gap-4 pb-6">
        <Input
          label="Назва цілі"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Наприклад, Ноутбук"
        />
        <Input
          label="Потрібна сума"
          inputMode="decimal"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
        <Input
          label="Вже зібрано"
          inputMode="decimal"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder="0"
        />
        <Input
          label="Дедлайн"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <Button fullWidth disabled={!valid} onClick={submit}>
          Створити ціль
        </Button>
      </div>
    </BottomSheet>
  );
}
