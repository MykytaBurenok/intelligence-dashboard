import { NextRequest, NextResponse } from "next/server";
import { ApiClientError } from "@/lib/api/client";
import { generateArticleBrief } from "@/lib/api/groq";
import type { DashboardArticle } from "@/types/dashboard";

export const dynamic = "force-dynamic";

function parseArticle(value: unknown): DashboardArticle | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.title !== "string" ||
    typeof candidate.source !== "string" ||
    typeof candidate.url !== "string" ||
    typeof candidate.description !== "string" ||
    typeof candidate.publishedAt !== "string"
  ) return null;

  const title = candidate.title.trim();
  const source = candidate.source.trim();
  const description = candidate.description.trim();
  const publishedAt = candidate.publishedAt.trim();
  if (!title || title.length > 240 || source.length > 160 || description.length > 2000) return null;

  let url: URL;
  try { url = new URL(candidate.url); } catch { return null; }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (publishedAt && Number.isNaN(Date.parse(publishedAt))) return null;

  return { title, source, url: url.toString(), description, publishedAt };
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "A valid JSON request body is required." }, { status: 400 });
  }

  const candidate = body && typeof body === "object" && !Array.isArray(body)
    ? (body as Record<string, unknown>).article
    : undefined;
  const article = parseArticle(candidate);
  if (!article) {
    return NextResponse.json({ error: "A valid article with bounded text fields is required." }, { status: 400 });
  }

  try {
    const brief = await generateArticleBrief(article);
    return NextResponse.json(brief, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const status = error instanceof ApiClientError && error.status === 429 ? 429 : 503;
    return NextResponse.json(
      { error: status === 429 ? "The AI provider rate limit has been reached. Try again later." : "Article analysis is temporarily unavailable." },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }
}
