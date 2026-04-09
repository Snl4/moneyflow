import type { CurrencyCode } from "@/types";

const symbols: Record<CurrencyCode, string> = {
  UAH: "₴",
  USD: "$",
  EUR: "€",
};

export function formatMoney(amount: number, currency: CurrencyCode): string {
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(abs);
  const sign = amount < 0 ? "−" : "";
  return `${sign}${formatted} ${symbols[currency]}`;
}

export function formatMoneyCompact(amount: number, currency: CurrencyCode): string {
  const sym = symbols[currency];
  if (Math.abs(amount) >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M ${sym}`;
  }
  if (Math.abs(amount) >= 1000) {
    return `${(amount / 1000).toFixed(1)}k ${sym}`;
  }
  return formatMoney(amount, currency);
}

export function formatDateDisplay(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00");
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}
