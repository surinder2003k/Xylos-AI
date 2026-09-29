/**
 * URL slug repair for posts whose TITLE was already de-slopped but whose URL
 * still carries the AI-jargon fingerprint.
 *
 * Why this exists: the archive retitler (retitle-slop.js) rewrites blogs.title
 * only — "slugs, content, metadata, and publication status are never changed".
 * So a post titled "Review of Souddrum P: An In-Depth Look at Its Audio
 * Technology Features" still lives at
 * /blog/unveiling-the-sonic-horizon-a-definitive-review-of-souddrum-p.
 * Google reads the URL as part of the page's quality signal, and the sitemap
 * publishes that URL to crawlers, so the slop is still being served even though
 * the headline is clean.
 *
 * Safety model, mirroring blog-quality-cleanup.js:
 *   - DRY RUN by default. Nothing is written without --apply.
 *   - Writes old_slug/new_slug pairs to database/slug-redirects.json BEFORE
 *     touching the database, so the whole change is reversible.
 *   - A new slug that collides with an existing row is skipped, never merged.
 *
 * Run:  node database/fix-slop-slugs.js
 *       node database/fix-slop-slugs.js --apply
 * To undo:
 *   node database/fix-slop-slugs.js --revert
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const REDIRECTS = path.join(__dirname, "slug-redirects.json");

const APPLY = process.argv.includes("--apply");
const REVERT = process.argv.includes("--revert");

const { AI_SLOP } = require("./slop-rules");

const env = {};
fs.readFileSync(path.join(ROOT, ".env.local"), "utf8")
  .split(/\r?\n/)
  .forEach((line) => {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  });

const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE;
if (!URL_BASE || !KEY) throw new Error("Missing Supabase URL or service-role key in .env.local");
const HEADERS = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

// Mirror the generator's slug shape (app/api/automate/route.ts): lowercase,
// non-alphanumerics collapsed to single dashes, 80-char ceiling.
const toSlug = (title) =>
  (title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);

const isSlopSlug = (slug) => AI_SLOP.some((re) => re.test(slug || ""));

async function revert() {
  if (!fs.existsSync(REDIRECTS)) {
    console.log("No database/slug-redirects.json — nothing to revert.");
    return;
  }
  const log = JSON.parse(fs.readFileSync(REDIRECTS, "utf8"));
  let ok = 0;
  for (const { id, old_slug } of log) {
    const r = await fetch(`${URL_BASE}/rest/v1/blogs?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { ...HEADERS, Prefer: "return=minimal" },
      body: JSON.stringify({ slug: old_slug }),
    });
    if (r.ok) ok++;
    else console.log(`  FAILED ${old_slug} -> HTTP ${r.status}`);
  }
  console.log(`Reverted ${ok}/${log.length} slugs.`);
}

(async () => {
  if (REVERT) return revert();

  const res = await fetch(
    URL_BASE + "/rest/v1/blogs?select=id,slug,title&status=eq.published&limit=1000",
    { headers: HEADERS }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);
  const rows = await res.json();

  const slopRows = rows.filter((r) => isSlopSlug(r.slug));
  console.log(`Published: ${rows.length}`);
  console.log(`Slop-slugged: ${slopRows.length}\n`);

  // Build the plan, skipping anything that would collide.
  const taken = new Set(rows.map((r) => r.slug));
  const plan = [];
  for (const r of slopRows) {
    const next = toSlug(r.title);
    if (!next) continue;
    if (next === r.slug) continue;
    if (taken.has(next)) {
      console.log(`  SKIP (slug "${next}" already taken): ${r.title}`);
      continue;
    }
    taken.add(next);
    plan.push({ id: r.id, old_slug: r.slug, new_slug: next, title: r.title });
  }

  for (const p of plan) {
    console.log(`  ${p.old_slug}`);
    console.log(`     ->  ${p.new_slug}`);
  }
  console.log(`\nTOTAL to rewrite: ${plan.length}`);

  if (!APPLY) {
    console.log("\nDRY RUN — nothing changed. Apply with: node database/fix-slop-slugs.js --apply");
    return;
  }

  const previous = fs.existsSync(REDIRECTS) ? JSON.parse(fs.readFileSync(REDIRECTS, "utf8")) : [];
  fs.writeFileSync(
    REDIRECTS,
    JSON.stringify([...previous, ...plan.map(({ id, old_slug, new_slug }) => ({ id, old_slug, new_slug }))], null, 2)
  );
  console.log(`Redirect log written: ${REDIRECTS}`);

  let ok = 0;
  for (const p of plan) {
    const r = await fetch(`${URL_BASE}/rest/v1/blogs?id=eq.${encodeURIComponent(p.id)}`, {
      method: "PATCH",
      headers: { ...HEADERS, Prefer: "return=minimal" },
      body: JSON.stringify({ slug: p.new_slug }),
    });
    if (r.ok) ok++;
    else console.log(`  FAILED ${p.old_slug} -> HTTP ${r.status} ${await r.text()}`);
  }
  console.log(`\nApplied: ${ok}/${plan.length} slugs rewritten.`);
})();
