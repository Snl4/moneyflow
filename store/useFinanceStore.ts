"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
} from "date-fns";
import type {
  Transaction,
  Category,
  Budget,
  Goal,
  User,
  AppSettings,
  TransactionType,
} from "@/types";
import { createDefaultCategories } from "@/data/defaultCategories";
import { mockTransactions, mockGoals, mockBudgets } from "@/data/mockData";

const defaultSettings: AppSettings = {
  currency: "UAH",
  theme: "telegram",
  hasSeenWelcome: false,
  demoAutoLoaded: false,
};

function nowIso() {
  return new Date().toISOString();
}

interface FinanceStore {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: Goal[];
  user: User | null;
  settings: AppSettings;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  setUserFromTelegram: (u: User) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  completeWelcome: () => void;

  addTransaction: (t: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;

  addCategory: (c: Omit<Category, "id" | "isBuiltIn"> & { isBuiltIn?: boolean }) => void;
  removeCategory: (id: string) => void;

  upsertBudget: (b: Omit<Budget, "id"> & { id?: string }) => void;
  removeBudget: (id: string) => void;

  addGoal: (g: Omit<Goal, "id" | "createdAt">) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  removeGoal: (id: string) => void;

  loadDemoData: () => void;
  exportData: () => string;
  clearAllData: () => void;
}

const emptyUser = (): User | null => null;

const initialState = {
  transactions: [] as Transaction[],
  categories: createDefaultCategories(),
  budgets: [] as Budget[],
  goals: [] as Goal[],
  user: emptyUser(),
  settings: { ...defaultSettings },
  _hasHydrated: false,
};

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHasHydrated: (v) => set({ _hasHydrated: v }),

      setUserFromTelegram: (u) => set({ user: u }),

      updateSettings: (partial) =>
        set((s) => ({
          settings: { ...s.settings, ...partial },
        })),

      completeWelcome: () =>
        set((s) => ({
          settings: { ...s.settings, hasSeenWelcome: true },
        })),

      addTransaction: (t) => {
        const id = crypto.randomUUID();
        const ts = nowIso();
        set((s) => ({
          transactions: [
            {
              ...t,
              id,
              createdAt: ts,
              updatedAt: ts,
            },
            ...s.transactions,
          ],
        }));
      },

      updateTransaction: (id, patch) =>
        set((s) => ({
          transactions: s.transactions.map((x) =>
            x.id === id
              ? { ...x, ...patch, updatedAt: nowIso() }
              : x
          ),
        })),

      removeTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((x) => x.id !== id),
        })),

      addCategory: (c) => {
        const id = crypto.randomUUID();
        set((s) => ({
          categories: [
            ...s.categories,
            {
              id,
              name: c.name,
              type: c.type,
              icon: c.icon,
              color: c.color,
              isBuiltIn: c.isBuiltIn ?? false,
            },
          ],
        }));
      },

      removeCategory: (id) =>
        set((s) => ({
          categories: s.categories.filter(
            (c) => !(c.id === id && !c.isBuiltIn)
          ),
        })),

      upsertBudget: (b) => {
        const id = b.id ?? crypto.randomUUID();
        set((s) => {
          const rest = s.budgets.filter(
            (x) =>
              !(
                x.year === b.year &&
                x.month === b.month &&
                (x.categoryId ?? "") === (b.categoryId ?? "")
              )
          );
          return {
            budgets: [
              ...rest,
              {
                id,
                categoryId: b.categoryId,
                amount: b.amount,
                year: b.year,
                month: b.month,
              },
            ],
          };
        });
      },

      removeBudget: (id) =>
        set((s) => ({
          budgets: s.budgets.filter((x) => x.id !== id),
        })),

      addGoal: (g) => {
        const id = crypto.randomUUID();
        set((s) => ({
          goals: [
            {
              ...g,
              id,
              createdAt: nowIso(),
            },
            ...s.goals,
          ],
        }));
      },

      updateGoal: (id, patch) =>
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        })),

      removeGoal: (id) =>
        set((s) => ({
          goals: s.goals.filter((g) => g.id !== id),
        })),

      loadDemoData: () =>
        set((s) => ({
          transactions: mockTransactions.map((t) => ({ ...t })),
          goals: mockGoals.map((g) => ({ ...g })),
          budgets: mockBudgets.map((b) => ({ ...b })),
          settings: { ...s.settings, demoAutoLoaded: true },
        })),

      exportData: () => {
        const s = get();
        return JSON.stringify(
          {
            exportedAt: nowIso(),
            transactions: s.transactions,
            categories: s.categories,
            budgets: s.budgets,
            goals: s.goals,
            settings: s.settings,
          },
          null,
          2
        );
      },

      clearAllData: () =>
        set({
          ...initialState,
          categories: createDefaultCategories(),
          settings: {
            ...defaultSettings,
            hasSeenWelcome: true,
            demoAutoLoaded: true,
          },
          _hasHydrated: true,
        }),
    }),
    {
      name: "moneyflow-finance-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        transactions: s.transactions,
        categories: s.categories,
        budgets: s.budgets,
        goals: s.goals,
        user: s.user,
        settings: s.settings,
      }),
    }
  )
);

export function useCategoryMap() {
  const categories = useFinanceStore((s) => s.categories);
  return new Map(categories.map((c) => [c.id, c]));
}

export function getMonthRange(year: number, month: number) {
  const d = new Date(year, month - 1, 1);
  return { start: startOfMonth(d), end: endOfMonth(d) };
}

export function filterTransactionsByMonth(
  list: Transaction[],
  year: number,
  month: number
) {
  const { start, end } = getMonthRange(year, month);
  return list.filter((t) => {
    const d = parseISO(t.date + "T12:00:00");
    return isWithinInterval(d, { start, end });
  });
}

export function selectMonthStats(
  transactions: Transaction[],
  year: number,
  month: number
) {
  const inMonth = filterTransactionsByMonth(transactions, year, month);
  let income = 0;
  let expense = 0;
  for (const t of inMonth) {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, balance: income - expense, count: inMonth.length };
}

export function filterTransactions(
  list: Transaction[],
  categories: Category[],
  opts: {
    search: string;
    type: TransactionType | "all";
    categoryId: string | "all";
    from: string | null;
    to: string | null;
  }
) {
  const q = opts.search.trim().toLowerCase();
  const catMap = new Map(categories.map((c) => [c.id, c]));
  return list.filter((t) => {
    if (opts.type !== "all" && t.type !== opts.type) return false;
    if (opts.categoryId !== "all" && t.categoryId !== opts.categoryId)
      return false;
    if (opts.from && t.date < opts.from) return false;
    if (opts.to && t.date > opts.to) return false;
    if (q) {
      const cat = catMap.get(t.categoryId);
      const hay = `${t.title} ${t.note} ${cat?.name ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
