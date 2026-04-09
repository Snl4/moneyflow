"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { TransactionRow } from "@/components/transaction/TransactionRow";
import { TransactionForm } from "@/components/transaction/TransactionForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFinanceStore, filterTransactions } from "@/store/useFinanceStore";
import type { Transaction, TransactionType } from "@/types";
import { hapticLight } from "@/lib/telegram";
import { useToastStore } from "@/store/useToastStore";

export default function TransactionsPage() {
  const transactions = useFinanceStore((s) => s.transactions);
  const categories = useFinanceStore((s) => s.categories);
  const currency = useFinanceStore((s) => s.settings.currency);
  const removeTransaction = useFinanceStore((s) => s.removeTransaction);
  const showToast = useToastStore((s) => s.show);

  const [search, setSearch] = useState("");
  const [type, setType] = useState<TransactionType | "all">("all");
  const [categoryId, setCategoryId] = useState<string | "all">("all");
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(
    () =>
      filterTransactions(transactions, categories, {
        search,
        type,
        categoryId,
        from,
        to,
      }).sort((a, b) => b.date.localeCompare(a.date)),
    [transactions, categories, search, type, categoryId, from, to]
  );

  const catMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <AppHeader title="Операції" subtitle="Усі транзакції" />

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tg-hint" />
          <Input
            className="pl-10"
            placeholder="Пошук..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="secondary"
          size="md"
          className="w-12 shrink-0 px-0"
          onClick={() => {
            hapticLight();
            setFiltersOpen(true);
          }}
          aria-label="Фільтри"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>

      <Button fullWidth onClick={() => setAddOpen(true)}>
        + Додати операцію
      </Button>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Нічого не знайдено"
            description="Змініть фільтри або додайте нову операцію"
            actionLabel="Додати"
            onAction={() => setAddOpen(true)}
          />
        ) : (
          filtered.map((t) => (
            <div key={t.id} className="flex flex-col gap-1">
              <TransactionRow
                t={t}
                category={catMap.get(t.categoryId)}
                currency={currency}
                onClick={() => setEditTx(t)}
              />
            </div>
          ))
        )}
      </div>

      <BottomSheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Фільтри">
        <div className="flex flex-col gap-4 pb-6">
          <div>
            <p className="mb-2 text-sm font-medium text-tg-hint">Тип</p>
            <div className="flex flex-wrap gap-2">
              {(["all", "income", "expense"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setType(v)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    type === v
                      ? "bg-tg-button text-tg-button-text"
                      : "bg-tg-secondary text-tg-text"
                  }`}
                >
                  {v === "all" ? "Усі" : v === "income" ? "Дохід" : "Витрата"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-tg-hint">Категорія</p>
            <select
              className="min-h-[48px] w-full rounded-2xl border border-black/8 bg-tg-secondary px-3 text-tg-text dark:border-white/10"
              value={categoryId}
              onChange={(e) =>
                setCategoryId(e.target.value === "all" ? "all" : e.target.value)
              }
            >
              <option value="all">Усі категорії</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type === "income" ? "+" : "−"})
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Від дати"
            type="date"
            value={from ?? ""}
            onChange={(e) => setFrom(e.target.value || null)}
          />
          <Input
            label="До дати"
            type="date"
            value={to ?? ""}
            onChange={(e) => setTo(e.target.value || null)}
          />
          <Button
            variant="secondary"
            onClick={() => {
              setType("all");
              setCategoryId("all");
              setFrom(null);
              setTo(null);
            }}
          >
            Скинути фільтри
          </Button>
        </div>
      </BottomSheet>

      <BottomSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Нова операція"
      >
        <TransactionForm
          initial={null}
          useTelegramMainButton
          onSaved={() => {
            setAddOpen(false);
            showToast("Додано", "success");
          }}
          onCancel={() => setAddOpen(false)}
        />
      </BottomSheet>

      <BottomSheet
        open={!!editTx}
        onClose={() => setEditTx(null)}
        title="Редагувати"
      >
        {editTx ? (
          <div className="flex flex-col gap-4 pb-4">
            <TransactionForm
              key={editTx.id}
              initial={editTx}
              useTelegramMainButton
              onSaved={() => {
                setEditTx(null);
                showToast("Оновлено", "success");
              }}
              onCancel={() => setEditTx(null)}
            />
            <Button
              variant="danger"
              onClick={() => {
                removeTransaction(editTx.id);
                setEditTx(null);
                showToast("Видалено", "default");
              }}
            >
              Видалити операцію
            </Button>
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}
