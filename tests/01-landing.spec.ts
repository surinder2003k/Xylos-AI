import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should load with correct title and meta", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");
    await expect(page).toHaveTitle(/Xylos AI/);
    expect(consoleErrors.length).toBe(0);
  });

  test("should display core navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Neural Chat").first()).toBeVisible();
    await expect(page.locator("text=Blog").first()).toBeVisible();
    await expect(page.locator("text=About Us").first()).toBeVisible();
    await expect(page.locator("text=Sign In").first()).toBeVisible();
  });

  test("should show blog grid with posts", async ({ page }) => {
    await page.goto("/");
    const blogCards = page.locator("a[href*='/blog/']").first();
    await expect(blogCards).toBeVisible();
  });

  test("should navigate to blog page", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");
    await page.locator("text=View Full Archive").first().click();
    await expect(page).toHaveURL(/\/blog/);
    expect(consoleErrors.length).toBe(0);
  });

  test("should have Neural Chat link pointing to /chat", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[href="/chat"]').first()).toBeVisible();
  });

  test("should navigate to about page", async ({ page }) => {
    await page.goto("/");
    await page.locator("text=About Us").first().click();
    await expect(page).toHaveURL(/\/about/);
  });

  test("should navigate to login page", async ({ page }) => {
    await page.goto("/");
    await page.locator("text=Sign In").first().click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("should navigate to privacy page", async ({ page }) => {
    await page.goto("/");
    await page.locator("text=Privacy Policy").first().click();
    await expect(page).toHaveURL(/\/privacy/);
  });

  test("should have working footer links", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Blog Archive").first()).toBeVisible();
    await expect(page.locator("text=About Us").last()).toBeVisible();
  });

  test("should have working social links", async ({ page }) => {
    await page.goto("/");
    const githubLink = page.locator('a[href*="github.com"]').first();
    await expect(githubLink).toBeVisible();
  });

  test("should subscribe to newsletter", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");
    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.fill("test@example.com");
    const subscribeBtn = page.locator("button:has-text('Subscribe')").first();
    await subscribeBtn.click();
    expect(consoleErrors.length).toBe(0);
  });

  test("should have no broken images", async ({ page }) => {
    const brokenImages: string[] = [];
    page.on("response", (response) => {
      if (response.url().match(/\.(png|jpg|jpeg|gif|webp|avif)/) && response.status() >= 400) {
        brokenImages.push(response.url());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(brokenImages.length).toBe(0);
  });
});
