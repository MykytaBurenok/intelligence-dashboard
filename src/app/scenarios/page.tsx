import DashboardPageShell from "@/components/layout/DashboardPageShell";
import { getDashboardData } from "@/lib/dashboard";
import { buildAIBrief } from "@/lib/dashboard-helpers";

export const revalidate = 300;

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
          Probability-weighted outcomes derived from the current brief and
          supporting market context.
        </p>
      </section>

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
                style={{ width: `${scenario.probability}%` }}
              />
            </div>
          </article>
        ))}
      </section>

      <section className="card p-5">
        <p className="dashboard-kicker">Scenario Notes</p>
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
      </section>
    </DashboardPageShell>
  );
}
