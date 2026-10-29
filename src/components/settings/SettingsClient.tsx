"use client";

import { useEffect, useState } from "react";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import { useWatchlist } from "@/components/providers/WatchlistProvider";

const PREFERENCES_EVENT = "dashboard-preferences-change";
const DEFAULT_FILTER_KEY = "dashboard:default-news-filter";
const DENSITY_KEY = "dashboard:feed-density";
const filters = ["All news", "Macro", "Markets", "Technology"] as const;
type NewsFilter = (typeof filters)[number];
type Density = "comfortable" | "compact";

function readFilter(): NewsFilter {
  const value = window.localStorage.getItem(DEFAULT_FILTER_KEY);
  return filters.includes(value as NewsFilter) ? value as NewsFilter : "All news";
}

function readDensity(): Density {
  return window.localStorage.getItem(DENSITY_KEY) === "compact" ? "compact" : "comfortable";
}

export default function SettingsClient() {
  const [defaultFilter, setDefaultFilter] = useState<NewsFilter>("All news");
  const [density, setDensity] = useState<Density>("comfortable");
  const [saved, setSaved] = useState(false);
  const { items, removeItem } = useWatchlist();

  useEffect(() => {
    // Load saved preferences after hydration so server and client markup match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDefaultFilter(readFilter());
    setDensity(readDensity());
  }, []);

  function savePreferences(nextFilter = defaultFilter, nextDensity = density) {
    window.localStorage.setItem(DEFAULT_FILTER_KEY, nextFilter);
    window.localStorage.setItem(DENSITY_KEY, nextDensity);
    window.dispatchEvent(new Event(PREFERENCES_EVENT));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  function resetPreferences() {
    setDefaultFilter("All news");
    setDensity("comfortable");
    savePreferences("All news", "comfortable");
  }

  return (
    <div className="space-y-5">
      <section className="card p-5 sm:p-6">
        <div>
          <p className="dashboard-kicker">Appearance</p>
          <h2 className="mt-1 text-lg font-semibold text-[var(--text)]">Theme</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Theme changes apply immediately and are saved in this browser.
          </p>
        </div>
        <div className="mt-4 inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-2">
          <ThemeSwitcher />
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <p className="dashboard-kicker">News experience</p>
        <h2 className="mt-1 text-lg font-semibold text-[var(--text)]">Feed preferences</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Choose the default topic and density for the home feed. Preferences are local to this browser.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[var(--text)]">
            Default topic
            <select
              value={defaultFilter}
              onChange={(event) => {
                const value = event.target.value as NewsFilter;
                setDefaultFilter(value);
                savePreferences(value, density);
              }}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3"
            >
              {filters.map((filter) => <option key={filter} value={filter}>{filter}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-[var(--text)]">
            Card density
            <select
              value={density}
              onChange={(event) => {
                const value = event.target.value as Density;
                setDensity(value);
                savePreferences(defaultFilter, value);
              }}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3"
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </label>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => savePreferences()} className="premium-button rounded-xl px-4 py-2.5 text-sm font-semibold">
            Save preferences
          </button>
          <button type="button" onClick={resetPreferences} className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--text-muted)]">
            Reset to defaults
          </button>
          {saved ? <span className="text-sm text-[var(--success)]" role="status">Preferences saved</span> : null}
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="dashboard-kicker">Workspace</p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--text)]">Watchlist</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Saved stories are stored in this browser only. They are not synced across devices.
            </p>
          </div>
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
            {items.length} saved
          </span>
        </div>
        {items.length ? (
          <ul className="mt-4 divide-y divide-[var(--border)]">
            {items.map((item) => (
              <li key={item} className="flex items-start justify-between gap-4 py-3">
                <span className="text-sm leading-6 text-[var(--text)]">{item}</span>
                <button type="button" onClick={() => removeItem(item)} className="shrink-0 text-xs font-semibold text-[var(--danger)]">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-[var(--border)] p-4 text-sm text-[var(--text-muted)]">
            Your watchlist is empty. Use Watch on any story to save it here.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
        <p className="text-sm font-semibold text-[var(--text)]">API configuration</p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Provider keys are configured as server-side deployment environment variables. They are never entered or stored in this page.
        </p>
      </section>
    </div>
  );
}
