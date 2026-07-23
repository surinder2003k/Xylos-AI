import { test, expect } from "@playwright/test";

test.describe("Chat Page", () => {
  test("should redirect to login when not authenticated", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/chat");
    await page.waitForLoadState("networkidle");
    expect(page.url()).toBe("https://xylosai.vercel.app/");
    expect(consoleErrors.length).toBe(0);
  });

  test("should show landing CTA for chat", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const cta = page.locator("text=Neural Chat").first();
    await expect(cta).toBeVisible();
  });

  test("should have Neural Chat link in navigation", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator('a[href="/chat"]').first()).toBeVisible();
  });
});
