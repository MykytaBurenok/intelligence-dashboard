import { requestJson, requireEnv } from "@/lib/api/client";
import { normalizeNewsArticles } from "@/lib/dashboard-logic.mjs";
import type { DashboardArticle } from "@/types/dashboard";

type NewsApiArticle = {
  title?: string;
  description?: string;
  url?: string;
  publishedAt?: string;
  source?: { name?: string };
};

type NewsApiResponse = {
  articles?: NewsApiArticle[];
  status?: string;
  totalResults?: number;
};

export type FetchNewsPageOptions = {
  query?: string;
  page?: number;
  pageSize?: number;
};

export type NewsPage = {
  articles: DashboardArticle[];
  page: number;
  pageSize: number;
  totalResults: number;
  hasMore: boolean;
};

export async function fetchNewsPage({
  query = "markets OR economy OR Federal Reserve OR inflation OR AI",
  page = 1,
  pageSize = 8,
}: FetchNewsPageOptions = {}): Promise<NewsPage> {
  const safePage = Math.min(100, Math.max(1, Math.floor(page)));
  const safePageSize = Math.min(100, Math.max(1, Math.floor(pageSize)));

  const data = await requestJson<NewsApiResponse>(
    "https://newsapi.org/v2/everything",
    {
      apiName: "NewsAPI",
      query: {
        apiKey: requireEnv("NEWSAPI_KEY"),
        q: query,
        language: "en",
        sortBy: "publishedAt",
        page: safePage,
        pageSize: safePageSize,
      },
      next: { revalidate: 300 },
    },
  );

  if (data.status && data.status !== "ok") {
    throw new Error("NewsAPI returned an unsuccessful status");
  }

  const articles = normalizeNewsArticles(data.articles);
  const totalResults =
    typeof data.totalResults === "number" && Number.isFinite(data.totalResults)
      ? Math.max(0, data.totalResults)
      : articles.length;

  return {
    articles,
    page: safePage,
    pageSize: safePageSize,
    totalResults,
    hasMore: safePage * safePageSize < totalResults && articles.length > 0,
  };
}

export async function fetchNews(
  options: FetchNewsPageOptions = {},
): Promise<DashboardArticle[]> {
  return (await fetchNewsPage(options)).articles;
}
