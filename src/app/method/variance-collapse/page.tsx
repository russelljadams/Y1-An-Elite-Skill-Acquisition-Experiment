import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "variance collapse",
  description: "Why consistency matters more than peak performance.",
};

export default function VarianceCollapsePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-16">
        <Link
          href="/method"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          method
        </Link>
        <h1 className="text-2xl font-bold mb-4 mt-8">Variance collapse</h1>
        <p className="text-muted-foreground text-sm">
          Your worst laps matter more than your best. Anyone can get lucky once.
          Elite drivers are consistent.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">The core idea</h2>
        <div className="text-sm text-muted-foreground space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass p-4">
              <p className="text-xs mb-2">Amateur pattern</p>
              <p>Best: 1:42.5 / Typical: 1:44.2 / Worst: 1:47.0</p>
              <p className="text-foreground mt-2">Range: 4.5s</p>
            </div>
            <div className="glass p-4">
              <p className="text-xs mb-2">Expert pattern</p>
              <p>Best: 1:42.0 / Typical: 1:42.4 / Worst: 1:43.0</p>
              <p className="text-foreground mt-2">Range: 1.0s</p>
            </div>
          </div>
          <p>
            The expert is only 0.5s faster on their best lap. But 4.0s better
            on their worst. That difference is dominance.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">Why variance matters</h2>
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            Worst laps determine position more than best laps. One bad corner
            costs multiple positions.
          </p>
          <p>
            Best laps often include luck. Worst laps reveal gaps that luck
            can&apos;t cover.
          </p>
          <p>
            Low variance means the skill is internalized and automatic. High
            variance means you&apos;re still consciously managing.
          </p>
          <p>
            Lap times can plateau while variance shrinks. That&apos;s real
            improvement even if the number on screen doesn&apos;t change.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">Measurement</h2>
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            <span className="text-foreground">Standard deviation</span> —
            measures typical deviation from the mean. Lower is more consistent.
            This is the primary metric I track.
          </p>
          <p>
            <span className="text-foreground">IQR</span> — interquartile
            range. Middle 50% of laps. Ignores outliers.
          </p>
          <p>
            <span className="text-foreground">Range</span> — best minus worst.
            Simple but sensitive to single outliers.
          </p>
          <p className="text-xs">
            What to track: lap time variance across sessions, sector variance
            (which sector swings most?), session-to-session reproducibility.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">The collapse process</h2>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>1. Identify high-variance zones from sector or corner data</p>
          <p>
            2. Diagnose the cause — usually inconsistent braking, sloppy
            turn-in, or reactive exit corrections
          </p>
          <p>
            3. Create anchor points — physical or visual references that make
            inputs repeatable
          </p>
          <p>
            4. Drill to stability — repeated runs hitting anchors. Not fast,
            correct. Speed comes from repeatability
          </p>
          <p>
            5. Test under load — stable in isolation, then full laps, then
            stints, then traffic
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">Variance vs speed</h2>
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            Focus on consistency first. Build a reliable baseline (low variance,
            not necessarily fast). Push speed in one area. Stabilize at the new
            level. Push the next area.
          </p>
          <p className="text-xs">
            Pushing speed before variance is controlled means building on an
            unstable foundation. Gains won&apos;t stick.
          </p>
        </div>
      </section>

      <footer className="mt-16 pt-8 border-t border-white/[0.06] flex justify-between">
        <Link
          href="/method/active-reset"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          active reset
        </Link>
        <Link
          href="/method/the-constraints"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          the constraints
        </Link>
      </footer>
    </div>
  );
}
