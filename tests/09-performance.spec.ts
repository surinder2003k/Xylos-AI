import { test, expect } from "@playwright/test";

test.describe("Performance Checks", () => {
  test("landing page should load within 8 seconds", async ({ page }) => {
    const start = Date.now();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(8000);
  });

  test("blog page should load within 8 seconds", async ({ page }) => {
    const start = Date.now();
    await page.goto("/blog");
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(8000);
  });

  test("chat page should load within 8 seconds", async ({ page }) => {
    const start = Date.now();
    await page.goto("/chat");
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(8000);
  });

  test("all pages should have no 4xx/5xx responses", async ({ page }) => {
    const failures: string[] = [];
    page.on("response", (response) => {
      if (response.status() >= 400 && response.status() < 600) {
        failures.push(`${response.url()} -> ${response.status()}`);
      }
    });

    const pages = ["/", "/blog", "/about", "/privacy", "/login", "/chat"];
    for (const url of pages) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
    }

    const authFailures = failures.filter(
      (f) => !f.includes("/api/automate") && !f.includes("/api/upload") && !f.includes("/api/chat") && !f.includes("/api/blog/generate")
    );
    expect(authFailures.length).toBe(0);
  });
});
