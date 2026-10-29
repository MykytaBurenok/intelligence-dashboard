import { NextRequest, NextResponse } from "next/server";
import { ApiClientError, requestJson, requireEnv } from "@/lib/api/client";

export const dynamic = "force-dynamic";

const ALLOWED_SYMBOLS = new Set(["SPY", "QQQ", "GLD", "USO"]);
const RANGE_DAYS = { "1M": 30, "3M": 90, "1Y": 365 } as const;
type RangeKey = keyof typeof RANGE_DAYS;
type FinnhubCandles = { s?: string; t?: number[]; c?: number[] };
type HistoryPoint = { time: number; close: number };

function isRange(value: string | null): value is RangeKey {
  return value !== null && Object.hasOwn(RANGE_DAYS, value);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const symbol = (params.get("symbol") ?? "SPY").trim().toUpperCase();
  const range = params.get("range") ?? "3M";

  if (!ALLOWED_SYMBOLS.has(symbol)) {
    return NextResponse.json({ error: "Unsupported symbol. Choose SPY, QQQ, GLD, or USO." }, { status: 400 });
  }
  if (!isRange(range)) {
    return NextResponse.json({ error: "Unsupported range. Choose 1M, 3M, or 1Y." }, { status: 400 });
  }

  const to = Math.floor(Date.now() / 1000);
  const from = to - RANGE_DAYS[range] * 24 * 60 * 60;

  try {
    const payload = await requestJson<FinnhubCandles>("https://finnhub.io/api/v1/stock/candle", {
      apiName: "Finnhub historical candles",
      query: { symbol, resolution: "D", from, to, token: requireEnv("FINNHUB_KEY") },
      next: { revalidate: 900 },
    });

    if (payload.s !== "ok" || !Array.isArray(payload.t) || !Array.isArray(payload.c) || payload.t.length !== payload.c.length) {
      return NextResponse.json({ error: "Historical data is unavailable for this symbol or range." }, { status: 503 });
    }

    const points: HistoryPoint[] = payload.t.flatMap((time, index) => {
      const close = payload.c?.[index];
      return Number.isFinite(time) && Number.isFinite(close) && close! > 0
        ? [{ time: time * 1000, close: close! }]
        : [];
    });

    if (points.length < 2) {
      return NextResponse.json({ error: "Not enough valid historical observations were returned." }, { status: 503 });
    }

    return NextResponse.json({ symbol, range, points, source: "Finnhub", fetchedAt: new Date().toISOString() }, {
      headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" },
    });
  } catch (error) {
    const status = error instanceof ApiClientError && error.status === 429 ? 429 : 503;
    return NextResponse.json(
      { error: status === 429 ? "Finnhub rate limit reached. Try again later." : "Historical market data is temporarily unavailable." },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }
}
