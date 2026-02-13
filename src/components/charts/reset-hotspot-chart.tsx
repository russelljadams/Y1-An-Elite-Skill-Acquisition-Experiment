"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TOOLTIP_STYLE,
  GRID_STROKE,
  TICK_STYLE,
  COLORS,
} from "@/lib/chart-utils";
import type { Zone } from "@/lib/data";

type Bin = {
  startPct: number;
  endPct: number;
  count: number;
};

function labelBin(bin: Bin, zones?: Zone[]): string {
  if (zones) {
    const midPct = (bin.startPct + bin.endPct) / 2;
    const zone = zones.find((z) => midPct >= z.start && midPct < z.end);
    if (zone) {
      const pct = Math.round(bin.startPct * 100);
      return `${zone.name} (${pct}%)`;
    }
  }
  return `${Math.round(bin.startPct * 100)}%`;
}

export function ResetHotspotChart({
  bins,
  zones,
}: {
  bins: Bin[];
  zones?: Zone[];
}) {
  if (!bins.length) {
    return (
      <div className="glass p-6 text-xs text-muted-foreground">
        No reset data.
      </div>
    );
  }

  const chartData = bins.map((bin) => ({
    label: labelBin(bin, zones),
    count: bin.count,
  }));

  return (
    <div className="glass p-4">
      <ResponsiveContainer width="100%" height={Math.max(200, bins.length * 28)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
        >
          <CartesianGrid horizontal={false} vertical stroke={GRID_STROKE} />
          <XAxis
            type="number"
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            stroke={GRID_STROKE}
            width={100}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [Number(value), "resets"]}
          />
          <Bar
            dataKey="count"
            fill={COLORS.red}
            fillOpacity={0.7}
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
