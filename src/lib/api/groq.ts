import { requestJson, requireEnv } from "@/lib/api/client";
import { normalizeConfidence } from "@/lib/dashboard-logic.mjs";
import type {
  DashboardArticle,
  DashboardBrief,
  MarketQuote,
} from "@/types/dashboard";

type GroqMessage = {
  role: "system" | "user";
  content: string;
};

type GroqChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type GenerateBriefInput = {
  articles: DashboardArticle[];
  quotes: MarketQuote[];
};

function fallbackBrief(articles: DashboardArticle[]): DashboardBrief {
  return {
    headline: articles[0]?.title ?? "Market dashboard update",
    summary:
      articles[0]?.description ??
      "Latest market and news inputs are available for review.",
    takeaways: articles.slice(0, 3).map((article) => article.title),
    confidence: 0,
  };
}

function parseBrief(
  content: string,
  articles: DashboardArticle[],
): DashboardBrief {
  const fallback = fallbackBrief(articles);

  try {
    const parsed: unknown = JSON.parse(content);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return fallback;
    }

    const candidate = parsed as Partial<DashboardBrief>;
    const takeaways = Array.isArray(candidate.takeaways)
      ? candidate.takeaways.filter((item): item is string =>
          typeof item === "string" && item.trim().length > 0
        ).slice(0, 5)
      : [];

    return {
      headline:
        typeof candidate.headline === "string" && candidate.headline.trim()
          ? candidate.headline.trim()
          : fallback.headline,
      summary:
        typeof candidate.summary === "string" && candidate.summary.trim()
          ? candidate.summary.trim()
          : fallback.summary,
      takeaways: takeaways.length ? takeaways : fallback.takeaways,
      confidence: normalizeConfidence(candidate.confidence),
    };
  } catch {
    return fallback;
  }
}

export async function generateDashboardBrief({
  articles,
  quotes,
}: GenerateBriefInput): Promise<DashboardBrief> {
  if (articles.length === 0) {
    return fallbackBrief(articles);
  }

  const messages: GroqMessage[] = [
    {
      role: "system",
      content:
        "Return only compact JSON with headline, summary, takeaways, and confidence. No markdown. Confidence must be an integer from 0 to 100 representing your subjective confidence in this summary, not a calibrated probability or investment recommendation.",
    },
    {
      role: "user",
      content: JSON.stringify({
        articles: articles.slice(0, 6),
        quotes,
      }),
    },
  ];

  const data = await requestJson<GroqChatResponse>(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      apiName: "Groq",
      method: "POST",
      headers: {
        Authorization: `Bearer ${requireEnv("GROQ_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "llama-3.1-8b-instant",
        messages,
        temperature: 0.2,
        response_format: {
          type: "json_object",
        },
      }),
      next: {
        revalidate: 300,
      },
    },
  );

  return parseBrief(data.choices?.[0]?.message?.content ?? "", articles);
}

export async function generateArticleBrief(article: DashboardArticle): Promise<DashboardBrief> {
  const data = await requestJson<GroqChatResponse>(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      apiName: "Groq",
      method: "POST",
      headers: {
        Authorization: "Bearer " + requireEnv("GROQ_API_KEY"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "Analyze exactly one news article for a market intelligence dashboard. Return only JSON with headline, summary, takeaways, and confidence. Use only the supplied title, publisher, date, and description. Do not claim you read the full article URL. Separate reported facts from possible implications. Never invent prices, outcomes, statistics, or causal links. If the supplied description is insufficient, say so. Takeaways must be grounded in the supplied text. Confidence is subjective confidence in summary faithfulness, not a calibrated probability or investment recommendation.",
          },
          { role: "user", content: JSON.stringify({ article }) },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
      cache: "no-store",
    },
  );

  const parsed = parseBrief(data.choices?.[0]?.message?.content ?? "", [article]);
  return { ...parsed, headline: article.title };
}
