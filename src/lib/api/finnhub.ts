import { requestJson, requireEnv } from "@/lib/api/client";
import type { MarketQuote } from "@/types/dashboard";

type FinnhubQuoteResponse = {
  c?: number;
  d?: number;
  dp?: number;
  pc?: number;
};

export async function fetchQuote(symbol: string): Promise<MarketQuote> {
  const data = await requestJson<FinnhubQuoteResponse>(
    "https://finnhub.io/api/v1/quote",
    {
      apiName: "Finnhub",
      query: {
        symbol,
        token: requireEnv("FINNHUB_KEY"),
      },
      next: {
        revalidate: 60,
      },
    },
  );

  return {
    symbol,
    current: data.c ?? 0,
    change: data.d ?? 0,
    percentChange: data.dp ?? 0,
    previousClose: data.pc ?? 0,
  };
}

export async function fetchMarketQuotes(
  symbols = ["SPY", "QQQ", "GLD", "USO"],
) {
  return Promise.all(symbols.map((symbol) => fetchQuote(symbol)));
}
