"use client";

import {
  LineChart,
  Line,
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

type GapPoint = {
  date: string;
  gapToAlien?: number;
  gapToTopSplit?: number;
};

export function GapChart({ data, formatX }: { data: GapPoint[]; formatX?: (v: string) => string }) {
  const xFmt = formatX ?? formatDate;
  if (!data.length) {
    return (
      <div className="glass p-6 text-xs text-muted-foreground">
        No reference data available.
      </div>
    );
  }

  const hasAlien = data.some((d) => d.gapToAlien != null);
  const hasTopSplit = data.some((d) => d.gapToTopSplit != null);

  const allValues = [
    ...(hasAlien ? data.filter((d) => d.gapToAlien != null).map((d) => d.gapToAlien!) : []),
    ...(hasTopSplit ? data.filter((d) => d.gapToTopSplit != null).map((d) => d.gapToTopSplit!) : []),
  ];
  const maxY = Math.max(...allValues);
  const minY = Math.min(...allValues, 0);
  const padding = (maxY - minY) * 0.1 || 0.5;

  return (
    <div className="glass p-4">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 12, left: 8, bottom: 4 }}
        >
          <CartesianGrid horizontal vertical={false} stroke={GRID_STROKE} />
          <XAxis
            dataKey="date"
            tickFormatter={xFmt}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[Math.max(0, minY - padding), maxY + padding]}
            tickFormatter={(v: number) => v.toFixed(1) + "s"}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            width={44}
            label={{
              value: "gap (s)",
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
              const labels: Record<string, string> = {
                gapToAlien: "Gap to alien",
                gapToTopSplit: "Gap to top split",
              };
              return [Number(value).toFixed(2) + "s", labels[String(name)] ?? String(name)];
            }}
            cursor={{ stroke: "rgba(139, 92, 246, 0.3)", strokeWidth: 1 }}
          />
          {hasAlien && (
            <Line
              type="monotone"
              dataKey="gapToAlien"
              stroke={COLORS.violet}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: COLORS.violet, stroke: "hsl(222, 47%, 5%)", strokeWidth: 2 }}
              connectNulls
            />
          )}
          {hasTopSplit && (
            <Line
              type="monotone"
              dataKey="gapToTopSplit"
              stroke={COLORS.amber}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: COLORS.amber, stroke: "hsl(222, 47%, 5%)", strokeWidth: 2 }}
              connectNulls
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs">
        {hasAlien && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-4 border-t-2" style={{ borderColor: COLORS.violet }} />
            <span style={{ color: COLORS.violet }}>Gap to alien</span>
          </span>
        )}
        {hasTopSplit && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-4 border-t-2" style={{ borderColor: COLORS.amber }} />
            <span style={{ color: COLORS.amber }}>Gap to top split</span>
          </span>
        )}
      </div>
    </div>
  );
}
