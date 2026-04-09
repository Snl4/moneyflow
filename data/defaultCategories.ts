import type { Category } from "@/types";

export function createDefaultCategories(): Category[] {
  const expense: Category[] = [
    {
      id: "cat-exp-food",
      name: "Їжа",
      type: "expense",
      icon: "UtensilsCrossed",
      color: "#f97316",
      isBuiltIn: true,
    },
    {
      id: "cat-exp-transport",
      name: "Транспорт",
      type: "expense",
      icon: "Car",
      color: "#3b82f6",
      isBuiltIn: true,
    },
    {
      id: "cat-exp-housing",
      name: "Житло",
      type: "expense",
      icon: "Home",
      color: "#8b5cf6",
      isBuiltIn: true,
    },
    {
      id: "cat-exp-subs",
      name: "Підписки",
      type: "expense",
      icon: "Repeat",
      color: "#ec4899",
      isBuiltIn: true,
    },
    {
      id: "cat-exp-shopping",
      name: "Покупки",
      type: "expense",
      icon: "ShoppingBag",
      color: "#14b8a6",
      isBuiltIn: true,
    },
    {
      id: "cat-exp-entertainment",
      name: "Розваги",
      type: "expense",
      icon: "Sparkles",
      color: "#eab308",
      isBuiltIn: true,
    },
    {
      id: "cat-exp-health",
      name: "Здоров'я",
      type: "expense",
      icon: "HeartPulse",
      color: "#ef4444",
      isBuiltIn: true,
    },
    {
      id: "cat-exp-other",
      name: "Інше",
      type: "expense",
      icon: "CircleDot",
      color: "#64748b",
      isBuiltIn: true,
    },
  ];

  const income: Category[] = [
    {
      id: "cat-inc-salary",
      name: "Зарплата",
      type: "income",
      icon: "Briefcase",
      color: "#22c55e",
      isBuiltIn: true,
    },
    {
      id: "cat-inc-freelance",
      name: "Фріланс",
      type: "income",
      icon: "Laptop",
      color: "#06b6d4",
      isBuiltIn: true,
    },
    {
      id: "cat-inc-business",
      name: "Бізнес",
      type: "income",
      icon: "Building2",
      color: "#a855f7",
      isBuiltIn: true,
    },
    {
      id: "cat-inc-gift",
      name: "Подарунок",
      type: "income",
      icon: "Gift",
      color: "#f43f5e",
      isBuiltIn: true,
    },
    {
      id: "cat-inc-other",
      name: "Інше",
      type: "income",
      icon: "Wallet",
      color: "#94a3b8",
      isBuiltIn: true,
    },
  ];

  return [...expense, ...income];
}
