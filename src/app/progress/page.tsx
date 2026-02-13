import { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { ProgressSummaryCard } from "@/components/cards/progress-summary-card";
import { GapChart } from "@/components/charts/gap-chart";
import { MultiTrackChart } from "@/components/charts/multi-track-chart";
import { MonthlyVolumeChart } from "@/components/charts/monthly-volume-chart";
import { CumulativeHoursChart } from "@/components/charts/cumulative-hours-chart";
import {
  mergeTrackTimeseries,
  mergeTrackByCumulativeHours,
  TRACK_SLUGS,
} from "@/lib/data";
import type {
  TimeseriesPoint,
  GapDataPoint,
  TrackSummary,
  TrackReference,
  SummaryData,
} from "@/lib/data";
import { COLORS } from "@/lib/chart-utils";

export const metadata: Metadata = {
  title: "progress",
  description: "Cross-track progress dashboard.",
};

const TRACKS = [
  { slug: "spa", label: "Spa-Francorchamps" },
  { slug: "monza-full", label: "Monza" },
  { slug: "nurburgring-gp", label: "Nürburgring GP" },
  { slug: "barcelona-gp", label: "Barcelona" },
];

const TRACK_CONFIGS = [
  { slug: "spa", label: "Spa", color: COLORS.violet },
  { slug: "monza-full", label: "Monza", color: COLORS.cyan },
  { slug: "nurburgring-gp", label: "Nürburgring", color: COLORS.orange },
  { slug: "barcelona-gp", label: "Barcelona", color: COLORS.emerald },
];

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

function computeTrend(series: TimeseriesPoint[]): "improving" | "flat" | "regressing" {
  if (series.length < 5) return "flat";
  const recent = series.slice(-5);
  const earlier = series.slice(-10, -5);
  if (!earlier.length) return "flat";
  const recentAvg = recent.reduce((s, p) => s + p.bestLap, 0) / recent.length;
  const earlierAvg = earlier.reduce((s, p) => s + p.bestLap, 0) / earlier.length;
  const diff = earlierAvg - recentAvg;
  if (diff > 0.3) return "improving";
  if (diff < -0.3) return "regressing";
  return "flat";
}

type DailyData = {
  date: string;
  durationHours: number;
};

function loadCumulativeHours(): { date: string; cumulativeHours: number }[] {
  const dailyDir = path.join(process.cwd(), "public", "data", "daily");
  if (!fs.existsSync(dailyDir)) return [];

  const files = fs.readdirSync(dailyDir).filter((f) => f.endsWith(".json")).sort();
  let cumulative = 0;
  const result: { date: string; cumulativeHours: number }[] = [];

  for (const file of files) {
    const data = JSON.parse(
      fs.readFileSync(path.join(dailyDir, file), "utf-8")
    ) as DailyData;
    cumulative += data.durationHours || 0;
    result.push({
      date: data.date,
      cumulativeHours: Math.round(cumulative * 100) / 100,
    });
  }

  return result;
}

export default function ProgressPage() {
  const summary = loadJson<SummaryData>("summary.json");
  const references = loadJson<Record<string, TrackReference>>("references.json") ?? {};

  const trackCards = TRACKS.map((track) => {
    const trackSummary = loadJson<TrackSummary>(`tracks/${track.slug}.json`);
    const series = loadJsonArray<TimeseriesPoint>(`tracks/${track.slug}-timeseries.json`);
    const gap = loadJsonArray<GapDataPoint>(`tracks/${track.slug}-gap.json`);
    const ref = references[track.slug];

    const latest = series.length ? series[series.length - 1] : null;
    const allTimeBest = series.length ? Math.min(...series.map((p) => p.bestLap)) : null;
    const latestGap = gap.length ? gap[gap.length - 1] : null;

    return {
      ...track,
      trackSummary,
      series,
      gap,
      latest,
      allTimeBest,
      latestGap,
      ref,
      trend: computeTrend(series),
    };
  });

  // Cross-track timeseries data (by date and by cumulative hours)
  const stdDev = mergeTrackByCumulativeHours(TRACK_SLUGS, "stdDev7d");
  const bestLap = mergeTrackByCumulativeHours(TRACK_SLUGS, "bestLap");
  const medianLap = mergeTrackByCumulativeHours(TRACK_SLUGS, "medianLap7d");
  const cumulativeHours = loadCumulativeHours();

  const hasGapData = trackCards.some((t) => t.gap.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-12">
        <h1 className="text-2xl font-bold mb-4">Progress</h1>
        <p className="text-muted-foreground text-sm">
          Am I getting better? This page answers that question with data.
          {summary && (
            <> {summary.totalHours}h across {summary.totalSessions} sessions so far.</>
          )}
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wider">
          Track overview
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Best is my all-time fastest clean lap. Gap is how far that is
          from the fastest known time for this car and track. Stddev
          (standard deviation) measures how spread out my laps are — lower
          means more consistent. The sparkline shows my recent daily best.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trackCards.map((track) => (
            <Link key={track.slug} href={`/progress/${track.slug}`}>
              {track.latest && track.allTimeBest ? (
                <ProgressSummaryCard
                  trackName={track.slug}
                  currentBest={track.allTimeBest}
                  gapToAlien={track.ref?.alienBest != null && track.allTimeBest != null
                    ? track.allTimeBest - track.ref.alienBest
                    : undefined}
                  currentStdDev={track.latest.stdDev}
                  trend={track.trend}
                  sparklineData={track.series.slice(-14).map((p) => ({ value: p.bestLap }))}
                />
              ) : (
                <div className="glass glass-hover p-4">
                  <h3 className="text-sm font-medium capitalize">
                    {track.label}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2">
                    No data yet
                  </p>
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {stdDev.byDate.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wider">
            Variance collapse
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            7-day rolling standard deviation across all four tracks. This is the
            primary signal — when these lines trend down, lap-to-lap consistency
            is improving. Lower is better. Toggle &quot;By hours&quot; to compare
            learning curves by practice time instead of calendar date.
          </p>
          <MultiTrackChart
            data={stdDev.byDate}
            hoursData={stdDev.byHours}
            tracks={TRACK_CONFIGS}
            format="seconds"
            yLabel="stddev"
          />
        </section>
      )}

      {bestLap.byDate.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wider">
            Best lap progression
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            My fastest clean lap each day. Shows whether raw speed is
            improving — every peak is a real lap I actually drove.
          </p>
          <MultiTrackChart
            data={bestLap.byDate}
            hoursData={bestLap.byHours}
            tracks={TRACK_CONFIGS}
            format="lapTime"
            yLabel="best"
          />
        </section>
      )}

      {medianLap.byDate.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wider">
            Median lap progression
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            7-day rolling median lap time — the &quot;typical&quot; lap. Median
            is more meaningful than best because it filters out lucky outliers
            and shows true repeatable pace.
          </p>
          <MultiTrackChart
            data={medianLap.byDate}
            hoursData={medianLap.byHours}
            tracks={TRACK_CONFIGS}
            format="lapTime"
            yLabel="median"
          />
        </section>
      )}

      {summary && summary.monthlyBreakdown && (
        <section className="mb-12">
          <h2 className="text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wider">
            Monthly practice volume
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Hours per month against the 100h target. The dashed red line is the
            goal — hitting it consistently is a prerequisite for meaningful
            improvement. Bars turn green when the target is met.
          </p>
          <MonthlyVolumeChart data={summary.monthlyBreakdown} targetHours={100} />
        </section>
      )}

      {cumulativeHours.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wider">
            Cumulative hours
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Running total of practice hours since the experiment started.
            Steady accumulation matters — large gaps disrupt motor learning
            consolidation.
          </p>
          <CumulativeHoursChart data={cumulativeHours} />
        </section>
      )}

      {hasGapData && (
        <section className="mb-12">
          <h2 className="text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wider">
            Gap to reference
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            How far my daily best lap is from the fastest known time
            (&quot;alien&quot;) and from competitive online pace (&quot;top
            split&quot;). When the line goes down, I&apos;m getting closer.
          </p>
          {trackCards
            .filter((t) => t.gap.length > 0)
            .map((track) => (
              <div key={track.slug} className="mb-6">
                <h3 className="text-xs text-muted-foreground mb-2 capitalize">
                  {track.label}
                </h3>
                <GapChart data={track.gap} />
              </div>
            ))}
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider">
          Track deep dives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trackCards.map((track) => (
            <Link
              key={track.slug}
              href={`/progress/${track.slug}`}
              className="glass glass-hover p-4"
            >
              <div className="text-sm font-medium capitalize">{track.label}</div>
              <div className="text-xs text-muted-foreground mt-2">
                {track.trackSummary
                  ? `${track.trackSummary.sessions} sessions, ${track.trackSummary.durationHours}h, ${track.trackSummary.laps} laps`
                  : "No data yet"}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <Link
          href="/progress/baselines"
          className="glass glass-hover p-4 block"
        >
          <div className="text-sm font-medium">Baseline runs</div>
          <div className="text-xs text-muted-foreground mt-1">
            Standardized 25-lap measurement sessions for tracking improvement
          </div>
        </Link>
      </section>
    </div>
  );
}
