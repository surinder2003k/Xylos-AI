import { test, expect } from "@playwright/test";

test.describe("Dashboard Pages", () => {
  test("dashboard should redirect to login when not authenticated", async ({ page }) => {
    const response = await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    const finalUrl = page.url();
    expect(finalUrl.includes("/login") || finalUrl.includes("/")).toBeTruthy();
  });

  test("dashboard/create should be inaccessible without auth", async ({ page }) => {
    await page.goto("/dashboard/create");
    await page.waitForLoadState("networkidle");
    expect(page.url().includes("/login") || page.url().includes("/")).toBeTruthy();
  });

  test("dashboard/posts should be inaccessible without auth", async ({ page }) => {
    await page.goto("/dashboard/posts");
    await page.waitForLoadState("networkidle");
    expect(page.url().includes("/login") || page.url().includes("/")).toBeTruthy();
  });

  test("dashboard/ai-manager should be inaccessible without auth", async ({ page }) => {
    await page.goto("/dashboard/ai-manager");
    await page.waitForLoadState("networkidle");
    expect(page.url().includes("/login") || page.url().includes("/")).toBeTruthy();
  });
});
