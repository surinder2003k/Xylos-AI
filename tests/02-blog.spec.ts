import { test, expect } from "@playwright/test";
import { skipWithoutBackend } from "./helpers";

// Every test in this file reads posts from the database.
test.describe("Blog Pages", () => {
  test.beforeEach(() => {
    skipWithoutBackend();
  });

  test("blog listing should load with posts", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/blog");
    await expect(page).toHaveTitle(/Blog/);
    const articleCards = page.locator("a[href*='/blog/']");
    await expect(articleCards.first()).toBeVisible({ timeout: 15000 });
    expect(consoleErrors.length).toBe(0);
  });

  test("should navigate to a blog post", async ({ page }) => {
    await page.goto("/blog");
    const firstPost = page.locator("a[href*='/blog/']").first();
    await firstPost.click();
    await expect(page).toHaveURL(/\/blog\//, { timeout: 15000 });
  });

  test("blog post should have content and metadata", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/blog");
    const firstPost = page.locator("a[href*='/blog/']").first();
    await firstPost.click();
    await page.waitForURL(/\/blog\//, { timeout: 15000 });

    const body = page.locator("article");
    await expect(body).toBeVisible({ timeout: 15000 });
    expect(consoleErrors.length).toBe(0);
  });

  test("blog post should have a feature image", async ({ page }) => {
    await page.goto("/blog");
    const firstPost = page.locator("a[href*='/blog/']").first();
    await firstPost.click();
    await page.waitForURL(/\/blog\//, { timeout: 15000 });
    const images = page.locator("img");
    await expect(images.first()).toBeVisible({ timeout: 15000 });
  });

  test("should have no broken blog images", async ({ page }) => {
    const brokenImages: string[] = [];
    page.on("response", (response) => {
      if (response.url().match(/\.(png|jpg|jpeg|gif|webp|avif)/) && response.status() >= 400) {
        brokenImages.push(response.url());
      }
    });

    await page.goto("/blog");
    await page.waitForLoadState("load");
    await page.waitForTimeout(1500);
    expect(brokenImages.length).toBe(0);
  });

  test("author byline should be visible on blog posts", async ({ page }) => {
    await page.goto("/blog");
    const firstPost = page.locator("a[href*='/blog/']").first();
    await firstPost.click();
    await page.waitForURL(/\/blog\//, { timeout: 15000 });
    await expect(page.locator("article").getByText("AI Research & Editorial").first()).toBeVisible({ timeout: 15000 });
  });

  test("share buttons should appear on blog posts", async ({ page }) => {
    await page.goto("/blog");
    const firstPost = page.locator("a[href*='/blog/']").first();
    await firstPost.click();
    await page.waitForURL(/\/blog\//, { timeout: 15000 });
    await expect(page.locator('a[href*="twitter.com/intent/tweet"]').first()).toBeVisible({ timeout: 15000 });
  });

  test("newsletter card should be on blog posts", async ({ page }) => {
    await page.goto("/blog");
    const firstPost = page.locator("a[href*='/blog/']").first();
    await firstPost.click();
    await page.waitForURL(/\/blog\//, { timeout: 15000 });
    const emailInput = page.locator('input[type="email"]').last();
    await expect(emailInput).toBeVisible({ timeout: 15000 });
  });
});
