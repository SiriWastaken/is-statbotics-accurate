import { biggestUpsets, type ScoredMatch } from "@/lib/score";
import { label, pct, tone } from "./format";

export function Upsets({ matches }: { matches: ScoredMatch[] }) {
  const upsets = biggestUpsets(matches);

  return (
    <section aria-labelledby="upsets">
      <h2 id="upsets" className="text-2xl font-bold">
        Biggest upsets
      </h2>
      {upsets.length === 0 ? (
        <p className="mt-2 text-muted">None. Every favorite won.</p>
      ) : (
        <ol className="mt-3 divide-y divide-line rounded-lg border border-line">
          {upsets.map((m) => (
            <li key={m.key} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-3">
              <span className="font-mono font-semibold">Q{m.matchNumber}</span>
              <span className="text-sm">
                <span className="text-red">Red {pct(m.redWinProb)}</span>
                <span className="text-muted"> · </span>
                <span className="text-blue">Blue {pct(1 - m.redWinProb)}</span>
              </span>
              <span>
                <span className={tone(m.actual)}>{label(m.actual)}</span> won
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
