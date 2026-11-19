import { describe, expect, it } from "vitest";
import { type ApiMatch, type Winner, biggestUpsets, scoreMatch, summarize, verdict } from "./score";

const match = (n: number, p: number | null, winner: Winner | null): ApiMatch => ({
  key: `2024test_qm${n}`,
  match_number: n,
  pred: { red_win_prob: p },
  result: { winner },
});

describe("scoreMatch", () => {
  it("skips matches without a prediction or result", () => {
    expect(scoreMatch(match(1, null, "red"))).toBeNull();
    expect(scoreMatch(match(1, 0.7, null))).toBeNull();
  });

  it("picks the favored alliance and reports its confidence", () => {
    expect(scoreMatch(match(1, 0.8, "red"))).toMatchObject({ predicted: "red", confidence: 0.8, correct: true });
    expect(scoreMatch(match(2, 0.2, "red"))).toMatchObject({ predicted: "blue", confidence: 0.8, correct: false });
  });

  it("calls a dead-even match for red", () => {
    expect(scoreMatch(match(1, 0.5, "blue"))).toMatchObject({ predicted: "red", confidence: 0.5, correct: false });
  });

  it("never counts a tie as correct", () => {
    expect(scoreMatch(match(1, 0.9, "tie"))?.correct).toBe(false);
  });
});

describe("summarize", () => {
  it("returns nulls when nothing is scorable", () => {
    expect(summarize([match(1, null, null)])).toEqual({ matches: [], total: 0, correct: 0, accuracy: null, brier: null });
  });

  it("computes accuracy and Brier score", () => {
    const s = summarize([match(2, 0.8, "red"), match(1, 0.3, "red"), match(3, null, "blue")]);
    expect(s.matches.map((m) => m.matchNumber)).toEqual([1, 2]);
    expect(s.total).toBe(2);
    expect(s.correct).toBe(1);
    expect(s.accuracy).toBe(0.5);
    expect(s.brier).toBeCloseTo((0.2 ** 2 + 0.7 ** 2) / 2);
  });

  it("handles 0% and 100% predictions", () => {
    expect(summarize([match(1, 1, "red"), match(2, 0, "blue")]).brier).toBe(0);
    const wrong = summarize([match(1, 1, "blue"), match(2, 0, "red")]);
    expect(wrong.accuracy).toBe(0);
    expect(wrong.brier).toBe(1);
  });

  it("scores ties as a half outcome", () => {
    expect(summarize([match(1, 0.5, "tie")]).brier).toBe(0);
    expect(summarize([match(1, 1, "tie")]).brier).toBe(0.25);
  });
});

describe("verdict", () => {
  it.each([
    [1, "YES."],
    [0.75, "YES."],
    [0.7499, "KINDA."],
    [0.6, "KINDA."],
    [0.5999, "NOT TODAY."],
    [0, "NOT TODAY."],
  ])("%f -> %s", (acc, expected) => expect(verdict(acc)).toBe(expected));
});

describe("biggestUpsets", () => {
  it("returns the most confident wrong calls, excluding ties", () => {
    const { matches } = summarize([
      match(1, 0.9, "blue"),
      match(2, 1, "tie"),
      match(3, 0.05, "red"),
      match(4, 0.6, "blue"),
      match(5, 0.99, "red"),
      match(6, 0.3, "red"),
      match(7, 0.8, "blue"),
      match(8, 0.75, "blue"),
    ]);
    expect(biggestUpsets(matches).map((m) => m.matchNumber)).toEqual([3, 1, 7, 8, 6]);
    expect(biggestUpsets(matches, 2).map((m) => m.matchNumber)).toEqual([3, 1]);
  });
});
