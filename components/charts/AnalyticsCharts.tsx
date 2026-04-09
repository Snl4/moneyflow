"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { formatMoney } from "@/lib/format";
import type { CurrencyCode } from "@/types";

export function IncomeExpenseChart({
  data,
  currency,
}: {
  data: { date: string; income: number; expense: number }[];
  currency: CurrencyCode;
}) {
  const chartData = data.map((d) => ({
    ...d,
    label: format(new Date(d.date + "T12:00:00"), "d MMM", { locale: uk }),
  }));

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(0 0 0 / 0.06)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "var(--tg-theme-hint-color, #888)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--tg-theme-hint-color, #888)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0].payload as (typeof chartData)[0];
              return (
                <div className="rounded-xl border border-black/8 bg-tg-bg px-3 py-2 text-xs shadow-lg dark:border-white/10">
                  <p className="mb-1 font-medium text-tg-text">{row.label}</p>
                  <p className="text-emerald-600">
                    Дохід: {formatMoney(row.income, currency)}
                  </p>
                  <p className="text-red-500">
                    Витрати: {formatMoney(row.expense, currency)}
                  </p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#inc)"
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#exp)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPie({
  data,
  currency,
}: {
  data: { name: string; value: number; color: string }[];
  currency: CurrencyCode;
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={56}
            outerRadius={88}
            paddingAngle={2}
          >
            {data.map((e, i) => (
              <Cell key={i} fill={e.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const p = payload[0].payload as (typeof data)[0];
              return (
                <div className="rounded-xl border border-black/8 bg-tg-bg px-3 py-2 text-xs shadow-lg dark:border-white/10">
                  <p className="font-semibold text-tg-text">{p.name}</p>
                  <p className="text-tg-hint">{formatMoney(p.value, currency)}</p>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
