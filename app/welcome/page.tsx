"use client";

import { motion } from "framer-motion";
import { Sparkles, Shield, PieChart, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useRouter } from "next/navigation";
import { hapticMedium } from "@/lib/telegram";

const points = [
  { Icon: Wallet, text: "Доходи, витрати та бюджети в одному місці" },
  { Icon: PieChart, text: "Аналітика та графіки по категоріях" },
  { Icon: Shield, text: "Дані локально; готово до хмарного бекенду" },
];

export default function WelcomePage() {
  const router = useRouter();
  const completeWelcome = useFinanceStore((s) => s.completeWelcome);

  const start = () => {
    hapticMedium();
    completeWelcome();
    router.replace("/dashboard");
  };

  return (
    <div
      className="flex min-h-[100dvh] flex-col bg-tg-bg px-6 pt-[calc(2rem+env(safe-area-inset-top))] pb-[calc(2rem+env(safe-area-inset-bottom))]"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col items-center text-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-card-lg">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-tg-text">
          MoneyFlow
        </h1>
        <p className="mt-2 max-w-sm text-base text-tg-hint">
          Premium міні-застосунок для щоденного керування грошима прямо в Telegram.
        </p>
      </motion.div>

      <div className="flex flex-1 flex-col gap-4">
        {points.map(({ Icon, text }, i) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * (i + 1) }}
            className="flex gap-4 rounded-3xl border border-black/6 bg-surface-elevated p-4 shadow-card dark:border-white/8"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tg-secondary">
              <Icon className="h-6 w-6 text-tg-button" />
            </div>
            <p className="flex items-center text-left text-sm font-medium leading-snug text-tg-text">
              {text}
            </p>
          </motion.div>
        ))}
      </div>

      <Button fullWidth className="mt-8" onClick={start}>
        Почати
      </Button>
    </div>
  );
}
