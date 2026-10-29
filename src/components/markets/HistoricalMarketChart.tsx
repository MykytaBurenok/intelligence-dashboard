"use client";

import { useEffect, useMemo, useState } from "react";

type RangeKey = "1M" | "3M" | "1Y";
type Point = { time: number; close: number };
type HistoryResponse = { symbol: string; range: RangeKey; points: Point[]; source: string; fetchedAt: string; error?: string };

const SYMBOLS = ["SPY", "QQQ", "GLD", "USO"] as const;
const RANGES: RangeKey[] = ["1M", "3M", "1Y"];
const WIDTH = 760;
const HEIGHT = 260;
const PAD = { top: 20, right: 18, bottom: 34, left: 18 };

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

function formatDate(value: number, range: RangeKey) {
  return new Intl.DateTimeFormat("en-US", range === "1Y" ? { month: "short", year: "2-digit" } : { month: "short", day: "numeric" }).format(new Date(value));
}

function formatReturn(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export default function HistoricalMarketChart() {
  const [symbol, setSymbol] = useState<(typeof SYMBOLS)[number]>("SPY");
  const [range, setRange] = useState<RangeKey>("3M");
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/market/history?symbol=${symbol}&range=${range}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = (await response.json()) as HistoryResponse;
        if (!response.ok) throw new Error(payload.error || "Historical data could not be loaded.");
        return payload;
      })
      .then((payload) => setData(payload))
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === "AbortError") return;
        setData(null);
        setError(cause instanceof Error ? cause.message : "Historical data could not be loaded.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });

    return () => controller.abort();
  }, [symbol, range]);

  const chart = useMemo(() => {
    const points = data?.points ?? [];
    if (points.length < 2) return null;
    const values = points.map((point) => point.close);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || max * 0.01 || 1;
    const plotWidth = WIDTH - PAD.left - PAD.right;
    const plotHeight = HEIGHT - PAD.top - PAD.bottom;
    const coords = points.map((point, index) => ({
      ...point,
      x: PAD.left + (index / (points.length - 1)) * plotWidth,
      y: PAD.top + ((max - point.close) / span) * plotHeight,
    }));
    return { coords, min, max, first: points[0], last: points[points.length - 1],
      path: coords.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" "),
      area: `${coords[0].x} ${HEIGHT - PAD.bottom} ` + coords.map((point) => `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ") + ` L ${coords[coords.length - 1].x} ${HEIGHT - PAD.bottom} Z`,
    };
  }, [data]);

  const selectedPoint = chart && activeIndex !== null ? chart.coords[activeIndex] : null;
  const totalReturn = chart ? ((chart.last.close / chart.first.close) - 1) * 100 : 0;

  return (
    <section className="card overflow-hidden p-4 sm:p-6" aria-labelledby="historical-chart-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="dashboard-kicker">Historical performance</p>
          <h2 id="historical-chart-title" className="mt-1 text-xl font-semibold text-[var(--text)]">Price history</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Daily closing prices · source: Finnhub</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <span>Asset</span>
          <select value={symbol} onChange={(event) => { setSymbol(event.target.value as (typeof SYMBOLS)[number]); setLoading(true); setError(""); setActiveIndex(null); }} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-semibold text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]">
            {SYMBOLS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-1" aria-label="Chart time range">
          {RANGES.map((item) => (
            <button key={item} type="button" aria-pressed={range === item} onClick={() => { setRange(item); setLoading(true); setError(""); setActiveIndex(null); }} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${range === item ? "bg-[var(--accent)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`}>{item}</button>
          ))}
        </div>
        {chart && !loading && <div className={`text-sm font-semibold ${totalReturn >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>{formatReturn(totalReturn)} <span className="font-normal text-[var(--text-faint)]">over {range}</span></div>}
      </div>

      <div className="relative mt-4 min-h-[220px]">
        {loading ? (
          <div className="flex h-[260px] flex-col justify-end gap-3 pb-2" aria-label="Loading historical data">
            <div className="h-2/3 animate-pulse rounded-xl bg-[var(--surface-soft)]" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-[var(--surface-soft)]" />
          </div>
        ) : error ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] px-6 text-center">
            <p className="text-sm font-semibold text-[var(--text)]">Historical data unavailable</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)]">{error}</p>
            <p className="mt-2 text-xs text-[var(--text-faint)]">Check that FINNHUB_KEY is configured and the provider supports this symbol.</p>
          </div>
        ) : chart ? (
          <>
            {selectedPoint && <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"><span className="font-semibold text-[var(--text)]">{formatPrice(selectedPoint.close)}</span><span className="text-[var(--text-muted)]">{formatDate(selectedPoint.time, range)}</span></div>}
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`${symbol} historical daily closing prices over ${range}`} className="block w-full overflow-visible" onMouseLeave={() => setActiveIndex(null)}>
              {[0, 0.5, 1].map((fraction) => { const y = PAD.top + fraction * (HEIGHT - PAD.top - PAD.bottom); return <line key={fraction} x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} stroke="var(--border)" strokeDasharray="4 6" />; })}
              <path d={`M ${chart.coords[0].x} ${HEIGHT - PAD.bottom} ${chart.area.slice(chart.area.indexOf("L"))}`} fill="var(--accent)" opacity="0.09" />
              <path d={chart.path} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              {selectedPoint && <line x1={selectedPoint.x} x2={selectedPoint.x} y1={PAD.top} y2={HEIGHT - PAD.bottom} stroke="var(--text-faint)" strokeDasharray="3 4" /> }
              {chart.coords.map((point, index) => <circle key={point.time} cx={point.x} cy={point.y} r={activeIndex === index ? 5 : 2} fill="var(--accent)" opacity={activeIndex === null || activeIndex === index ? 1 : 0.18} onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} onClick={() => setActiveIndex(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActiveIndex(index); } }} tabIndex={index % 5 === 0 ? 0 : -1} role="button" aria-label={`${formatDate(point.time, range)} close ${formatPrice(point.close)}`} />)}
              <text x={PAD.left} y={HEIGHT - 8} fill="var(--text-faint)" fontSize="11">{formatDate(chart.first.time, range)}</text>
              <text x={WIDTH - PAD.right} y={HEIGHT - 8} textAnchor="end" fill="var(--text-faint)" fontSize="11">{formatDate(chart.last.time, range)}</text>
            </svg>
            <div className="mt-3 grid grid-cols-3 gap-3 border-t border-[var(--border)] pt-4">
              <div><p className="text-xs text-[var(--text-faint)]">Period low</p><p className="mt-1 text-sm font-semibold text-[var(--text)]">{formatPrice(chart.min)}</p></div>
              <div><p className="text-xs text-[var(--text-faint)]">Latest close</p><p className="mt-1 text-sm font-semibold text-[var(--text)]">{formatPrice(chart.last.close)}</p></div>
              <div><p className="text-xs text-[var(--text-faint)]">Period high</p><p className="mt-1 text-sm font-semibold text-[var(--text)]">{formatPrice(chart.max)}</p></div>
            </div>
            <p className="mt-4 text-xs leading-5 text-[var(--text-faint)]">Daily closes are historical observations, not real-time ticks. Returns are calculated from the first and last available closes in this response. {data?.fetchedAt ? `Fetched ${new Date(data.fetchedAt).toLocaleString()}.` : ""}</p>
          </>
        ) : null}
      </div>
    </section>
  );
}
