"use client";

import { useState, useMemo } from "react";
import { ConsistencyBandChart } from "@/components/charts/consistency-band-chart";
import { VarianceChart } from "@/components/charts/variance-chart";
import { GapChart } from "@/components/charts/gap-chart";
import { ResetHotspotChart } from "@/components/charts/reset-hotspot-chart";
import { IncidentTrendChart } from "@/components/charts/incident-trend-chart";
import { LapTimeChart } from "@/components/charts/lap-time-chart";
import type { ReferenceMark, Zone } from "@/lib/data";

type AxisMode = "hours" | "date";

type BandPoint = {
  date: string;
  p25: number;
  p75: number;
  medianLap: number;
  bestLap: number;
};

type VariancePoint = { date: string; value: number; laps?: number };
type GapPoint = { date: string; gapToAlien?: number; gapToTopSplit?: number };
type IncidentPoint = {
  date: string;
  offTracks: number;
  spins: number;
  bigSaves: number;
  eventsPerLap: number;
  totalLaps: number;
};
type CleanRatePoint = { date: string; value: number };
type HoursEntry = { date: string; cumulativeHours: number };

export type TrackChartsWrapperProps = {
  bandData: BandPoint[];
  lapRefs: ReferenceMark[];
  dailyVariance: VariancePoint[];
  weeklyVariance: VariancePoint[];
  monthlyVariance: VariancePoint[];
  gap: GapPoint[];
  incidents: IncidentPoint[];
  cleanRateData: CleanRatePoint[];
  hoursMap: HoursEntry[];
  resetBins?: { startPct: number; endPct: number; count: number }[];
  zones?: Zone[];
};

function formatHoursLabel(v: string): string {
  const n = parseFloat(v);
  if (isNaN(n)) return v;
  return n.toFixed(1) + "h";
}

/**
 * Replace date values with cumulative hours strings, filtered by maxHours.
 */
function toHoursData<T extends { date: string }>(
  data: T[],
  dateToHours: Map<string, number>,
  maxHours: number
): T[] {
  const result: T[] = [];
  for (const item of data) {
    const hours = dateToHours.get(item.date);
    if (hours == null || hours > maxHours) continue;
    result.push({ ...item, date: String(hours) });
  }
  return result;
}

export function TrackChartsWrapper({
  bandData,
  lapRefs,
  dailyVariance,
  weeklyVariance,
  monthlyVariance,
  gap,
  incidents,
  cleanRateData,
  hoursMap,
  resetBins,
  zones,
}: TrackChartsWrapperProps) {
  const hasHours = hoursMap.length > 0;
  const [axisMode, setAxisMode] = useState<AxisMode>(hasHours ? "hours" : "date");

  const dateToHours = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of hoursMap) {
      map.set(entry.date, entry.cumulativeHours);
    }
    return map;
  }, [hoursMap]);

  const globalMaxHours = useMemo(() => {
    if (!hoursMap.length) return 0;
    return Math.ceil(Math.max(...hoursMap.map((e) => e.cumulativeHours)));
  }, [hoursMap]);

  const [maxHours, setMaxHours] = useState(globalMaxHours);

  const inHoursMode = axisMode === "hours" && hasHours;
  const formatX = inHoursMode ? formatHoursLabel : undefined;

  // Transform all data sets for hours mode
  const activeBandData = useMemo(
    () => (inHoursMode ? toHoursData(bandData, dateToHours, maxHours) : bandData),
    [inHoursMode, bandData, dateToHours, maxHours]
  );

  const activeDailyVariance = useMemo(
    () => (inHoursMode ? toHoursData(dailyVariance, dateToHours, maxHours) : dailyVariance),
    [inHoursMode, dailyVariance, dateToHours, maxHours]
  );

  const activeGap = useMemo(
    () => (inHoursMode ? toHoursData(gap, dateToHours, maxHours) : gap),
    [inHoursMode, gap, dateToHours, maxHours]
  );

  const activeIncidents = useMemo(
    () => (inHoursMode ? toHoursData(incidents, dateToHours, maxHours) : incidents),
    [inHoursMode, incidents, dateToHours, maxHours]
  );

  const activeCleanRate = useMemo(
    () => (inHoursMode ? toHoursData(cleanRateData, dateToHours, maxHours) : cleanRateData),
    [inHoursMode, cleanRateData, dateToHours, maxHours]
  );

  return (
    <>
      {/* Global hours/date toggle + slider */}
      {hasHours && (
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="flex rounded-full overflow-hidden border border-white/[0.12]">
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
          {inHoursMode && globalMaxHours > 0 && (
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <span className="text-xs text-muted-foreground whitespace-nowrap">First</span>
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
      )}

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-2">Lap times</h2>
        <p className="text-xs text-muted-foreground mb-4">
          The shaded band shows where my middle 50% of laps fall each day.
          A narrowing band means I&apos;m getting more consistent. The line
          is my median, the dots are my best lap each day.
          {lapRefs.length > 0 && (
            <> Dashed lines show reference pace &mdash; &quot;alien&quot; is the
            fastest known time for this car/track, &quot;top split&quot; is
            a competitive online pace.</>
          )}
        </p>
        <ConsistencyBandChart data={activeBandData} references={lapRefs} formatX={formatX} />
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-2">Spread</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Standard deviation &mdash; how spread out my laps are around the
          average, in seconds. Lower means more consistent. This is the
          core metric of the experiment: if deliberate practice works, this
          number should shrink over time.
        </p>
        <VarianceChart
          daily={activeDailyVariance}
          weekly={inHoursMode ? [] : weeklyVariance}
          monthly={inHoursMode ? [] : monthlyVariance}
          formatX={formatX}
        />
      </section>

      {activeGap.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-medium mb-2">Gap to reference</h2>
          <p className="text-xs text-muted-foreground mb-4">
            How far my best lap each day is from the fastest known time
            (alien) and from competitive online pace (top split). A
            shrinking gap means I&apos;m getting faster in absolute terms.
          </p>
          <GapChart data={activeGap} formatX={formatX} />
        </section>
      )}

      {resetBins && resetBins.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-medium mb-2">Reset hotspots</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Where on track I hit reset most often. High bars reveal corners
            I&apos;m actively drilling &mdash; most of my practice is resetting
            to repeat specific sections.
          </p>
          <ResetHotspotChart
            bins={resetBins}
            zones={zones && zones.length > 0 ? zones : undefined}
          />
        </section>
      )}

      {activeIncidents.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-medium mb-2">Incidents per lap</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Average number of iRacing-detected incidents (off-tracks, loss
            of control) per completed lap each day. Laps with incidents
            still count in all other metrics &mdash; this just tracks how often
            they happen.
          </p>
          <IncidentTrendChart data={activeIncidents} formatX={formatX} />
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-2">Clean lap rate</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Percentage of completed, iRacing-timed laps that were &quot;clean&quot;
          &mdash; meaning they finished with valid timing and fell within
          reasonable time bounds (no AFK or paused laps). A lap with
          incidents still counts as clean; only structural issues like
          missing timing exclude it.
        </p>
        <LapTimeChart
          data={activeCleanRate}
          yLabel="%"
          formatAsTime={false}
          formatX={formatX}
        />
      </section>
    </>
  );
}
