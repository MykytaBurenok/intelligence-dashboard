# Intelligence Dashboard

A market and news monitoring dashboard built with Next.js, React, TypeScript, and Tailwind CSS. It combines current provider data with an AI-generated briefing in a responsive interface.

## Current capabilities

- Market quotes from Finnhub for a configurable list of symbols.
- Historical daily closing-price charts for SPY, QQQ, GLD, and USO over 1M, 3M, and 1Y ranges, using Finnhub with Yahoo Finance as a fallback.
- News articles from NewsAPI.
- A compact AI-generated summary from Groq when configured.
- A horizontally scrollable news feed with selected-story details, story pagination, and provider-backed page loading.
- Article-specific AI analysis on the home dashboard, with publisher-description fallback when the AI provider is unavailable.
- Search and keyword-based Macro, Markets, and Technology news filters.
- Browser-persisted watchlist.
- Market overview, signals, narrative summaries, scenario status, and settings pages.
- Browser-persisted theme, default topic, and feed-density preferences.
- Responsive desktop sidebar and mobile navigation drawer.
- Layered ambient background, subtle card sheen, staggered page entrance, animated chart drawing, and custom accent-colored scrollbars.
- Resizable desktop navigation and intelligence side panels with keyboard controls and browser-persisted widths.
- Live type-on effect for selected-story AI analysis, with a reduced-motion fallback.
- CSS-first motion and interactive transitions with `prefers-reduced-motion` support.

## Data integrity notes

- Market values and articles are shown only when valid responses are returned by their providers.
- Historical charts use daily candle close values from Finnhub, with Yahoo Finance as a fallback. The chart never generates or interpolates sample prices. If both providers fail or return insufficient observations, the chart shows an unavailable state.
- Market Snapshot cards are global quotes and are not expected to change when a news story is selected.
- The selected-story analysis updates when the selected article changes and uses its title and description as context.
- The AI analysis does not fetch or verify the full linked article page. Its conclusions are limited to metadata and description supplied by the news provider.
- The dashboard does not currently have a calibrated forecasting model. Scenario probabilities are therefore intentionally not displayed.
- AI-reported confidence is a subjective language-model estimate, not a calibrated probability or investment recommendation.
- News category filters use keyword matching and should not be interpreted as financial signals.
- When a provider is unavailable or returns invalid data, the affected section may show an empty or unavailable state.

## Requirements

- Node.js 20 or later recommended.
- npm.
- API keys for the data providers you want to use.

## Getting started

```bash
git clone https://github.com/MykytaBurenok/intelligence-dashboard.git
cd intelligence-dashboard
npm install
cp .env.example .env.local
```

Add your provider keys to `.env.local`, then run the development server:

```bash
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `FINNHUB_KEY` | For market quotes | Finnhub API token |
| `NEWSAPI_KEY` | For news articles | NewsAPI key |
| `GROQ_API_KEY` | For AI briefing | Groq API key |
| `GROQ_MODEL` | No | Optional Groq chat model override; defaults to `llama-3.1-8b-instant` |

Keep secrets in `.env.local` or your deployment provider's environment-variable settings. Never commit real API keys. The example file contains placeholders only.

The app degrades to unavailable/empty data when a provider cannot be reached, so the dashboard can still render without all providers configured. Features requiring the missing provider will not return live data.

## Scripts

```bash
npm run dev    # Start local development
npm test       # Run business logic unit tests
npm run typecheck # Check TypeScript types
npm run lint   # Run ESLint
npm run build  # Create a production build
npm run start  # Serve a production build
```

Core dashboard rules, including news pagination boundaries, have automated unit tests using Node.js built-in test runner. Run `npm test` to execute them and `npm run typecheck` to check TypeScript types. GitHub Actions runs tests, dependency audit, type checking, lint, and a production build for pull requests and pushes to `main`.

## Architecture

- `src/app`: Next.js App Router pages and API routes.
- `src/app/api/market/history/route.ts`: validated, cached historical candle endpoint with Finnhub and Yahoo Finance fallback.
- `src/components/markets/HistoricalMarketChart.tsx`: interactive client-side SVG chart and period statistics.
- `src/components`: dashboard shell, cards, navigation, and client-side interactions.
- `src/lib/api`: external provider clients and request handling.
- `src/lib/dashboard.ts`: server-side data aggregation and fallback behavior.
- `src/types`: shared data contracts.

The application uses server-rendered data fetching for provider requests and client components for search, filtering, theming, and watchlist interactions. The `POST /api/article-brief` endpoint validates article fields, calls the server-side AI provider, and returns an article-specific brief without exposing API credentials to the browser.

## Known limitations

- Historical charts currently support daily candles for 1M, 3M, and 1Y. Intraday intervals, benchmark comparison, volume, and calibrated market forecasts are not implemented yet.
- Article analysis is based on the title and description returned by NewsAPI, not the full article text.
- Topic filters use lightweight keyword matching rather than a trained classifier.
- The watchlist is stored in the current browser and is not synchronized across devices.
- Theme and feed preferences are stored in the current browser; they are not synchronized across devices.
- Provider rate limits and API plan restrictions may affect data availability.

## Deployment

Configure the required environment variables in your hosting provider, then deploy the repository using its Next.js build support. Do not expose server-side provider keys through public client-side environment variables.
