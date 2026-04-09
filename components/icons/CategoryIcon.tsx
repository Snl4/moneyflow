"use client";

import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  UtensilsCrossed,
  Car,
  Home,
  Repeat,
  ShoppingBag,
  Sparkles,
  HeartPulse,
  CircleDot,
  Briefcase,
  Laptop,
  Building2,
  Gift,
  Wallet,
  Tag,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/lib/cn";

const map: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Car,
  Home,
  Repeat,
  ShoppingBag,
  Sparkles,
  HeartPulse,
  CircleDot,
  Briefcase,
  Laptop,
  Building2,
  Gift,
  Wallet,
  Tag,
};

export function CategoryIcon({
  name,
  className,
  style,
  ...rest
}: { name: string; className?: string; style?: CSSProperties } & LucideProps) {
  const Icon = map[name] ?? Tag;
  return <Icon className={cn("shrink-0", className)} style={style} {...rest} />;
}
