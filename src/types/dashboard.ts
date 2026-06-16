export type DashboardArticle = {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  description: string;
};

export type MarketQuote = {
  symbol: string;
  current: number;
  change: number;
  percentChange: number;
  previousClose: number;
};

export type DashboardBrief = {
  headline: string;
  summary: string;
  takeaways: string[];
  confidence: number;
};

export type DashboardData = {
  generatedAt: string;
  articles: DashboardArticle[];
  quotes: MarketQuote[];
  brief: DashboardBrief;
};

export type AIBrief = {
  whatThisMeans: string;
  keyTakeaways: string[];
  featuredTitle: string;
  scenarios: {
    label: string;
    probability: number;
  }[];
};
