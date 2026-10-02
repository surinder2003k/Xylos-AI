import { test, expect } from "@playwright/test";
import { skipWithoutBackend } from "./helpers";

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
    await expect(page.locator('a[href="/blog"]').first()).toBeVisible();
    await expect(page.locator('a[href="/about"]').first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Login", exact: true }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /start chatting/i }).first()).toBeVisible();
  });

  test("should show blog grid with posts", async ({ page }) => {
    skipWithoutBackend();
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
    await page.getByRole("link", { name: /view all/i }).first().click();
    await expect(page).toHaveURL(/\/blog/, { timeout: 15000 });
    expect(consoleErrors.length).toBe(0);
  });

  test("should have chat link pointing to /chat", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[href="/chat"]').first()).toBeVisible();
  });

  test("should navigate to about page", async ({ page }) => {
    await page.goto("/");
    await page.locator('nav a[href="/about"]').first().click();
    await expect(page).toHaveURL(/\/about/, { timeout: 15000 });
  });

  test("should navigate to login page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Login", exact: true }).first().click();
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

  test("should navigate to privacy page", async ({ page }) => {
    await page.goto("/");
    await page.locator('footer a[href="/privacy"]').first().click();
    await expect(page).toHaveURL(/\/privacy/, { timeout: 15000 });
  });

  test("should have working footer links", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('footer a[href="/blog"]').first()).toBeVisible();
    await expect(page.locator('footer a[href="/about"]').first()).toBeVisible();
  });

  test("should have working social links", async ({ page }) => {
    await page.goto("/contact");
    const githubLink = page.locator('a[href*="github.com"]').first();
    await expect(githubLink).toBeVisible();
  });

  test("should subscribe to newsletter", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    // Mock the API so the test never sends a real subscription email.
    await page.route("**/api/subscribe", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
    );

    await page.goto("/");
    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.fill("test@example.com");
    const subscribeBtn = page.locator("button:has-text('Subscribe')").first();
    await subscribeBtn.click();
    await expect(page.getByRole("button", { name: /processing|verified/i })).toBeVisible();
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
    await page.waitForLoadState("load");
    await page.waitForTimeout(1500);
    expect(brokenImages.length).toBe(0);
  });
});
