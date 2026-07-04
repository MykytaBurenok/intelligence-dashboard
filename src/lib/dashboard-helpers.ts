import type { AIBrief, DashboardData } from "@/types/dashboard";

export function buildAIBrief(data: DashboardData): AIBrief {
  return {
    whatThisMeans: data.brief.summary,
    keyTakeaways: data.brief.takeaways,
    featuredTitle: data.brief.headline,
    scenarios: [
      { label: "Delayed cuts", probability: 58 },
      { label: "Soft landing", probability: 34 },
      { label: "Recession risk", probability: 8 },
    ],
  };
}
