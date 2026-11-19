"use client";

import { useState } from "react";

const EXAMPLES = ["2023hop", "2023cabl", "2023ncjoh"];

export function EventForm({ initial, onSubmit }: { initial: string; onSubmit: (key: string) => void }) {
  const [value, setValue] = useState(initial);
  const submit = (key: string) => {
    const clean = key.trim().toLowerCase();
    setValue(clean);
    if (clean) onSubmit(clean);
  };

  return (
    <div className="space-y-3">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
      >
        <label htmlFor="event-key" className="sr-only">
          FRC event key
        </label>
        <input
          id="event-key"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 2023txhou"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-4 py-3 font-mono text-lg placeholder:text-muted"
        />
        <button type="submit" className="rounded-lg bg-fg px-5 py-3 font-semibold text-bg hover:opacity-90">
          Go
        </button>
      </form>
      <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
        Try:
        {EXAMPLES.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => submit(key)}
            className="rounded-md border border-line px-2 py-1 font-mono text-fg hover:bg-surface"
          >
            {key}
          </button>
        ))}
      </p>
    </div>
  );
}
