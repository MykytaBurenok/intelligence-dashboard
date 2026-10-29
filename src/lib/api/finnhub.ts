import { ApiClientError, requestJson, requireEnv } from "@/lib/api/client";
import type { MarketQuote } from "@/types/dashboard";

type FinnhubQuoteResponse = {
  c?: number;
  d?: number;
  dp?: number;
  pc?: number;
};

function finiteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

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

  if (
    !finiteNumber(data.c) ||
    !finiteNumber(data.d) ||
    !finiteNumber(data.dp) ||
    !finiteNumber(data.pc) ||
    (data.c === 0 && data.pc === 0)
  ) {
    throw new ApiClientError(`Finnhub returned no valid quote for ${symbol}`);
  }

  return {
    symbol,
    current: data.c,
    change: data.d,
    percentChange: data.dp,
    previousClose: data.pc,
  };
}

export async function fetchMarketQuotes(
  symbols = ["SPY", "QQQ", "GLD", "USO"],
): Promise<MarketQuote[]> {
  const results = await Promise.allSettled(symbols.map((symbol) => fetchQuote(symbol)));
  return results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
}
