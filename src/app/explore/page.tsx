import DashboardPageShell from "@/components/layout/DashboardPageShell";
import { getDashboardData } from "@/lib/dashboard";
import NewsFeed from "@/components/home/NewsFeed";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const data = await getDashboardData();

  return (
    <DashboardPageShell data={data}>
      <section className="border-b border-[var(--border)] pb-6">
        <p className="dashboard-kicker">Discovery workspace</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          Explore
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
          Browse source-linked coverage, filter stories by topic, and load additional pages from the news provider.
        </p>
      </section>

      <NewsFeed initialArticles={data.articles} showFilters />

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-5">
          <p className="dashboard-kicker">AI briefing</p>
          <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">
            {data.brief.headline}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            {data.brief.summary}
          </p>
          <p className="mt-4 text-xs leading-5 text-[var(--text-faint)]">
            The briefing summarizes the current input batch. It is not investment advice.
          </p>
        </div>

        <div className="card p-5">
          <p className="dashboard-kicker">Market quotes</p>
          <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">Available assets</h2>
          {data.quotes.length ? (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {data.quotes.map((quote) => (
                <div key={quote.symbol} className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3">
                  <p className="text-sm font-semibold text-[var(--text)]">{quote.symbol}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{quote.current.toFixed(2)}</p>
                  <p className={`mt-1 text-xs ${quote.percentChange > 0 ? "text-[var(--success)]" : quote.percentChange < 0 ? "text-[var(--danger)]" : "text-[var(--text-muted)]"}`}>
                    {quote.percentChange > 0 ? "+" : ""}{quote.percentChange.toFixed(2)}%
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-[var(--text-muted)]">No market quotes are currently available.</p>
          )}
        </div>
      </section>
    </DashboardPageShell>
  );
}
