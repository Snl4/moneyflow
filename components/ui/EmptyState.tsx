"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-tg-hint/25 bg-tg-secondary/40 px-6 py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-tg-bg shadow-card">
        <Icon className="h-8 w-8 text-tg-hint" />
      </div>
      <div>
        <p className="text-lg font-semibold text-tg-text">{title}</p>
        {description ? (
          <p className="mt-1 text-sm text-tg-hint">{description}</p>
        ) : null}
      </div>
      {actionLabel && onAction ? (
        <Button size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
