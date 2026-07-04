import Shell from "@/components/layout/Shell";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import EventCard from "@/components/cards/EventCard";
import ImpactCard from "@/components/cards/ImpactCard";
import ScenarioCard from "@/components/cards/ScenarioCard";
import { getDashboardData } from "@/lib/dashboard";
import { buildAIBrief } from "@/lib/dashboard-helpers";
import type { AIBrief } from "@/types/dashboard";

export const revalidate = 300;

type MetricItem = {
  label: string;
  name: string;
  value: string;
  change: string;
  description: string;
  intensity: number;
};

type FeaturedShift = {
  title: string;
  summary: string;
  confidence: number;
  direction: string;
  affectedNarratives: string[];
  affectedMarkets: string[];
  impactScore: number;
  updatedAt: string;
};

export default async function HomePage() {
  const data = await getDashboardData();

  const metrics: MetricItem[] = [
    {
      label: "Market",
      name: data.quotes[0]?.symbol ?? "DXY",
      value: data.quotes[0] ? data.quotes[0].current.toFixed(2) : "—",
      change: data.quotes[0]
        ? `${data.quotes[0].percentChange >= 0 ? "+" : ""}${data.quotes[0].percentChange.toFixed(2)}%`
        : "—",
      description: "Dollar index reaction to macro policy shift.",
      intensity: Math.min(
        Math.abs(data.quotes[0]?.percentChange ?? 0) * 20,
        100,
      ),
    },
    {
      label: "Commodities",
      name: data.quotes[1]?.symbol ?? "Gold",
      value: data.quotes[1] ? data.quotes[1].current.toFixed(2) : "—",
      change: data.quotes[1]
        ? `${data.quotes[1].percentChange >= 0 ? "+" : ""}${data.quotes[1].percentChange.toFixed(2)}%`
        : "—",
      description: "Safe haven demand tracked against dollar moves.",
      intensity: Math.min(
        Math.abs(data.quotes[1]?.percentChange ?? 0) * 15,
        100,
      ),
    },
    {
      label: "Narrative",
      name: "Narrative strength",
      value: `${data.brief.confidence}`,
      change: "+0.9",
      description: "Policy divergence cluster gaining cross-source support.",
      intensity: data.brief.confidence,
    },
    {
      label: "Scenario",
      name: data.brief.takeaways[0] ?? "Delayed-cut probability",
      value: "58%",
      change: "+11%",
      description: "Consensus path shifts toward a longer hold window.",
      intensity: 58,
    },
  ];

  const featuredShift: FeaturedShift = {
    title: data.brief.headline,
    summary: data.brief.summary,
    confidence: data.brief.confidence,
    direction: "Risk-off",
    affectedNarratives: [
      "Policy divergence",
      "Dollar resilience",
      "Soft landing",
    ],
    affectedMarkets: data.quotes.map((q) => q.symbol).slice(0, 4),
    impactScore: data.brief.confidence,
    updatedAt: data.generatedAt,
  };

  const aiBrief: AIBrief = buildAIBrief(data);

  return (
    <Shell
      sidebar={<Sidebar />}
      header={<Header />}
      rightPanel={<ScenarioCard aiBrief={aiBrief} />}
    >
      <div className="mx-auto max-w-[1120px] space-y-6">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="dashboard-kicker">Reality Shift Monitor</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-semibold tracking-normal text-[var(--text)] sm:text-3xl">
              Top Reality Shifts Today
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
              AI-ranked macro, market, and narrative shifts with confidence
              scores, affected assets, and scenario movement.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["All signals", "Macro", "Markets", "High confidence"].map(
              (item, index) => (
                <button
                  key={item}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    index === 0
                      ? "border-[var(--border-strong)] bg-[var(--surface-strong)] text-[var(--text)]"
                      : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </section>

        <EventCard shift={featuredShift} />

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="dashboard-kicker">Live Analytics</p>
              <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">
                Market Impact Overview
              </h2>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Model consensus across tracked assets
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {metrics.map((item) => (
              <ImpactCard key={item.name} {...item} />
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card p-5">
            <p className="dashboard-kicker">Narrative Shift</p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">
              {data.articles[1]?.title ??
                "Dollar resilience overtaking soft-landing optimism"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
              {data.articles[1]?.description ??
                "Source clustering shows policy commentary carrying more weight than equity earnings momentum."}
            </p>
          </div>

          <div className="card p-5">
            <p className="dashboard-kicker">Next Watch</p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">
              {data.articles[2]?.title ?? "CPI surprise threshold"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
              {data.articles[2]?.description ??
                "A hotter print would likely push delayed-cut probability above 65%."}
            </p>
          </div>
        </section>

        <div className="h-8" />
      </div>
    </Shell>
  );
}
