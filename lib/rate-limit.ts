/**
 * Small fixed-window rate limiter for public route handlers.
 *
 * State is kept in the module scope of a single server instance, so this is a
 * best-effort guard rather than a distributed limit: on serverless platforms
 * each instance keeps its own counters. That is still enough to stop a single
 * client from driving unbounded upstream work through one warm instance, which
 * is the case that matters here. Anything that needs a hard global limit should
 * use a shared store (Upstash/Redis) instead.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Keeps the map from growing without bound on a long-lived server. */
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Returns `ok: false` once the caller has exceeded `limit` requests in `windowMs`.
 * Expired windows are reset lazily, so callers never need to clear anything.
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { ok: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  const ok = existing.count <= limit;
  return {
    ok,
    remaining: Math.max(0, limit - existing.count),
    retryAfterSeconds: ok ? 0 : Math.ceil((existing.resetAt - now) / 1000),
  };
}

/**
 * Best-effort client identity for a request. On Vercel the leftmost
 * `x-forwarded-for` entry is the original client; the rest is only a fallback
 * for local development, where there is no proxy at all.
 */
export function clientKey(request: Request): string {
  const headers = request.headers;
  const forwarded = headers.get("x-forwarded-for");
  console.log("[DEBUG clientKey] xff=", JSON.stringify(forwarded), "realip=", JSON.stringify(headers.get("x-real-ip")));
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") || "local";
}
