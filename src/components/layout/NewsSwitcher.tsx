"use client";

import { useState } from "react";
import type { DashboardArticle } from "@/types/dashboard";
import WatchButton from "@/components/dashboard/WatchButton";

type NewsSwitcherProps = {
  articles: DashboardArticle[];
  activeIndex?: number;
  onChange?: (index: number) => void;
};

function formatPublishedAt(value: string) {
  if (!value) return "Publication time unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Publication time unavailable";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NewsSwitcher({
  articles,
  activeIndex,
  onChange,
}: NewsSwitcherProps) {
  const [internalIndex, setInternalIndex] = useState(0);

  if (!articles.length) {
    return (
      <div className="mt-3 text-sm text-[var(--text-muted)]" role="status">
        No news available right now.
      </div>
    );
  }

  const visibleArticles = articles.slice(0, 5);
  const isControlled =
    typeof activeIndex === "number" && typeof onChange === "function";

  const currentIndex = isControlled ? activeIndex : internalIndex;
  const safeIndex = Math.min(Math.max(0, currentIndex), visibleArticles.length - 1);
  const activeArticle = visibleArticles[safeIndex];

  function handleChange(index: number) {
    if (isControlled && onChange) {
      onChange(index);
      return;
    }

    setInternalIndex(index);
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2" aria-label="Choose article">
        {visibleArticles.map((article, index) => (
          <button
            key={`${article.title}-${index}`}
            type="button"
            aria-pressed={safeIndex === index}
            onClick={() => handleChange(index)}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              safeIndex === index
                ? "border-[var(--border-strong)] bg-[var(--surface-strong)] text-[var(--text)]"
                : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            News {index + 1}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <h2 className="min-w-0 flex-1 text-lg font-semibold text-[var(--text)]">
          {activeArticle.title}
        </h2>
        <WatchButton item={activeArticle.title} />
      </div>

      <p className="mt-2 text-xs text-[var(--text-faint)]">
        {activeArticle.source} · {formatPublishedAt(activeArticle.publishedAt)}
      </p>

      <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
        {activeArticle.description || "No description available."}
      </p>

      <a
        href={activeArticle.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center text-sm font-semibold text-[var(--accent)] transition hover:opacity-80"
      >
        Open article
      </a>
    </div>
  );
}
