import { test, expect } from "@playwright/test";

test.describe("API Endpoints", () => {
  test("GET /api/automate should return 401 without auth", async ({ page }) => {
    const response = await page.goto("/api/automate?count=1");
    expect(response?.status()).toBe(401);
  });

  test("POST /api/subscribe should accept valid emails", async ({ page }) => {
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

  test("sitemap.xml should serve valid XML", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const text = await response?.text();
    expect(text).toContain("<urlset");
    expect(text).toContain("</urlset>");
  });
});
