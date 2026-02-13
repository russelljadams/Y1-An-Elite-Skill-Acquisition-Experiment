"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TOOLTIP_STYLE,
  GRID_STROKE,
  TICK_STYLE,
  COLORS,
} from "@/lib/chart-utils";
import type { MonthlyBreakdown } from "@/lib/data";

type MonthlyVolumeChartProps = {
  data: MonthlyBreakdown[];
  targetHours?: number;
};

function formatMonth(month: string): string {
  const [year, m] = month.split("-");
  const d = new Date(Number(year), Number(m) - 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as MonthlyBreakdown;
  if (!d) return null;

  return (
    <div style={TOOLTIP_STYLE}>
      <div className="text-muted-foreground mb-1.5" style={{ fontSize: 11 }}>
        {formatMonth(d.month)}
      </div>
      <div className="flex justify-between gap-4" style={{ fontSize: 12 }}>
        <span className="text-muted-foreground">Hours</span>
        <span className="font-mono text-foreground">{d.hours}h</span>
      </div>
      <div className="flex justify-between gap-4" style={{ fontSize: 12 }}>
        <span className="text-muted-foreground">Sessions</span>
        <span className="font-mono text-foreground">{d.sessions}</span>
      </div>
      <div className="flex justify-between gap-4" style={{ fontSize: 12 }}>
        <span className="text-muted-foreground">Laps</span>
        <span className="font-mono text-foreground">{d.laps}</span>
      </div>
    </div>
  );
}

export function MonthlyVolumeChart({
  data,
  targetHours = 100,
}: MonthlyVolumeChartProps) {
  if (!data.length) {
    return (
      <div className="glass p-6 text-xs text-muted-foreground">
        No data yet.
      </div>
    );
  }

  const maxHours = Math.max(...data.map((d) => d.hours), targetHours);

  return (
    <div className="glass p-4">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 12, left: 8, bottom: 4 }}
        >
          <CartesianGrid horizontal vertical={false} stroke={GRID_STROKE} />
          <XAxis
            dataKey="month"
            tickFormatter={formatMonth}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
          />
          <YAxis
            domain={[0, Math.ceil(maxHours * 1.1)]}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            width={40}
            tickFormatter={(v: number) => `${v}h`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <ReferenceLine
            y={targetHours}
            stroke={COLORS.red}
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{
              value: `${targetHours}h target`,
              position: "right",
              style: { fontSize: 10, fill: COLORS.red },
            }}
          />
          <Bar dataKey="hours" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.hours >= targetHours ? COLORS.emerald : COLORS.cyan}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
