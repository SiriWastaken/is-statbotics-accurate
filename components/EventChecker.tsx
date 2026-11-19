"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { useEventMatches } from "@/lib/useEventMatches";
import { EventForm } from "./EventForm";
import { MatchTable } from "./MatchTable";
import { Upsets } from "./Upsets";
import { Verdict } from "./Verdict";

export function EventChecker() {
  const router = useRouter();
  const pathname = usePathname();
  const eventKey = useSearchParams().get("event")?.trim().toLowerCase() ?? "";
  const { state, retry } = useEventMatches(eventKey);

  return (
    <>
      <EventForm
        key={eventKey}
        initial={eventKey}
        onSubmit={(key) => router.push(`${pathname}?event=${encodeURIComponent(key)}`, { scroll: false })}
      />
      <div className="mt-12" aria-busy={state.status === "loading"}>
        {state.status === "loading" && <Skeleton />}
        {state.status === "invalid" && (
          <Message title="That doesn’t look like an event.">
            Statbotics has no matches for <code className="font-mono">{eventKey}</code>. Event keys look like{" "}
            <code className="font-mono">2023txhou</code>: a year followed by the event code.
          </Message>
        )}
        {state.status === "empty" && (
          <Message title="Nothing to grade yet.">
            {eventKey} has no completed qualification matches with predictions.
          </Message>
        )}
        {state.status === "error" && (
          <Message title="Couldn’t reach Statbotics.">
            The API didn’t answer. It may be waking up.{" "}
            <button type="button" onClick={retry} className="ml-1 rounded-md border border-line px-3 py-1 text-fg hover:bg-surface">
              Retry
            </button>
          </Message>
        )}
        {state.status === "done" && (
          <div className="space-y-12">
            <Verdict key={eventKey} eventKey={eventKey} summary={state.summary} />
            <Upsets matches={state.summary.matches} />
            <MatchTable matches={state.summary.matches} />
          </div>
        )}
      </div>
    </>
  );
}

function Message({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div role="alert" className="rounded-lg border border-line p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-1 text-muted">{children}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div role="status" className="space-y-4">
      <span className="sr-only">Loading matches…</span>
      <div className="h-4 w-48 rounded bg-surface" />
      <div className="h-24 w-64 rounded bg-surface sm:h-32 sm:w-96" />
      <div className="h-6 w-full max-w-md rounded bg-surface" />
      <div className="h-40 w-full rounded bg-surface" />
    </div>
  );
}
