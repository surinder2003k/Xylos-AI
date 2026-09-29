/**
 * Read-only diagnostic: compare SLUG vs TITLE for a sample of posts that a
 * slug-based scan flags as off-topic / AI-slop. Explains why the cleanup script
 * (which matches on title) can report 0 off-topic while a slug grep reports 21.
 *
 * Writes nothing. Run:  node inspect-slug-title.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = process.argv[2] || process.cwd();
const env = {};
fs.readFileSync(path.join(ROOT, ".env.local"), "utf8")
  .split(/\r?\n/)
  .forEach((line) => {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  });

const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE;
const HEADERS = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
};

const { OFF_TOPIC, AI_SLOP } = require(path.join(ROOT, "database", "slop-rules"));

// A slug-side heuristic broad enough to catch consumer-service spam and the
// AI-jargon fingerprint, independent of the title rules above.
const SLUG_OFF = /electrical|brooklyn|benefits-provider|reimbursement|logistics|clerical|cafeteria|vinyl-wrap|mental-health|ceramic-tint|aerospace-fastener|diabetes|supply-chain|virtual-design|your-land|jewelry|iskin|clerk|dental|roofing|plumbing|insurance|lawyer|casino|restaurant/i;
const SLUG_SLOP = /unveiling|unlocking|navigating|odyssey|epistemic|paradigm|nexus|juxtaposition|tapestry|zeitgeist|deconstruct|omniscien|forensic-cognition|grounding-protocol|grounding-layer|expert-synthesis|expert-calibration|cognitive-validation|cognitive-sanction|cognitive-integrity|synthetic-|agentic-imperative|architecture-of-truth|asymmetric-prose|redefining-truth|restructuring-frontier|sleek|intricate|robust|leverage/i;

(async () => {
  const res = await fetch(
    URL_BASE + "/rest/v1/blogs?select=id,slug,title,status&status=eq.published&limit=1000",
    { headers: HEADERS }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);
  const rows = await res.json();

  console.log(`published rows fetched: ${rows.length}\n`);

  const slugOff = rows.filter((r) => SLUG_OFF.test(r.slug || ""));
  const slugSlop = rows.filter((r) => SLUG_SLOP.test(r.slug || ""));
  const titleOff = rows.filter((r) => OFF_TOPIC.some((re) => re.test(r.title || "")));
  const titleSlop = rows.filter((r) => AI_SLOP.some((re) => re.test(r.title || "")));

  console.log("=== counts (slug heuristic vs title rules) ===");
  console.log(`off-topic : slug=${slugOff.length}  title=${titleOff.length}`);
  console.log(`ai-slop   : slug=${slugSlop.length}  title=${titleSlop.length}`);

  const inSitemapOnly = slugOff.filter((r) => !titleOff.some((t) => t.id === r.id));
  console.log(`\nslug-offtopic NOT caught by title rules: ${inSitemapOnly.length}`);
  for (const r of inSitemapOnly.slice(0, 25)) {
    console.log(`  [${r.status}] ${r.slug}`);
    console.log(`     title: ${r.title}`);
  }

  const inSlopOnly = slugSlop.filter((r) => !titleSlop.some((t) => t.id === r.id));
  console.log(`\nslug-slop NOT caught by title rules: ${inSlopOnly.length}`);
  for (const r of inSlopOnly.slice(0, 25)) {
    console.log(`  [${r.status}] ${r.slug}`);
    console.log(`     title: ${r.title}`);
  }
})();
