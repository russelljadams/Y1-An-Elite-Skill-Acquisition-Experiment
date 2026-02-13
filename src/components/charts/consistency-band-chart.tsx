"use client";

import {
  ComposedChart,
  Area,
  Line,
  Scatter,
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

type BandPoint = {
  date: string;
  p25: number;
  p75: number;
  medianLap: number;
  bestLap: number;
};

export function ConsistencyBandChart({
  data,
  references = [],
  formatX,
}: {
  data: BandPoint[];
  references?: ReferenceMark[];
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

  // For the stacked area trick: invisible base (p25) + visible band (p75 - p25)
  const chartData = data.map((d) => ({
    ...d,
    iqrBase: d.p25,
    iqrRange: d.p75 - d.p25,
  }));

  const allValues = [
    ...data.map((d) => d.bestLap),
    ...data.map((d) => d.p75),
    ...data.map((d) => d.p25),
    ...references.map((r) => r.value),
  ];
  const minY = Math.min(...allValues);
  const maxY = Math.max(...allValues);
  const padding = (maxY - minY) * 0.1 || 1;

  return (
    <div className="glass p-4">
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart
          data={chartData}
          margin={{ top: 8, right: 12, left: 8, bottom: 4 }}
        >
          <defs>
            <linearGradient id="iqrGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.cyan} stopOpacity={0.15} />
              <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid horizontal vertical={false} stroke={GRID_STROKE} />
          <XAxis
            dataKey="date"
            tickFormatter={xFmt}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minY - padding, maxY + padding]}
            allowDataOverflow
            tickFormatter={(v: number) => formatLapTime(v)}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            width={52}
            label={{
              value: "lap time",
              angle: -90,
              position: "insideLeft",
              offset: 4,
              style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" },
            }}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelFormatter={(label) => xFmt(String(label))}
            formatter={(value, name) => {
              if (name === "iqrBase" || name === "iqrRange") return [null, null];
              const labels: Record<string, string> = {
                medianLap: "Median",
                bestLap: "Best",
              };
              return [formatLapTime(Number(value)), labels[String(name)] ?? String(name)];
            }}
            cursor={{ stroke: "rgba(34, 211, 238, 0.3)", strokeWidth: 1 }}
          />
          {/* IQR band: invisible base stacked with visible range */}
          <Area
            type="monotone"
            dataKey="iqrBase"
            stackId="iqr"
            stroke="none"
            fill="transparent"
          />
          <Area
            type="monotone"
            dataKey="iqrRange"
            stackId="iqr"
            stroke="none"
            fill="url(#iqrGradient)"
            name="IQR band"
          />
          <Line
            type="monotone"
            dataKey="medianLap"
            stroke={COLORS.cyan}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: COLORS.cyan, stroke: "hsl(222, 47%, 5%)", strokeWidth: 2 }}
            name="Median"
          />
          <Scatter
            dataKey="bestLap"
            fill={COLORS.emerald}
            r={3}
            name="Best"
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
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm opacity-30" style={{ background: COLORS.cyan }} />
          <span className="text-muted-foreground">Middle 50%</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 border-t-2" style={{ borderColor: COLORS.cyan }} />
          <span className="text-muted-foreground">Median</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: COLORS.emerald }} />
          <span className="text-muted-foreground">Best</span>
        </span>
        {references.map((ref, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span
              className="inline-block w-4 border-t-2 border-dashed"
              style={{ borderColor: ref.color ?? "hsl(var(--muted-foreground))" }}
            />
            <span style={{ color: ref.color ?? "hsl(var(--muted-foreground))" }}>
              {ref.label} — {formatLapTime(ref.value)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
