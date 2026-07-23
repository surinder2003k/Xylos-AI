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

  test("sitemap.xml should serve valid XML", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const text = await response?.text();
    expect(text).toContain("<urlset");
    expect(text).toContain("</urlset>");
  });
});
