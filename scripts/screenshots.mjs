import { chromium } from "@playwright/test";

const BASE = "https://xylosai.vercel.app";
const VIEWPORT = { width: 1440, height: 900 };

const pages = [
  { path: "/",             name: "landing-hero",      fullPage: false },
  { path: "/",             name: "landing-full",      fullPage: true  },
  { path: "/blog",         name: "blog-archive",      fullPage: true  },
  { path: "/about",        name: "about",             fullPage: true  },
  { path: "/login",        name: "login",             fullPage: false },
  { path: "/privacy",      name: "privacy",           fullPage: true  },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: VIEWPORT });
const page = await context.newPage();

for (const { path, name, fullPage } of pages) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: `public/screenshots/${name}.png`,
    fullPage,
  });
  console.log(`✓ ${name}.png`);
}

// Blog post — need to fetch first post URL
await page.goto(`${BASE}/blog`, { waitUntil: "networkidle" });
const postLink = await page.locator("a[href*='/blog/']").first().getAttribute("href");
if (postLink) {
  await page.goto(`${BASE}${postLink}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "public/screenshots/blog-post.png", fullPage: true });
  console.log(`✓ blog-post.png (${postLink})`);
}

// Chat page (will redirect to /)
await page.goto(`${BASE}/chat`, { waitUntil: "networkidle" });
await page.screenshot({ path: "public/screenshots/chat-redirect.png", fullPage: false });
console.log("✓ chat-redirect.png");

await browser.close();
