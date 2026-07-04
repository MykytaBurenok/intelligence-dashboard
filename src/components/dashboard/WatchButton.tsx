"use client";

import { useWatchlist } from "@/components/providers/WatchlistProvider";

type WatchButtonProps = {
  item: string;
};

export default function WatchButton({ item }: WatchButtonProps) {
  const { toggleItem, isWatched } = useWatchlist();
  const watched = isWatched(item);

  return (
    <button
      onClick={() => toggleItem(item)}
      className={`shrink-0 rounded-xl border px-3 py-2 text-sm font-medium transition ${
        watched
          ? "border-[var(--border-strong)] bg-[var(--surface-strong)] text-[var(--text)]"
          : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)] hover:text-[var(--text)]"
      }`}
    >
      {watched ? "Watching" : "Watch"}
    </button>
  );
}
