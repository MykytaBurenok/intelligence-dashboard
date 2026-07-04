"use client";

import { useState } from "react";
import type { DashboardArticle } from "@/types/dashboard";
import WatchButton from "@/components/dashboard/WatchButton";

type NewsSwitcherProps = {
  articles: DashboardArticle[];
};

export default function NewsSwitcher({ articles }: NewsSwitcherProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!articles.length) return null;

  const activeArticle = articles[activeIndex];

  return (
    <section className="card p-5">
      <div className="flex flex-wrap gap-2">
        {articles.slice(0, 5).map((article, index) => (
          <button
            key={`${article.title}-${index}`}
            onClick={() => setActiveIndex(index)}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
              activeIndex === index
                ? "border-[var(--border-strong)] bg-[var(--surface-strong)] text-[var(--text)]"
                : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)]"
            }`}
          >
            News {index + 1}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">
          {activeArticle.title}
        </h2>

        <WatchButton item={activeArticle.title} />
      </div>

      <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
        {activeArticle.description ?? "No description available."}
      </p>
    </section>
  );
}
