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
  return (
    <section className="panel overflow-hidden p-5 sm:p-6 lg:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="dashboard-kicker">Featured Shift</p>
          <p className="mt-1 text-sm text-[var(--text-faint)]">
            Updated {formatUpdatedAt(shift.updatedAt)} · macro policy cluster
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
            Confidence {shift.confidence}%
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

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
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

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)]">
                Affected Markets
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {shift.affectedMarkets.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg bg-[var(--surface-strong)] px-2 py-2 text-center text-xs font-semibold text-[var(--text)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)]">
            Impact Score
          </p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <p className="text-5xl font-semibold text-[var(--text)]">
              {shift.impactScore}
            </p>
            <p className="pb-2 text-sm font-semibold text-[var(--success)]">
              +11
            </p>
          </div>
          <div className="mt-5 h-1.5 rounded-full bg-[var(--surface-strong)]">
            <div
              className="metric-line h-full rounded-full"
              style={{ width: `${shift.impactScore}%` }}
            />
          </div>
          <div className="mt-5 grid h-14 grid-cols-6 items-end gap-1.5">
            {[38, 56, 74, 69, 82, 77].map((height, index) => (
              <div
                key={index}
                className="rounded-sm bg-[var(--accent)] opacity-70 transition-opacity hover:opacity-100"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">
            Mini trend tracks narrative acceleration across policy-sensitive
            assets over the latest session.
          </p>
        </div>
      </div>
    </section>
  );
}
