"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Radio,
  BarChart2,
  BookOpen,
  GitBranch,
  Bookmark,
  Settings,
  Compass,
} from "lucide-react";
import { useWatchlist } from "@/components/providers/WatchlistProvider";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Signals", href: "/signals", icon: Radio },
  { label: "Markets", href: "/markets", icon: BarChart2 },
  { label: "Narratives", href: "/narratives", icon: BookOpen },
  { label: "Scenarios", href: "/scenarios", icon: GitBranch },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { items, removeItem } = useWatchlist();

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
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={label}
              href={href}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${
                isActive
                  ? "border-[var(--border-strong)] bg-[var(--surface-strong)] text-[var(--text)] shadow-[var(--shadow-accent)]"
                  : "border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-soft)] text-[var(--accent)]">
                <Icon size={14} strokeWidth={1.75} />
              </span>
              <span className="hidden xl:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="panel p-4 xl:block">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-soft)] text-[var(--accent)]">
            <Bookmark size={15} strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">
              Watchlist
            </p>
            <p className="text-xs text-[var(--text-faint)]">
              Saved items for tracking
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {items.length ? (
            items.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="line-clamp-2 text-sm font-medium leading-5 text-[var(--text)]">
                    {item}
                  </p>
                  <button
                    onClick={() => removeItem(item)}
                    className="shrink-0 rounded-lg border border-transparent px-2 py-1 text-xs text-[var(--text-muted)] transition hover:border-[var(--border)] hover:bg-[var(--surface-strong)] hover:text-[var(--text)]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-3">
              <p className="text-sm text-[var(--text-muted)]">
                Nothing watched yet.
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--text-faint)]">
                Use the Watch button on articles or signals to save them here.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="panel hidden p-4 xl:block">
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
