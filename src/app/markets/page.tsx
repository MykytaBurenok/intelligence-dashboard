import DashboardPageShell from "@/components/layout/DashboardPageShell";
import { getDashboardData } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

function formatMove(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function getBias(value: number) {
  if (value > 0.5) return "Strengthening";
  if (value < -0.5) return "Weakening";
  return "Neutral";
}

export default async function MarketsPage() {
  const data = await getDashboardData();

  return (
    <DashboardPageShell data={data}>
      <section>
        <p className="dashboard-kicker">Asset Tracker</p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--text)] sm:text-3xl">
          Market Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
          Live market snapshot based on the latest quotes from the dashboard
          feed.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.quotes.map((quote) => (
          <article key={quote.symbol} className="card p-5">
            <p className="dashboard-kicker">{quote.symbol}</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">
              {quote.current.toFixed(2)}
            </h2>
            <p
              className={`mt-2 text-sm font-semibold ${
                quote.percentChange >= 0
                  ? "text-[var(--success)]"
                  : "text-[var(--danger)]"
              }`}
            >
              {formatMove(quote.percentChange)}
            </p>
            <p className="mt-4 text-sm text-[var(--text-muted)]">
              Previous close: {quote.previousClose.toFixed(2)}
            </p>
            <div className="mt-4 h-1 rounded-full bg-[var(--surface-strong)]">
              <div
                className="metric-line h-full rounded-full"
                style={{
                  width: `${Math.min(Math.abs(quote.percentChange) * 12, 100)}%`,
                }}
              />
            </div>
            <p className="mt-4 text-xs text-[var(--text-faint)]">
              Bias: {getBias(quote.percentChange)}
            </p>
          </article>
        ))}
      </section>
    </DashboardPageShell>
  );
}
