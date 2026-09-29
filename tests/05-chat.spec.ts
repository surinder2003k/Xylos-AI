import { test, expect } from "@playwright/test";

test.describe("Chat Page", () => {
  test("should redirect away from /chat when not authenticated", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/chat");
    // /chat server-redirects to /dashboard/chat, whose client guard sends
    // guests to /login (or back home). Wait for the client-side hop.
    await page.waitForURL((url) => ["/", "/login"].includes(new URL(url).pathname), {
      timeout: 20000,
    });
    expect(["/", "/login"]).toContain(new URL(page.url()).pathname);
    expect(consoleErrors.length).toBe(0);
  });

  test("should show landing CTA for chat", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /start chatting/i }).first()).toBeVisible();
  });

  test("should have chat link in navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[href="/chat"]').first()).toBeVisible();
  });
});
