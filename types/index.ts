export type CurrencyCode = "UAH" | "USD" | "EUR";

export type ThemeMode = "light" | "dark";

export type TransactionType = "income" | "expense";

export interface TelegramUserLite {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface User {
  telegramId: number | null;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  isBuiltIn: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  categoryId: string;
  note: string;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  categoryId: string | null;
  amount: number;
  year: number;
  month: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  createdAt: string;
}

export interface AppSettings {
  currency: CurrencyCode;
  theme: ThemeMode;
  hasSeenWelcome: boolean;
}

export interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: Goal[];
  user: User | null;
  settings: AppSettings;
}
