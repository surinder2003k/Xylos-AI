import { test, expect } from "@playwright/test";

test.describe("Blog Pages", () => {
  test("blog listing should load with posts", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/blog");
    await expect(page).toHaveTitle(/Blog/);
    const articleCards = page.locator("a[href*='/blog/']");
    await expect(articleCards.first()).toBeVisible();
    expect(consoleErrors.length).toBe(0);
  });

  test("should navigate to a blog post", async ({ page }) => {
    await page.goto("/blog");
    const firstPost = page.locator("a[href*='/blog/']").first();
    await firstPost.click();
    await expect(page).toHaveURL(/\/blog\//);
  });

  test("blog post should have content and metadata", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/blog");
    const firstPost = page.locator("a[href*='/blog/']").first();
    await firstPost.click();
    await page.waitForLoadState("networkidle");

    const body = page.locator("article");
    await expect(body).toBeVisible();
    expect(consoleErrors.length).toBe(0);
  });

  test("blog post should have a feature image", async ({ page }) => {
    await page.goto("/blog");
    const firstPost = page.locator("a[href*='/blog/']").first();
    await firstPost.click();
    await page.waitForLoadState("networkidle");
    const images = page.locator("img");
    await expect(images.first()).toBeVisible();
  });

  test("should have no broken blog images", async ({ page }) => {
    const brokenImages: string[] = [];
    page.on("response", (response) => {
      if (response.url().match(/\.(png|jpg|jpeg|gif|webp|avif)/) && response.status() >= 400) {
        brokenImages.push(response.url());
      }
    });

    await page.goto("/blog");
    await page.waitForLoadState("networkidle");
    expect(brokenImages.length).toBe(0);
  });

  test("author bio should be visible on blog posts", async ({ page }) => {
    await page.goto("/blog");
    const firstPost = page.locator("a[href*='/blog/']").first();
    await firstPost.click();
    await page.waitForLoadState("networkidle");
    await expect(page.locator("[title='Verified Author']").first()).toBeVisible();
  });

  test("share buttons should appear on blog posts", async ({ page }) => {
    await page.goto("/blog");
    const firstPost = page.locator("a[href*='/blog/']").first();
    await firstPost.click();
    await page.waitForLoadState("networkidle");
    await expect(page.locator('a[href*="twitter.com/intent/tweet"]').first()).toBeVisible();
  });

  test("newsletter card should be on blog posts", async ({ page }) => {
    await page.goto("/blog");
    const firstPost = page.locator("a[href*='/blog/']").first();
    await firstPost.click();
    await page.waitForLoadState("networkidle");
    const emailInput = page.locator('input[type="email"]').last();
    await expect(emailInput).toBeVisible();
  });
});
