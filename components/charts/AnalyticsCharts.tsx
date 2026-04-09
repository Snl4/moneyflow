"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { formatMoney } from "@/lib/format";
import type { CurrencyCode } from "@/types";
import { useChartTheme } from "@/hooks/useChartTheme";

export function IncomeExpenseChart({
  data,
  currency,
  hasAnyMovement: hasMovementProp,
}: {
  data: { date: string; income: number; expense: number }[];
  currency: CurrencyCode;
  /** Якщо не передано — визначається з data (дохід або витрата > 0 хоча б один день) */
  hasAnyMovement?: boolean;
}) {
  const ct = useChartTheme();
  const hasAnyMovement =
    hasMovementProp !== undefined
      ? hasMovementProp
      : data.some((d) => d.income > 0 || d.expense > 0);
  const chartData = data.map((d) => ({
    ...d,
    label: format(new Date(d.date + "T12:00:00"), "d MMM", { locale: uk }),
  }));

  const gid = ct.isDark ? "inc-d" : "inc-l";
  const gide = ct.isDark ? "exp-d" : "exp-l";

  return (
    <div className="relative h-56 w-full">
      {!hasAnyMovement ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-tg-secondary/80 backdrop-blur-[1px]">
          <p className="px-4 text-center text-sm font-medium text-tg-hint">
            Поки немає операцій — графік з&apos;явиться після перших доходів і витрат
          </p>
        </div>
      ) : null}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ct.incomeStroke} stopOpacity={0.4} />
              <stop offset="100%" stopColor={ct.incomeStroke} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={gide} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ct.expenseStroke} stopOpacity={0.4} />
              <stop offset="100%" stopColor={ct.expenseStroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: ct.axis }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: ct.axis }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0].payload as (typeof chartData)[0];
              return (
                <div
                  className="rounded-xl px-3 py-2 text-xs shadow-lg"
                  style={{
                    backgroundColor: "var(--tg-theme-bg-color)",
                    border: `1px solid ${ct.tooltipBorder}`,
                    color: "var(--tg-theme-text-color)",
                  }}
                >
                  <p className="mb-1 font-medium opacity-90">{row.label}</p>
                  <p style={{ color: ct.incomeStroke }}>
                    Дохід: {formatMoney(row.income, currency)}
                  </p>
                  <p style={{ color: ct.expenseStroke }}>
                    Витрати: {formatMoney(row.expense, currency)}
                  </p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke={ct.incomeStroke}
            strokeWidth={2}
            fill={`url(#${gid})`}
            isAnimationActive={hasAnyMovement}
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke={ct.expenseStroke}
            strokeWidth={2}
            fill={`url(#${gide})`}
            isAnimationActive={hasAnyMovement}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPie({
  data,
  currency,
  hasData: hasDataProp,
}: {
  data: { name: string; value: number; color: string }[];
  currency: CurrencyCode;
  /** Якщо не передано — true, коли data не порожній */
  hasData?: boolean;
}) {
  const ct = useChartTheme();
  const hasData = hasDataProp !== undefined ? hasDataProp : data.length > 0;

  return (
    <div className="relative h-64 w-full">
      {!hasData ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-tg-secondary/80 backdrop-blur-[1px]">
          <p className="px-4 text-center text-sm font-medium text-tg-hint">
            Немає витрат за місяць — діаграма з&apos;явиться автоматично
          </p>
        </div>
      ) : null}
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
            isAnimationActive={hasData}
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
                <div
                  className="rounded-xl px-3 py-2 text-xs shadow-lg"
                  style={{
                    backgroundColor: "var(--tg-theme-bg-color)",
                    border: `1px solid ${ct.tooltipBorder}`,
                    color: "var(--tg-theme-text-color)",
                  }}
                >
                  <p className="font-semibold">{p.name}</p>
                  <p className="opacity-80">{formatMoney(p.value, currency)}</p>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryBarChart({
  data,
  currency,
  hasData: hasDataProp,
}: {
  data: { name: string; value: number; color: string }[];
  currency: CurrencyCode;
  hasData?: boolean;
}) {
  const ct = useChartTheme();
  const hasData = hasDataProp !== undefined ? hasDataProp : data.length > 0;
  const rows = [...data].reverse();

  return (
    <div className="relative h-[min(22rem,52vh)] w-full">
      {!hasData ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-tg-secondary/80 backdrop-blur-[1px]">
          <p className="px-4 text-center text-sm font-medium text-tg-hint">
            Стовпчики з&apos;являться після витрат за категоріями
          </p>
        </div>
      ) : null}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: ct.axis }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={88}
            tick={{ fontSize: 10, fill: ct.axis }}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <Tooltip
            cursor={{ fill: ct.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const p = payload[0].payload as (typeof rows)[0];
              return (
                <div
                  className="rounded-xl px-3 py-2 text-xs shadow-lg"
                  style={{
                    backgroundColor: "var(--tg-theme-bg-color)",
                    border: `1px solid ${ct.tooltipBorder}`,
                    color: "var(--tg-theme-text-color)",
                  }}
                >
                  <p className="font-semibold">{p.name}</p>
                  <p className="opacity-80">{formatMoney(p.value, currency)}</p>
                </div>
              );
            }}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={18} isAnimationActive={hasData}>
            {rows.map((e, i) => (
              <Cell key={i} fill={e.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
