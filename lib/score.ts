export type Alliance = "red" | "blue";
export type Winner = Alliance | "tie";

// Subset of a Statbotics v3 match (GET /v3/matches).
export type ApiMatch = {
  key: string;
  match_number: number;
  pred: { red_win_prob: number | null };
  result: { winner: Winner | null };
};

export type ScoredMatch = {
  key: string;
  matchNumber: number;
  redWinProb: number;
  predicted: Alliance;
  actual: Winner;
  confidence: number;
  correct: boolean;
};

export type Summary = {
  matches: ScoredMatch[];
  total: number;
  correct: number;
  accuracy: number | null;
  brier: number | null;
};

const OUTCOME: Record<Winner, number> = { red: 1, blue: 0, tie: 0.5 };

export function scoreMatch(m: ApiMatch): ScoredMatch | null {
  const p = m.pred?.red_win_prob;
  const actual = m.result?.winner;
  if (p == null || actual == null) return null;
  // A dead-even 50% is called for red; a tie never counts as a correct call.
  const predicted: Alliance = p >= 0.5 ? "red" : "blue";
  return {
    key: m.key,
    matchNumber: m.match_number,
    redWinProb: p,
    predicted,
    actual,
    confidence: Math.max(p, 1 - p),
    correct: predicted === actual,
  };
}

export function summarize(raw: ApiMatch[]): Summary {
  const matches = raw
    .map(scoreMatch)
    .filter((m): m is ScoredMatch => m !== null)
    .sort((a, b) => a.matchNumber - b.matchNumber);
  const total = matches.length;
  const correct = matches.filter((m) => m.correct).length;
  const brierSum = matches.reduce((s, m) => s + (m.redWinProb - OUTCOME[m.actual]) ** 2, 0);
  return {
    matches,
    total,
    correct,
    accuracy: total ? correct / total : null,
    brier: total ? brierSum / total : null,
  };
}

export type Verdict = "YES." | "KINDA." | "NOT TODAY.";

export function verdict(accuracy: number): Verdict {
  if (accuracy >= 0.75) return "YES.";
  if (accuracy >= 0.6) return "KINDA.";
  return "NOT TODAY.";
}

export function biggestUpsets(matches: ScoredMatch[], n = 5): ScoredMatch[] {
  return matches
    .filter((m) => m.actual !== "tie" && !m.correct)
    .sort((a, b) => b.confidence - a.confidence || a.matchNumber - b.matchNumber)
    .slice(0, n);
}
