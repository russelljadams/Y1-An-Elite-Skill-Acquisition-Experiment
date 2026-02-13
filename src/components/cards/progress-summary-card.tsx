"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { formatLapTime, COLORS } from "@/lib/chart-utils";

type Trend = "improving" | "flat" | "regressing";

export function ProgressSummaryCard({
  trackName,
  currentBest,
  gapToAlien,
  currentStdDev,
  trend,
  sparklineData,
}: {
  trackName: string;
  currentBest: number;
  gapToAlien?: number;
  currentStdDev: number;
  trend: Trend;
  sparklineData?: { value: number }[];
}) {
  const trendIcon =
    trend === "improving" ? "\u2193" : trend === "regressing" ? "\u2191" : "\u2014";
  const trendColor =
    trend === "improving"
      ? "text-emerald-400"
      : trend === "regressing"
        ? "text-red-400"
        : "text-muted-foreground";

  return (
    <div className="glass glass-hover p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium capitalize">
          {trackName.replace(/-/g, " ")}
        </h3>
        <span className={`text-lg font-mono ${trendColor}`}>{trendIcon}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-lg font-mono font-semibold tracking-tight">
            {formatLapTime(currentBest)}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            best
          </div>
        </div>
        <div>
          <div className="text-lg font-mono font-semibold tracking-tight">
            {gapToAlien != null ? `+${gapToAlien.toFixed(1)}s` : "\u2014"}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            to alien
          </div>
        </div>
        <div>
          <div className="text-lg font-mono font-semibold tracking-tight">
            {currentStdDev.toFixed(2)}s
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            spread
          </div>
        </div>
      </div>

      {sparklineData && sparklineData.length > 1 && (
        <div className="h-[48px] -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={COLORS.cyan}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
