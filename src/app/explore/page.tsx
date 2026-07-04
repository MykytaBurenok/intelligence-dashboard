import DashboardPageShell from "@/components/layout/DashboardPageShell";
import { getDashboardData } from "@/lib/dashboard";

export const revalidate = 300;

export default async function ExplorePage() {
  const data = await getDashboardData();

  return (
    <DashboardPageShell data={data}>
      <section>
        <p className="dashboard-kicker">Discovery Layer</p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--text)] sm:text-3xl">
          Explore
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
          Browse current articles, narrative signals, and tracked market assets
          in one place.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-5">
          <p className="dashboard-kicker">Articles</p>
          <div className="mt-4 space-y-3">
            {data.articles.slice(0, 6).map((article, index) => (
              <article
                key={`${article.title}-${index}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4"
              >
                <h2 className="text-base font-semibold text-[var(--text)]">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  {article.description ?? "No description available."}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <p className="dashboard-kicker">Top Narrative</p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">
              {data.brief.headline}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
              {data.brief.summary}
            </p>
          </div>

          <div className="card p-5">
            <p className="dashboard-kicker">Tracked Assets</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {data.quotes.map((quote) => (
                <div
                  key={quote.symbol}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3"
                >
                  <p className="text-sm font-semibold text-[var(--text)]">
                    {quote.symbol}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {quote.current.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </DashboardPageShell>
  );
}
