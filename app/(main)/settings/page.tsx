"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { useFinanceStore } from "@/store/useFinanceStore";
import type { CurrencyCode, ThemeMode, TransactionType } from "@/types";
import { useToastStore } from "@/store/useToastStore";
import { isTelegramMiniApp } from "@/lib/telegram";
import { Trash2 } from "lucide-react";

const currencies: CurrencyCode[] = ["UAH", "USD", "EUR"];

export default function SettingsPage() {
  const settings = useFinanceStore((s) => s.settings);
  const updateSettings = useFinanceStore((s) => s.updateSettings);
  const user = useFinanceStore((s) => s.user);
  const categories = useFinanceStore((s) => s.categories);
  const addCategory = useFinanceStore((s) => s.addCategory);
  const removeCategory = useFinanceStore((s) => s.removeCategory);
  const exportData = useFinanceStore((s) => s.exportData);
  const clearAllData = useFinanceStore((s) => s.clearAllData);
  const loadDemoData = useFinanceStore((s) => s.loadDemoData);
  const showToast = useToastStore((s) => s.show);

  const [catOpen, setCatOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [catType, setCatType] = useState<TransactionType>("expense");
  const [catColor, setCatColor] = useState("#0d9488");

  const themeOptions: { id: ThemeMode; label: string }[] = [
    { id: "telegram", label: "Як у Telegram" },
    { id: "light", label: "Світла" },
    { id: "dark", label: "Темна" },
  ];

  const exportJson = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `moneyflow-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Експорт готовий", "success");
  };

  const saveCustomCategory = () => {
    if (!catName.trim()) return;
    addCategory({
      name: catName.trim(),
      type: catType,
      icon: "Tag",
      color: catColor,
      isBuiltIn: false,
    });
    setCatName("");
    setCatOpen(false);
    showToast("Категорію додано", "success");
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-8">
      <AppHeader title="Налаштування" subtitle="Профіль і дані" />

      <Card>
        <h2 className="mb-3 text-base font-semibold text-tg-text">
          Telegram
        </h2>
        <p className="text-sm text-tg-hint">
          {isTelegramMiniApp()
            ? "Міні-застосунок відкрито в Telegram. Дані користувача підтягуються з WebApp."
            : "Локальний перегляд: відкрийте через бота, щоб отримати аватар та ім’я."}
        </p>
        {user?.telegramId ? (
          <p className="mt-2 text-xs text-tg-hint">ID: {user.telegramId}</p>
        ) : null}
      </Card>

      <Card>
        <h2 className="mb-4 text-base font-semibold text-tg-text">Валюта</h2>
        <div className="flex flex-wrap gap-2">
          {currencies.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => updateSettings({ currency: c })}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                settings.currency === c
                  ? "bg-tg-button text-tg-button-text"
                  : "bg-tg-secondary text-tg-text"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-base font-semibold text-tg-text">Тема</h2>
        <div className="flex flex-col gap-2">
          {themeOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => updateSettings({ theme: opt.id })}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold ${
                settings.theme === opt.id
                  ? "bg-tg-button text-tg-button-text"
                  : "bg-tg-secondary text-tg-text"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-tg-hint">
          У режимі «Як у Telegram» кольори синхронізуються з themeParams.
        </p>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-tg-text">Категорії</h2>
          <Button size="md" variant="secondary" onClick={() => setCatOpen(true)}>
            + Своя
          </Button>
        </div>
        <div className="flex max-h-56 flex-col gap-2 overflow-y-auto">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-2 rounded-xl bg-tg-secondary px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <CategoryIcon
                  name={c.icon}
                  className="h-4 w-4 shrink-0"
                  style={{ color: c.color }}
                />
                <span className="truncate text-sm font-medium text-tg-text">
                  {c.name}
                </span>
                <span className="text-xs text-tg-hint">
                  {c.type === "income" ? "+" : "−"}
                </span>
              </div>
              {!c.isBuiltIn ? (
                <button
                  type="button"
                  className="p-2 text-red-500"
                  aria-label="Видалити"
                  onClick={() => {
                    removeCategory(c.id);
                    showToast("Категорію видалено", "default");
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-tg-text">Дані</h2>
        <Button variant="secondary" onClick={exportJson}>
          Експорт JSON
        </Button>
        <Button variant="secondary" onClick={() => loadDemoData()}>
          Завантажити демо-дані
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            if (typeof window !== "undefined" && window.confirm("Очистити всі дані?")) {
              clearAllData();
              showToast("Дані очищено", "warning");
            }
          }}
        >
          Очистити всі дані
        </Button>
      </Card>

      <BottomSheet open={catOpen} onClose={() => setCatOpen(false)} title="Нова категорія">
        <div className="flex flex-col gap-4 pb-6">
          <Input
            label="Назва"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
          />
          <div>
            <p className="mb-2 text-sm font-medium text-tg-hint">Тип</p>
            <div className="flex gap-2">
              {(["expense", "income"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setCatType(t)}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-semibold ${
                    catType === t
                      ? "bg-tg-button text-tg-button-text"
                      : "bg-tg-secondary text-tg-text"
                  }`}
                >
                  {t === "income" ? "Дохід" : "Витрата"}
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Колір"
            type="color"
            className="min-h-[52px] cursor-pointer py-1"
            value={catColor}
            onChange={(e) => setCatColor(e.target.value)}
          />
          <Button fullWidth onClick={saveCustomCategory}>
            Зберегти
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
