"use client";

import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Shell from "@/components/layout/Shell";
import Sidebar from "@/components/layout/Sidebar";
import EventCard from "@/components/cards/EventCard";
import ImpactCard from "@/components/cards/ImpactCard";
import ScenarioCard from "@/components/cards/ScenarioCard";
import NewsSwitcher from "@/components/layout/NewsSwitcher";
import type { AIBrief, DashboardArticle } from "@/types/dashboard";

type MetricItem = {
  label: string;
  name: string;
  value: string;
  change: string;
  description: string;
  intensity: number;
};

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

  const filteredArticles = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return articles;

    return articles.filter((article) => {
      const haystack = [article.title, article.description, article.source]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [articles, query]);

  const safeActiveIndex =
    filteredArticles.length === 0
      ? 0
      : Math.min(activeIndex, filteredArticles.length - 1);

  const activeArticle =
    filteredArticles[safeActiveIndex] ?? filteredArticles[0] ?? articles[0];
  const featuredShift = activeArticle
    ? {
        title: activeArticle.title,
        summary: activeArticle.description || brief.summary,
        confidence: brief.confidence,
        direction: "Risk-off",
        affectedNarratives: [
          "Policy divergence",
          "Dollar resilience",
          "Soft landing",
        ],
        affectedMarkets: quotes.map((q) => q.symbol).slice(0, 4),
        impactScore: brief.confidence,
        updatedAt: activeArticle.publishedAt || generatedAt,
      }
    : {
        title: brief.headline,
        summary: brief.summary,
        confidence: brief.confidence,
        direction: "Risk-off",
        affectedNarratives: [
          "Policy divergence",
          "Dollar resilience",
          "Soft landing",
        ],
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
          onQueryChange={setQuery}
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
              Top Reality Shifts Today
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
              AI-ranked macro, market, and narrative shifts with confidence
              scores, affected assets, and scenario movement.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["All signals", "Macro", "Markets", "High confidence"].map(
              (item, index) => (
                <button
                  key={item}
                  type="button"
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    index === 0
                      ? "border-[var(--border-strong)] bg-[var(--surface-strong)] text-[var(--text)]"
                      : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </section>

        <EventCard shift={featuredShift} />

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="dashboard-kicker">Live Analytics</p>
              <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">
                Market Impact Overview
              </h2>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Model consensus across tracked assets
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
            <p className="dashboard-kicker">Narrative Shift</p>
            <NewsSwitcher
              articles={filteredArticles}
              activeIndex={activeIndex}
              onChange={setActiveIndex}
            />
          </div>

          <div className="card p-5">
            <p className="dashboard-kicker">Next Watch</p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">
              {filteredArticles[1]?.title ??
                articles[1]?.title ??
                "CPI surprise threshold"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
              {filteredArticles[1]?.description ??
                articles[1]?.description ??
                "A hotter print would likely push delayed-cut probability above 65%."}
            </p>
          </div>
        </section>

        <div className="h-8" />
      </div>
    </Shell>
  );
}
