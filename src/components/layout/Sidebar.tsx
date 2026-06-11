const navItems = [
  "Home",
  "Signals",
  "Markets",
  "Narratives",
  "Scenarios",
  "Watchlist",
  "Settings",
];

export default function Sidebar() {
  return (
    <div className="flex min-h-full flex-col gap-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent)] shadow-[var(--shadow-glow)]">
            RS
          </div>
          <div className="hidden min-w-0 xl:block">
            <p className="truncate text-lg font-semibold tracking-tight text-[var(--text)]">
              Reality Shift
            </p>
            <p className="truncate text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">
              Intelligence Dashboard
            </p>
          </div>
        </div>
      </div>

      <nav className="grid gap-2">
        {navItems.map((item, index) => (
          <button
            key={item}
            className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${
              index === 0
                ? "border-[var(--border-strong)] bg-[var(--surface-strong)] text-[var(--text)] shadow-[var(--shadow-accent)]"
                : "border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-soft)] text-[0.68rem] font-semibold text-[var(--accent)]">
              {item.slice(0, 2).toUpperCase()}
            </span>
            <span className="hidden xl:inline">{item}</span>
          </button>
        ))}
      </nav>

      <div className="panel mt-auto hidden p-4 xl:block">
        <p className="dashboard-kicker">Signal Health</p>
        <p className="mt-3 text-2xl font-semibold text-[var(--text)]">94.2</p>
        <div className="mt-3 h-1 rounded-full bg-[var(--surface-strong)]">
          <div className="metric-line h-full w-[78%] rounded-full" />
        </div>
        <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">
          Cross-source confidence remains elevated across macro and policy
          clusters.
        </p>
      </div>

      <div className="hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 xl:block">
        <p className="text-sm font-semibold text-[var(--text)]">Nikita</p>
        <p className="mt-1 text-xs text-[var(--text-faint)]">
          Research workspace
        </p>
      </div>
    </div>
  );
}
