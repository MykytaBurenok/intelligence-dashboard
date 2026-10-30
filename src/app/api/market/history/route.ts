import { NextRequest, NextResponse } from "next/server";
import { ApiClientError, requestJson, requireEnv } from "@/lib/api/client";
import { HISTORICAL_RANGE_DAYS, HISTORICAL_SYMBOLS, normalizeHistoryPoints } from "@/lib/market-history.mjs";

export const dynamic = "force-dynamic";

type RangeKey = keyof typeof HISTORICAL_RANGE_DAYS;
type HistoryPoint = { time: number; close: number };
type FinnhubCandles = { s?: string; t?: number[]; c?: number[] };
type YahooChartResponse = {
  chart?: {
    error?: { description?: string } | null;
    result?: Array<{
      timestamp?: number[];
      indicators?: { quote?: Array<{ close?: Array<number | null> }> };
    }> | null;
  };
};

function isRange(value: string | null): value is RangeKey {
  return value !== null && Object.hasOwn(HISTORICAL_RANGE_DAYS, value);
}


async function fetchFinnhubHistory(symbol: string, from: number, to: number): Promise<HistoryPoint[]> {
  const payload = await requestJson<FinnhubCandles>("https://finnhub.io/api/v1/stock/candle", {
    apiName: "Finnhub historical candles",
    query: { symbol, resolution: "D", from, to, token: requireEnv("FINNHUB_KEY") },
    next: { revalidate: 900 },
  });

  return payload.s === "ok" ? normalizeHistoryPoints(payload.t, payload.c, true) : [];
}

async function fetchYahooHistory(symbol: string, from: number, to: number): Promise<HistoryPoint[]> {
  const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`);
  url.searchParams.set("period1", String(from));
  url.searchParams.set("period2", String(to));
  url.searchParams.set("interval", "1d");
  url.searchParams.set("events", "history");

  const payload = await requestJson<YahooChartResponse>(url.toString(), {
    apiName: "Yahoo Finance historical candles",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; IntelligenceDashboard/1.0)" },
    next: { revalidate: 900 },
  });
  const result = payload.chart?.result?.[0];
  return normalizeHistoryPoints(result?.timestamp, result?.indicators?.quote?.[0]?.close, true);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const symbol = (params.get("symbol") ?? "SPY").trim().toUpperCase();
  const range = params.get("range") ?? "3M";

  if (!HISTORICAL_SYMBOLS.has(symbol)) {
    return NextResponse.json({ error: "Unsupported symbol. Choose SPY, QQQ, GLD, or USO." }, { status: 400 });
  }
  if (!Object.hasOwn(HISTORICAL_RANGE_DAYS, range)) {
    return NextResponse.json({ error: "Unsupported range. Choose 1M, 3M, or 1Y." }, { status: 400 });
  }

  const to = Math.floor(Date.now() / 1000);
  const from = to - HISTORICAL_RANGE_DAYS[range as RangeKey] * 24 * 60 * 60;
  let points: HistoryPoint[] = [];
  let source = "";

  try {
    try {
      points = await fetchFinnhubHistory(symbol, from, to);
      if (points.length >= 2) source = "Finnhub";
    } catch {
      // Continue to the secondary provider if Finnhub is unconfigured or unavailable.
    }

    if (points.length < 2) {
      points = await fetchYahooHistory(symbol, from, to);
      if (points.length >= 2) source = "Yahoo Finance";
    }

    if (points.length < 2) {
      return NextResponse.json(
        { error: "No historical prices were returned by Finnhub or Yahoo Finance for this symbol and range." },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json({ symbol, range, points, source, fetchedAt: new Date().toISOString() }, {
      headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" },
    });
  } catch (error) {
    const status = error instanceof ApiClientError && error.status === 429 ? 429 : 503;
    return NextResponse.json(
      {
        error: status === 429
          ? "The market data provider rate limit was reached. Try again later."
          : "Historical data is temporarily unavailable from both market data providers.",
      },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }
}
