import type { AIBrief } from "@/types/dashboard";

type Props = {
  aiBrief: AIBrief;
  isLoading?: boolean;
  analysisError?: string;
};

export default function ScenarioCard({
  aiBrief,
  isLoading = false,
  analysisError = "",
}: Props) {
  return (
    <div className="space-y-4">
      <div className="panel p-5" aria-live="polite">
        <div className="flex items-center justify-between gap-3">
          <p className="dashboard-kicker">Selected story</p>
          {isLoading && (
            <span className="inline-flex items-center gap-2 text-xs text-[var(--text-faint)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
              Updating analysis
            </span>
          )}
        </div>
        <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">
          {aiBrief.featuredTitle || "Select a story"}
        </h2>
        <h3 className="mt-4 text-sm font-semibold text-[var(--text)]">What this means</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{aiBrief.whatThisMeans}</p>
        {analysisError && (
          <p className="mt-3 text-xs leading-5 text-[var(--text-faint)]" role="status">{analysisError}</p>
        )}
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-semibold text-[var(--text)]">Key Takeaways</h2>
        {aiBrief.keyTakeaways.length ? (
          <ul className="mt-4 space-y-3 text-sm text-[var(--text-muted)]">
            {aiBrief.keyTakeaways.map((item, index) => (
              <li key={`${index}-${item}`} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[var(--text-muted)]">Not enough source detail is available to extract key takeaways.</p>
        )}
      </div>

      <div className="card p-5">
        <p className="dashboard-kicker">Scenario Outlook</p>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          Scenario probabilities are unavailable because no calibrated forecasting model is connected. This panel will not display invented percentages.
        </p>
      </div>
    </div>
  );
}
