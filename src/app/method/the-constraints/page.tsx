import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "the constraints",
  description: "Why one car and four tracks accelerates learning.",
};

export default function ConstraintsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-16">
        <Link
          href="/method"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          method
        </Link>
        <h1 className="text-2xl font-bold mb-4 mt-8">The constraints</h1>
        <p className="text-muted-foreground text-sm">
          One car. Four tracks. 12 months. These aren&apos;t limitations —
          they&apos;re the mechanism. Constraints eliminate noise and force
          depth.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">Why one car</h2>
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            Every car has different brake feel, throttle response, weight
            transfer. Switching means constantly re-calibrating instead of
            refining. The Porsche 911 GT3 Cup is rear-engine, rear-wheel-drive
            — it punishes lazy throttle application and rewards precise weight
            transfer management. No downforce crutch.
          </p>
          <p>
            The 911 Cup Car is also the one-make series standard — Porsche
            Carrera Cup, Supercup, and Esports Supercup all use it. Every hour
            of practice maps directly to the car used in the real-world feeder
            series. And with one car, there&apos;s no &quot;maybe a different
            car suits me better&quot; excuse. Improvement has to come from
            the driver.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">Why four tracks</h2>
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            Learning follows phases: orientation (1-2h), rapid improvement
            (5-10h), plateau (10-50h), mastery (100+h). Most people switch
            tracks at the plateau, chasing the dopamine of early gains. They
            never reach the deeper phase where real skill develops.
          </p>
          <p>
            Staying on the same tracks forces you to confront your variance
            honestly. You can&apos;t hide inconsistency in novelty. Same
            corner, over and over, reveals every gap.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">The four tracks</h2>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            <span className="text-foreground">Spa-Francorchamps</span> —
            elevation changes, Eau Rouge commitment, every corner type. Porsche
            Supercup, GTWC Endurance Cup, iRacing 24h. Team RedLine&apos;s backyard.
          </p>
          <p>
            <span className="text-foreground">Monza</span> — extreme braking
            from 300+ kph into tight chicanes. Supercup season finale, GTWC
            Endurance Cup. The polar opposite of Spa.
          </p>
          <p>
            <span className="text-foreground">N&uuml;rburgring GP</span> —
            balanced mid-speed flowing sections with elevation. GTWC Endurance
            Cup. Verstappen and Team RedLine won the iRacing 24h here.
          </p>
          <p>
            <span className="text-foreground">Barcelona</span> — the test
            track. Sustained high-speed corners, tire management, setup
            compromise. Porsche Supercup + GTWC both years.
          </p>
          <p className="text-xs">
            All appear on real-world Porsche Supercup or GTWC Europe calendars.
            Every braking zone type covered. Every speed range. Elevation from
            dramatic (Spa) to flat (Monza).
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">Holding the line</h2>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Constraint drift is the main risk. &quot;Just this one new
            track&quot; or &quot;different car for variety, just one
            session.&quot; Each exception seems harmless. Accumulated, they
            destroy the experiment.
          </p>
          <p>
            Boredom is expected, not a signal to change. Plateaus are expected —
            push through with better practice quality. 12 months isn&apos;t
            forever.
          </p>
        </div>
      </section>

      <footer className="mt-16 pt-8 border-t border-white/[0.06] flex justify-between">
        <Link
          href="/method/variance-collapse"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          variance collapse
        </Link>
        <Link
          href="/method"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          method
        </Link>
      </footer>
    </div>
  );
}
