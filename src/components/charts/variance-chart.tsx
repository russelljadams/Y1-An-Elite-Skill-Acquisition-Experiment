"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  formatDateByGranularity,
  TOOLTIP_STYLE,
  GRID_STROKE,
  TICK_STYLE,
  COLORS,
} from "@/lib/chart-utils";

type DataPoint = {
  date: string;
  value: number;
  laps?: number;
};

type Granularity = "day" | "week" | "month";

export function VarianceChart({
  daily,
  weekly,
  monthly,
  formatX,
}: {
  daily: DataPoint[];
  weekly: DataPoint[];
  monthly: DataPoint[];
  formatX?: (v: string) => string;
}) {
  const [granularity, setGranularity] = useState<Granularity>("day");

  // When formatX is provided (hours mode), only use daily data and skip granularity toggle
  const overrideMode = !!formatX;
  const dataMap: Record<Granularity, DataPoint[]> = {
    day: daily,
    week: weekly,
    month: monthly,
  };
  const data = overrideMode ? daily : dataMap[granularity];

  if (!daily.length && !weekly.length && !monthly.length) {
    return (
      <div className="glass p-6 text-xs text-muted-foreground">
        No data yet.
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const minY = Math.min(...values);
  const maxY = Math.max(...values);
  const padding = (maxY - minY) * 0.1 || 0.5;

  const tabs: { key: Granularity; label: string }[] = [
    { key: "day", label: "Daily" },
    { key: "week", label: "Weekly" },
    { key: "month", label: "Monthly" },
  ];

  return (
    <div className="glass p-4">
      {!overrideMode && (
        <div className="flex gap-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setGranularity(tab.key)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                granularity === tab.key
                  ? "bg-white/[0.1] text-foreground border border-white/[0.1]"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart
          data={data}
          margin={{ top: 8, right: 12, left: 8, bottom: 4 }}
        >
          <defs>
            <linearGradient id="varianceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.orange} stopOpacity={0.2} />
              <stop offset="100%" stopColor={COLORS.orange} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            horizontal={true}
            vertical={false}
            stroke={GRID_STROKE}
          />
          <XAxis
            dataKey="date"
            tickFormatter={(d) => formatX ? formatX(d) : formatDateByGranularity(d, granularity)}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[Math.max(0, minY - padding), maxY + padding]}
            tickFormatter={(v: number) => v.toFixed(1)}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            width={40}
            label={{
              value: "std dev (s)",
              angle: -90,
              position: "insideLeft",
              offset: 4,
              style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" },
            }}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelFormatter={(label) => formatX ? formatX(String(label)) : formatDateByGranularity(String(label), granularity)}
            formatter={(value, _name, props) => {
              const laps = (props.payload as DataPoint | undefined)?.laps;
              const label = laps ? `std dev (${laps} laps)` : "std dev";
              return [Number(value).toFixed(2) + "s", label];
            }}
            cursor={{ stroke: "rgba(251, 146, 60, 0.3)", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={COLORS.orange}
            strokeWidth={2}
            fill="url(#varianceGradient)"
            dot={false}
            activeDot={{
              r: 5,
              fill: COLORS.orange,
              stroke: "hsl(222, 47%, 5%)",
              strokeWidth: 2,
            }}
            name="Variance"
          />
        </AreaChart>
      </ResponsiveContainer>

      {!overrideMode && (
        <div className="text-xs text-muted-foreground mt-3">
          {granularity === "day" && "Standard deviation computed from all laps each day."}
          {granularity === "week" && "Standard deviation computed from all laps each week (Mon\u2013Sun)."}
          {granularity === "month" && "Standard deviation computed from all laps each calendar month."}
        </div>
      )}
    </div>
  );
}
