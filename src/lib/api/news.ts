import { requestJson, requireEnv } from "@/lib/api/client";
import { normalizeNewsArticles } from "@/lib/dashboard-logic.mjs";
import type { DashboardArticle } from "@/types/dashboard";

type NewsApiArticle = {
  title?: string;
  description?: string;
  url?: string;
  publishedAt?: string;
  source?: {
    name?: string;
  };
};

type NewsApiResponse = {
  articles?: NewsApiArticle[];
  status?: string;
};

type FetchNewsOptions = {
  query?: string;
  pageSize?: number;
};

export async function fetchNews({
  query = "markets OR economy OR Federal Reserve OR inflation OR AI",
  pageSize = 8,
}: FetchNewsOptions = {}): Promise<DashboardArticle[]> {
  const data = await requestJson<NewsApiResponse>(
    "https://newsapi.org/v2/everything",
    {
      apiName: "NewsAPI",
      query: {
        apiKey: requireEnv("NEWSAPI_KEY"),
        q: query,
        language: "en",
        sortBy: "publishedAt",
        pageSize: Math.min(100, Math.max(1, Math.floor(pageSize))),
      },
      next: {
        revalidate: 300,
      },
    },
  );

  if (data.status && data.status !== "ok") {
    throw new Error("NewsAPI returned an unsuccessful status");
  }

  return normalizeNewsArticles(data.articles);
}
