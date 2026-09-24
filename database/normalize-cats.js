const fs = require("fs");

// One-off: normalise remaining non-canonical categories on PUBLISHED posts.
// Same map as content-audit.js, plus "Top 10 AI Tools for Students" (AI listicle category).
const CATEGORY_MAP = {
  "Ai": "Technology",
  "AI": "Technology",
  "seo tips": "Technology",
  "SEO": "Technology",
  "Daily Web seo Tricks": "Technology",
  "Business": "Technology",
  "india latest news": "Technology",
  "Aajtak india tv news": "Technology",
  "Aajtak latest News": "Technology",
  "Technology/Business": "Technology",
  "Technology/Education": "Technology",
  "Technology/Science": "Technology",
  "New Ai Model": "AI & Machine Learning",
  "Top 10 AI Tools for Students": "AI & Machine Learning",
};

const envVars = {};
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) envVars[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
}
const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const key = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE;
const H = { apikey: key, Authorization: `Bearer ${key}` };

(async () => {
  const rows = await fetch(url + "/rest/v1/blogs?select=id,title,category&status=eq.published", { headers: H })
    .then(r => r.json());
  const targets = rows.filter(r => r.category && CATEGORY_MAP[r.category]);
  console.log(`Published rows: ${rows.length} | to normalise: ${targets.length}`);

  let ok = 0, fail = 0;
  for (const t of targets) {
    try {
      const res = await fetch(url + "/rest/v1/blogs?id=eq." + encodeURIComponent(t.id), {
        method: "PATCH",
        headers: { ...H, "Content-Type": "application/json" },
        body: JSON.stringify({ category: CATEGORY_MAP[t.category] }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status + ": " + (await res.text()));
      ok++;
    } catch (e) {
      fail++;
      console.log(`  FAIL [${t.category}] ${t.title.slice(0, 50)}: ${e.message}`);
    }
  }
  console.log(`\n=== NORMALISE DONE: ${ok} ok, ${fail} failed ===`);

  // Verify final category set on published posts
  const after = await fetch(url + "/rest/v1/blogs?select=category&status=eq.published", { headers: H })
    .then(r => r.json());
  const uniq = [...new Set(after.map(c => c.category).filter(Boolean))].sort();
  console.log(`\nPublished categories (${uniq.length}):`);
  uniq.forEach(c => console.log("  " + c));
})();
