import { subDays, formatISO, startOfMonth } from "date-fns";
import type { Transaction, Goal, Budget } from "@/types";

function iso(d: Date) {
  return formatISO(d, { representation: "date" });
}

const now = new Date();
const month = now.getMonth() + 1;
const year = now.getFullYear();

export const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    title: "Зарплата",
    amount: 45000,
    date: iso(startOfMonth(now)),
    categoryId: "cat-inc-salary",
    note: "",
    type: "income",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tx-2",
    title: "Фріланс проєкт",
    amount: 12000,
    date: iso(subDays(now, 5)),
    categoryId: "cat-inc-freelance",
    note: "Клієнт А",
    type: "income",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tx-3",
    title: "Сільпо",
    amount: 1850,
    date: iso(subDays(now, 1)),
    categoryId: "cat-exp-food",
    note: "",
    type: "expense",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tx-4",
    title: "Uber",
    amount: 220,
    date: iso(subDays(now, 2)),
    categoryId: "cat-exp-transport",
    note: "",
    type: "expense",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tx-5",
    title: "Netflix",
    amount: 299,
    date: iso(subDays(now, 3)),
    categoryId: "cat-exp-subs",
    note: "",
    type: "expense",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tx-6",
    title: "Аптека",
    amount: 540,
    date: iso(subDays(now, 4)),
    categoryId: "cat-exp-health",
    note: "",
    type: "expense",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockGoals: Goal[] = [
  {
    id: "goal-1",
    name: "Ноутбук",
    targetAmount: 80000,
    currentAmount: 24000,
    deadline: `${year}-12-31`,
    createdAt: new Date().toISOString(),
  },
  {
    id: "goal-2",
    name: "Подорож",
    targetAmount: 50000,
    currentAmount: 8000,
    deadline: `${year + 1}-06-01`,
    createdAt: new Date().toISOString(),
  },
  {
    id: "goal-3",
    name: "Резервний фонд",
    targetAmount: 100000,
    currentAmount: 32000,
    deadline: null,
    createdAt: new Date().toISOString(),
  },
];

export const mockBudgets: Budget[] = [
  {
    id: "bud-0",
    categoryId: null,
    amount: 35000,
    year,
    month,
  },
  {
    id: "bud-food",
    categoryId: "cat-exp-food",
    amount: 8000,
    year,
    month,
  },
  {
    id: "bud-transport",
    categoryId: "cat-exp-transport",
    amount: 3000,
    year,
    month,
  },
];
