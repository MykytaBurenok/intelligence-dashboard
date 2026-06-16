import { fetchMarketQuotes } from "@/lib/api/finnhub";
import { generateDashboardBrief } from "@/lib/api/groq";
import { fetchNews } from "@/lib/api/news";
import type {
  DashboardArticle,
  DashboardBrief,
  DashboardData,
  MarketQuote,
} from "@/types/dashboard";

function fallbackBrief(articles: DashboardArticle[]): DashboardBrief {
  return {
    headline: articles[0]?.title ?? "Market dashboard update",
    summary:
      articles[0]?.description ??
      "Latest market and news inputs are available for review.",
    takeaways: articles.slice(0, 3).map((article) => article.title),
    confidence: 60,
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const [articles, quotes] = await Promise.all([
    fetchNews().catch(() => [] as DashboardArticle[]),
    fetchMarketQuotes().catch(() => [] as MarketQuote[]),
  ]);

  const brief = await generateDashboardBrief({ articles, quotes }).catch(() =>
    fallbackBrief(articles),
  );

  return {
    generatedAt: new Date().toISOString(),
    articles,
    quotes,
    brief,
  };
}
