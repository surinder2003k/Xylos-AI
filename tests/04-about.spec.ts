import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test("should load with correct content", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/about");
    await expect(page.locator("h1")).toBeVisible();
    expect(consoleErrors.length).toBe(0);
  });

  test("should have team or mission content", async ({ page }) => {
    await page.goto("/about");
    const content = page.locator("main, article, section").first();
    await expect(content).toBeVisible();
  });
});
