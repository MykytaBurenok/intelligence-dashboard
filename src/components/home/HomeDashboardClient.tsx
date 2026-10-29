"use client";

import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Shell from "@/components/layout/Shell";
import Sidebar from "@/components/layout/Sidebar";
import EventCard from "@/components/cards/EventCard";
import ImpactCard from "@/components/cards/ImpactCard";
import ScenarioCard from "@/components/cards/ScenarioCard";
import NewsSwitcher from "@/components/layout/NewsSwitcher";
import { matchesNewsTopic } from "@/lib/dashboard-logic.mjs";
import type { AIBrief, DashboardArticle } from "@/types/dashboard";

type MetricItem = {
  label: string;
  name: string;
  value: string;
  change: string;
  description: string;
  intensity: number;
};

type NewsFilter = "All news" | "Macro" | "Markets" | "Technology";

type HomeDashboardClientProps = {
  articles: DashboardArticle[];
  generatedAt: string;
  metrics: MetricItem[];
  aiBrief: AIBrief;
  quotes: { symbol: string }[];
  brief: {
    headline: string;
    summary: string;
    confidence: number;
  };
};

const NEWS_FILTERS: NewsFilter[] = ["All news", "Macro", "Markets", "Technology"];

export default function HomeDashboardClient({
  articles,
  generatedAt,
  metrics,
  aiBrief,
  quotes,
  brief,
}: HomeDashboardClientProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<NewsFilter>("All news");

  const filteredArticles = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return articles.filter((article) => {
      const haystack = [article.title, article.description, article.source]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (!normalized || haystack.includes(normalized)) &&
        matchesNewsTopic(article, activeFilter);
    });
  }, [articles, query, activeFilter]);

  const safeActiveIndex =
    filteredArticles.length === 0
      ? 0
      : Math.min(activeIndex, filteredArticles.length - 1);

  const activeArticle =
    filteredArticles[safeActiveIndex] ?? filteredArticles[0];

  const featuredShift = activeArticle
    ? {
        title: activeArticle.title,
        summary: activeArticle.description || brief.summary,
        confidence: 0,
        direction: "Not assessed",
        affectedNarratives: [],
        affectedMarkets: quotes.map((q) => q.symbol).slice(0, 4),
        impactScore: 0,
        updatedAt: activeArticle.publishedAt || generatedAt,
      }
    : {
        title: brief.headline,
        summary: brief.summary,
        confidence: brief.confidence,
        direction: "Not assessed",
        affectedNarratives: [],
        affectedMarkets: quotes.map((q) => q.symbol).slice(0, 4),
        impactScore: brief.confidence,
        updatedAt: generatedAt,
      };

  return (
    <Shell
      sidebar={<Sidebar />}
      header={
        <Header
          query={query}
          onQueryChange={(value) => {
            setQuery(value);
            setActiveIndex(0);
          }}
          watchItem={activeArticle?.title ?? featuredShift.title}
          shareTitle={activeArticle?.title ?? featuredShift.title}
          shareUrl={activeArticle?.url}
        />
      }
      rightPanel={<ScenarioCard aiBrief={aiBrief} />}
    >
      <div className="mx-auto max-w-[1120px] space-y-6">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="dashboard-kicker">Reality Shift Monitor</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-semibold tracking-normal text-[var(--text)] sm:text-3xl">
              Latest News Snapshot
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
              Current news, market data, and an AI-generated briefing. Categories
              are keyword-based and are not investment signals.
            </p>
          </div>

          <div className="flex flex-wrap gap-2" aria-label="Filter news by topic">
            {NEWS_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={activeFilter === item}
                onClick={() => {
                  setActiveFilter(item);
                  setActiveIndex(0);
                }}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  activeFilter === item
                    ? "border-[var(--border-strong)] bg-[var(--surface-strong)] text-[var(--text)]"
                    : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {filteredArticles.length ? (
          <EventCard shift={featuredShift} />
        ) : (
          <section className="panel p-6" role="status">
            <h2 className="text-lg font-semibold text-[var(--text)]">No matching news</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Try another category or clear the search query.
            </p>
          </section>
        )}

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="dashboard-kicker">Live Analytics</p>
              <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">
                Market Snapshot
              </h2>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Values reflect the latest successfully retrieved inputs
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {metrics.map((item) => (
              <ImpactCard key={item.name} {...item} />
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card p-5">
            <p className="dashboard-kicker">News Feed</p>
            <NewsSwitcher
              articles={filteredArticles}
              activeIndex={activeIndex}
              onChange={setActiveIndex}
            />
          </div>

          <div className="card p-5">
            <p className="dashboard-kicker">Next Article</p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">
              {filteredArticles[safeActiveIndex + 1]?.title ?? "No additional article"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
              {filteredArticles[safeActiveIndex + 1]?.description ??
                "More articles will appear here when they are available from the news provider."}
            </p>
          </div>
        </section>

        <div className="h-8" />
      </div>
    </Shell>
  );
}
