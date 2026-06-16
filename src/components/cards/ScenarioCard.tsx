import type { AIBrief } from "@/types/dashboard";

type Props = { aiBrief: AIBrief };

export default function ScenarioCard({ aiBrief }: Props) {
  const sectors = [
    { name: "Banks", score: "High" },
    { name: "Semis", score: "Medium" },
    { name: "Energy", score: "Rising" },
  ];

  return (
    <div className="space-y-4">
      <div className="panel p-5">
        <p className="dashboard-kicker">AI Brief</p>
        <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">
          What this means
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          {aiBrief.whatThisMeans}
        </p>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-semibold text-[var(--text)]">
          Key Takeaways
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-[var(--text-muted)]">
          {aiBrief.keyTakeaways.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-semibold text-[var(--text)]">
          Most Affected Sectors
        </h2>
        <div className="mt-4 space-y-3">
          {sectors.map((sector) => (
            <div
              key={sector.name}
              className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2"
            >
              <span className="text-sm text-[var(--text-muted)]">
                {sector.name}
              </span>
              <span className="text-xs font-semibold text-[var(--accent)]">
                {sector.score}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <p className="dashboard-kicker">Scenario Outlook</p>
        <div className="mt-4 space-y-4">
          {aiBrief.scenarios.map((scenario) => (
            <div key={scenario.label}>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-[var(--text-muted)]">
                  {scenario.label}
                </span>
                <span className="font-semibold text-[var(--text)]">
                  {scenario.probability}%
                </span>
              </div>
              <div className="mt-2 h-1 rounded-full bg-[var(--surface-strong)]">
                <div
                  className="metric-line h-full rounded-full"
                  style={{ width: `${scenario.probability}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
