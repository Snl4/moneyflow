"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useFinanceStore } from "@/store/useFinanceStore";

export function MainGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hasSeen = useFinanceStore((s) => s.settings.hasSeenWelcome);

  useEffect(() => {
    if (!hasSeen && pathname !== "/welcome") {
      router.replace("/welcome");
    }
  }, [hasSeen, pathname, router]);

  if (!hasSeen) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-tg-bg">
        <div className="h-8 w-8 animate-pulse rounded-lg bg-emerald-500/40" />
      </div>
    );
  }

  return <>{children}</>;
}
