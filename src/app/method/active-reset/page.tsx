import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "active reset",
  description: "How instant repetition compresses feedback loops.",
};

export default function ActiveResetPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-16">
        <Link
          href="/method"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          method
        </Link>
        <h1 className="text-2xl font-bold mb-4 mt-8">Active reset</h1>
        <p className="text-muted-foreground text-sm">
          iRacing&apos;s instant teleport to any track position. The single
          feature that makes sim racing the best motor learning environment
          ever created.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">What active reset is</h2>
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            In iRacing, you can instantly teleport your car to any position on
            the track. No cool-down lap, no pit stop, no loading screen. You
            press a button and you&apos;re at the corner entry, car pointed in
            the right direction, at speed.
          </p>
          <p>
            Instead of completing a full 90-second lap to retry a single corner,
            you reset to the entry point. The corner that cost you time 8
            seconds ago? You&apos;re already attempting it again.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">
          The math of repetition density
        </h2>
        <div className="text-sm text-muted-foreground space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass p-4">
              <p className="text-xs mb-2">Full laps</p>
              <p>~90s per repetition</p>
              <p>~40 corner attempts per hour</p>
              <p className="text-foreground mt-2">
                Most of the lap is &quot;dead time&quot; — corners you
                already know
              </p>
            </div>
            <div className="glass p-4">
              <p className="text-xs mb-2">Active reset</p>
              <p>~8s per repetition</p>
              <p>~450 corner attempts per hour</p>
              <p className="text-foreground mt-2">
                11x increase in targeted repetition density
              </p>
            </div>
          </div>
          <p>
            That&apos;s not 11x more practice. It&apos;s 11x more practice
            on the thing that actually needs work. The distinction matters.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">
          Why feedback loop speed matters
        </h2>
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            Motor learning depends on the gap between attempt and correction.
            Shorter gaps keep the error signal fresh — your motor cortex is
            still processing what went wrong when the next attempt begins.
          </p>
          <p>
            With full laps, 80+ seconds pass between attempts at the same
            corner. The proprioceptive memory of the error has already begun
            to fade. You&apos;re partially re-discovering the problem each
            time instead of iterating on a solution.
          </p>
          <p>
            With active reset, the gap is 8 seconds. The feeling of
            over-rotating, braking too late, or missing the apex is still
            vivid when you try again. Each rep directly informs the next.
            This is what Ericsson means by &quot;immediate feedback.&quot;
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">
          Mapping to Ericsson&apos;s framework
        </h2>
        <div className="text-sm text-muted-foreground space-y-4">
          <p>
            Active reset doesn&apos;t just increase volume — it satisfies
            all four requirements for deliberate practice:
          </p>
          <div>
            <span className="text-foreground">Designed for improvement</span> —
            you choose the specific corner that needs work. No wasted reps on
            sections you&apos;ve already automated.
          </div>
          <div>
            <span className="text-foreground">Immediate feedback</span> —
            8-second loop means the error signal is still active when the
            next attempt begins. Telemetry confirms what you felt.
          </div>
          <div>
            <span className="text-foreground">
              Repetition with refinement
            </span>{" "}
            — high volume, but each rep is informed by the last. You&apos;re
            not mindlessly repeating — you&apos;re adjusting one variable at a
            time.
          </div>
          <div>
            <span className="text-foreground">Mental engagement</span> —
            corner isolation at high rep density is cognitively exhausting.
            Focus degrades after 20-30 minutes. That&apos;s a feature, not a
            bug — it means you&apos;re operating at the edge of ability.
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">
          The corner isolation protocol
        </h2>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>1. Identify the worst corner from telemetry or variance data</p>
          <p>2. Set the reset point at the corner entry</p>
          <p>
            3. Run 20-30 reps focusing on one variable — brake point, turn-in
            timing, throttle application, or line
          </p>
          <p>
            4. Review telemetry after the block — compare traces, check
            consistency
          </p>
          <p>
            5. Stabilize — once the correction feels automatic, run 10 more
            reps to confirm
          </p>
          <p>
            6. Test in full laps — does the improvement hold when you arrive
            at the corner from the previous section?
          </p>
          <p className="text-xs mt-3">
            One variable at a time. If you change braking and line
            simultaneously, you can&apos;t isolate which change helped. The
            scientific method applies to driving too.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">When not to reset</h2>
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            Active reset is isolation. It&apos;s surgery, not exercise. You
            also need:
          </p>
          <div>
            <span className="text-foreground">Full laps</span> — integration
            testing. Can you link corners together? Does the fix in Turn 3
            survive the adrenaline of Turn 2?
          </div>
          <div>
            <span className="text-foreground">Baselines</span> — measurement.
            Standardized 25-lap runs under controlled conditions. The only
            honest measure of current ability.
          </div>
          <div>
            <span className="text-foreground">Stints</span> — endurance.
            Can you maintain technique for 15-20 consecutive laps? Fatigue
            reveals what isn&apos;t truly automated yet.
          </div>
          <p className="text-xs">
            The protocol balances all three: reset for targeted improvement,
            full laps for integration, baselines for measurement.
          </p>
        </div>
      </section>

      <footer className="mt-16 pt-8 border-t border-white/[0.06] flex justify-between">
        <Link
          href="/method/deliberate-practice"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          deliberate practice
        </Link>
        <Link
          href="/method/variance-collapse"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          variance collapse
        </Link>
      </footer>
    </div>
  );
}
