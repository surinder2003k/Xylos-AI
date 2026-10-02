import { NextRequest, NextResponse } from "next/server";
import { getModelCatalog } from "@/lib/ai/model-catalog";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * GET /api/models — live catalog of free, currently-served models grouped by
 * configured provider. Public on purpose: the payload is only model ids (no
 * secrets) and the catalog is cached, so the chat page can populate the model
 * picker before anything is authenticated. `?refresh=1` asks for an up-to-date
 * catalog.
 *
 * The endpoint is public, so it is rate limited per client, and `?refresh=1`
 * additionally cannot force upstream calls more often than once a minute (see
 * getModelCatalog) — otherwise a single client could turn this route into a
 * fan-out against every configured provider.
 */
const LIMIT_PER_MINUTE = 60;

export async function GET(request: NextRequest) {
  try {
    const gate = rateLimit(clientKey(request), {
      limit: LIMIT_PER_MINUTE,
      windowMs: 60_000,
    });
    if (!gate.ok) {
      return NextResponse.json(
        { error: "Too many requests. Try again shortly." },
        { status: 429, headers: { "Retry-After": String(gate.retryAfterSeconds) } }
      );
    }

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
