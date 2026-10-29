import test from "node:test";
import assert from "node:assert/strict";
import {
  isValidFinnhubQuote,
  normalizeConfidence,
  normalizeWatchlist,
  normalizeNewsArticles,
  matchesNewsTopic,
  getNewsPageMeta,
} from "../src/lib/dashboard-logic.mjs";

test("Finnhub quote validation accepts finite zero moves but rejects empty provider payloads", () => {
  assert.equal(isValidFinnhubQuote({ c: 100, d: 0, dp: 0, pc: 100 }), true);
  assert.equal(isValidFinnhubQuote({ c: 0, d: 0, dp: 0, pc: 0 }), false);
  assert.equal(isValidFinnhubQuote({ c: 100, d: 1, dp: Infinity, pc: 99 }), false);
  assert.equal(isValidFinnhubQuote({ c: 100, d: 1, pc: 99 }), false);
  assert.equal(isValidFinnhubQuote(null), false);
});

test("confidence is restricted to finite values from 0 through 100", () => {
  assert.equal(normalizeConfidence(0), 0);
  assert.equal(normalizeConfidence(87.5), 87.5);
  assert.equal(normalizeConfidence(101), 0);
  assert.equal(normalizeConfidence(-1), 0);
  assert.equal(normalizeConfidence(Number.NaN), 0);
  assert.equal(normalizeConfidence("90"), 0);
});

test("watchlist normalization trims, removes duplicates, filters invalid entries and caps size", () => {
  assert.deepEqual(normalizeWatchlist([" SPY ", "SPY", "", 7, " QQQ "]), ["SPY", "QQQ"]);
  assert.deepEqual(normalizeWatchlist({ items: ["SPY"] }), []);
  assert.equal(normalizeWatchlist(Array.from({ length: 110 }, (_, i) => "item-" + i)).length, 100);
});

test("news normalization drops unusable articles and never invents publication dates", () => {
  const result = normalizeNewsArticles([
    { title: " Market update ", url: "https://example.com/story", publishedAt: "not-a-date", source: { name: " Wire " } },
    { title: "No URL" },
    { title: "  ", url: "https://example.com/blank" },
  ]);
  assert.equal(result.length, 1);
  assert.deepEqual(result[0], {
    title: "Market update",
    source: "Wire",
    url: "https://example.com/story",
    publishedAt: "",
    description: "",
  });
  assert.deepEqual(normalizeNewsArticles(null), []);
});

test("topic filters classify matching text and leave unrelated text out", () => {
  const article = { title: "Federal Reserve holds interest rates", description: "", source: "Wire" };
  assert.equal(matchesNewsTopic(article, "Macro"), true);
  assert.equal(matchesNewsTopic(article, "Technology"), false);
  assert.equal(matchesNewsTopic(article, "All news"), true);
  assert.equal(matchesNewsTopic(article, "unknown"), false);
});

test("news pagination metadata handles boundaries and empty pages", () => {
  assert.deepEqual(getNewsPageMeta(1, 8, 17, 8), {
    page: 1, pageSize: 8, totalResults: 17, hasMore: true,
  });
  assert.deepEqual(getNewsPageMeta(3, 8, 17, 1), {
    page: 3, pageSize: 8, totalResults: 17, hasMore: false,
  });
  assert.deepEqual(getNewsPageMeta(0, 8, 17, 8), {
    page: 1, pageSize: 8, totalResults: 17, hasMore: true,
  });
  assert.deepEqual(getNewsPageMeta(1, 8, Number.NaN, 0), {
    page: 1, pageSize: 8, totalResults: 0, hasMore: false,
  });
});
