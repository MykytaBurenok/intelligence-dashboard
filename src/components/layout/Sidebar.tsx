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
  { label: "Home", description: "News and market overview", href: "/", icon: Home },
  { label: "Signals", description: "Observed metrics, not forecasts", href: "/signals", icon: Radio },
  { label: "Markets", description: "Quotes and daily moves", href: "/markets", icon: BarChart2 },
  { label: "Narratives", description: "Themes in current coverage", href: "/narratives", icon: BookOpen },
  { label: "Scenarios", description: "Forecasts when a model exists", href: "/scenarios", icon: GitBranch },
  { label: "Explore", description: "Browse and paginate stories", href: "/explore", icon: Compass },
  { label: "Settings", description: "Theme, feed and saved items", href: "/settings", icon: Settings },
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
            <p className="truncate text-lg font-semibold tracking-tight text-[var(--text)]">Reality Shift</p>
            <p className="truncate text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-faint)]">Intelligence Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="grid gap-2" aria-label="Main navigation">
        {navItems.map(({ label, description, href, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              aria-current={isActive ? "page" : undefined}
              aria-label={`${label}: ${description}`}
              title={`${label}: ${description}`}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                isActive
                  ? "border-[var(--border-strong)] bg-[var(--surface-strong)] text-[var(--text)] shadow-[var(--shadow-accent)]"
                  : "border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-soft)] text-[var(--accent)]">
                <Icon size={14} strokeWidth={1.75} />
              </span>
              <span className="sidebar-label hidden min-w-0 xl:block">
                <span className="block text-sm font-medium">{label}</span>
                <span className="mt-0.5 block text-[11px] leading-4 text-[var(--text-faint)]">{description}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <section className="sidebar-watchlist panel hidden p-4 xl:block" aria-label="Watchlist">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-soft)] text-[var(--accent)]">
            <Bookmark size={15} strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">Watchlist</p>
            <p className="text-xs text-[var(--text-faint)]">{items.length} saved {items.length === 1 ? "item" : "items"}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {items.length ? items.map((item) => (
            <div key={item} className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="line-clamp-2 text-sm font-medium leading-5 text-[var(--text)]">{item}</p>
                <button
                  type="button"
                  onClick={() => removeItem(item)}
                  aria-label={`Remove ${item} from watchlist`}
                  className="shrink-0 rounded-lg border border-transparent px-2 py-1 text-xs text-[var(--text-muted)] transition hover:border-[var(--border)] hover:bg-[var(--surface-strong)] hover:text-[var(--text)]"
                >
                  Remove
                </button>
              </div>
            </div>
          )) : (
            <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-3">
              <p className="text-sm text-[var(--text-muted)]">Nothing saved yet.</p>
              <p className="mt-1 text-xs leading-5 text-[var(--text-faint)]">Use Watch on an article to save it here. Items stay in this browser.</p>
            </div>
          )}
        </div>
      </section>

      <div className="hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 xl:block">
        <p className="text-sm font-semibold text-[var(--text)]">Research workspace</p>
        <p className="mt-1 text-xs leading-5 text-[var(--text-faint)]">News and market inputs are shown with source limitations. No calibrated forecast model is connected.</p>
      </div>
    </div>
  );
}
