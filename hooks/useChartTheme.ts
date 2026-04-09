"use client";

import { useFinanceStore } from "@/store/useFinanceStore";

/** Палітра графіків під світлу / темну тему та читабельність у Telegram WebView */
export function useChartTheme() {
  const isDark = useFinanceStore((s) => s.settings.theme === "dark");

  if (isDark) {
    return {
      isDark: true,
      grid: "rgba(255,255,255,0.08)",
      axis: "#94a3b8",
      incomeStroke: "#34d399",
      incomeFillTop: "rgba(52,211,153,0.45)",
      incomeFillBot: "rgba(52,211,153,0)",
      expenseStroke: "#f87171",
    expenseFillTop: "rgba(248,113,113,0.45)",
    expenseFillBot: "rgba(248,113,113,0)",
    tooltipBorder: "rgba(255,255,255,0.12)",
  } as const;
  }

  return {
    isDark: false,
    grid: "rgba(15,23,42,0.08)",
    axis: "#64748b",
    incomeStroke: "#059669",
    incomeFillTop: "rgba(16,185,129,0.35)",
    incomeFillBot: "rgba(16,185,129,0)",
    expenseStroke: "#dc2626",
    expenseFillTop: "rgba(239,68,68,0.35)",
    expenseFillBot: "rgba(239,68,68,0)",
    tooltipBorder: "rgba(15,23,42,0.1)",
  } as const;
}
