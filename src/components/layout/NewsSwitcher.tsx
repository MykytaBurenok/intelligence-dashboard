"use client";

import { useState } from "react";
import type { DashboardArticle } from "@/types/dashboard";
import WatchButton from "@/components/dashboard/WatchButton";

type NewsSwitcherProps = {
  articles: DashboardArticle[];
};

export default function NewsSwitcher({ articles }: NewsSwitcherProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!articles.length) {
    return (
      <div className="mt-3 text-sm text-[var(--text-muted)]">
        No news available right now.
      </div>
    );
  }

  const visibleArticles = articles.slice(0, 5);
  const safeIndex = Math.min(activeIndex, visibleArticles.length - 1);
  const activeArticle = visibleArticles[safeIndex];

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        {visibleArticles.map((article, index) => (
          <button
            key={`${article.title}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
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
        {activeArticle.source} ·{" "}
        {new Date(activeArticle.publishedAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
        {activeArticle.description ?? "No description available."}
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
