"use client";

import { useState } from "react";
import type { ScoredMatch } from "@/lib/score";
import { label, pct, tone } from "./format";

type SortKey = "match" | "confidence";

export function MatchTable({ matches }: { matches: ScoredMatch[] }) {
  const [sort, setSort] = useState<SortKey>("match");
  const rows = sort === "match" ? matches : [...matches].sort((a, b) => b.confidence - a.confidence);

  const header = (key: SortKey, text: string, direction: "ascending" | "descending") => (
    <th scope="col" aria-sort={sort === key ? direction : "none"} className="p-0">
      <button
        type="button"
        onClick={() => setSort(key)}
        className="w-full px-3 py-2 text-left font-semibold whitespace-nowrap hover:text-fg"
      >
        {text} {sort === key ? (direction === "ascending" ? "↑" : "↓") : ""}
      </button>
    </th>
  );

  return (
    <details className="rounded-lg border border-line">
      <summary className="cursor-pointer p-3 font-semibold">All {matches.length} matches</summary>
      <div tabIndex={0} role="region" aria-label="All qualification matches" className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Every scored qualification match. Sort by match number or confidence.</caption>
          <thead className="border-y border-line text-muted">
            <tr>
              {header("match", "Match", "ascending")}
              <th scope="col" className="px-3 py-2 whitespace-nowrap">
                Predicted
              </th>
              {header("confidence", "Win %", "descending")}
              <th scope="col" className="px-3 py-2 whitespace-nowrap">
                Actual
              </th>
              <th scope="col" className="px-3 py-2 whitespace-nowrap">
                Correct
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((m) => (
              <tr key={m.key}>
                <th scope="row" className="px-3 py-2 font-mono font-normal">
                  Q{m.matchNumber}
                </th>
                <td className={`px-3 py-2 ${tone(m.predicted)}`}>{label(m.predicted)}</td>
                <td className="px-3 py-2 font-mono">{pct(m.confidence)}</td>
                <td className={`px-3 py-2 ${tone(m.actual)}`}>{label(m.actual)}</td>
                <td className="px-3 py-2">{m.correct ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
