type ShellProps = {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  rightPanel: React.ReactNode;
  children: React.ReactNode;
};

export default function Shell({
  sidebar,
  header,
  rightPanel,
  children,
}: ShellProps) {
  return (
    <div className="shell-frame">
      <div className="shell-grid">
        <aside className="shell-sidebar">{sidebar}</aside>

        <div className="shell-content flex min-h-screen flex-col">
          <div className="shell-mobile-brand">
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-9 w-9 shrink-0 rounded-xl border border-[var(--border-strong)] bg-[var(--accent-soft)] shadow-[var(--shadow-glow)]" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--text)]">
                  Reality Shift
                </p>
                <p className="truncate text-xs text-[var(--text-faint)]">
                  AI intelligence dashboard
                </p>
              </div>
            </div>
            <button className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-xs font-semibold text-[var(--text-muted)]">
              Menu
            </button>
          </div>

          <header className="shell-header border-b p-4">{header}</header>

          <main className="shell-main flex-1">{children}</main>
        </div>

        <aside className="shell-right-panel">{rightPanel}</aside>
      </div>
    </div>
  );
}
