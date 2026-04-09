"use client";

import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-surface-elevated p-5 shadow-card dark:shadow-none",
        "border border-black/[0.04] dark:border-white/[0.06]",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
