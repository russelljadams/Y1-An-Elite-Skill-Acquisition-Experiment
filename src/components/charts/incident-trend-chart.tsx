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

type IncidentPoint = {
  date: string;
  offTracks: number;
  spins: number;
  bigSaves: number;
  eventsPerLap: number;
  totalLaps: number;
};

export function IncidentTrendChart({ data, formatX }: { data: IncidentPoint[]; formatX?: (v: string) => string }) {
  const xFmt = formatX ?? formatDate;
  if (!data.length) {
    return (
      <div className="glass p-6 text-xs text-muted-foreground">
        No incident data yet.
      </div>
    );
  }

  const maxY = Math.max(...data.map((d) => d.eventsPerLap));
  const padding = maxY * 0.1 || 0.1;

  return (
    <div className="glass p-4">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 12, left: 8, bottom: 4 }}
        >
          <defs>
            <linearGradient id="incidentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.red} stopOpacity={0.15} />
              <stop offset="100%" stopColor={COLORS.red} stopOpacity={0} />
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
            domain={[0, maxY + padding]}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            width={36}
            tickFormatter={(v: number) => v.toFixed(1)}
            label={{
              value: "per lap",
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
              if (String(name) === "eventsPerLap") {
                return [Number(value).toFixed(2) + " / lap", "Incidents"];
              }
              return [Number(value), String(name)];
            }}
            cursor={{ stroke: "rgba(239, 68, 68, 0.3)", strokeWidth: 1 }}
          />
          <Line
            type="monotone"
            dataKey="eventsPerLap"
            stroke={COLORS.red}
            strokeWidth={2}
            dot={{ r: 3, fill: COLORS.red, stroke: "hsl(222, 47%, 5%)", strokeWidth: 1 }}
            activeDot={{ r: 5, fill: COLORS.red, stroke: "hsl(222, 47%, 5%)", strokeWidth: 2 }}
            name="Incidents per lap"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 border-t-2" style={{ borderColor: COLORS.red }} />
          <span className="text-muted-foreground">Incidents per lap (lower is better)</span>
        </span>
      </div>
    </div>
  );
}
