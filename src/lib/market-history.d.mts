export const HISTORICAL_SYMBOLS: Set<string>;
export const HISTORICAL_RANGE_DAYS: {
  readonly "1M": 30;
  readonly "3M": 90;
  readonly "1Y": 365;
};
export type HistoricalPoint = { time: number; close: number };
export function normalizeHistoryPoints(
  times: number[] | undefined,
  closes: Array<number | null> | undefined,
  timestampsInSeconds?: boolean,
): HistoricalPoint[];
export function isSupportedHistoryRequest(symbol: string, range: string): boolean;
