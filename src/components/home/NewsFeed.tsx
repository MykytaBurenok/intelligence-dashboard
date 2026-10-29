"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, LoaderCircle, RefreshCw } from "lucide-react";
import WatchButton from "@/components/dashboard/WatchButton";
import { matchesNewsTopic } from "@/lib/dashboard-logic.mjs";
import type { DashboardArticle } from "@/types/dashboard";

const PAGE_SIZE = 8;
const FILTERS = ["All news", "Macro", "Markets", "Technology"] as const;
type NewsFilter = (typeof FILTERS)[number];

type NewsPageResponse = {
  articles: DashboardArticle[];
  page: number;
  pageSize: number;
  totalResults: number;
  hasMore: boolean;
  error?: string;
};

type NewsFeedProps = {
  initialArticles: DashboardArticle[];
  query?: string;
  activeFilter?: NewsFilter;
  onFilterChange?: (filter: NewsFilter) => void;
  onArticleChange?: (article: DashboardArticle | undefined) => void;
  showFilters?: boolean;
  density?: "comfortable" | "compact";
};

function formatDate(value: string) {
  if (!value) return "Time unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time unavailable";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function NewsFeed({
  initialArticles,
  query = "",
  activeFilter = "All news",
  onFilterChange,
  onArticleChange,
  showFilters = false,
  density = "comfortable",
}: NewsFeedProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [selectedUrl, setSelectedUrl] = useState(initialArticles[0]?.url ?? "");
  const [nextApiPage, setNextApiPage] = useState(2);
  const [hasMore, setHasMore] = useState(initialArticles.length >= PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const stripRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return articles.filter((article) => {
      const searchable = [article.title, article.description, article.source]
        .filter(Boolean).join(" ").toLowerCase();
      return (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        matchesNewsTopic(article, activeFilter);
    });
  }, [articles, query, activeFilter]);

  const foundIndex = filteredArticles.findIndex((article) => article.url === selectedUrl);
  const safeIndex = foundIndex >= 0 ? foundIndex : 0;
  const selectedArticle = filteredArticles[safeIndex];

  useEffect(() => {
    onArticleChange?.(selectedArticle);
  }, [selectedArticle, onArticleChange]);

  useEffect(() => {
    cardRefs.current[safeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [safeIndex]);

  async function loadMore(): Promise<DashboardArticle[]> {
    if (isLoading || !hasMore) return [];
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/news?page=${nextApiPage}&pageSize=${PAGE_SIZE}`);
      const payload = (await response.json()) as NewsPageResponse;
      if (!response.ok) {
        throw new Error(payload.error || "Unable to load more news.");
      }

      const knownUrls = new Set(articles.map((article) => article.url));
      const added = payload.articles.filter((article) => !knownUrls.has(article.url));
      setArticles((current) => {
        const currentUrls = new Set(current.map((article) => article.url));
        return [...current, ...added.filter((article) => !currentUrls.has(article.url))];
      });
      setHasMore(payload.hasMore && payload.articles.length > 0);
      setNextApiPage(payload.page + 1);
      return added;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load more news.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  async function moveSelection(direction: -1 | 1) {
    const nextIndex = safeIndex + direction;
    if (nextIndex >= 0 && nextIndex < filteredArticles.length) {
      setSelectedUrl(filteredArticles[nextIndex].url);
      return;
    }
    if (direction === 1 && hasMore && !isLoading) {
      const added = await loadMore();
      const normalizedQuery = query.trim().toLowerCase();
      const nextArticle = added.find((article) => {
        const searchable = [article.title, article.description, article.source]
          .filter(Boolean).join(" ").toLowerCase();
        return (!normalizedQuery || searchable.includes(normalizedQuery)) &&
          matchesNewsTopic(article, activeFilter);
      });
      if (nextArticle) setSelectedUrl(nextArticle.url);
    }
  }

  const currentPage = Math.floor(safeIndex / PAGE_SIZE);
  const currentPageStart = currentPage * PAGE_SIZE;
  const pageArticles = filteredArticles.slice(currentPageStart, currentPageStart + PAGE_SIZE);
  const pageDotIndex = safeIndex - currentPageStart;

  return (
    <section className="space-y-5" aria-label="News feed">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="dashboard-kicker">News Feed</p>
          <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">Latest coverage</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {filteredArticles.length} loaded · Select a story to inspect it
          </p>
        </div>
        {showFilters && onFilterChange ? (
          <div className="flex flex-wrap gap-2" aria-label="Filter news by topic">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                aria-pressed={activeFilter === filter}
                onClick={() => onFilterChange(filter)}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  activeFilter === filter
                    ? "border-[var(--border-strong)] bg-[var(--surface-strong)] text-[var(--text)]"
                    : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {selectedArticle ? (
        <article className="panel p-5 sm:p-6" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                Selected story · {safeIndex + 1} of {filteredArticles.length}
              </p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight text-[var(--text)] sm:text-3xl">
                {selectedArticle.title}
              </h3>
              <p className="mt-2 text-xs text-[var(--text-faint)]">
                {selectedArticle.source} · {formatDate(selectedArticle.publishedAt)}
              </p>
            </div>
            <WatchButton item={selectedArticle.title} />
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-[var(--text-muted)]">
            {selectedArticle.description || "The provider did not supply a description for this article."}
          </p>
          <a
            href={selectedArticle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:opacity-80"
          >
            Read original article <ExternalLink size={14} />
          </a>
        </article>
      ) : (
        <div className="panel p-6" role="status">
          <h3 className="font-semibold text-[var(--text)]">No matching articles</h3>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Change the topic or search term. More stories can also be loaded from the provider.
          </p>
          {hasMore ? (
            <button type="button" onClick={() => void loadMore()} disabled={isLoading} className="premium-button mt-4 rounded-xl px-4 py-2 text-sm">
              {isLoading ? "Loading…" : "Load more stories"}
            </button>
          ) : null}
        </div>
      )}

      <div
        ref={stripRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3"
        aria-label="Scrollable story selection"
      >
        {filteredArticles.map((article, index) => (
          <button
            key={article.url}
            ref={(node) => { cardRefs.current[index] = node; }}
            type="button"
            aria-pressed={activeArticle?.url === article.url}
            onClick={() => setSelectedUrl(article.url)}
            className={`group shrink-0 snap-start rounded-2xl border text-left transition ${density === "compact" ? "w-[220px] p-3 sm:w-[250px]" : "w-[260px] p-4 sm:w-[300px]"} ${
              activeArticle?.url === article.url
                ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-[var(--shadow-accent)]"
                : "border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--border-strong)]"
            }`}
          >
            <span className="text-xs font-semibold text-[var(--accent)]">
              {article.source}
            </span>
            <span className="mt-2 block line-clamp-3 min-h-[4.5rem] text-sm font-semibold leading-6 text-[var(--text)]">
              {article.title}
            </span>
            <span className="mt-3 block line-clamp-2 text-xs leading-5 text-[var(--text-muted)]">
              {article.description || "No summary provided by source."}
            </span>
            <span className="mt-4 block text-xs text-[var(--text-faint)]">
              {formatDate(article.publishedAt)}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void moveSelection(-1)}
            disabled={safeIndex === 0}
            aria-label="Previous story"
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-2.5 text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-1.5" aria-label="Story pagination">
            {pageArticles.map((article, index) => (
              <button
                key={article.url}
                type="button"
                aria-label={`Select story ${currentPageStart + index + 1}`}
                aria-current={pageDotIndex === index ? "page" : undefined}
                onClick={() => setSelectedUrl(article.url)}
                className={`h-2 rounded-full transition-all ${
                  pageDotIndex === index
                    ? "w-6 bg-[var(--accent)]"
                    : "w-2 bg-[var(--border-strong)] hover:bg-[var(--text-faint)]"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => void moveSelection(1)}
            disabled={safeIndex >= filteredArticles.length - 1 && !hasMore || isLoading}
            aria-label="Next story"
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-2.5 text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-faint)]">
            {hasMore ? "More stories available" : "End of available feed"}
          </span>
          <button
            type="button"
            onClick={loadMore}
            disabled={!hasMore || isLoading}
            className="premium-button inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isLoading ? <LoaderCircle size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            {isLoading ? "Loading" : "Load more"}
          </button>
        </div>
      </div>
      {error ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--danger)]/30 bg-[var(--surface-soft)] p-3" role="alert">
          <p className="text-sm text-[var(--text-muted)]">{error}</p>
          <button type="button" onClick={() => void loadMore()} disabled={isLoading} className="text-sm font-semibold text-[var(--accent)]">
            Retry
          </button>
        </div>
      ) : null}
    </section>
  );
}
