"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFinanceStore } from "@/store/useFinanceStore";

export default function HomePage() {
  const router = useRouter();
  const hasSeen = useFinanceStore((s) => s.settings.hasSeenWelcome);

  useEffect(() => {
    router.replace(hasSeen ? "/dashboard" : "/welcome");
  }, [hasSeen, router]);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-tg-bg">
      <div className="h-10 w-10 animate-pulse rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600" />
    </div>
  );
}
