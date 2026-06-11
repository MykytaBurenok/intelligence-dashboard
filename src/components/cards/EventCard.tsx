export default function EventCard() {
  const narratives = ["Policy divergence", "Dollar resilience", "Soft landing"];
  const markets = ["DXY", "UST 2Y", "Nasdaq", "Gold"];

  return (
    <section className="panel overflow-hidden p-5 sm:p-6 lg:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="dashboard-kicker">Featured Shift</p>
          <p className="mt-1 text-sm text-[var(--text-faint)]">
            Updated 2m ago - macro policy cluster
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
            Confidence 91%
          </div>
          <div className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
            Direction: Risk-off
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-normal text-[var(--text)] sm:text-4xl">
            Fed hold resets rate-cut timing and strengthens the dollar narrative
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
            AI synthesis shows the market repricing the path of cuts rather than
            the current rate decision. The largest second-order effects are
            appearing in front-end yields, dollar exposure, and high-duration
            equities.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)]">
                Affected Narratives
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {narratives.map((item) => (
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
                {markets.map((item) => (
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
            <p className="text-5xl font-semibold text-[var(--text)]">82</p>
            <p className="pb-2 text-sm font-semibold text-[var(--success)]">
              +11
            </p>
          </div>
          <div className="mt-5 h-1.5 rounded-full bg-[var(--surface-strong)]">
            <div className="metric-line h-full w-[82%] rounded-full" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[38, 56, 74, 69, 82, 77].map((height, index) => (
              <div
                key={`${height}-${index}`}
                className="flex h-16 items-end rounded-lg bg-[var(--surface-soft)] px-1.5 pb-1.5"
              >
                <div
                  className="w-full rounded-md bg-[var(--accent)] opacity-80"
                  style={{ height: `${height}%` }}
                />
              </div>
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
