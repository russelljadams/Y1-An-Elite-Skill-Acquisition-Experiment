import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "method",
  description: "The protocol: car, tracks, practice methods, and baseline testing.",
};

export default function MethodPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-16">
        <h1 className="text-2xl font-bold mb-4">The method</h1>
        <p className="text-muted-foreground text-sm">
          How this experiment works. One car, four tracks, structured practice,
          and public data. Everything below is the protocol I follow every
          session.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">The protocol</h2>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Porsche 911 GT3 Cup, exclusively. Four tracks locked for 12 months:
            Spa, Monza, N&uuml;rburgring GP, Barcelona. Three-phase scheduling
            based on motor learning research (increasing contextual interference).
            Active reset for corner isolation. Warm tires only for measurement.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">Why constraints</h2>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Constraints eliminate noise and force depth. Most people switch
            tracks at the plateau, chasing the dopamine of early gains. Staying
            on the same tracks forces you to confront your variance honestly.
          </p>
          <Link
            href="/method/the-constraints"
            className="inline-block text-xs text-[hsl(var(--accent))] hover:underline"
          >
            Deep dive: the constraints
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">Deliberate practice</h2>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Not &quot;practicing a lot.&quot; A specific type of practice that
            produces expert performance: designed for improvement, immediate
            feedback, repetition with refinement, and mental engagement. Most
            practice doesn&apos;t qualify.
          </p>
          <Link
            href="/method/deliberate-practice"
            className="inline-block text-xs text-[hsl(var(--accent))] hover:underline"
          >
            Deep dive: deliberate practice
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">Active reset</h2>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            iRacing&apos;s instant teleport to any track position. Instead of
            completing a 90-second lap to retry one corner, reset to the entry
            point. 11x increase in targeted repetition density. This is the
            mechanism that compresses feedback loops from minutes to seconds.
          </p>
          <Link
            href="/method/active-reset"
            className="inline-block text-xs text-[hsl(var(--accent))] hover:underline"
          >
            Deep dive: active reset
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">Variance collapse</h2>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            The main signal I track. Your worst laps matter more than your best.
            Elite drivers are consistent. If my standard deviation shrinks over
            months, the protocol is working.
          </p>
          <Link
            href="/method/variance-collapse"
            className="inline-block text-xs text-[hsl(var(--accent))] hover:underline"
          >
            Deep dive: variance collapse
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">Baseline protocol</h2>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            The Standard 25: 5 warm-up laps followed by 20 measurement laps
            under fixed conditions. No resets, no corner isolation, just drive.
            The resulting distribution (median, IQR, stddev) is the ground truth
            snapshot of current ability at that track.
          </p>
          <p>
            Baselines are run periodically to measure progress independent of
            session-to-session variance. They answer: &quot;Am I actually
            getting better, or just having good days?&quot;
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium mb-4">Deep dives</h2>
        <div className="space-y-2">
          <DocLink
            href="/method/deliberate-practice"
            title="Deliberate practice"
            desc="The Ericsson framework. Why most practice fails."
          />
          <DocLink
            href="/method/active-reset"
            title="Active reset"
            desc="How instant repetition compresses feedback loops."
          />
          <DocLink
            href="/method/variance-collapse"
            title="Variance collapse"
            desc="Why consistency matters more than peak performance."
          />
          <DocLink
            href="/method/the-constraints"
            title="The constraints"
            desc="Why one car and four tracks accelerates learning."
          />
        </div>
      </section>
    </div>
  );
}

function DocLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="block py-3 border-b border-white/[0.06] hover:text-foreground text-muted-foreground transition-colors text-sm"
    >
      <span className="text-foreground">{title}</span>
      <span className="text-xs ml-4">{desc}</span>
    </Link>
  );
}
