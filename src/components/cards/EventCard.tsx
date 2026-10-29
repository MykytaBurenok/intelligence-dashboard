import WatchButton from "@/components/dashboard/WatchButton";
import ShareButton from "@/components/dashboard/ShareButton";

type Props = {
  shift: {
    title: string;
    summary: string;
    confidence: number;
    direction: string;
    affectedNarratives: string[];
    affectedMarkets: string[];
    impactScore: number;
    updatedAt: string;
  };
};

function formatUpdatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventCard({ shift }: Props) {
  const confidence = Number.isFinite(shift.impactScore)
    ? Math.min(100, Math.max(0, shift.impactScore))
    : 0;

  return (
    <section className="panel overflow-hidden p-5 sm:p-6 lg:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="dashboard-kicker">Featured News</p>
          <p className="mt-1 text-sm text-[var(--text-faint)]">
            Updated {formatUpdatedAt(shift.updatedAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
            Model confidence {shift.confidence > 0 ? `${shift.confidence}%` : "unavailable"}
          </div>
          <div className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
            Direction: {shift.direction}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-normal text-[var(--text)] sm:text-4xl">
              {shift.title}
            </h2>

            <div className="flex shrink-0 flex-wrap gap-2">
              <ShareButton title={shift.title} />
              <WatchButton item={shift.title} />
            </div>
          </div>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
            {shift.summary}
          </p>

          {shift.affectedNarratives.length > 0 && (
            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)]">
                Affected Narratives
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {shift.affectedNarratives.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)]">
              Market data available
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {shift.affectedMarkets.length ? shift.affectedMarkets.map((item) => (
                <span
                  key={item}
                  className="rounded-lg bg-[var(--surface-strong)] px-3 py-2 text-xs font-semibold text-[var(--text)]"
                >
                  {item}
                </span>
              )) : (
                <span className="text-sm text-[var(--text-muted)]">No live market quotes available.</span>
              )}
            </div>
          </div>
        </div>

        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)]">
            Model-reported confidence
          </p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <p className="text-5xl font-semibold text-[var(--text)]">
              {shift.impactScore > 0 ? confidence : "—"}
            </p>
            <p className="pb-2 text-sm font-medium text-[var(--text-muted)]">
              {shift.impactScore > 0 ? "%" : "Unavailable"}
            </p>
          </div>
          <div className="mt-5 h-1.5 rounded-full bg-[var(--surface-strong)]">
            <div
              className="metric-line h-full rounded-full"
              style={{ width: `${shift.impactScore > 0 ? confidence : 0}%` }}
            />
          </div>
          <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">
            This is a subjective estimate returned by the language model, not a
            statistically calibrated probability, historical trend, or trading recommendation.
          </p>
        </div>
      </div>
    </section>
  );
}
