const fs = require("fs");

// Parse .env.local
const envVars = {};
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) envVars[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
}
const url  = envVars.NEXT_PUBLIC_SUPABASE_URL;
const key  = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE;
const H    = { apikey: key, Authorization: `Bearer ${key}` };

const CANONICAL = new Set([
  "Technology", "AI & Machine Learning", "Cybersecurity",
  "Software Development", "Cloud & DevOps", "Consumer Tech",
  "Blockchain & Crypto", "Space & Science",
]);

const CATEGORY_MAP = {
  "Ai": "Technology", "AI": "Technology", "seo tips": "Technology", "SEO": "Technology",
  "Daily Web seo Tricks": "Technology", "Business": "Technology",
  "india latest news": "Technology", "Aajtak india tv news": "Technology",
  "Aajtak latest News": "Technology", "Technology/Business": "Technology",
  "Technology/Education": "Technology", "Technology/Science": "Technology",
  "New Ai Model": "AI & Machine Learning",
};

const SPAM_PATTERN = /aajtak|india tv|india latest news|seo tips|daily web seo|backlink|guest post|denture|insurance|roof|plumb|burger|casino|half cow|locksmith|backsplash|photographer|nursing program|realtor|mortgage/i;
const SLOP_PATTERN = /epistemic|deconstruct|omniscience|re-architect|paradigm|juxtaposition|zeitgeist|tapestry|synthetic scholar|forensic cognition|arbitration engine|empirical benchmark|expert calibration|cognitive validation|cognitive sanction|synthetic velocity/i;
const wc = (html) => (html || "").replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;

const args = process.argv.slice(2);
const MODE = args[0] || "dry";

(async () => {
  console.log(`=== MODE: ${MODE.toUpperCase()} ===`);
  console.log("=== FETCHING POSTS ===");
  let rows = [];
  for (let off = 0; off < 3000; off += 1000) {
    const res = await fetch(`${url}/rest/v1/blogs?select=id,title,slug,status,category,content,published_at&order=created_at.desc&limit=1000&offset=${off}`, { headers: H });
    const page = await res.json();
    if (!Array.isArray(page) || page.length === 0) break;
    rows = rows.concat(page);
  }
  const pub = rows.filter(r => r.status === "published");
  console.log(`Total: ${rows.length} | published: ${pub.length}\n`);

  const actions = pub.map(r => {
    let decision = "keep", reason = "", newCat = null;
    if (r.category && !CANONICAL.has(r.category) && CATEGORY_MAP[r.category]) newCat = CATEGORY_MAP[r.category];
    if (SPAM_PATTERN.test(r.title) || SPAM_PATTERN.test(r.category || "")) { decision = "archive"; reason = "spam/off-topic"; }
    if (decision === "keep" && SLOP_PATTERN.test(r.title)) { decision = "rewrite"; reason = "AI-slop headline"; }
    if (decision === "keep" && wc(r.content) < 800) { decision = "enhance"; reason = `thin ${wc(r.content)}w`; }
    return { id: r.id, oldCat: r.category, newCat, decision, reason, title: r.title.slice(0,70), wc: wc(r.content) };
  });

  const toApply = actions.filter(a => a.decision !== "keep");
  const archive = toApply.filter(a => a.decision === "archive");
  const rewrite = toApply.filter(a => a.decision === "rewrite");
  const enhance = toApply.filter(a => a.decision === "enhance");
  const catFix  = toApply.filter(a => a.newCat);

  console.log(`archive:${archive.length} rewrite:${rewrite.length} enhance:${enhance.length} catFix:${catFix.length} TOTAL:${toApply.length}\n`);

  if (MODE === "dry") {
    console.log("=== WOULD ARCHIVE (spam/off-topic) ===");
    archive.slice(0, 20).forEach(a => console.log(`  [${a.oldCat||"(null)"}] ${a.title}`));
    if (archive.length > 20) console.log(`  ... +${archive.length - 20} more`);
    console.log("\n=== WOULD REWRITE (AI-slop headline) ===");
    rewrite.slice(0, 15).forEach(a => console.log(`  ${a.title}`));
    if (rewrite.length > 15) console.log(`  ... +${rewrite.length - 15} more`);
    console.log("\n=== WOULD ENHANCE (thin <800w) ===");
    enhance.slice(0, 15).forEach(a => console.log(`  ${a.wc}w  ${a.title}`));
    if (enhance.length > 15) console.log(`  ... +${enhance.length - 15} more`);
    console.log("\n=== WOULD NORMALISE CATEGORIES ===");
    catFix.slice(0, 20).forEach(a => console.log(`  ${a.oldCat||"(null)"} -> ${a.newCat}  [${a.title}]`));
    if (catFix.length > 20) console.log(`  ... +${catFix.length - 20} more`);
    console.log("\n=== DRY RUN — no changes to DB ===");
    console.log(`\nTo apply: node content-audit.js save && node apply-content.js`);
    return;
  }

  // SAVE MODE: write actions to JSON
  console.log(`Saving ${toApply.length} actions to actions.json...`);
  fs.writeFileSync("actions.json", JSON.stringify(toApply, null, 2));
  console.log("Done. Now run: node apply-content.js\n");
})();
