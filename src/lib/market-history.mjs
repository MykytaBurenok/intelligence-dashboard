export const HISTORICAL_SYMBOLS = new Set(["SPY", "QQQ", "GLD", "USO"]);
export const HISTORICAL_RANGE_DAYS = { "1M": 30, "3M": 90, "1Y": 365 };

export function normalizeHistoryPoints(times, closes, timestampsInSeconds = false) {
  if (!Array.isArray(times) || !Array.isArray(closes) || times.length !== closes.length) return [];

  const byTimestamp = new Map();
  for (let index = 0; index < times.length; index += 1) {
    const timestamp = times[index];
    const close = closes[index];
    if (!Number.isFinite(timestamp) || typeof close !== "number" || !Number.isFinite(close) || close <= 0) continue;
    byTimestamp.set(timestampsInSeconds ? timestamp * 1000 : timestamp, close);
  }

  return [...byTimestamp.entries()]
    .map(([time, close]) => ({ time, close }))
    .sort((a, b) => a.time - b.time);
}

export function isSupportedHistoryRequest(symbol, range) {
  return HISTORICAL_SYMBOLS.has(symbol) && Object.hasOwn(HISTORICAL_RANGE_DAYS, range);
}
