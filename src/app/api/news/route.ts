import { NextRequest, NextResponse } from "next/server";
import { ApiClientError } from "@/lib/api/client";
import { fetchNewsPage } from "@/lib/api/news";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = Number(params.get("page") ?? "1");
  const pageSize = Number(params.get("pageSize") ?? "8");

  if (!Number.isInteger(page) || page < 1 || page > 100) {
    return NextResponse.json({ error: "Page must be an integer between 1 and 100." }, { status: 400 });
  }

  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 20) {
    return NextResponse.json({ error: "Page size must be an integer between 1 and 20." }, { status: 400 });
  }

  try {
    const result = await fetchNewsPage({ page, pageSize });
    return NextResponse.json(result, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=240" },
    });
  } catch (error) {
    const status = error instanceof ApiClientError && error.status === 429 ? 429 : 503;
    return NextResponse.json(
      { error: status === 429 ? "The news provider rate limit has been reached. Try again later." : "News is temporarily unavailable. Check the provider configuration and try again." },
      { status },
    );
  }
}
