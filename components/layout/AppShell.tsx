"use client";

import { TabBar } from "@/components/layout/TabBar";
import { cn } from "@/lib/cn";

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-[100dvh] bg-tg-bg text-tg-text">
      <main
        className={cn(
          "mx-auto max-w-lg px-4 pb-28 pt-[calc(0.75rem+env(safe-area-inset-top))]",
          className
        )}
      >
        {children}
      </main>
      <TabBar />
    </div>
  );
}
