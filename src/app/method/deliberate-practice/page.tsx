import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "deliberate practice",
  description: "The Ericsson framework. Why most practice fails.",
};

function Cite({ n }: { n: number }) {
  return (
    <sup className="text-xs text-[hsl(var(--accent))]">[{n}]</sup>
  );
}

export default function DeliberatePracticePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-16">
        <Link
          href="/method"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          method
        </Link>
        <h1 className="text-2xl font-bold mb-4 mt-8">Deliberate practice</h1>
        <p className="text-muted-foreground text-sm">
          Term coined by K. Anders Ericsson.<Cite n={1} /> Not &quot;practicing a lot&quot; — a
          specific type of practice that produces expert performance. Most
          practice doesn&apos;t qualify.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">
          The 10,000 hour problem
        </h2>
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            Gladwell popularized the number.<Cite n={2} /> Ericsson was frustrated by the
            misrepresentation.<Cite n={5} /> The point was never about hours — it was about
            what you do during those hours. 10,000 hours of comfortable
            repetition builds nothing. Shorter periods of focused, difficult,
            feedback-rich practice build everything.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">Four requirements</h2>
        <div className="text-sm text-muted-foreground space-y-4">
          <div>
            <span className="text-foreground">Designed for improvement</span> —
            not repetition of things you can already do. Every session targets a
            specific weakness and pushes beyond current ability.<Cite n={1} />
          </div>
          <div>
            <span className="text-foreground">Immediate feedback</span> —
            without it, you reinforce whatever you happen to be doing.<Cite n={6} /> In sim
            racing, telemetry is the mechanism: real-time delta, trace overlay,
            input comparison.
          </div>
          <div>
            <span className="text-foreground">Repetition with refinement</span>{" "}
            — high volume, but each rep informs the next. Not mindless
            repetition — deliberate adjustment based on the previous result.<Cite n={5} />
          </div>
          <div>
            <span className="text-foreground">Mental engagement</span> —
            cognitively exhausting. If it feels comfortable, it&apos;s not
            deliberate practice.<Cite n={1} />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">
          Why most practice fails
        </h2>
        <div className="text-sm text-muted-foreground space-y-3">
          <div>
            <span className="text-foreground">Comfort zone trap</span> — once
            adequate, continuing feels productive but builds nothing. Fix:
            always practice at the edge of ability.<Cite n={5} />
          </div>
          <div>
            <span className="text-foreground">No feedback loop</span> —
            &quot;feel&quot; without measurement. No objective evidence of
            change. Fix: measure everything measurable.
          </div>
          <div>
            <span className="text-foreground">Wrong target</span> — practicing
            the wrong thing hard. &quot;More laps&quot; is often the wrong
            answer. Fix: diagnose first, then prescribe.
          </div>
          <div>
            <span className="text-foreground">Volume without intensity</span> —
            long sessions where focus degrades. Fix: shorter, higher-intensity.
            Stop when focus drops.<Cite n={6} />
          </div>
          <div>
            <span className="text-foreground">Novelty addiction</span> —
            constant switching resets the learning curve. Fix: constrain the
            environment. Depth over breadth.<Cite n={4} />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">The neuroscience</h2>
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            Myelination — myelin sheath thickens around frequently-fired
            pathways.<Cite n={3} /> Signal transmission becomes faster and more reliable. This
            is what people call &quot;muscle memory.&quot;
          </p>
          <p>
            Pathway strengthening — neurons that fire together wire together.
            Connections strengthen with repetition.<Cite n={4} />
          </p>
          <p>
            Cognitive load reduction — automated skills require less conscious
            attention, freeing working memory for higher-level decisions.
          </p>
          <p className="text-xs">
            This adaptation only happens when challenged. Repeating things you
            can already do triggers no significant adaptation.<Cite n={1} />
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">
          Application to sim racing
        </h2>
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            Active reset changes everything. Instant reset to track means rep
            density that physical practice can&apos;t match. Run a corner 50
            times while real-world driving allows 10 laps.
          </p>
          <p>
            Session structure matters: 60-90 minute sessions of focused
            practice, 1-2 hour break between sessions, stop when sharpness
            drops. Ericsson found the daily ceiling for complex motor skills
            is 2-4 hours across multiple sessions.<Cite n={1} />
          </p>
          <p>
            Sleep is where consolidation happens. Walker et al. showed a single
            night of sleep produced 17-20% motor speed improvement that more
            practice could not replicate.<Cite n={7} /> Spacing sessions across
            days beats cramming the same volume into marathon sessions.<Cite n={8} />
          </p>
          <p>
            Corner work: one corner per session. Reset, attempt, telemetry
            check. One variable at a time. Stable in isolation, then test in
            full laps, then test under pressure.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">
          Practice scheduling science
        </h2>
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            This experiment uses a three-phase increasing contextual
            interference schedule based on Porter &amp; Magill (2010).<Cite n={9} />{" "}
            Their research showed that gradually increasing task mixing
            beat both pure blocked AND pure interleaved practice.
          </p>
          <p>
            <span className="text-foreground">Phase 1 (Months 1-3)</span> —
            primarily blocked practice. Concentrated sessions on each track to
            build the initial motor representation. You need something to
            &quot;reconstruct&quot; before interleaving benefits kick in.<Cite n={10} />
          </p>
          <p>
            <span className="text-foreground">Phase 2 (Months 4-7)</span> —
            serial rotation. Predictable weekly rotation across all 4 tracks.
            Inter-task comparisons forced by mixing create more elaborate
            memory traces.<Cite n={11} />
          </p>
          <p>
            <span className="text-foreground">Phase 3 (Months 8-12)</span> —
            full interleaving. Random track ordering. The forgetting-reconstruction
            mechanism strengthens each return to a track.<Cite n={12} />
          </p>
          <p>
            Schmidt&apos;s schema theory (1975): practicing the same skill
            class under varied conditions (4 different tracks) builds stronger
            generalized motor programs than grinding one track.<Cite n={13} />
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium mb-3">References</h2>
        <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
          <li>
            Ericsson, K.A., Krampe, R.T., &amp; Tesch-Romer, C. (1993). The
            role of deliberate practice in the acquisition of expert
            performance. <em>Psychological Review</em>, 100(3), 363-406.
          </li>
          <li>
            Gladwell, M. (2008).{" "}
            <em>Outliers: The Story of Success</em>. Little, Brown and Company.
          </li>
          <li>
            Fields, R.D. (2008). White matter matters.{" "}
            <em>Scientific American</em>, 298(3), 54-61.
          </li>
          <li>
            Coyle, D. (2009). <em>The Talent Code</em>. Bantam Books.
          </li>
          <li>
            Ericsson, K.A. &amp; Pool, R. (2016).{" "}
            <em>Peak: Secrets from the New Science of Expertise</em>. Houghton
            Mifflin Harcourt.
          </li>
          <li>
            Ericsson, K.A. (2006).{" "}
            <em>
              The Cambridge Handbook of Expertise and Expert Performance
            </em>
            . Cambridge University Press.
          </li>
          <li>
            Walker, M.P. et al. (2002). Practice with sleep makes perfect.{" "}
            <em>Neuron</em>, 35, 205-211.
          </li>
          <li>
            Shea, C.H. et al. (2000). Spacing practice sessions across days
            benefits the learning of motor skills.{" "}
            <em>Human Movement Science</em>, 19, 737-760.
          </li>
          <li>
            Porter, J.M. &amp; Magill, R.A. (2010). Systematically increasing
            contextual interference is beneficial for learning sport skills.{" "}
            <em>Journal of Sports Sciences</em>, 28(12), 1277-1285.
          </li>
          <li>
            Magill, R.A. &amp; Hall, K.G. (1990). A review of the contextual
            interference effect in motor skill acquisition.{" "}
            <em>Human Movement Science</em>, 9, 241-289.
          </li>
          <li>
            Shea, J.B. &amp; Morgan, R.L. (1979). Contextual interference
            effects on the acquisition, retention, and transfer of a motor
            skill. <em>J. Exp. Psych.: Human Learning and Memory</em>, 5(2),
            179-187.
          </li>
          <li>
            Lee, T.D. &amp; Magill, R.A. (1983). The locus of contextual
            interference in motor-skill acquisition.{" "}
            <em>J. Exp. Psych.: Learning, Memory, and Cognition</em>, 9,
            730-746.
          </li>
          <li>
            Schmidt, R.A. (1975). A schema theory of discrete motor skill
            learning. <em>Psychological Review</em>, 82(4), 225-260.
          </li>
        </ol>
      </section>

      <footer className="mt-16 pt-8 border-t border-white/[0.06] flex justify-between">
        <Link
          href="/method"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          method
        </Link>
        <Link
          href="/method/active-reset"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          active reset
        </Link>
      </footer>
    </div>
  );
}
