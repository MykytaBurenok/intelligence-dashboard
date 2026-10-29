import type { AIBrief, DashboardData } from "@/types/dashboard";

export function buildAIBrief(data: DashboardData): AIBrief {
  return {
    whatThisMeans: data.brief.summary,
    keyTakeaways: data.brief.takeaways,
    featuredTitle: data.brief.headline,
    // Probabilities must come from a calibrated model, not hardcoded demo values.
    scenarios: [],
  };
}
