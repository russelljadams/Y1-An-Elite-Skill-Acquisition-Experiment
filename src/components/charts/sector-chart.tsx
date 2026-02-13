"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  formatLapTime,
  TOOLTIP_STYLE,
  GRID_STROKE,
  TICK_STYLE,
  COLORS,
} from "@/lib/chart-utils";

type SectorBarData = {
  sectorName: string;
  [dateKey: string]: string | number;
};

const DATE_COLORS = [COLORS.cyan, COLORS.emerald, COLORS.violet, COLORS.amber, COLORS.orange];

export function SectorChart({
  data,
  dateKeys,
}: {
  data: SectorBarData[];
  dateKeys: string[];
}) {
  if (!data.length || !dateKeys.length) {
    return (
      <div className="glass p-6 text-xs text-muted-foreground">
        No sector data yet.
      </div>
    );
  }

  const allValues = data.flatMap((d) =>
    dateKeys.map((k) => (typeof d[k] === "number" ? (d[k] as number) : 0))
  ).filter((v) => v > 0);
  const minY = Math.min(...allValues);
  const maxY = Math.max(...allValues);
  const padding = (maxY - minY) * 0.15 || 1;

  return (
    <div className="glass p-4">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 12, left: 8, bottom: 4 }}
        >
          <CartesianGrid horizontal vertical={false} stroke={GRID_STROKE} />
          <XAxis
            dataKey="sectorName"
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
          />
          <YAxis
            domain={[Math.max(0, minY - padding), maxY + padding]}
            tickFormatter={(v: number) => formatLapTime(v)}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            width={52}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value, name) => [
              formatLapTime(Number(value)),
              String(name),
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
          />
          {dateKeys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={DATE_COLORS[i % DATE_COLORS.length]}
              fillOpacity={0.7}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
