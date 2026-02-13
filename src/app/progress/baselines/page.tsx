import { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { LapTimeChart } from "@/components/charts/lap-time-chart";
import type { BaselineEntry } from "@/lib/data";

export const metadata: Metadata = {
  title: "baselines",
  description: "Standardized baseline measurement sessions.",
};

const TRACKS = [
  { slug: "monza-full", label: "Monza Full" },
  { slug: "silverstone-2019-gp", label: "Silverstone 2019 Gp" },
  { slug: "suzuka-grandprix", label: "Suzuka" },
  { slug: "spa-2024-bike", label: "Spa 2024 Bike" },
];

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

export default function BaselinesPage() {
  const trackBaselines = TRACKS.map((track) => ({
    ...track,
    baselines: loadBaselines(track.slug),
  }));

  const hasAny = trackBaselines.some((t) => t.baselines.length > 0);
  const tracksWithMultiple = trackBaselines.filter((t) => t.baselines.length >= 2);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-12">
        <Link
          href="/progress"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          progress
        </Link>
        <h1 className="text-2xl font-bold mb-4 mt-8">Baseline runs</h1>
        <p className="text-muted-foreground text-sm">
          A baseline is a standardized measurement session — same car, same
          track, same conditions, 5 warm-up laps then 20 timed laps. By
          repeating this periodically, I can compare apples to apples and
          see real improvement (or lack of it) independent of daily
          variation.
        </p>
        <div className="mt-6 glass p-4 text-xs text-muted-foreground space-y-2">
          <p className="font-medium text-foreground text-sm">Reading the numbers</p>
          <p>
            <strong>Median</strong> — sort all 20 laps from fastest to
            slowest. The one in the middle is the median. It shows typical
            pace without being thrown off by one freak lap.
          </p>
          <p>
            <strong>Stddev</strong> (standard deviation) — how much lap
            times bounce around. It&apos;s roughly the average amount each
            lap differs from the typical lap. If my median is 1:42 and
            stddev is 0.5s, most laps land between 1:41.5 and 1:42.5.
            Lower is better — it means hitting the same marks every lap.
          </p>
          <p>
            <strong>IQR</strong> (interquartile range) — another way to
            measure consistency. Take 20 laps, throw out the fastest 5 and
            the slowest 5. The IQR is the time gap across the 10 that
            remain. Unlike stddev, one terrible lap won&apos;t blow it up.
            Lower is better.
          </p>
          <p>
            <strong>Spread</strong> on the track cards below refers to
            stddev — how much laps vary within that session.
          </p>
        </div>
      </header>

      {!hasAny ? (
        <div className="glass p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No baselines recorded yet. Place baseline sessions in the{" "}
            <code className="text-xs">baselines/</code> subfolder and run the
            pipeline.
          </p>
        </div>
      ) : (
        <>
          <section className="mb-12">
            <h2 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider">
              Latest baseline per track
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trackBaselines.map((track) => {
                const latest = track.baselines.length
                  ? track.baselines[track.baselines.length - 1]
                  : null;
                return (
                  <Link
                    key={track.slug}
                    href={`/progress/baselines/${track.slug}`}
                    className="glass glass-hover p-4"
                  >
                    <h3 className="text-sm font-medium">{track.label}</h3>
                    {latest ? (
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-sm font-mono font-semibold">
                            {formatLapTime(latest.median)}
                          </div>
                          <div className="text-[10px] text-muted-foreground uppercase">
                            median
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-mono font-semibold">
                            {latest.stddev.toFixed(2)}s
                          </div>
                          <div className="text-[10px] text-muted-foreground uppercase">
                            spread
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-mono font-semibold">
                            {latest.cleanLapCount}
                          </div>
                          <div className="text-[10px] text-muted-foreground uppercase">
                            laps
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-2">
                        No baseline yet
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      {latest ? latest.date : ""}{" "}
                      {track.baselines.length > 1
                        ? `(${track.baselines.length} baselines)`
                        : ""}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {tracksWithMultiple.length > 0 && (
            <section className="mb-12">
              <h2 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider">
                Cross-track median trend
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Median lap time across baseline sessions. The median is the
                middle lap when you sort all laps fastest to slowest — it
                shows my typical pace without being skewed by one lucky or
                one terrible lap.
              </p>
              <div className="space-y-4">
                {tracksWithMultiple.map((track) => (
                  <div key={track.slug}>
                    <div className="text-xs text-muted-foreground mb-1">{track.label}</div>
                    <LapTimeChart
                      data={track.baselines.map((b) => ({
                        date: b.date,
                        value: b.median,
                      }))}
                      yLabel="median"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {tracksWithMultiple.length > 0 && (
            <section className="mb-12">
              <h2 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider">
                Cross-track consistency trend
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                How much my lap times vary within each baseline session.
                Measured as standard deviation (stddev) — think of it as
                the average amount each lap differs from the typical lap.
                A stddev of 0.5s means most laps land within half a second
                of my median. Lower is better — it means I&apos;m driving
                the same line and hitting the same marks lap after lap.
              </p>
              <div className="space-y-4">
                {tracksWithMultiple.map((track) => (
                  <div key={track.slug}>
                    <div className="text-xs text-muted-foreground mb-1">{track.label}</div>
                    <LapTimeChart
                      data={track.baselines.map((b) => ({
                        date: b.date,
                        value: b.stddev,
                      }))}
                      yLabel="stddev"
                      formatAsTime={false}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mb-12">
            <h2 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider">
              Full stats
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Every number from every baseline session. See{" "}
              <em>Reading the numbers</em> above for what each column
              means. The <strong>&Delta;</strong> columns show the change
              from the previous baseline — green means improvement.
            </p>
            <div className="space-y-6">
              {trackBaselines
                .filter((t) => t.baselines.length > 0)
                .map((track) => (
                  <div key={track.slug} className="glass p-4">
                    <h3 className="text-sm font-medium mb-3">{track.label}</h3>
                    <div className="overflow-x-auto">
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
                          {track.baselines.map((b, i) => {
                            const prev = i > 0 ? track.baselines[i - 1] : null;
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
                  </div>
                ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
