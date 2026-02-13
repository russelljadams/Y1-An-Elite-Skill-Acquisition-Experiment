import { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { TrackChartsWrapper } from "@/components/track-charts-wrapper";
import type {
  TimeseriesPoint,
  GapDataPoint,
  IncidentDataPoint,
  TrackSummary,
  TrackReference,
  Zone,
  ReferenceMark,
} from "@/lib/data";

type Params = {
  params: { track: string };
};

export function generateMetadata({ params }: Params): Metadata {
  return {
    title: params.track.replace(/-/g, " "),
    description: "Track-specific progress and metrics.",
  };
}

function loadJson<T>(relativePath: string): T | null {
  const fullPath = path.join(process.cwd(), "public", "data", relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return JSON.parse(fs.readFileSync(fullPath, "utf-8")) as T;
}

function loadJsonArray<T>(relativePath: string): T[] {
  const fullPath = path.join(process.cwd(), "public", "data", relativePath);
  if (!fs.existsSync(fullPath)) return [];
  return JSON.parse(fs.readFileSync(fullPath, "utf-8")) as T[];
}

export default function TrackPage({ params }: Params) {
  const slug = params.track;
  const summary = loadJson<TrackSummary>(`tracks/${slug}.json`);
  const series = loadJsonArray<TimeseriesPoint>(`tracks/${slug}-timeseries.json`);
  const weekly = loadJsonArray<TimeseriesPoint>(`tracks/${slug}-weekly.json`);
  const monthly = loadJsonArray<TimeseriesPoint>(`tracks/${slug}-monthly.json`);
  const gap = loadJsonArray<GapDataPoint>(`tracks/${slug}-gap.json`);
  const incidents = loadJsonArray<IncidentDataPoint>(`tracks/${slug}-incidents.json`);
  const zones = loadJsonArray<Zone>(`tracks/${slug}-zones.json`);
  const refs = loadJson<Record<string, TrackReference>>("references.json");
  const trackRef = refs?.[slug] ?? null;

  const lapRefs: ReferenceMark[] = [];
  if (trackRef?.alienBest) {
    lapRefs.push({ value: trackRef.alienBest, label: "Alien", color: "#ef4444" });
  }
  if (trackRef?.topSplit) {
    lapRefs.push({ value: trackRef.topSplit, label: "Top split", color: "#f59e0b" });
  }

  const bandData = series.map((p) => ({
    date: p.date,
    p25: p.p25,
    p75: p.p75,
    medianLap: p.medianLap,
    bestLap: p.bestLap,
  }));

  const cleanRateData = series.map((p) => ({
    date: p.date,
    value: Math.round((p.cleanRate ?? (p.timedLaps ? p.completeLaps / p.timedLaps : 1)) * 100),
  }));

  const hoursMap = series
    .filter((p) => p.cumulativeHours != null)
    .map((p) => ({ date: p.date, cumulativeHours: p.cumulativeHours! }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-12">
        <Link
          href="/progress"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          progress
        </Link>
        <h1 className="text-2xl font-bold mb-4 mt-8 capitalize">
          {summary?.track ?? slug.replace(/-/g, " ")}
        </h1>
        <p className="text-muted-foreground text-sm">
          Daily progress on clean, iRacing-validated laps.
          {trackRef?.source ? ` Reference: ${trackRef.source}` : ""}
        </p>
      </header>

      {summary ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Stat label="sessions" value={String(summary.sessions)} />
          <Stat label="hours" value={String(summary.durationHours)} />
          <Stat label="clean laps" value={String(summary.laps)} />
          <Stat label="resets" value={String(summary.resets)} />
        </div>
      ) : (
        <div className="glass p-6 text-sm mb-12">No data yet.</div>
      )}

      <TrackChartsWrapper
        bandData={bandData}
        lapRefs={lapRefs}
        dailyVariance={series.map((p) => ({ date: p.date, value: p.stdDev, laps: p.completeLaps }))}
        weeklyVariance={weekly.map((p) => ({ date: p.date, value: p.stdDev, laps: p.completeLaps }))}
        monthlyVariance={monthly.map((p) => ({ date: p.date, value: p.stdDev, laps: p.completeLaps }))}
        gap={gap}
        incidents={incidents}
        cleanRateData={cleanRateData}
        hoursMap={hoursMap}
        resetBins={summary?.resetHotspotsBins}
        zones={zones.length > 0 ? zones : undefined}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass glass-hover p-4 text-center">
      <div className="text-lg font-mono font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
