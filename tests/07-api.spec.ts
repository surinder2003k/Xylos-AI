import { test, expect } from "@playwright/test";
import { hasBackend } from "./helpers";

test.describe("API Endpoints", () => {
  test("GET /api/automate should return 401 without auth", async ({ page }) => {
    // Resolving the session needs the backend; without it the route cannot tell
    // an anonymous caller from a misconfigured environment.
    test.skip(!hasBackend, "no Supabase backend configured");
    const response = await page.goto("/api/automate?count=1");
    expect(response?.status()).toBe(401);
  });

  test("POST /api/subscribe should accept valid emails", async ({ page }) => {
    test.skip(!hasBackend, "no SUPABASE_SERVICE_ROLE_KEY configured");
    const response = await page.request.post("/api/subscribe", {
      data: { email: "test-playwright@example.com" },
    });
    expect(response.status()).toBe(200);
  });

  test("POST /api/subscribe should reject invalid data", async ({ page }) => {
    const response = await page.request.post("/api/subscribe", {
      data: {},
    });
    expect(response.status()).toBe(400);
  });

  test("POST /api/upload should return 401 without auth", async ({ page }) => {
    const response = await page.request.post("/api/upload", {
      multipart: {},
    });
    expect(response.status()).toBe(401);
  });

  test("GET /api/chat should return 401 without auth", async ({ page }) => {
    const response = await page.request.post("/api/chat", {
      data: { messages: [] },
    });
    expect(response.status()).toBe(401);
  });

  test("POST /api/blog/generate should return 401 without auth", async ({ page }) => {
    const response = await page.request.post("/api/blog/generate", {
      data: { prompt: "test" },
    });
    expect(response.status()).toBe(401);
  });

  test("GET /api/models should return a well-formed provider catalog", async ({ page }) => {
    const response = await page.request.get("/api/models");
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(typeof data.generatedAt).toBe("string");
    expect(Array.isArray(data.providers)).toBe(true);
    expect(data.providers.length).toBeGreaterThan(0);
    for (const provider of data.providers) {
      expect(typeof provider.id).toBe("string");
      expect(typeof provider.label).toBe("string");
      expect(Array.isArray(provider.models)).toBe(true);
      for (const model of provider.models) {
        expect(typeof model.id).toBe("string");
        expect(model.id.length).toBeGreaterThan(0);
      }
    }
  });

  test("GET /api/models?refresh=1 should force a live refetch", async ({ page }) => {
    const response = await page.request.get("/api/models?refresh=1");
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.providers)).toBe(true);
    expect(data.providers.length).toBeGreaterThan(0);
  });

  // The catalog route is public, so a burst from one client must be rejected
  // rather than turned into a fan-out against every configured provider.
  test("GET /api/models should rate limit a burst from one client", async ({ page }) => {
    const codes: number[] = [];
    let retryAfter: string | null = null;
    for (let i = 0; i < 70; i++) {
      const response = await page.request.get("/api/models");
      codes.push(response.status());
      if (response.status() === 429 && retryAfter === null) {
        retryAfter = response.headers()["retry-after"] ?? null;
      }
    }

    const rejected = codes.filter((c) => c === 429).length;
    const allowed = codes.filter((c) => c === 200).length;
    const unexpected = codes.filter((c) => c !== 200 && c !== 429);

    // The window allows 60/min, so a 70-request burst cannot all be served.
    expect(unexpected, `unexpected statuses: ${[...new Set(unexpected)].join(", ")}`).toEqual([]);
    expect(allowed).toBeLessThanOrEqual(60);
    expect(rejected).toBeGreaterThan(0);
    expect(retryAfter).toBeTruthy();
  });

  test("sitemap.xml should serve valid XML", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const text = await response?.text();
    expect(text).toContain("<urlset");
    expect(text).toContain("</urlset>");
  });

  // Regression guard for soft-404s: a streamed shell (a loading.tsx above a
  // notFound() call) locks the response into HTTP 200, and Google then treats
  // every dead URL as an indexable duplicate.
  test("unknown blog slugs should return a real 404", async ({ page }) => {
    const response = await page.goto("/blog/this-slug-does-not-exist-e2e");
    expect(response?.status()).toBe(404);
  });

  test("unknown tool slugs should return a real 404", async ({ page }) => {
    const response = await page.goto("/tools/no-such-tool-e2e");
    expect(response?.status()).toBe(404);
  });

  // The RSS feed lives outside the blog route tree, so /blog/rss.xml is not a
  // valid post slug and must not be served as one.
  test("/blog/rss.xml should 404 rather than render as a post", async ({ page }) => {
    const response = await page.goto("/blog/rss.xml");
    expect(response?.status()).toBe(404);
  });

  // Guards the asset rule: public/ files are ignored by a broad *.png rule, so
  // the OpenGraph image silently disappeared from production builds.
  test("/og-image.png should be served", async ({ page }) => {
    const response = await page.request.get("/og-image.png");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });
});
