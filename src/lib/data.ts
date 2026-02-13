import fs from "fs";
import path from "path";

export function loadJson<T>(relativePath: string): T | null {
  const fullPath = path.join(process.cwd(), "public", "data", relativePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(fullPath, "utf-8")) as T;
}

export function loadJsonArray<T>(relativePath: string): T[] {
  const fullPath = path.join(process.cwd(), "public", "data", relativePath);
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(fullPath, "utf-8")) as T[];
}

// ── Shared types ──────────────────────────────────────────────────

export type TimeseriesPoint = {
  date: string;
  bestLap: number;
  medianLap: number;
  stdDev: number;
  completeLaps: number;
  timedLaps: number;
  cleanRate: number;
  worstLap: number;
  p25: number;
  p75: number;
  iqr: number;
  bestLap7d?: number;
  medianLap7d?: number;
  stdDev7d?: number;
  cumulativeHours?: number;
};

export type IncidentDataPoint = {
  date: string;
  offTracks: number;
  spins: number;
  bigSaves: number;
  eventsPerLap: number;
  totalLaps: number;
};

export type GapDataPoint = {
  date: string;
  bestLap: number;
  gapToAlien?: number;
  gapToTopSplit?: number;
};

export type SectorDataPoint = {
  date: string;
  sectors: Record<string, { best: number; median: number; stddev: number }>;
};

export type SessionTypeDataPoint = {
  date: string;
  cornerIsolation: number;
  hotLaps: number;
  raceSim: number;
  mixed: number;
};

export type BaselineEntry = {
  date: string;
  sessionId: number;
  laps: number[];
  median: number;
  best: number;
  worst: number;
  stddev: number;
  iqr: number;
  p25: number;
  p75: number;
  cleanLapCount: number;
  sectors?: Record<string, { best: number; median: number }>;
};

export type Zone = {
  name: string;
  start: number;
  end: number;
};

export type TrackSummary = {
  track: string;
  sessions: number;
  durationHours: number;
  laps: number;
  resets: number;
  resetHotspotsBins: { startPct: number; endPct: number; count: number }[];
};

export type TrackReference = {
  alienBest: number | null;
  topSplit: number | null;
  source: string;
};

export type MonthlyBreakdown = {
  month: string;
  sessions: number;
  hours: number;
  laps: number;
};

export type SummaryData = {
  generatedAt: string;
  totalSessions: number;
  totalLaps: number;
  totalHours: number;
  totalResets: number;
  latestDay: string | null;
  monthlyBreakdown: MonthlyBreakdown[];
  jan2026Sessions: number;
  jan2026Hours: number;
  feb2026Sessions: number;
  feb2026Hours: number;
};

export type ReferenceMark = {
  value: number;
  label: string;
  color?: string;
};

// ── Constants ────────────────────────────────────────────────────

export const TRACK_SLUGS = [
  "spa",
  "monza-full",
  "nurburgring-gp",
  "barcelona-gp",
] as const;

// ── Utilities ────────────────────────────────────────────────────

export function mergeTrackTimeseries(
  slugs: readonly string[],
  field: keyof TimeseriesPoint
): Record<string, any>[] {
  const dateMap = new Map<string, Record<string, any>>();

  for (const slug of slugs) {
    const series = loadJsonArray<TimeseriesPoint>(
      `tracks/${slug}-timeseries.json`
    );
    for (const point of series) {
      const val = point[field];
      if (val == null) continue;
      if (!dateMap.has(point.date)) {
        dateMap.set(point.date, { date: point.date });
      }
      dateMap.get(point.date)![slug] = val;
    }
  }

  return Array.from(dateMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}

/**
 * Merge track timeseries by cumulative hours on each track.
 * Each track gets its own row per practice day, keyed by that track's
 * cumulative hours. Other tracks are null for that row.
 * Result is sorted by a synthetic index so lines don't cross.
 */
export function mergeTrackByCumulativeHours(
  slugs: readonly string[],
  field: keyof TimeseriesPoint
): { byHours: Record<string, any>[]; byDate: Record<string, any>[] } {
  const byHoursRows: Record<string, any>[] = [];

  for (const slug of slugs) {
    const series = loadJsonArray<TimeseriesPoint>(
      `tracks/${slug}-timeseries.json`
    );
    for (const point of series) {
      const val = point[field];
      if (val == null || point.cumulativeHours == null) continue;
      const row: Record<string, any> = {
        hours: point.cumulativeHours,
        date: point.date,
        _slug: slug,
      };
      row[slug] = val;
      byHoursRows.push(row);
    }
  }

  // Sort by hours across all tracks so the x-axis is monotonic
  byHoursRows.sort((a, b) => a.hours - b.hours);

  // Also build date-based for the toggle
  const dateMap = new Map<string, Record<string, any>>();
  for (const slug of slugs) {
    const series = loadJsonArray<TimeseriesPoint>(
      `tracks/${slug}-timeseries.json`
    );
    for (const point of series) {
      const val = point[field];
      if (val == null) continue;
      if (!dateMap.has(point.date)) {
        dateMap.set(point.date, { date: point.date });
      }
      dateMap.get(point.date)![slug] = val;
    }
  }
  const byDate = Array.from(dateMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return { byHours: byHoursRows, byDate };
}
