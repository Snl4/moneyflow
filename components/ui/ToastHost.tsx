"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToastStore } from "@/store/useToastStore";
import { cn } from "@/lib/cn";

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      className="pointer-events-none fixed left-1/2 z-[100] flex w-[min(100%,420px)] -translate-x-1/2 flex-col gap-2 px-4"
      style={{
        top: "calc(1rem + env(safe-area-inset-top))",
      }}
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={cn(
              "pointer-events-auto rounded-2xl px-4 py-3 text-center text-sm font-medium shadow-card-lg",
              t.variant === "default" &&
                "bg-tg-secondary text-tg-text border border-black/5 dark:border-white/10",
              t.variant === "success" && "bg-emerald-600 text-white",
              t.variant === "error" && "bg-red-600 text-white",
              t.variant === "warning" && "bg-amber-500 text-black"
            )}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
