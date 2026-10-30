# Intelligence Dashboard

A personal **market-intelligence workspace** that brings market quotes, financial news, historical price action, and AI-assisted context into one responsive dashboard.

Built as a portfolio project to demonstrate practical frontend engineering, API integration, data validation, resilient UI states, and thoughtful interaction design. It is a learning project, not a production financial service or investment-advice product.

> **Data integrity first:** market values and news are provider-backed. When a provider is unavailable or returns unusable data, the relevant feature should show an unavailable state instead of inventing prices or silently substituting demo values.

## Product overview

The dashboard is designed to answer three quick questions:

- **What is moving?** Review the latest available quotes for a small set of market ETFs.
- **What might matter?** Scan current news and filter it by macro, markets, and technology topics.
- **What is the context?** Read a concise AI-assisted briefing and inspect historical closing-price behavior.

### Current features

- **Market snapshot** using Finnhub quotes for SPY, QQQ, GLD, and USO when the provider returns valid observations.
- **Historical price chart** with 1M, 3M, and 1Y ranges, daily closes, percentage and absolute period change, provider attribution, last-fetch time, and explicit loading/error/empty states.
- **Provider fallback** for historical data: Finnhub first, Yahoo Finance if Finnhub is unavailable or returns insufficient observations.
- **News feed** powered by NewsAPI, including search, topic filters, pagination, feed-density preferences, and selected-story details.
- **AI-assisted briefings** using Groq when configured. If AI analysis is unavailable, the UI falls back to publisher-provided metadata where possible and identifies the limitation.
- **Persistent workspace preferences** for theme, watchlist, default topic, feed density, and desktop panel widths.
- **Responsive navigation** with a desktop sidebar and mobile navigation drawer.
- **Interactive UI** with resizable panels, animated chart drawing, staggered page transitions, ambient background motion, and reduced-motion support.

## Screenshots

Screenshots are intentionally left for the project author to add.

<!-- Add product screenshots here when ready. -->

## Architecture

The project uses the Next.js App Router. Provider calls and API credentials stay on the server; client components handle interactions and visualization.

| Area | Responsibility |
| --- | --- |
| `src/app` | App Router pages and API endpoints |
| `src/app/api/market/history/route.ts` | Validates historical-chart parameters, requests provider data, normalizes observations, and applies caching |
| `src/components/markets/HistoricalMarketChart.tsx` | Interactive historical-price visualization and period statistics |
| `src/components/home` | Home overview, news feed, and article-specific interactions |
| `src/components/layout` | Application shell, navigation, theme-aware header, and side panels |
| `src/lib/api` | Shared HTTP client and provider integrations |
| `src/lib/dashboard.ts` | Aggregates market quotes, news, and the AI briefing with graceful fallbacks |
| `src/lib/dashboard-logic.mjs` | Reusable validation and business rules covered by unit tests |

## Data sources and integrity

| Data | Provider | Notes |
| --- | --- | --- |
| Market quotes | Finnhub | Only valid provider responses are included |
| Historical daily closes | Finnhub, with Yahoo Finance fallback | The chart uses provider-returned observations; it does not synthesize or interpolate missing prices |
| News articles | NewsAPI | Article content is limited to the metadata returned by the provider |
| AI briefing | Groq, when configured | AI output is contextual assistance, not a calibrated forecast |

Historical prices are daily closes, not real-time ticks. Markets are closed on weekends and holidays, and provider datasets can have missing sessions. The chart does not invent observations to fill those gaps. The source and fetch timestamp are shown so the user can judge data freshness.

The application does **not** currently provide a calibrated forecasting model. Any model-reported confidence is subjective model output, not a statistical probability or investment recommendation. Keyword-based topic filters are navigation aids, not trading signals.

API keys are read from server-side environment variables. Never put real credentials in source control or expose them through client-side code.

## Getting started

### Requirements

- Node.js 20 or later
- npm
- Provider API keys for the live features you want to use

### Install

```bash
git clone https://github.com/MykytaBurenok/intelligence-dashboard.git
cd intelligence-dashboard
npm install
cp .env.example .env.local
```

Add the relevant keys to `.env.local`, then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Needed for | Description |
| --- | --- | --- |
| `FINNHUB_KEY` | Market quotes and primary historical data | Finnhub API token |
| `NEWSAPI_KEY` | News feed | NewsAPI key |
| `GROQ_API_KEY` | AI briefing | Groq API key |
| `GROQ_MODEL` | Optional | Overrides the default Groq chat model |

Yahoo Finance is used as a historical-data fallback and does not require a project API key. Provider availability, rate limits, and plan restrictions can affect live data. Without keys, the application can still render, but provider-backed features may show unavailable states.

## Quality checks

Run the checks locally before opening a pull request:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

- `npm test` runs the Node.js test suite for reusable business rules.
- `npm run typecheck` validates TypeScript types.
- `npm run lint` runs ESLint.
- `npm run build` checks whether Next.js can produce a production build.

GitHub Actions runs the repository's configured quality checks for pull requests and pushes to `main`. A successful local build or CI run is not proof that the hosted deployment is healthy; deployment status must be verified separately.

## Project scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm test` | Run unit tests |
| `npm run typecheck` | Run TypeScript checks |
| `npm run lint` | Run ESLint |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |

## Known limitations

- This is a **pet project**, not a production financial platform.
- Provider coverage and freshness depend on external APIs, their rate limits, and the configured plan.
- Historical charts currently support SPY, QQQ, GLD, and USO with daily candles over 1M, 3M, and 1Y ranges.
- News filters are keyword-based and may misclassify stories.
- AI analysis uses the title and description returned by the news provider; it does not verify the full linked article.
- AI-generated summaries can be wrong and should be treated as reading assistance, not factual verification.
- The project does not provide calibrated forecasts, trading recommendations, or personalized financial advice.
- Hosted deployment availability is separate from source-code and CI status.

## Tech stack

- **Next.js** and **React** for the application and routing
- **TypeScript** for typed application code
- **Tailwind CSS** and custom CSS variables for layout and theming
- **GSAP** and CSS motion for restrained interface animation
- **Finnhub**, **Yahoo Finance**, **NewsAPI**, and **Groq** for provider-backed features
- **Node.js built-in test runner** for business-logic unit tests

## License

No license has been added yet. Unless a license is added, standard copyright restrictions apply to reuse of this repository.
