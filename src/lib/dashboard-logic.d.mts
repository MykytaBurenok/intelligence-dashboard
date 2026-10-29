import type { DashboardArticle } from "@/types/dashboard";

export function isValidFinnhubQuote(data: unknown): boolean;
export function normalizeConfidence(value: unknown): number;
export function normalizeWatchlist(value: unknown): string[];
export function normalizeNewsArticles(value: unknown): DashboardArticle[];
export function matchesNewsTopic(
  article: Pick<DashboardArticle, "title" | "description" | "source">,
  filter: "All news" | "Macro" | "Markets" | "Technology",
): boolean;
