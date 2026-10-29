import { ApiClientError, requestJson, requireEnv } from "@/lib/api/client";
import { isValidFinnhubQuote } from "@/lib/dashboard-logic.mjs";
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

  if (!isValidFinnhubQuote(data)) {
    throw new ApiClientError(`Finnhub returned no valid quote for ${symbol}`);
  }

  return {
    symbol,
    current: data.c!,
    change: data.d!,
    percentChange: data.dp!,
    previousClose: data.pc!,
  };
}

export async function fetchMarketQuotes(
  symbols = ["SPY", "QQQ", "GLD", "USO"],
): Promise<MarketQuote[]> {
  const results = await Promise.allSettled(symbols.map((symbol) => fetchQuote(symbol)));
  return results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
}
