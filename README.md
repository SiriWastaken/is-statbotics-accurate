# Is Statbotics Accurate?

Type an FRC event key, get a verdict: **YES.**, **KINDA.**, or **NOT TODAY.**

![Screenshot](docs/screenshot.png)
<!-- TODO: add docs/screenshot.png -->

Live: https://is-statbotics-accurate.vercel.app

## How it works

The page calls the public [Statbotics API](https://www.statbotics.io/docs/rest) (`GET /v3/matches?event=<key>&elim=false`) from your browser and keeps every completed qualification match that has both a result and a prediction. Statbotics predicts each match as a red-alliance win probability (`pred.red_win_prob`). The favored alliance (red at 50% or above) is the predicted winner, and the call counts as correct only if that alliance won, so ties always count as misses. Accuracy is correct calls divided by matches scored. The Brier score is the mean of `(red_win_prob − outcome)²`, where red win = 1, blue win = 0 and tie = 0.5; lower is better. Accuracy of 75% or more is "YES.", 60–75% is "KINDA.", and anything lower is "NOT TODAY." There is no backend: the site is a static export, and all the scoring lives in `lib/score.ts`.

## Limitations

- **Predictions use pre-event ratings.** Statbotics' EPA updates as an event goes on, but each match is predicted from the ratings teams had before it. Early matches are graded against the least information.
- **Small events give noisy accuracy.** At 50–80 qualification matches, a handful of upsets moves the number several points. Don't read much into one event.
- **Qualification matches only.** Playoff matches are excluded.
- If the Statbotics API is down or slow, the page shows an error with a retry button. Statbotics returns HTTP 500 for both "not found" and real failures, so an unknown event key can show up as a network error while the API is having trouble.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # Vitest, scoring functions
npm run lint
npm run build   # static export to out/
```

No environment variables or API keys are needed.

## Deploy

**Vercel:** import the repo at vercel.com/new. The Next.js preset works as-is, with no env vars. Set the project name to `is-statbotics-accurate` to get that subdomain.

**GitHub Pages:** in the repo, go to Settings → Pages → Source and pick "GitHub Actions". Then add `.github/workflows/pages.yml` that runs `PAGES_BASE_PATH=/is-statbotics-accurate npm run build` and uploads `out/` with `actions/upload-pages-artifact` + `actions/deploy-pages`. If you serve from Pages, change `metadataBase` in `app/layout.tsx` to the Pages URL.

Not affiliated with Statbotics or FIRST.
