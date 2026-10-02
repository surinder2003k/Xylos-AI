import { NextRequest, NextResponse } from "next/server";
import { getModelCatalog } from "@/lib/ai/model-catalog";

export const dynamic = "force-dynamic";

/**
 * GET /api/models — live catalog of free, currently-served models grouped by
 * configured provider. Public on purpose: the payload is only model ids (no
 * secrets) and the in-memory 1h cache keeps upstream calls bounded. The chat
 * page uses it to populate the model picker; `?refresh=1` forces a refetch.
 */
export async function GET(request: NextRequest) {
  try {
    const refresh = request.nextUrl.searchParams.get("refresh") === "1";
    const catalog = await getModelCatalog(refresh);
    return NextResponse.json(catalog, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=1800",
      },
    });
  } catch (err) {
    console.error("[Models API]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Failed to build model catalog." }, { status: 500 });
  }
}
