"use client";

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
  formatDate,
  TOOLTIP_STYLE,
  GRID_STROKE,
  TICK_STYLE,
  COLORS,
} from "@/lib/chart-utils";

type CumulativeHoursChartProps = {
  data: { date: string; cumulativeHours: number }[];
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div style={TOOLTIP_STYLE}>
      <div className="text-muted-foreground mb-1.5" style={{ fontSize: 11 }}>
        {formatDate(String(label))}
      </div>
      <div className="flex justify-between gap-4" style={{ fontSize: 12 }}>
        <span className="text-muted-foreground">Total</span>
        <span className="font-mono" style={{ color: COLORS.emerald }}>
          {payload[0].value.toFixed(1)}h
        </span>
      </div>
    </div>
  );
}

export function CumulativeHoursChart({ data }: CumulativeHoursChartProps) {
  if (!data.length) {
    return (
      <div className="glass p-6 text-xs text-muted-foreground">
        No data yet.
      </div>
    );
  }

  return (
    <div className="glass p-4">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 8, right: 12, left: 8, bottom: 4 }}
        >
          <defs>
            <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.emerald} stopOpacity={0.3} />
              <stop offset="100%" stopColor={COLORS.emerald} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid horizontal vertical={false} stroke={GRID_STROKE} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            width={44}
            tickFormatter={(v: number) => `${v}h`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="cumulativeHours"
            stroke={COLORS.emerald}
            strokeWidth={2}
            fill="url(#emeraldGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
