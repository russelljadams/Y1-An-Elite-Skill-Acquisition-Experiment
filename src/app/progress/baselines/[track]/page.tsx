import { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { BoxPlotChart } from "@/components/charts/box-plot-chart";
import { SectorChart } from "@/components/charts/sector-chart";
import { LapTimeChart } from "@/components/charts/lap-time-chart";
import type { BaselineEntry } from "@/lib/data";

type Params = {
  params: { track: string };
};

export function generateMetadata({ params }: Params): Metadata {
  return {
    title: `${params.track.replace(/-/g, " ")} baselines`,
    description: "Baseline measurement sessions for this track.",
  };
}

function loadBaselines(slug: string): BaselineEntry[] {
  const fullPath = path.join(process.cwd(), "public", "data", "baselines", `${slug}.json`);
  if (!fs.existsSync(fullPath)) return [];
  return JSON.parse(fs.readFileSync(fullPath, "utf-8")) as BaselineEntry[];
}

function formatLapTime(s: number): string {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs.toFixed(1).padStart(4, "0")}`;
}

export default function BaselineTrackPage({ params }: Params) {
  const slug = params.track;
  const baselines = loadBaselines(slug);

  const boxData = baselines.map((b) => ({
    label: b.date,
    min: b.best,
    p25: b.p25,
    median: b.median,
    p75: b.p75,
    max: b.worst,
  }));

  // Sector comparison across baselines
  const allSectorNames = new Set<string>();
  baselines.forEach((b) => {
    if (b.sectors) Object.keys(b.sectors).forEach((s) => allSectorNames.add(s));
  });
  const dateKeys = baselines.filter((b) => b.sectors).map((b) => b.date);
  const sectorData = Array.from(allSectorNames).map((sectorName) => {
    const row: { sectorName: string; [k: string]: string | number } = { sectorName };
    baselines.forEach((b) => {
      if (b.sectors?.[sectorName]) {
        row[b.date] = b.sectors[sectorName].median;
      }
    });
    return row;
  });

  // Latest baseline: lap-by-lap scatter
  const latest = baselines.length ? baselines[baselines.length - 1] : null;
  const lapScatterData = latest
    ? latest.laps.map((t, i) => ({ date: String(i + 1), value: t }))
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-12">
        <Link
          href="/progress/baselines"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          baselines
        </Link>
        <h1 className="text-2xl font-bold mb-4 mt-8 capitalize">
          {slug.replace(/-/g, " ")} baselines
        </h1>
        <p className="text-muted-foreground text-sm">
          {baselines.length} baseline session{baselines.length !== 1 ? "s" : ""} recorded.
        </p>
        <div className="mt-6 glass p-4 text-xs text-muted-foreground space-y-2">
          <p className="font-medium text-foreground text-sm">Reading the numbers</p>
          <p>
            <strong>Median</strong> — sort all 20 laps from fastest to
            slowest. The one in the middle is the median. It shows my
            typical pace without being thrown off by one freak lap.
          </p>
          <p>
            <strong>Stddev</strong> (standard deviation) — how much my lap
            times bounce around. It&apos;s roughly the average amount each
            lap differs from my typical lap. If my median is 1:42 and
            stddev is 0.5s, most laps land between 1:41.5 and 1:42.5.
            Lower is better — it means I&apos;m hitting the same marks
            every lap.
          </p>
          <p>
            <strong>IQR</strong> (interquartile range) — another way to
            measure consistency. Take my 20 laps, throw out the fastest 5
            and the slowest 5. The IQR is the time gap across the 10 that
            remain. Unlike stddev, one terrible lap won&apos;t blow it up.
            Lower is better.
          </p>
          <p>
            <strong>Best / Worst</strong> — my single fastest and slowest
            clean laps in the session.
          </p>
        </div>
      </header>

      {!baselines.length ? (
        <div className="glass p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No baseline sessions for this track yet.
          </p>
        </div>
      ) : (
        <>
          {/* 1. Distribution by baseline */}
          <section className="mb-12">
            <h2 className="text-sm font-medium mb-2">Distribution by baseline</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Each box shows the spread of lap times in a single baseline
              session. The box is the middle 50%, the line inside is the
              median, and the whiskers reach the fastest and slowest laps.
              Smaller boxes = more consistent.
            </p>
            <BoxPlotChart data={boxData} />
          </section>

          {/* 2. Median trend */}
          {baselines.length >= 2 && (
            <section className="mb-12">
              <h2 className="text-sm font-medium mb-2">Median trend</h2>
              <p className="text-xs text-muted-foreground mb-4">
                My median (middle) lap time across baseline sessions. This
                is a better measure of typical pace than best lap, because
                it ignores outliers.
              </p>
              <LapTimeChart
                data={baselines.map((b) => ({ date: b.date, value: b.median }))}
                yLabel="median"
              />
            </section>
          )}

          {/* 3. Stddev trend */}
          {baselines.length >= 2 && (
            <section className="mb-12">
              <h2 className="text-sm font-medium mb-2">Consistency trend (stddev)</h2>
              <p className="text-xs text-muted-foreground mb-4">
                How much my lap times vary within each baseline session.
                Standard deviation (stddev) is basically the average
                amount each lap differs from my typical lap. If my median
                is 1:42 and stddev is 0.5s, most laps are between 1:41.5
                and 1:42.5. Lower is better — it means I&apos;m hitting
                the same marks lap after lap instead of being fast one lap
                and slow the next.
              </p>
              <LapTimeChart
                data={baselines.map((b) => ({ date: b.date, value: b.stddev }))}
                yLabel="stddev"
                formatAsTime={false}
              />
            </section>
          )}

          {/* 4. Best lap trend */}
          {baselines.length >= 2 && (
            <section className="mb-12">
              <h2 className="text-sm font-medium mb-2">Best lap trend</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Fastest single lap from each baseline session. Shows raw
                pace improvement — what I&apos;m capable of on my best lap.
              </p>
              <LapTimeChart
                data={baselines.map((b) => ({ date: b.date, value: b.best }))}
                yLabel="best"
              />
            </section>
          )}

          {/* 5. IQR trend */}
          {baselines.length >= 2 && (
            <section className="mb-12">
              <h2 className="text-sm font-medium mb-2">IQR trend</h2>
              <p className="text-xs text-muted-foreground mb-4">
                IQR (interquartile range) measures the gap between my
                faster-half laps and slower-half laps. If you sorted all 20
                laps and threw out the fastest 5 and slowest 5, the IQR is
                the range of what&apos;s left. It&apos;s another way to
                measure consistency, but unlike stddev it ignores extreme
                outliers — so one terrible lap won&apos;t skew it. Lower is
                better.
              </p>
              <LapTimeChart
                data={baselines.map((b) => ({ date: b.date, value: b.iqr }))}
                yLabel="IQR"
                formatAsTime={false}
              />
            </section>
          )}

          {/* 6. Sector comparison */}
          {sectorData.length > 0 && dateKeys.length > 0 && (
            <section className="mb-12">
              <h2 className="text-sm font-medium mb-2">Sector comparison</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Median time per track sector across baselines. Shows which
                parts of the track I&apos;m improving on and which are
                stalling.
              </p>
              <SectorChart data={sectorData} dateKeys={dateKeys} />
            </section>
          )}

          {/* 7. Stats table */}
          <section className="mb-12">
            <h2 className="text-sm font-medium mb-2">All baselines</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Every number from every baseline session. The{" "}
              <strong>&Delta;</strong> columns show the change from the
              previous baseline — green means improvement.
            </p>
            <div className="glass p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground">
                    <th className="text-left py-2">Date</th>
                    <th className="text-right py-2">Laps</th>
                    <th className="text-right py-2">Best</th>
                    <th className="text-right py-2">Median</th>
                    <th className="text-right py-2">Worst</th>
                    <th className="text-right py-2">Stddev</th>
                    <th className="text-right py-2">IQR</th>
                    <th className="text-right py-2">&Delta; Median</th>
                    <th className="text-right py-2">&Delta; Stddev</th>
                  </tr>
                </thead>
                <tbody>
                  {baselines.map((b, i) => {
                    const prev = i > 0 ? baselines[i - 1] : null;
                    const dMedian = prev ? b.median - prev.median : null;
                    const dStddev = prev ? b.stddev - prev.stddev : null;
                    return (
                      <tr key={b.date} className="border-t border-white/[0.06]">
                        <td className="py-2">{b.date}</td>
                        <td className="py-2 text-right font-mono">{b.cleanLapCount}</td>
                        <td className="py-2 text-right font-mono">{formatLapTime(b.best)}</td>
                        <td className="py-2 text-right font-mono">{formatLapTime(b.median)}</td>
                        <td className="py-2 text-right font-mono">{formatLapTime(b.worst)}</td>
                        <td className="py-2 text-right font-mono">{b.stddev.toFixed(2)}s</td>
                        <td className="py-2 text-right font-mono">{b.iqr.toFixed(2)}s</td>
                        <td className={`py-2 text-right font-mono ${
                          dMedian === null ? "" : dMedian < 0 ? "text-emerald-400" : "text-red-400"
                        }`}>
                          {dMedian !== null
                            ? `${dMedian > 0 ? "+" : ""}${dMedian.toFixed(2)}s`
                            : "—"}
                        </td>
                        <td className={`py-2 text-right font-mono ${
                          dStddev === null ? "" : dStddev < 0 ? "text-emerald-400" : "text-red-400"
                        }`}>
                          {dStddev !== null
                            ? `${dStddev > 0 ? "+" : ""}${dStddev.toFixed(2)}s`
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* 8. Latest baseline lap-by-lap */}
          {latest && (
            <section className="mb-12">
              <h2 className="text-sm font-medium mb-2">
                Latest baseline ({latest.date}) — lap by lap
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Every lap from the most recent baseline run. Best is the
                fastest single lap, median is the middle lap, spread is how
                much variation there is across all laps.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="glass p-3 text-center">
                  <div className="text-sm font-mono font-semibold">
                    {formatLapTime(latest.best)}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase">best</div>
                </div>
                <div className="glass p-3 text-center">
                  <div className="text-sm font-mono font-semibold">
                    {formatLapTime(latest.median)}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase">median</div>
                </div>
                <div className="glass p-3 text-center">
                  <div className="text-sm font-mono font-semibold">
                    {latest.stddev.toFixed(2)}s
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase">spread</div>
                </div>
              </div>
              <LapTimeChart
                data={lapScatterData}
                yLabel="lap time"
              />
            </section>
          )}
        </>
      )}
    </div>
  );
}
