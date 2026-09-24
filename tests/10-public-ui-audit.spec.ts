import { test, expect } from "@playwright/test";

const publicPages = [
  { path: "/", name: "landing" },
  { path: "/blog", name: "blog" },
  { path: "/about", name: "about" },
  { path: "/contact", name: "contact" },
  { path: "/tools", name: "tools" },
  { path: "/tools/ai-chat-free", name: "ai-chat-free" },
  { path: "/tools/dropzone-share", name: "dropzone-share" },
  { path: "/tools/pic-extractor", name: "pic-extractor" },
  { path: "/login", name: "login" },
  { path: "/privacy", name: "privacy" },
  { path: "/terms", name: "terms" },
  { path: "/cookies", name: "cookies" },
];

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test.describe(`Public UI audit (${viewport.name})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const target of publicPages) {
      test(`${target.name} has a sound document and layout`, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
        page.on("console", (message) => {
          if (message.type() === "error") errors.push(`console: ${message.text()}`);
        });
        page.on("response", (response) => {
          const url = new URL(response.url());
          const isApplicationResponse = url.hostname.endsWith("xylosai.vercel.app")
            || url.hostname === "127.0.0.1"
            || url.hostname === "localhost";
          if (response.status() >= 400 && isApplicationResponse) {
            errors.push(`response: ${response.status()} ${response.url()}`);
          }
        });

        const response = await page.goto(target.path, { waitUntil: "domcontentloaded" });
        expect(response?.status(), `${target.path} should return a successful page`).toBeLessThan(400);
        const mainCount = await page.locator("main").count();
        expect(mainCount, `${target.path} should expose a main content landmark`).toBeGreaterThan(0);
        await expect(page.locator("h1")).toHaveCount(1);

        const audit = await page.evaluate(() => {
          const root = document.documentElement;
          const brokenImages = [...document.images]
            .filter((image) => image.complete && image.naturalWidth === 0)
            .map((image) => image.currentSrc || image.src);
          const unnamedControls = [...document.querySelectorAll<HTMLElement>("button, a")]
            .filter((control) => {
              const label = control.getAttribute("aria-label") || control.textContent?.trim() || control.getAttribute("title");
              return !label;
            }).length;
          return {
            horizontalOverflow: Math.max(0, root.scrollWidth - root.clientWidth),
            brokenImages,
            unnamedControls,
          };
        });

        expect(audit.horizontalOverflow, `${target.path} should not overflow horizontally`).toBeLessThanOrEqual(1);
        expect(audit.brokenImages, `${target.path} should not contain broken images`).toEqual([]);
        expect(audit.unnamedControls, `${target.path} should label every link and button`).toBe(0);
        expect(errors, `${target.path} should be free of page and network errors`).toEqual([]);
      });
    }
  });
}
