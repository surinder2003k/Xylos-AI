/**
 * Check publish status + slug for specific posts, bypassing any HTTP caching.
 * Used to tell apart "post is genuinely draft/404" from "edge cache is stale".
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

const slugs = process.argv.slice(2);

(async () => {
  for (const slug of slugs) {
    const res = await fetch(
      `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/blogs?slug=eq.${encodeURIComponent(slug)}&select=slug,title,status,published_at`,
      { headers: HEADERS }
    );
    const rows = await res.json();
    if (!rows.length) {
      console.log(`MISSING  ${slug}`);
    } else {
      const r = rows[0];
      console.log(`status=${String(r.status).padEnd(10)} ${r.published_at ? r.published_at.slice(0, 10) : "----"}  ${r.title.slice(0, 60)}`);
    }
  }
})();
