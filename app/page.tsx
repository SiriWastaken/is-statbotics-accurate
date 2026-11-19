import { Suspense } from "react";
import { EventChecker } from "@/components/EventChecker";

const REPO_URL = "https://github.com/SiriWastaken/is-statbotics-accurate";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-10 sm:px-6 sm:py-16">
      <main className="flex-1">
        <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">Is Statbotics accurate?</h1>
        <Suspense>
          <EventChecker />
        </Suspense>
      </main>
      <footer className="mt-16 border-t border-line pt-6 text-sm text-muted">
        <p>Not affiliated with Statbotics or FIRST. Data from the Statbotics API.</p>
        <p className="mt-2 flex gap-4">
          <a className="underline hover:text-fg" href={REPO_URL}>
            Source on GitHub
          </a>
          <a className="underline hover:text-fg" href="https://www.statbotics.io/docs/rest">
            Statbotics API docs
          </a>
        </p>
      </footer>
    </div>
  );
}
