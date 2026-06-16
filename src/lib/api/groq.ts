import { requestJson, requireEnv } from "@/lib/api/client";
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
    confidence: 60,
  };
}

function parseBrief(
  content: string,
  articles: DashboardArticle[],
): DashboardBrief {
  try {
    const parsed = JSON.parse(content) as Partial<DashboardBrief>;

    return {
      headline: parsed.headline || fallbackBrief(articles).headline,
      summary: parsed.summary || fallbackBrief(articles).summary,
      takeaways:
        Array.isArray(parsed.takeaways) && parsed.takeaways.length > 0
          ? parsed.takeaways.slice(0, 5).map(String)
          : fallbackBrief(articles).takeaways,
      confidence:
        typeof parsed.confidence === "number" ? parsed.confidence : 60,
    };
  } catch {
    return fallbackBrief(articles);
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
        "Return only compact JSON with headline, summary, takeaways, and confidence. No markdown.",
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
