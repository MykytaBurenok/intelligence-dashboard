"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Shell from "@/components/layout/Shell";
import Sidebar from "@/components/layout/Sidebar";
import ImpactCard from "@/components/cards/ImpactCard";
import ScenarioCard from "@/components/cards/ScenarioCard";
import NewsFeed from "@/components/home/NewsFeed";
import HistoricalMarketChart from "@/components/markets/HistoricalMarketChart";
import { matchesNewsTopic } from "@/lib/dashboard-logic.mjs";
import type { AIBrief, DashboardArticle, DashboardBrief } from "@/types/dashboard";

type MetricItem = {
  label: string;
  name: string;
  value: string;
  change: string;
  description: string;
  intensity: number;
};

type NewsFilter = "All news" | "Macro" | "Markets" | "Technology";
type FeedDensity = "comfortable" | "compact";

type HomeDashboardClientProps = {
  articles: DashboardArticle[];
  generatedAt: string;
  metrics: MetricItem[];
  aiBrief: AIBrief;
  brief: {
    headline: string;
    summary: string;
    confidence: number;
  };
};

const FILTERS: NewsFilter[] = ["All news", "Macro", "Markets", "Technology"];

type ArticleBriefResponse = DashboardBrief & { error?: string };

function toAIBrief(brief: DashboardBrief): AIBrief {
  return { whatThisMeans: brief.summary, keyTakeaways: brief.takeaways, featuredTitle: brief.headline, scenarios: [] };
}

function articleFallback(article: DashboardArticle): AIBrief {
  return {
    whatThisMeans: article.description || "The publisher did not provide a description for this story.",
    keyTakeaways: article.description ? [article.description] : [],
    featuredTitle: article.title,
    scenarios: [],
  };
}

export default function HomeDashboardClient({
  articles,
  generatedAt,
  metrics,
  aiBrief,
  brief,
}: HomeDashboardClientProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<NewsFilter>("All news");
  const [selectedArticle, setSelectedArticle] = useState<DashboardArticle>();
  const [articleAnalysis, setArticleAnalysis] = useState<{
    articleUrl: string;
    brief: AIBrief;
    error?: string;
  }>();
  const [density, setDensity] = useState<FeedDensity>("comfortable");

  useEffect(() => {
    const readPreferences = () => {
      try {
        const savedFilter = window.localStorage.getItem("dashboard:default-news-filter");
        const savedDensity = window.localStorage.getItem("dashboard:feed-density");
        if (FILTERS.includes(savedFilter as NewsFilter)) {
          setActiveFilter(savedFilter as NewsFilter);
        }
        setDensity(savedDensity === "compact" ? "compact" : "comfortable");
      } catch {
        // Preferences are optional; the feed stays usable when storage is blocked.
      }
    };

    readPreferences();
    window.addEventListener("dashboard-preferences-change", readPreferences);
    return () => window.removeEventListener("dashboard-preferences-change", readPreferences);
  }, []);

  const onArticleChange = useCallback((article: DashboardArticle | undefined) => {
    setSelectedArticle(article);
  }, []);

  useEffect(() => {
    if (!selectedArticle) return;

    const controller = new AbortController();

    fetch("/api/article-brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ article: selectedArticle }),
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = (await response.json()) as ArticleBriefResponse;
        if (!response.ok) throw new Error(payload.error || "Article analysis is temporarily unavailable.");
        return payload;
      })
      .then((payload) => {
        if (!controller.signal.aborted) {
          setArticleAnalysis({ articleUrl: selectedArticle.url, brief: toAIBrief(payload) });
        }
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        if (!controller.signal.aborted) {
          setArticleAnalysis({
            articleUrl: selectedArticle.url,
            brief: articleFallback(selectedArticle),
            error: "AI analysis is unavailable. Showing the publisher-provided description instead.",
          });
        }
      });

    return () => controller.abort();
  }, [selectedArticle]);

  const currentArticleAnalysis = selectedArticle && articleAnalysis?.articleUrl === selectedArticle.url
    ? articleAnalysis
    : undefined;
  const articleBrief = selectedArticle
    ? currentArticleAnalysis?.brief ?? articleFallback(selectedArticle)
    : aiBrief;
  const shareTitle = selectedArticle?.title ?? brief.headline;
  const shareUrl = selectedArticle?.url;

  const filteredCount = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return articles.filter((article) => {
      const haystack = [article.title, article.description, article.source]
        .filter(Boolean).join(" ").toLowerCase();
      return (!normalized || haystack.includes(normalized)) && matchesNewsTopic(article, activeFilter);
    }).length;
  }, [articles, query, activeFilter]);

  return (
    <Shell
      sidebar={<Sidebar />}
      header={
        <Header
          query={query}
          onQueryChange={setQuery}
          watchItem={selectedArticle?.title ?? shareTitle}
          shareTitle={shareTitle}
          shareUrl={shareUrl}
        />
      }
      rightPanel={
        <ScenarioCard
          aiBrief={articleBrief}
          isLoading={Boolean(selectedArticle && !currentArticleAnalysis)}
          analysisError={currentArticleAnalysis?.error}
        />
      }
    >
      <div className="mx-auto max-w-[1120px] space-y-7">
        <section className="flex flex-col gap-4 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="dashboard-kicker">Intelligence workspace</p>
            <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
              Market &amp; News Monitor
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
              A source-backed view of current coverage and market quotes. Topic labels use keyword matching and are not investment signals.
            </p>
          </div>
          <div className="shrink-0 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
            <p className="text-xs text-[var(--text-faint)]">Articles in current snapshot</p>
            <p className="mt-1 text-xl font-semibold text-[var(--text)]">{filteredCount}</p>
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="dashboard-kicker">Market data</p>
              <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">Market Snapshot</h2>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Latest successful provider responses · {`${new Date(generatedAt).toISOString().replace("T", " ").slice(0, 16)} UTC`}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {metrics.map((item) => <ImpactCard key={item.name} {...item} />)}
          </div>
          <div className="mt-6">
            <HistoricalMarketChart />
          </div>
        </section>

        <section aria-labelledby="news-coverage-title" className="space-y-3">
          <div>
            <p className="dashboard-kicker">Signal discovery</p>
            <h2 id="news-coverage-title" className="mt-1 text-xl font-semibold text-[var(--text)]">Latest News &amp; Coverage</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Search and filter provider-sourced stories. Topic labels are heuristic, not verified market signals.</p>
          </div>
          <NewsFeed
            initialArticles={articles}
            query={query}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onArticleChange={onArticleChange}
            showFilters
            density={density}
          />
        </section>
      </div>
    </Shell>
  );
}
