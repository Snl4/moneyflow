"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }
>(function Textarea({ className, label, id, ...props }, ref) {
  const lid = id ?? props.name;
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label htmlFor={lid} className="text-sm font-medium text-tg-hint">
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={lid}
        className={cn(
          "min-h-[100px] w-full resize-none rounded-2xl border border-black/8 bg-tg-secondary px-4 py-3 text-base text-tg-text",
          "placeholder:text-tg-hint/80 focus:border-tg-button focus:outline-none focus:ring-2 focus:ring-tg-button/25",
          "dark:border-white/10",
          className
        )}
        {...props}
      />
    </div>
  );
});
