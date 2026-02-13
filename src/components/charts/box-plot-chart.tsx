"use client";

import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ErrorBar,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  formatLapTime,
  TOOLTIP_STYLE,
  GRID_STROKE,
  TICK_STYLE,
  COLORS,
} from "@/lib/chart-utils";

type BoxData = {
  label: string;
  min: number;
  p25: number;
  median: number;
  p75: number;
  max: number;
};

export function BoxPlotChart({ data }: { data: BoxData[] }) {
  if (!data.length) {
    return (
      <div className="glass p-6 text-xs text-muted-foreground">
        No baseline data yet.
      </div>
    );
  }

  // Build chart data: bar from p25 to p75 (base = p25, height = iqr)
  const chartData = data.map((d) => ({
    ...d,
    iqrBase: d.p25,
    iqr: d.p75 - d.p25,
    lowerWhisker: d.p25 - d.min,
    upperWhisker: d.max - d.p75,
  }));

  const allValues = data.flatMap((d) => [d.min, d.max]);
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
          <CartesianGrid horizontal vertical={false} stroke={GRID_STROKE} />
          <XAxis
            dataKey="label"
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
          />
          <YAxis
            domain={[minY - padding, maxY + padding]}
            tickFormatter={(v: number) => formatLapTime(v)}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            width={52}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value, name, props) => {
              const d = props.payload as BoxData;
              if (name === "iqrBase") return [null, null];
              return [
                `Best: ${formatLapTime(d.min)} | P25: ${formatLapTime(d.p25)} | Med: ${formatLapTime(d.median)} | P75: ${formatLapTime(d.p75)} | Worst: ${formatLapTime(d.max)}`,
                "Distribution",
              ];
            }}
          />
          {/* Invisible base bar to offset the IQR box */}
          <Bar dataKey="iqrBase" stackId="box" fill="transparent" />
          {/* Visible IQR box */}
          <Bar dataKey="iqr" stackId="box" radius={[4, 4, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS.cyan} fillOpacity={0.4} stroke={COLORS.cyan} strokeWidth={1} />
            ))}
            <ErrorBar
              dataKey="upperWhisker"
              direction="y"
              width={8}
              stroke={COLORS.cyan}
              strokeWidth={1.5}
            />
          </Bar>
          {/* Median line as reference lines per bar */}
          {data.map((d, i) => (
            <ReferenceLine
              key={i}
              y={d.median}
              stroke={COLORS.cyan}
              strokeWidth={2}
              strokeDasharray="4 2"
              segment={[
                { x: i - 0.3, y: d.median },
                { x: i + 0.3, y: d.median },
              ]}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-muted-foreground">
        <span>Box = IQR (p25-p75), whisker = max, dashed = median</span>
      </div>
    </div>
  );
}
