"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListOrdered,
  PieChart,
  PiggyBank,
  Target,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { hapticLight } from "@/lib/telegram";

const tabs = [
  { href: "/dashboard", label: "Головна", Icon: LayoutDashboard },
  { href: "/transactions", label: "Операції", Icon: ListOrdered },
  { href: "/analytics", label: "Аналітика", Icon: PieChart },
  { href: "/budgets", label: "Бюджети", Icon: PiggyBank },
  { href: "/goals", label: "Цілі", Icon: Target },
  { href: "/settings", label: "Ще", Icon: Settings },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/6 bg-tg-bg/95 backdrop-blur-md dark:border-white/8"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto flex max-w-lg snap-x snap-mandatory gap-0.5 overflow-x-auto px-2 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map(({ href, label, Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => hapticLight()}
              className={cn(
                "flex min-w-[4.25rem] shrink-0 snap-center flex-col items-center gap-0.5 rounded-xl py-1.5 transition-colors",
                active ? "text-tg-button" : "text-tg-hint"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
              <span className="max-w-full truncate px-0.5 text-[10px] font-medium">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
