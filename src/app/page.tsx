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

  const metrics: MetricItem[] = [
    {
      label: "Market",
      name: data.quotes[0]?.symbol ?? "DXY",
      value: data.quotes[0] ? data.quotes[0].current.toFixed(2) : "—",
      change: data.quotes[0]
        ? `${data.quotes[0].percentChange >= 0 ? "+" : ""}${data.quotes[0].percentChange.toFixed(2)}%`
        : "—",
      description: "Dollar index reaction to macro policy shift.",
      intensity: Math.min(
        Math.abs(data.quotes[0]?.percentChange ?? 0) * 20,
        100,
      ),
    },
    {
      label: "Commodities",
      name: data.quotes[1]?.symbol ?? "Gold",
      value: data.quotes[1] ? data.quotes[1].current.toFixed(2) : "—",
      change: data.quotes[1]
        ? `${data.quotes[1].percentChange >= 0 ? "+" : ""}${data.quotes[1].percentChange.toFixed(2)}%`
        : "—",
      description: "Safe haven demand tracked against dollar moves.",
      intensity: Math.min(
        Math.abs(data.quotes[1]?.percentChange ?? 0) * 15,
        100,
      ),
    },
    {
      label: "Narrative",
      name: "Narrative strength",
      value: `${data.brief.confidence}`,
      change: "+0.9",
      description: "Policy divergence cluster gaining cross-source support.",
      intensity: data.brief.confidence,
    },
    {
      label: "Scenario",
      name: data.brief.takeaways[0] ?? "Delayed-cut probability",
      value: "58%",
      change: "+11%",
      description: "Consensus path shifts toward a longer hold window.",
      intensity: 58,
    },
  ];

  const aiBrief = buildAIBrief(data);

  return (
    <HomeDashboardClient
      articles={data.articles}
      generatedAt={data.generatedAt}
      metrics={metrics}
      aiBrief={aiBrief}
      quotes={data.quotes}
      brief={data.brief}
    />
  );
}
