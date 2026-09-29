/**
 * Find posts by title fragment across ALL statuses, and report the current
 * published/draft totals. Used to confirm nothing was lost by the cleanup run.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const env = {};
fs.readFileSync(path.join(ROOT, ".env.local"), "utf8")
  .split(/\r?\n/)
  .forEach((line) => {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  });

const HEADERS = {
  apikey: env.SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
};

const q = (path) =>
  fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${path}`, { headers: HEADERS }).then((r) => r.json());

(async () => {
  const published = await q("blogs?select=id&status=eq.published&limit=2000");
  const draft = await q("blogs?select=id&status=eq.draft&limit=2000");
  const all = await q("blogs?select=id,status&limit=3000");
  console.log(`published: ${published.length}`);
  console.log(`draft    : ${draft.length}`);
  console.log(`total    : ${all.length}\n`);

  const needles = process.argv.slice(2);
  for (const needle of needles) {
    const rows = await q(
      `blogs?select=slug,title,status&title=ilike.*${encodeURIComponent(needle)}*`
    );
    console.log(`--- "${needle}" -> ${rows.length} row(s)`);
    for (const r of rows) console.log(`    [${r.status}] ${r.slug}`);
    console.log("");
  }
})();
