import { requestJson, requireEnv } from "@/lib/api/client";
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
        pageSize,
      },
      next: {
        revalidate: 300,
      },
    },
  );

  return (data.articles ?? [])
    .filter((article) => article.title && article.url)
    .map((article) => ({
      title: article.title ?? "",
      source: article.source?.name ?? "Unknown source",
      url: article.url ?? "",
      publishedAt: article.publishedAt ?? new Date().toISOString(),
      description: article.description ?? "",
    }));
}
