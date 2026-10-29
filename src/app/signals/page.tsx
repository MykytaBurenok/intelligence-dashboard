import DashboardPageShell from "@/components/layout/DashboardPageShell";
import { getDashboardData } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function SignalsPage() {
  const data = await getDashboardData();
  const largestMove = [...data.quotes].sort(
    (a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange),
  )[0];

  const signals = [
    {
      title: "AI Brief Confidence",
      value: data.brief.confidence > 0 ? `${data.brief.confidence}%` : "Unavailable",
      progress: data.brief.confidence > 0 ? data.brief.confidence : null,
      summary: "Subjective confidence reported by the language model; not a calibrated probability.",
    },
    {
      title: "News Coverage",
      value: String(data.articles.length),
      progress: null,
      summary: "Number of articles returned by the configured news provider for this request.",
    },
    {
      title: "Market Quotes Available",
      value: String(data.quotes.length),
      progress: null,
      summary: "Number of valid market quotes returned by the configured market data provider.",
    },
    {
      title: "Largest Absolute Market Move",
      value: largestMove
        ? `${largestMove.percentChange > 0 ? "+" : ""}${largestMove.percentChange.toFixed(2)}%`
        : "Unavailable",
      progress: largestMove ? Math.min(Math.abs(largestMove.percentChange) * 20, 100) : null,
      summary: largestMove
        ? `${largestMove.symbol} has the largest absolute percentage move among the quotes currently available.`
        : "No valid market quote is currently available.",
    },
  ];

  return (
    <DashboardPageShell data={data}>
      <section>
        <p className="dashboard-kicker">Signal Matrix</p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--text)] sm:text-3xl">
          Live Signals
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
          Source-backed coverage and market observations. These metrics do not
          claim cross-source agreement or predictive signal strength.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {signals.map((signal) => (
          <article key={signal.title} className="card p-5">
            <p className="dashboard-kicker">Metric</p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">
              {signal.title}
            </h2>
            <p className="mt-4 text-4xl font-semibold text-[var(--text)]">
              {signal.value}
            </p>
            {signal.progress !== null && (
              <div className="mt-4 h-1 rounded-full bg-[var(--surface-strong)]">
                <div
                  className="metric-line h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, signal.progress))}%` }}
                />
              </div>
            )}
            <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">
              {signal.summary}
            </p>
          </article>
        ))}
      </section>
    </DashboardPageShell>
  );
}
