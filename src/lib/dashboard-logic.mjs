const TOPIC_PATTERNS = {
  Macro: /inflation|federal reserve|\bfed\b|interest rate|central bank|econom(y|ic)|gdp|jobs report|treasury|bond yield|monetary policy|cpi|pce/i,
  Markets: /stock|equity|market|shares|s&p|nasdaq|dow jones|\betf\b|bond|yield|dollar|gold|oil|crude|forex|bitcoin/i,
  Technology: /artificial intelligence|\bai\b|technology|tech|chip|semiconductor|software|cyber|data center|cloud computing/i,
};

export function isValidFinnhubQuote(data) {
  const values = [data?.c, data?.d, data?.dp, data?.pc];
  return values.every((value) => typeof value === "number" && Number.isFinite(value)) &&
    !(data.c === 0 && data.pc === 0);
}

export function normalizeConfidence(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100
    ? value
    : 0;
}

export function normalizeWatchlist(value) {
  if (!Array.isArray(value)) return [];
  const items = value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
  return [...new Set(items)].slice(0, 100);
}

export function normalizeNewsArticles(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((article) =>
      typeof article?.title === "string" &&
      article.title.trim().length > 0 &&
      typeof article?.url === "string" &&
      article.url.trim().length > 0
    )
    .map((article) => ({
      title: article.title.trim(),
      source: typeof article.source?.name === "string" && article.source.name.trim()
        ? article.source.name.trim()
        : "Unknown source",
      url: article.url.trim(),
      publishedAt: typeof article.publishedAt === "string" &&
        !Number.isNaN(Date.parse(article.publishedAt))
        ? article.publishedAt
        : "",
      description: typeof article.description === "string" ? article.description : "",
    }));
}

export function matchesNewsTopic(article, filter) {
  if (filter === "All news") return true;
  const pattern = TOPIC_PATTERNS[filter];
  if (!pattern) return false;
  const text = [article?.title, article?.description, article?.source]
    .filter((part) => typeof part === "string")
    .join(" ");
  return pattern.test(text);
}
