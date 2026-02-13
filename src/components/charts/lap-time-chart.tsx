"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  formatLapTime,
  formatDate,
  TOOLTIP_STYLE,
  GRID_STROKE,
  TICK_STYLE,
  COLORS,
} from "@/lib/chart-utils";
import type { ReferenceMark } from "@/lib/data";

type DataPoint = {
  date: string;
  value: number;
};

export function LapTimeChart({
  data,
  yLabel,
  references = [],
  formatAsTime = true,
  formatX,
}: {
  data: DataPoint[];
  yLabel: string;
  references?: ReferenceMark[];
  formatAsTime?: boolean;
  formatX?: (v: string) => string;
}) {
  const xFmt = formatX ?? formatDate;
  if (!data.length) {
    return (
      <div className="glass p-6 text-xs text-muted-foreground">
        No data yet.
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const refValues = references.map((r) => r.value);
  const allValues = [...values, ...refValues];
  const minY = Math.min(...allValues);
  const maxY = Math.max(...allValues);
  const padding = (maxY - minY) * 0.1 || 1;

  const formatter = formatAsTime ? formatLapTime : (v: number) => v.toFixed(2);
  const tickFormatter = formatAsTime
    ? (v: number) => formatLapTime(v)
    : (v: number) => v.toFixed(1);

  return (
    <div className="glass p-4">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart
          data={data}
          margin={{ top: 8, right: 12, left: 8, bottom: 4 }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.cyan} stopOpacity={0.2} />
              <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            horizontal={true}
            vertical={false}
            stroke={GRID_STROKE}
          />
          <XAxis
            dataKey="date"
            tickFormatter={xFmt}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minY - padding, maxY + padding]}
            tickFormatter={tickFormatter}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            width={52}
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              offset: 4,
              style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" },
            }}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelFormatter={(label) => xFmt(String(label))}
            formatter={(value) => [formatter(Number(value)), yLabel]}
            cursor={{ stroke: "rgba(34, 211, 238, 0.3)", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={COLORS.cyan}
            strokeWidth={2}
            fill="url(#areaGradient)"
            dot={false}
            activeDot={{
              r: 5,
              fill: COLORS.cyan,
              stroke: "hsl(222, 47%, 5%)",
              strokeWidth: 2,
            }}
            name="You"
          />
          {references.map((ref, i) => (
            <ReferenceLine
              key={i}
              y={ref.value}
              stroke={ref.color ?? "hsl(var(--muted-foreground))"}
              strokeDasharray="6 3"
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-4 border-t-2"
            style={{ borderColor: COLORS.cyan }}
          />
          <span className="text-muted-foreground">Your pace</span>
        </span>
        {references.map((ref, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span
              className="inline-block w-4 border-t-2 border-dashed"
              style={{ borderColor: ref.color ?? "hsl(var(--muted-foreground))" }}
            />
            <span style={{ color: ref.color ?? "hsl(var(--muted-foreground))" }}>
              {ref.label} — {formatter(ref.value)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
