import Shell from "@/components/layout/Shell";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import EventCard from "@/components/cards/EventCard";
import ImpactCard from "@/components/cards/ImpactCard";
import ScenarioCard from "@/components/cards/ScenarioCard";

const impacts = [
  {
    label: "Market",
    name: "Dollar index reaction",
    value: "103.42",
    change: "+0.68%",
    description: "Bid strengthens as rate-cut timing moves later.",
    intensity: 76,
  },
  {
    label: "Volatility",
    name: "Energy market volatility",
    value: "21.8",
    change: "+2.1%",
    description: "Oil sensitivity rises with dollar and growth uncertainty.",
    intensity: 64,
  },
  {
    label: "Narrative",
    name: "Narrative strength",
    value: "8.4",
    change: "+0.9",
    description: "Policy divergence cluster is gaining cross-source support.",
    intensity: 84,
  },
  {
    label: "Scenario",
    name: "Delayed-cut probability",
    value: "58%",
    change: "+11%",
    description: "Consensus path shifts toward a longer hold window.",
    intensity: 58,
  },
];

export default function HomePage() {
  return (
    <Shell
      sidebar={<Sidebar />}
      header={<Header />}
      rightPanel={<ScenarioCard />}
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

        <EventCard />

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
            {impacts.map((item) => (
              <ImpactCard
                key={item.name}
                label={item.label}
                name={item.name}
                value={item.value}
                change={item.change}
                description={item.description}
                intensity={item.intensity}
              />
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card p-5">
            <p className="dashboard-kicker">Narrative Shift</p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">
              Dollar resilience is overtaking soft-landing optimism
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
              Source clustering shows policy commentary and front-end yield
              action carrying more weight than equity earnings momentum.
            </p>
          </div>

          <div className="card p-5">
            <p className="dashboard-kicker">Next Watch</p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">
              CPI surprise threshold
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
              A hotter print would likely push delayed-cut probability above
              65% and raise dollar sensitivity.
            </p>
          </div>
        </section>
      </div>
    </Shell>
  );
}
