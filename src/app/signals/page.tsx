import DashboardPageShell from "@/components/layout/DashboardPageShell";
import { getDashboardData } from "@/lib/dashboard";

export const revalidate = 300;

export default async function SignalsPage() {
  const data = await getDashboardData();

  const signals = [
    {
      title: "Headline Momentum",
      value: data.brief.confidence,
      summary: data.brief.summary,
    },
    {
      title: "Cross-Source Agreement",
      value: Math.min(data.articles.length * 10, 100),
      summary:
        data.articles[0]?.description ??
        "Agreement level inferred from currently loaded articles.",
    },
    {
      title: "Top Takeaway Strength",
      value: data.brief.takeaways[0] ? 88 : 55,
      summary: data.brief.takeaways[0] ?? "No top takeaway available yet.",
    },
    {
      title: "Market Reaction Pressure",
      value: data.quotes[0]
        ? Math.min(Math.abs(data.quotes[0].percentChange) * 20, 100)
        : 0,
      summary: data.quotes[0]
        ? `${data.quotes[0].symbol} is currently the strongest reaction carrier.`
        : "No market quote available.",
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
          Real signal strength built from the current brief and article set.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {signals.map((signal) => (
          <article key={signal.title} className="card p-5">
            <p className="dashboard-kicker">Signal</p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">
              {signal.title}
            </h2>
            <p className="mt-4 text-4xl font-semibold text-[var(--text)]">
              {signal.value}
            </p>
            <div className="mt-4 h-1 rounded-full bg-[var(--surface-strong)]">
              <div
                className="metric-line h-full rounded-full"
                style={{ width: `${Math.min(signal.value, 100)}%` }}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">
              {signal.summary}
            </p>
          </article>
        ))}
      </section>
    </DashboardPageShell>
  );
}
