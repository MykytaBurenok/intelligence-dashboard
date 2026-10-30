import test from "node:test";
import assert from "node:assert/strict";
import {
  HISTORICAL_RANGE_DAYS,
  HISTORICAL_SYMBOLS,
  isSupportedHistoryRequest,
  normalizeHistoryPoints,
} from "../src/lib/market-history.mjs";

test("historical points reject null, non-finite, zero, and negative closes", () => {
  const points = normalizeHistoryPoints(
    [100, 200, 300, 400, 500, 600],
    [10, null, 0, -2, Number.NaN, 15],
  );
  assert.deepEqual(points, [{ time: 100, close: 10 }, { time: 600, close: 15 }]);
});

test("historical points are sorted chronologically and duplicate timestamps are collapsed", () => {
  const points = normalizeHistoryPoints([300, 100, 100, 200], [30, 10, 11, 20]);
  assert.deepEqual(points, [
    { time: 100, close: 11 },
    { time: 200, close: 20 },
    { time: 300, close: 30 },
  ]);
});

test("provider timestamps in seconds are normalized to milliseconds", () => {
  assert.deepEqual(normalizeHistoryPoints([1_700_000_000], [100], true), [
    { time: 1_700_000_000_000, close: 100 },
  ]);
});

test("mismatched provider arrays are rejected rather than partially paired", () => {
  assert.deepEqual(normalizeHistoryPoints([100, 200], [10]), []);
});

test("historical request allowlist only accepts supported symbols and ranges", () => {
  assert.equal(isSupportedHistoryRequest("SPY", "1M"), true);
  assert.equal(isSupportedHistoryRequest("QQQ", "1Y"), true);
  assert.equal(isSupportedHistoryRequest("BTC", "1M"), false);
  assert.equal(isSupportedHistoryRequest("SPY", "ALL"), false);
  assert.deepEqual([...HISTORICAL_SYMBOLS], ["SPY", "QQQ", "GLD", "USO"]);
  assert.deepEqual(HISTORICAL_RANGE_DAYS, { "1M": 30, "3M": 90, "1Y": 365 });
});
