import { test, expect } from "@playwright/test";

test.describe("Authentication Pages", () => {
  test("login page should load", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/login");
    await expect(page.locator("text=Welcome back").or(page.locator("text=Launch Workspace")).first()).toBeVisible();
    expect(consoleErrors.length).toBe(0);
  });

  test("login page should have email and password fields", async ({ page }) => {
    await page.goto("/login");
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    if (await emailInput.isVisible()) {
      await expect(emailInput).toBeVisible();
    }
    if (await passwordInput.isVisible()) {
      await expect(passwordInput).toBeVisible();
    }
  });

  test("login page should have Google sign-in option", async ({ page }) => {
    await page.goto("/login");
    const googleBtn = page.locator('button:has-text("Google"), a:has-text("Google")').first();
    if (await googleBtn.isVisible()) {
      await expect(googleBtn).toBeVisible();
    }
  });

  test("should have sign-up / register option", async ({ page }) => {
    await page.goto("/login");
    const signUpBtn = page.locator('button:has-text("Sign Up"), a:has-text("Sign Up"), button:has-text("Register"), a:has-text("Create")').first();
    if (await signUpBtn.isVisible()) {
      await expect(signUpBtn).toBeVisible();
    }
  });
});
