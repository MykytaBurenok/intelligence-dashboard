import DashboardPageShell from "@/components/layout/DashboardPageShell";
import { getDashboardData } from "@/lib/dashboard";
import { buildAIBrief } from "@/lib/dashboard-helpers";

export const dynamic = "force-dynamic";

export default async function ScenariosPage() {
  const data = await getDashboardData();
  const aiBrief = buildAIBrief(data);
  const scenarios = aiBrief.scenarios;

  return (
    <DashboardPageShell data={data}>
      <section>
        <p className="dashboard-kicker">Forward Paths</p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--text)] sm:text-3xl">
          Scenario Monitor
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
          Scenario probabilities require a calibrated forecasting model. This
          project does not currently have one connected.
        </p>
      </section>

      {scenarios.length ? (
        <section className="grid gap-4 md:grid-cols-3">
          {scenarios.map((scenario) => (
            <article key={scenario.label} className="card p-5">
              <p className="dashboard-kicker">Scenario</p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">
                {scenario.label}
              </h2>
              <p className="mt-4 text-4xl font-semibold text-[var(--text)]">
                {scenario.probability}%
              </p>
              <div className="mt-4 h-1 rounded-full bg-[var(--surface-strong)]">
                <div
                  className="metric-line h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, scenario.probability))}%` }}
                />
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="panel p-6" role="status">
          <h2 className="text-lg font-semibold text-[var(--text)]">
            No calibrated scenarios available
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            The dashboard currently summarizes available news and market quotes,
            but it does not estimate outcome probabilities. Percentages are
            intentionally omitted rather than presented as forecasts without a model.
          </p>
        </section>
      )}

      <section className="card p-5">
        <p className="dashboard-kicker">Source Notes</p>
        {data.brief.takeaways.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {data.brief.takeaways.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm leading-6 text-[var(--text-muted)]"
              >
                {item}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            No source notes are available yet.
          </p>
        )}
      </section>
    </DashboardPageShell>
  );
}
