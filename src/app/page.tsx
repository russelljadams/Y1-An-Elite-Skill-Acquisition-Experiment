import Link from "next/link";
import fs from "fs";
import path from "path";
import type { SummaryData, TimeseriesPoint } from "@/lib/data";

function loadSummary(): SummaryData | null {
  const summaryPath = path.join(process.cwd(), "public", "data", "summary.json");
  if (!fs.existsSync(summaryPath)) return null;
  return JSON.parse(fs.readFileSync(summaryPath, "utf-8")) as SummaryData;
}

function loadTrackProgress(slug: string): { latest: TimeseriesPoint; allTimeBest: number } | null {
  const p = path.join(process.cwd(), "public", "data", "tracks", `${slug}-timeseries.json`);
  if (!fs.existsSync(p)) return null;
  const arr = JSON.parse(fs.readFileSync(p, "utf-8")) as TimeseriesPoint[];
  if (!arr.length) return null;
  const allTimeBest = Math.min(...arr.map((pt) => pt.bestLap));
  return { latest: arr[arr.length - 1], allTimeBest };
}

function formatLapTime(s: number): string {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs.toFixed(1).padStart(4, "0")}`;
}

function getCurrentMonthHours(summary: SummaryData): { hours: number; month: string } | null {
  if (!summary.monthlyBreakdown?.length) return null;
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const entry = summary.monthlyBreakdown.find((m) => m.month === currentMonth);
  const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  return { hours: entry?.hours ?? 0, month: monthName };
}

const TRACKS = [
  { slug: "monza-full", label: "Monza" },
  { slug: "silverstone-2019-gp", label: "Silverstone" },
  { slug: "suzuka-grandprix", label: "Suzuka" },
  { slug: "spa-2024-bike", label: "Spa" },
];

export default function Home() {
  const summary = loadSummary();
  const trackProgress = TRACKS.map((t) => ({
    ...t,
    progress: loadTrackProgress(t.slug),
  }));
  const currentMonth = summary ? getCurrentMonthHours(summary) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/[0.07] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-violet-500/[0.05] rounded-full blur-3xl pointer-events-none" />

      <section className="mb-16 relative">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            Deliberate Practice
          </span>
          <br />
          <span className="text-foreground">in Sim Racing</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
          A 12-month experiment in mastery acquisition. One car, four tracks,
          100 hours of deliberate practice per month. Every session recorded,
          every lap measured, every insight published. The question: can
          structured, feedback-rich practice produce expert performance in an
          adult with zero prior experience?
        </p>
      </section>

      {currentMonth && (
        <section className="mb-16">
          <div className="glass p-5">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                {currentMonth.month}
              </span>
              <span className="text-sm font-mono">
                {currentMonth.hours.toFixed(1)}h{" "}
                <span className="text-muted-foreground">/ 100h</span>
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((currentMonth.hours / 100) * 100, 100)}%`,
                  backgroundColor:
                    currentMonth.hours >= 100
                      ? "hsl(160, 84%, 39%)"
                      : "hsl(187, 80%, 53%)",
                }}
              />
            </div>
          </div>
        </section>
      )}

      {summary && (
        <section className="mb-16">
          <h2 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider">
            Current status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="hours" value={String(summary.totalHours)} />
            <StatCard label="sessions" value={String(summary.totalSessions)} />
            <StatCard label="laps" value={String(summary.totalLaps)} />
            <StatCard
              label="latest"
              value={summary.latestDay ?? "\u2014"}
            />
          </div>
        </section>
      )}

      {trackProgress.some((t) => t.progress) && (
        <section className="mb-16">
          <h2 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider">
            Current best
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {trackProgress.map((track) =>
              track.progress ? (
                <Link
                  key={track.slug}
                  href={`/progress/${track.slug}`}
                  className="glass glass-hover p-4"
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {track.label}
                  </div>
                  <div className="text-lg font-mono font-semibold tracking-tight">
                    {formatLapTime(track.progress.allTimeBest)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    stddev {track.progress.latest.stdDev.toFixed(2)}s
                  </div>
                </Link>
              ) : (
                <div key={track.slug} className="glass p-4">
                  <div className="text-xs text-muted-foreground mb-1">
                    {track.label}
                  </div>
                  <div className="text-sm text-muted-foreground">No data</div>
                </div>
              )
            )}
          </div>
        </section>
      )}

      <section className="mb-16">
        <h2 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider">
          What I&apos;m measuring
        </h2>
        <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
          <p>
            The main signal is variance collapse — whether my lap time standard
            deviation shrinks over weeks and months. I also track best lap
            trends, sector consistency, and session-to-session retention.
          </p>
          <p>
            Speed matters, but consistency matters more. A fast outlier lap
            tells you less than a tight cluster of laps.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider">
          Explore
        </h2>
        <div className="space-y-1 text-sm">
          <NavLink
            href="/method"
            label="method"
            desc="the protocol — deliberate practice, active reset, variance collapse"
          />
          <NavLink
            href="/progress"
            label="progress"
            desc="am I getting better? charts and metrics"
          />
          <NavLink
            href="/log"
            label="log"
            desc="daily session history"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass glass-hover p-4">
      <div className="text-2xl font-mono font-semibold tracking-tight">
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function NavLink({
  href,
  label,
  desc,
}: {
  href: string;
  label: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="flex gap-4 py-2 hover:text-foreground text-muted-foreground transition-colors group"
    >
      <span className="w-24 group-hover:text-[hsl(var(--accent))] transition-colors">
        {label}
      </span>
      <span className="text-muted-foreground">&mdash; {desc}</span>
    </Link>
  );
}
