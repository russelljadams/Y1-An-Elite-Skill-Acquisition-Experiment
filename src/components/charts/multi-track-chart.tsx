"use client";

import { useMemo, useState } from "react";
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
  formatLapTime,
  TOOLTIP_STYLE,
  GRID_STROKE,
  TICK_STYLE,
} from "@/lib/chart-utils";

export type TrackConfig = {
  slug: string;
  label: string;
  color: string;
};

type FormatMode = "lapTime" | "seconds";
type AxisMode = "hours" | "date";

type MultiTrackChartProps = {
  data: Record<string, any>[];
  hoursData?: Record<string, any>[];
  tracks: TrackConfig[];
  format: FormatMode;
  yLabel?: string;
  height?: number;
};

function formatValue(v: number, mode: FormatMode): string {
  if (mode === "lapTime") return formatLapTime(v);
  return v.toFixed(2) + "s";
}

function CustomTooltip({
  active,
  payload,
  label,
  tracks,
  visibleTracks,
  format,
  axisMode,
}: any) {
  if (!active || !payload?.length) return null;

  const dataPoint = payload[0]?.payload;
  if (!dataPoint) return null;

  return (
    <div style={TOOLTIP_STYLE}>
      <div className="text-muted-foreground mb-1.5" style={{ fontSize: 11 }}>
        {axisMode === "hours" ? (
          <>
            {Number(label).toFixed(1)}h
            {dataPoint.date && (
              <span className="ml-2">({formatDate(String(dataPoint.date))})</span>
            )}
          </>
        ) : (
          formatDate(String(label))
        )}
      </div>
      {tracks
        .filter((t: TrackConfig) => visibleTracks.has(t.slug) && dataPoint[t.slug] != null)
        .map((t: TrackConfig) => (
          <div key={t.slug} className="flex items-center justify-between gap-4" style={{ fontSize: 12 }}>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: t.color }}
              />
              <span className="text-muted-foreground">{t.label}</span>
            </span>
            <span className="font-mono" style={{ color: t.color }}>
              {formatValue(dataPoint[t.slug], format)}
            </span>
          </div>
        ))}
    </div>
  );
}

export function MultiTrackChart({
  data,
  hoursData,
  tracks,
  format,
  yLabel,
  height = 340,
}: MultiTrackChartProps) {
  const hasHoursData = hoursData && hoursData.length > 0;
  const [axisMode, setAxisMode] = useState<AxisMode>(hasHoursData ? "hours" : "date");
  const [visibleTracks, setVisibleTracks] = useState<Set<string>>(
    () => new Set(tracks.map((t) => t.slug))
  );

  // Compute max hours across all data for the slider range
  const globalMaxHours = useMemo(() => {
    if (!hoursData?.length) return 0;
    return Math.ceil(Math.max(...hoursData.map((d) => d.hours ?? 0)));
  }, [hoursData]);

  const [maxHours, setMaxHours] = useState(globalMaxHours);

  // Filter hours data by the slider value
  const filteredHoursData = useMemo(() => {
    if (!hoursData?.length) return [];
    return hoursData.filter((d) => d.hours <= maxHours);
  }, [hoursData, maxHours]);

  const chartData = axisMode === "hours" && hasHoursData ? filteredHoursData : data;

  if (!chartData || !chartData.length) {
    return (
      <div className="glass p-6 text-xs text-muted-foreground">
        No data yet.
      </div>
    );
  }

  function toggleTrack(slug: string) {
    setVisibleTracks((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }

  // Compute Y domain from visible tracks only
  const allValues: number[] = [];
  for (const point of chartData) {
    for (const track of tracks) {
      if (visibleTracks.has(track.slug) && point[track.slug] != null) {
        allValues.push(point[track.slug]);
      }
    }
  }
  const minY = allValues.length ? Math.min(...allValues) : 0;
  const maxY = allValues.length ? Math.max(...allValues) : 1;
  const padding = (maxY - minY) * 0.1 || 0.5;

  const xDataKey = axisMode === "hours" ? "hours" : "date";
  const xTickFormatter =
    axisMode === "hours"
      ? (v: number) => `${v}h`
      : (v: string) => formatDate(v);

  return (
    <div className="glass p-4">
      {/* Controls row: axis toggle + track toggles */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {hasHoursData && (
          <div className="flex rounded-full overflow-hidden border border-white/[0.12] mr-2">
            <button
              onClick={() => setAxisMode("hours")}
              className={`px-3 py-1 text-xs font-medium transition-all ${
                axisMode === "hours"
                  ? "bg-white/[0.12] text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              By hours
            </button>
            <button
              onClick={() => setAxisMode("date")}
              className={`px-3 py-1 text-xs font-medium transition-all ${
                axisMode === "date"
                  ? "bg-white/[0.12] text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              By date
            </button>
          </div>
        )}
        {tracks.map((track) => {
          const isActive = visibleTracks.has(track.slug);
          return (
            <button
              key={track.slug}
              onClick={() => toggleTrack(track.slug)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={
                isActive
                  ? {
                      backgroundColor: track.color,
                      color: "#fff",
                    }
                  : {
                      backgroundColor: "transparent",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "hsl(var(--muted-foreground))",
                    }
              }
            >
              {!isActive && (
                <span
                  className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: track.color }}
                />
              )}
              {track.label}
            </button>
          );
        })}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 12, left: 8, bottom: 4 }}
        >
          <CartesianGrid horizontal vertical={false} stroke={GRID_STROKE} />
          <XAxis
            dataKey={xDataKey}
            tickFormatter={xTickFormatter as any}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            interval="preserveStartEnd"
            type={axisMode === "hours" ? "number" : "category"}
            domain={axisMode === "hours" ? [0, maxHours] : undefined}
          />
          <YAxis
            domain={[minY - padding, maxY + padding]}
            tickFormatter={(v: number) => formatValue(v, format)}
            tick={TICK_STYLE}
            stroke={GRID_STROKE}
            width={52}
            label={
              yLabel
                ? {
                    value: yLabel,
                    angle: -90,
                    position: "insideLeft",
                    offset: 4,
                    style: {
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    },
                  }
                : undefined
            }
          />
          <Tooltip
            content={
              <CustomTooltip
                tracks={tracks}
                visibleTracks={visibleTracks}
                format={format}
                axisMode={axisMode}
              />
            }
            cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
          />
          {tracks
            .filter((t) => visibleTracks.has(t.slug))
            .map((track) => (
              <Line
                key={track.slug}
                type="monotone"
                dataKey={track.slug}
                stroke={track.color}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: track.color,
                  stroke: "hsl(222, 47%, 5%)",
                  strokeWidth: 2,
                }}
                connectNulls
              />
            ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Hours range slider — only in hours mode */}
      {axisMode === "hours" && globalMaxHours > 0 && (
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            First
          </span>
          <input
            type="range"
            min={1}
            max={globalMaxHours}
            value={maxHours}
            onChange={(e) => setMaxHours(Number(e.target.value))}
            className="flex-1 h-1 accent-cyan-400 cursor-pointer"
          />
          <span className="text-xs font-mono text-foreground whitespace-nowrap w-10 text-right">
            {maxHours}h
          </span>
        </div>
      )}
    </div>
  );
}
