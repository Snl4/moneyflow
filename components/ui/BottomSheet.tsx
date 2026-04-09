"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className={cn(
              "relative z-10 max-h-[92vh] w-full max-w-lg overflow-hidden rounded-t-[28px] bg-tg-bg shadow-card-lg",
              "pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2",
              className
            )}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-tg-hint/35" />
            {title ? (
              <h2 className="px-6 pb-2 text-center text-lg font-semibold text-tg-text">
                {title}
              </h2>
            ) : null}
            <div className="max-h-[calc(92vh-4rem)] overflow-y-auto overscroll-contain px-5">
              {children}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
