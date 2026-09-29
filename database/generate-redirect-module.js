/**
 * Generates lib/slug-redirects.ts from database/slug-redirects.json.
 *
 * Run after any `node database/fix-slop-slugs.js --apply`:
 *   node database/generate-redirect-module.js
 *
 * Keeping this generated (rather than hand-editing) means the redirect table
 * can never drift from the actual slug changes that were applied.
 */
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "slug-redirects.json");
const OUT = path.join(__dirname, "..", "lib", "slug-redirects.ts");

if (!fs.existsSync(SRC)) {
  console.error("No database/slug-redirects.json — run fix-slop-slugs.js --apply first.");
  process.exit(1);
}

const log = JSON.parse(fs.readFileSync(SRC, "utf8"));
if (!Array.isArray(log) || log.length === 0) {
  console.error("Redirect log is empty.");
  process.exit(1);
}

const entries = log
  .map((e) => [e.old_slug, e.new_slug])
  .filter(([oldSlug, newSlug]) => oldSlug && newSlug && oldSlug !== newSlug);

// Last write wins if a slug was rewritten more than once.
const map = new Map(entries);

const body = `/**
 * GENERATED FILE — do not edit by hand.
 * Regenerate with:  node database/generate-redirect-module.js
 * Source:           database/slug-redirects.json
 *
 * ${map.size} legacy blog URLs whose slug was rewritten to drop AI-jargon
 * ("unveiling", "epistemic", "paradigm", ...) from the path. The titles were
 * already de-slopped but the URLs were not, so Google was still being handed
 * low-quality-looking paths in the sitemap. These are served as 301s from
 * middleware so no inbound link equity is lost.
 */
const SLUG_REDIRECTS: Record<string, string> = {
${[...map.entries()]
  .map(([from, to]) => `  ${JSON.stringify(from)}: ${JSON.stringify(to)},`)
  .join("\n")}
};

export default SLUG_REDIRECTS;
`;

fs.writeFileSync(OUT, body, "utf8");
console.log(`Wrote ${OUT} with ${map.size} redirects.`);
