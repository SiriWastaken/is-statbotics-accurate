import { type Summary, verdict } from "@/lib/score";

const TONE = { "YES.": "text-yes", "KINDA.": "text-kinda", "NOT TODAY.": "text-no" };

export function Verdict({ eventKey, summary }: { eventKey: string; summary: Summary }) {
  const accuracy = summary.accuracy ?? 0;
  const headline = verdict(accuracy);
  const line = `It called ${summary.correct} of ${summary.total} matches correctly.`;

  return (
    <section aria-labelledby="verdict" className="verdict-in">
      <p className="font-mono text-sm text-muted">Was Statbotics accurate at {eventKey}?</p>
      <h2 id="verdict" className={`text-7xl leading-none font-black tracking-tight sm:text-9xl ${TONE[headline]}`}>
        {headline}
      </h2>
      <p className="mt-4 text-xl">{line}</p>
      <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-4">
        <Stat label="Accuracy" value={`${(accuracy * 100).toFixed(1)}%`} />
        <Stat label="Brier score" value={(summary.brier ?? 0).toFixed(3)} hint="lower is better" />
        <Stat label="Matches scored" value={String(summary.total)} />
      </dl>
      <p role="status" className="sr-only">
        Verdict for {eventKey}: {headline} {line}
      </p>
    </section>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <dt className="text-sm text-muted">
        {label}
        {hint && <span className="block text-xs">({hint})</span>}
      </dt>
      <dd className="font-mono text-2xl font-semibold">{value}</dd>
    </div>
  );
}
