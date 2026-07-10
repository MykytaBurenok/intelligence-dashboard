"use client";

import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import ShareButton from "@/components/dashboard/ShareButton";
import WatchButton from "@/components/dashboard/WatchButton";

type HeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
  watchItem?: string;
  shareTitle?: string;
  shareUrl?: string;
};

export default function Header({
  query,
  onQueryChange,
  watchItem,
  shareTitle = "Reality Shift",
  shareUrl,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 max-w-md flex-1 items-center gap-3">
        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--accent)] sm:flex">
          <span className="text-sm font-semibold">AI</span>
        </div>

        <input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search shifts, markets, narratives..."
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:bg-[var(--surface-strong)]"
        />
      </div>

      <div className="flex items-center gap-3">
        <ThemeSwitcher />
        <ShareButton title={shareTitle} url={shareUrl} />
        {watchItem ? <WatchButton item={watchItem} /> : null}
      </div>
    </div>
  );
}
