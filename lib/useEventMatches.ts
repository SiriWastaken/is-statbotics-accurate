"use client";

import { useCallback, useEffect, useState } from "react";
import { type ApiMatch, type Summary, summarize } from "./score";

const API = "https://api.statbotics.io/v3/matches";
const EVENT_KEY = /^\d{4}[a-z][a-z0-9]*$/;

type Result = { status: "invalid" } | { status: "empty" } | { status: "error" } | { status: "done"; summary: Summary };
export type EventState = { status: "idle" } | { status: "loading" } | Result;

export function useEventMatches(eventKey: string) {
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState<{ id: string; result: Result }>();
  const id = `${eventKey}#${attempt}`;
  const valid = EVENT_KEY.test(eventKey);

  useEffect(() => {
    if (!valid) return;
    const ctrl = new AbortController();
    fetch(`${API}?event=${encodeURIComponent(eventKey)}&elim=false&limit=1000`, { signal: ctrl.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Statbotics responded ${res.status}`);
        return res.json() as Promise<ApiMatch[]>;
      })
      .then((matches) => {
        // Statbotics returns an empty list (not a 404) for unknown events.
        if (matches.length === 0) return setLoaded({ id, result: { status: "invalid" } });
        const summary = summarize(matches);
        setLoaded({ id, result: summary.total ? { status: "done", summary } : { status: "empty" } });
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setLoaded({ id, result: { status: "error" } });
      });
    return () => ctrl.abort();
  }, [eventKey, id, valid]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  const state: EventState = !eventKey
    ? { status: "idle" }
    : !valid
      ? { status: "invalid" }
      : loaded?.id === id
        ? loaded.result
        : { status: "loading" };

  return { state, retry };
}
