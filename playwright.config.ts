import { defineConfig, devices } from "@playwright/test";

// Two ways to run the suite:
//   1. Against the deployed site (default) — `npx playwright test`
//   2. Against a local production build — `PLAYWRIGHT_TARGET_LOCAL=1 npx playwright test`
//      which builds nothing itself; run `npm run build` first. Used by CI.
//
// The flag is trimmed because on Windows `set FOO=1 && some-command` assigns
// "1 " with a trailing space, which silently sent "local" runs to production.
const useLocal = (process.env.PLAYWRIGHT_TARGET_LOCAL ?? "").trim() === "1";
const baseURL = process.env.PLAYWRIGHT_BASE_URL || (useLocal ? "http://127.0.0.1:3100" : "https://xylosai.vercel.app");

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["line"]] : [["html"], ["line"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Only boots a server in local mode; against the deployed site there is
  // nothing to start, and CI sets the flag so the build under test is the one
  // that was just produced.
  //
  // reuseExistingServer is deliberately off: tests read limits from the
  // environment, so they only describe reality when the server under test was
  // started with that same environment. Reusing a server someone launched by
  // hand made a test assert against a limit the server never had.
  webServer: useLocal
    ? {
        command: "npm run start -- -p 3100",
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      }
    : undefined,
});
