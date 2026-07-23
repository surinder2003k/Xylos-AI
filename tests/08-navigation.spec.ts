import { test, expect } from "@playwright/test";

test.describe("Navigation & Layout", () => {
  test("should navigate through all main pages without console errors", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const pages = ["/", "/blog", "/about", "/privacy", "/login", "/chat"];
    for (const url of pages) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      const status = await page.evaluate(() => document.readyState);
      expect(status).toBe("complete");
    }

    expect(consoleErrors.length).toBe(0);
  });

  test("should navigate between blog and home", async ({ page }) => {
    await page.goto("/blog");
    const homeLink = page.locator('a[href="/"]');
    if (await homeLink.first().isVisible()) {
      await homeLink.first().click();
      await expect(page).toHaveURL("https://xylosai.vercel.app/");
    }
  });

  test("should navigate from blog post back to archive", async ({ page }) => {
    await page.goto("/blog");
    const firstPost = page.locator("a[href*='/blog/']").first();
    if (await firstPost.isVisible()) {
      await firstPost.click();
      await page.waitForLoadState("networkidle");
      await page.locator("text=Archive").or(page.locator("text=Blog")).first().click();
      await expect(page).toHaveURL(/\/blog/);
    }
  });

  test("logo should link to home page", async ({ page }) => {
    await page.goto("/blog");
    const logo = page.locator("a[href='/']").first();
    await logo.click();
    await expect(page).toHaveURL("/");
  });
});
