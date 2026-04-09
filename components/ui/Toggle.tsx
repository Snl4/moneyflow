"use client";

import { cn } from "@/lib/cn";
import { hapticLight } from "@/lib/telegram";

export function Toggle({
  checked,
  onChange,
  disabled,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        hapticLight();
        onChange(!checked);
      }}
      className={cn(
        "relative h-8 w-[52px] shrink-0 rounded-full transition-colors duration-200",
        checked ? "bg-tg-button" : "bg-tg-hint/35",
        disabled && "opacity-45"
      )}
    >
      <span
        className={cn(
          "absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200",
          checked && "translate-x-[22px]"
        )}
      />
    </button>
  );
}
