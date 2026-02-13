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

type SessionTypePoint = {
  date: string;
  cornerIsolation: number;
  hotLaps: number;
  raceSim: number;
  mixed: number;
};

export function SessionTypeChart({ data }: { data: SessionTypePoint[] }) {
  if (!data.length) {
    return (
      <div className="glass p-6 text-xs text-muted-foreground">
        No session type data yet.
      </div>
    );
  }

  const maxY = Math.max(
    ...data.map((d) => d.cornerIsolation + d.hotLaps + d.raceSim + d.mixed)
  );

  return (
    <div className="glass p-4">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart
          data={data}
          margin={{ top: 8, right: 12, left: 8, bottom: 4 }}
        >
          <CartesianGrid horizontal vertical={false} stroke={GRID_STROKE} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, maxY * 1.1 || 1]}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            width={32}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelFormatter={(label) => "Week of " + formatDate(String(label))}
            formatter={(value, name) => {
              const labels: Record<string, string> = {
                cornerIsolation: "Corner isolation",
                hotLaps: "Hot laps",
                raceSim: "Race sim",
                mixed: "Mixed",
              };
              return [Number(value), labels[String(name)] ?? String(name)];
            }}
          />
          <Area
            type="monotone"
            dataKey="cornerIsolation"
            stackId="types"
            stroke={COLORS.cyan}
            fill={COLORS.cyan}
            fillOpacity={0.3}
            strokeWidth={1}
          />
          <Area
            type="monotone"
            dataKey="hotLaps"
            stackId="types"
            stroke={COLORS.emerald}
            fill={COLORS.emerald}
            fillOpacity={0.3}
            strokeWidth={1}
          />
          <Area
            type="monotone"
            dataKey="raceSim"
            stackId="types"
            stroke={COLORS.violet}
            fill={COLORS.violet}
            fillOpacity={0.3}
            strokeWidth={1}
          />
          <Area
            type="monotone"
            dataKey="mixed"
            stackId="types"
            stroke={COLORS.muted}
            fill={COLORS.muted}
            fillOpacity={0.2}
            strokeWidth={1}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs">
        {[
          { key: "cornerIsolation", label: "Corner isolation", color: COLORS.cyan },
          { key: "hotLaps", label: "Hot laps", color: COLORS.emerald },
          { key: "raceSim", label: "Race sim", color: COLORS.violet },
          { key: "mixed", label: "Mixed", color: COLORS.muted },
        ].map(({ key, label, color }) => (
          <span key={key} className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ background: color, opacity: 0.5 }}
            />
            <span className="text-muted-foreground">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
