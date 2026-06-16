import ThemeSwitcher from "@/components/theme/ThemeSwitcher";

export default function Header() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-3 max-w-md">
        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--accent)] sm:flex">
          <span className="text-sm font-semibold">AI</span>
        </div>
        <input
          type="text"
          placeholder="Search shifts, markets, narratives..."
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-strong)]"
        />
      </div>

      <div className="flex items-center gap-3">
        <ThemeSwitcher />
        <button className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--text)]">
          Share
        </button>
        <button className="premium-button rounded-xl px-4 py-2 text-sm font-semibold transition hover:-translate-y-px">
          Watch
        </button>
      </div>
    </div>
  );
}
