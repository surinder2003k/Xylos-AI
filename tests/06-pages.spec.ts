import { test, expect } from "@playwright/test";

test.describe("Static Pages", () => {
  test("privacy page should load", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/privacy");
    await expect(page.locator("h1")).toBeVisible();
    expect(consoleErrors.length).toBe(0);
  });

  test("sitemap should be accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const text = await response?.text();
    expect(text).toContain("urlset");
  });

  test("robots.txt should be accessible", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const text = await response?.text();
    expect(text).toContain("User-Agent");
  });

  test("404 page should show for unknown routes", async ({ page }) => {
    await page.goto("/this-page-does-not-exist-xyz");
    await expect(page.locator("h1")).toBeVisible();
  });
});
