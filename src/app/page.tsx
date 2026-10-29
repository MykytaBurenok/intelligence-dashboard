import { getDashboardData } from "@/lib/dashboard";
import { buildAIBrief } from "@/lib/dashboard-helpers";
import HomeDashboardClient from "@/components/home/HomeDashboardClient";

export const dynamic = "force-dynamic";

type MetricItem = {
  label: string;
  name: string;
  value: string;
  change: string;
  description: string;
  intensity: number;
};

export default async function HomePage() {
  const data = await getDashboardData();
  const primaryQuote = data.quotes[0];
  const secondaryQuote = data.quotes[1];

  const metrics: MetricItem[] = [
    {
      label: "Market",
      name: primaryQuote?.symbol ?? "Market quote",
      value: primaryQuote ? primaryQuote.current.toFixed(2) : "Unavailable",
      change: primaryQuote
        ? `${primaryQuote.percentChange > 0 ? "+" : ""}${primaryQuote.percentChange.toFixed(2)}%`
        : "No live quote",
      description: primaryQuote
        ? "Latest quote returned by the market data provider."
        : "Market data is currently unavailable. Check API configuration and provider status.",
      intensity: primaryQuote
        ? Math.min(Math.abs(primaryQuote.percentChange) * 20, 100)
        : 0,
    },
    {
      label: "Market ETF",
      name: secondaryQuote?.symbol ?? "Secondary quote",
      value: secondaryQuote ? secondaryQuote.current.toFixed(2) : "Unavailable",
      change: secondaryQuote
        ? `${secondaryQuote.percentChange > 0 ? "+" : ""}${secondaryQuote.percentChange.toFixed(2)}%`
        : "No live quote",
      description: secondaryQuote
        ? "Latest quote returned by the market data provider."
        : "No second quote is available from the market data provider.",
      intensity: secondaryQuote
        ? Math.min(Math.abs(secondaryQuote.percentChange) * 15, 100)
        : 0,
    },
    {
      label: "News",
      name: "Fetched articles",
      value: String(data.articles.length),
      change: "Latest batch",
      description: "Articles returned by the configured news provider for this request.",
      intensity: Math.min(data.articles.length * 10, 100),
    },
    {
      label: "AI briefing",
      name: "Model-reported confidence",
      value: data.brief.confidence > 0 ? `${data.brief.confidence}%` : "Unavailable",
      change: data.brief.confidence > 0 ? "Subjective estimate" : "No validated estimate",
      description: "Self-reported model confidence, not a calibrated probability or investment signal.",
      intensity: data.brief.confidence > 0 ? data.brief.confidence : 0,
    },
  ];

  const aiBrief = buildAIBrief(data);

  return (
    <HomeDashboardClient
      articles={data.articles}
      generatedAt={data.generatedAt}
      metrics={metrics}
      aiBrief={aiBrief}
      brief={data.brief}
    />
  );
}
