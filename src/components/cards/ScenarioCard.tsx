import type { AIBrief } from "@/types/dashboard";

type Props = {
  aiBrief: AIBrief;
};

export default function ScenarioCard({ aiBrief }: Props) {
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
        {aiBrief.keyTakeaways.length ? (
          <ul className="mt-4 space-y-3 text-sm text-[var(--text-muted)]">
            {aiBrief.keyTakeaways.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            No takeaways are available because there is not enough source data.
          </p>
        )}
      </div>

      <div className="card p-5">
        <p className="dashboard-kicker">Scenario Outlook</p>
        {aiBrief.scenarios.length ? (
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
                    style={{
                      width: `${Math.min(100, Math.max(0, scenario.probability))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            Scenario probabilities are not available. No calibrated scenario model
            is connected, so this dashboard does not display invented percentages.
          </p>
        )}
      </div>
    </div>
  );
}
