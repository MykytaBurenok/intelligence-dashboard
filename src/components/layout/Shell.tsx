import MobileNavigation from "@/components/layout/MobileNavigation";

type ShellProps = {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  rightPanel: React.ReactNode;
  children: React.ReactNode;
};

export default function Shell({ sidebar, header, rightPanel, children }: ShellProps) {
  return (
    <div className="shell-frame">
      <div className="shell-grid">
        <aside className="shell-sidebar" aria-label="Desktop sidebar">{sidebar}</aside>

        <div className="shell-content flex min-h-screen flex-col">
          <div className="shell-mobile-brand">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]">RS</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--text)]">Reality Shift</p>
                <p className="truncate text-xs text-[var(--text-faint)]">AI intelligence dashboard</p>
              </div>
            </div>
            <MobileNavigation>{sidebar}</MobileNavigation>
          </div>

          <header className="shell-header border-b p-4">{header}</header>
          <main className="shell-main flex-1">{children}</main>
        </div>

        <aside className="shell-right-panel" aria-label="AI briefing and scenario notes">{rightPanel}</aside>
      </div>
    </div>
  );
}
