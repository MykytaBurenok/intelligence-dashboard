import DashboardPageShell from "@/components/layout/DashboardPageShell";
import { getDashboardData } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function NarrativesPage() {
  const data = await getDashboardData();

  const narratives = data.brief.takeaways.map((item, index) => ({
    title: data.articles[index]?.title ?? `Narrative ${index + 1}`,
    summary: item,
    description: data.articles[index]?.description ?? item,
  }));

  return (
    <DashboardPageShell data={data}>
      <section>
        <p className="dashboard-kicker">Story Layer</p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--text)] sm:text-3xl">
          Narrative Clusters
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
          Narratives assembled from the current brief and latest articles.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {narratives.map((item) => (
          <article key={item.title} className="card p-5">
            <p className="dashboard-kicker">Narrative</p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--text)]">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
              {item.summary}
            </p>
            <p className="mt-4 text-xs leading-5 text-[var(--text-faint)]">
              {item.description}
            </p>
          </article>
        ))}
      </section>
    </DashboardPageShell>
  );
}
