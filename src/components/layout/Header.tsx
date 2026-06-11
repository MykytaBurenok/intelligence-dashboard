import ThemeSwitcher from "@/components/theme/ThemeSwitcher";

export default function Header() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <p className="dashboard-kicker">Command Center</p>
        <h1 className="mt-1 text-xl font-semibold tracking-normal text-[var(--text)]">
          Top Reality Shifts Today
        </h1>
      </div>

      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center lg:flex-1 lg:justify-end">
        <div className="flex min-w-0 flex-1 items-center gap-3 lg:max-w-md">
          <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--accent)] sm:flex">
            <span className="text-sm font-semibold">AI</span>
          </div>

          <input
            type="text"
            placeholder="Search shifts, markets, narratives..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-strong)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ThemeSwitcher />

          <button className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--text)]">
            Share
          </button>

          <button className="premium-button rounded-xl px-4 py-2 text-sm font-semibold transition hover:-translate-y-px">
            Watch
          </button>
        </div>
      </div>
    </div>
  );
}
