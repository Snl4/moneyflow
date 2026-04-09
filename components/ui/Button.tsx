"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-tg-button text-tg-button-text shadow-sm active:opacity-90",
  secondary:
    "bg-tg-secondary text-tg-text border border-black/5 dark:border-white/10",
  ghost: "text-tg-text bg-transparent active:bg-black/5 dark:active:bg-white/10",
  danger: "bg-red-500 text-white active:opacity-90",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof variants;
    fullWidth?: boolean;
    size?: "md" | "lg";
  }
>(function Button(
  { className, variant = "primary", fullWidth, size = "lg", disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200",
        size === "lg" && "min-h-[52px] px-5 text-base",
        size === "md" && "min-h-[44px] px-4 text-sm",
        variants[variant],
        fullWidth && "w-full",
        disabled && "pointer-events-none opacity-45",
        className
      )}
      {...props}
    />
  );
});
