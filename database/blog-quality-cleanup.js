/**
 * Blog quality cleanup.
 *
 * Classifies every published post and moves low-value ones to `draft`
 * (reversible — never deletes). Categories of removal:
 *   1. OFF_TOPIC  — consumer-service spam unrelated to an AI/tech publication
 *   2. AI_SLOP    — machine-jargon headlines Google's helpful-content system demotes
 *   3. DUPLICATE  — same subject already covered (keeps the strongest variant)
 *   4. THIN       — under the minimum word count for a credible article
 *
 * Usage:
 *   node database/blog-quality-cleanup.js                      # dry run (prints the plan)
 *   node database/blog-quality-cleanup.js --apply              # moves flagged posts to draft
 *   node database/blog-quality-cleanup.js --only=off-topic,duplicate --apply
 *
 * Always dry-run first. `--apply` appends every drafted id (and the reason) to
 * blog-quality-cleanup.applied.json, and only ever sets status='draft' — nothing
 * is deleted, so a wrong call can be flipped back to 'published'.
 *
 * NOTE: because duplicates are matched against the surviving canonical rather
 * than via transitive chaining, one run is not always enough — re-run until the
 * "--only=... selected 0 of N" line says 0.
 */
const fs = require("fs");
const path = require("path");

const APPLY = process.argv.includes("--apply");

// Optional category filter, e.g. --only=off-topic,duplicate. Empty = everything.
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) || "")
  .slice("--only=".length)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
// A post may match several categories at once; --only selects it if ANY match.
const selected = (reasons) =>
  !ONLY.length || reasons.some((r) => ONLY.some((k) => r.startsWith(k)));

const env = {};
fs.readFileSync(".env.local", "utf8")
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
  "Content-Type": "application/json",
};

// Genuinely thin floor. Deliberately low: filter the local-service spam with
// OFF_TOPIC patterns (which inspect *meaning*) instead of using word count as a
// blunt proxy, otherwise legitimate 500-800 word AI articles get drafted.
const MIN_WORDS = 450;

// Consumer verticals that have nothing to do with an AI/tech publication.
const OFF_TOPIC = [
  /barca|escursion|arcipelago|maddalena/i,
  /half cow|cow price|beef cost|livestock|cattle/i,
  // NOTE: "tiny home(s)" plural slipped past a bare /tiny house/ — the archive
  // had "Code-Approved Tiny Homes Built Right by People Who Get It".
  /trailer made|tiny houses?|tiny homes?/i,
  /pittsburgh|buy a home|buying a home|home buying|moving to /i,
  /locksmith/i,
  /tile and backsplash|backsplash/i,
  /marketing company in|seo agency services|podcast studio|wayfinding|signage/i,
  /headshots? photographer|photographer/i,
  /peach fuzz|removal in port moody|port moody/i,
  /nursing|rn to bsn|b\.tech|universities in india|colleges with the best/i,
  /sedentary behaviour|long-term health/i,
  /dual-system audio|audio improve professional/i,
  /gutter|metal roof|roof replacement|roofing|skylight/i,
  /plumb|drain|hvac|pest control|exterminat/i,
  /denture|dental|oral surgery|dentist|chiropract/i,
  /insurance|attorney|lawyer|casino|betting|lottery/i,
  /restaurant|burger|recipe|food near|catering/i,
  /realtor|mortgage|real estate agent|property listing/i,
  /remodel|renovat/i, // present in app/api/automate/route.ts, was missing here
  /new construction home|builder west|home value|dream home/i,
  // NOTE: deliberately NOT a bare /landscap/ — that also matches on-topic
  // headlines like "Navigating the Landscape of Artificial Intelligence".
  /landscaping|landscape (design|service|company|contractor|maintenance)/i,
];

// Machine-generated headline jargon — the fingerprint of AI filler.
const AI_SLOP = [
  /epistemic|deconstruct|omniscience|omniscient/i,
  /re-architect|rearchitect|architecting the next/i,
  /forensic cognition|arbitration engine|empirical benchmark/i,
  /expert calibration|expert synthesis|synthetic epistemology/i,
  /grounding protocol|grounding primitive|grounding architecture|grounding layer/i,
  /architecture of truth|syntax of mind|agentic imperative/i,
  /asymmetric prose|cognitive validation|cognitive sanction|cognitive integrity/i,
  /synthetic scholar|synthetic engine|synthetic omniscience|synthetic velocity/i,
  /paradigm|juxtaposition|zeitgeist|tapestry/i,
  /redefining truth|restructuring frontier/i,
  // Generic filler machines that produced the bulk of the archived duplicates:
  // an all-caps "X ANALYSIS:" prefix or a vaguer-than-vague subtitle.
  /^\s*(expert|market|deep|comprehensive)\s+analysis\s*:/i,
  /^\s*(unveiling|unlocking|unearthing|decoding|deciphering|navigating)\b/i,
  /a futuristic odyssey|beyond the nexus|the nexus of/i,
];

const STOP = new Set([
  "the", "a", "an", "and", "or", "of", "in", "on", "for", "to", "with", "is", "are",
  "was", "were", "be", "been", "by", "at", "as", "it", "its", "this", "that", "these",
  "those", "from", "into", "your", "you", "our", "we", "how", "why", "what", "when",
  "who", "will", "can", "could", "should", "would", "might", "new", "latest", "2026",
  "2025", "2024", "guide", "explained", "best", "top", "vs", "versus", "after", "before",
  "about", "over", "under", "more", "most", "than", "then", "there", "here", "not",
]);

const tokens = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[\u2010-\u2015\u2212\u00ad]/g, "-")
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((w) => w.length > 1 && !STOP.has(w));

const wordCount = (html) =>
  (html || "").replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;

// Mirrors the near-duplicate test in app/api/automate/route.ts so the archive
// cleanup and the generator agree on what "duplicate" means.
const similarity = (a, b) => {
  const As = new Set(a);
  const Bs = new Set(b);
  const common = a.filter((w) => Bs.has(w)).length;
  const unionSize = new Set([...As, ...Bs]).size;
  const jac = unionSize ? common / unionSize : 0;
  const minSize = Math.min(As.size, Bs.size);
  const cont = minSize ? common / minSize : 0;
  return jac >= 0.45 || (common >= 4 && jac >= 0.35) || (minSize >= 3 && cont >= 0.7);
};

// --- main -------------------------------------------------------------------

(async () => {
  const res = await fetch(
    URL_BASE +
      "/rest/v1/blogs?select=id,title,category,content,published_at" +
      "&status=eq.published&order=published_at.asc",
    { headers: HEADERS }
  );
  if (!res.ok) throw new Error(`fetch failed: HTTP ${res.status} ${await res.text()}`);
  const rows = await res.json();

  const wc = rows.map((r) => wordCount(r.content));
  const OFF = new Map();
  const SLOP = new Map();
  const THIN = new Set();

  rows.forEach((r, i) => {
    const title = r.title || "";
    const off = OFF_TOPIC.find((re) => re.test(title));
    if (off) OFF.set(i, off.source);
    const slop = AI_SLOP.find((re) => re.test(title));
    if (slop) SLOP.set(i, slop.source);
    if (wc[i] < MIN_WORDS) THIN.add(i);
  });

  // Pairwise duplicate graph.
  const toks = rows.map((r) => tokens(r.title));
  const dupPair = new Set();
  const pk = (a, b) => (a < b ? a + ":" + b : b + ":" + a);
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      if (similarity(toks[i], toks[j])) dupPair.add(pk(i, j));
    }
  }

  // Union-find purely to *group* topics so each group can pick one canonical.
  const parent = rows.map((_, i) => i);
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  for (const p of dupPair) {
    const [a, b] = p.split(":").map(Number);
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[rb] = ra;
  }
  const groups = new Map();
  rows.forEach((_, i) => {
    const root = find(i);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(i);
  });

  // A post is only ever kept if it is on-topic, not filler, and not thin.
  const disqualified = (i) => OFF.has(i) || SLOP.has(i) || THIN.has(i);

  // A post can be flagged for several reasons at once — an off-topic post often
  // also carries an AI-slop headline, and a slop headline is often also a
  // duplicate. Keeping only the last reason written made --only=duplicate skip
  // duplicates whose headline was slop, and --only=off-topic skip spam that was
  // also slop. Collect all of them instead.
  const reasons = new Map(); // idx -> string[]
  const addReason = (i, r) => {
    if (!reasons.has(i)) reasons.set(i, []);
    if (!reasons.get(i).includes(r)) reasons.get(i).push(r);
  };
  const clusters = [];

  for (const members of groups.values()) {
    if (members.length < 2) continue;

    const survivors = members.filter((i) => !disqualified(i));
    if (!survivors.length) continue; // every member is already flagged on its own

    // Canonical = longest survivor, tie-break on the oldest (the incumbent URL
    // is the one most likely already indexed and holding link equity).
    const keep = survivors.reduce((best, i) => {
      if (wc[i] > wc[best]) return i;
      if (wc[i] === wc[best] && rows[i].published_at < rows[best].published_at) return i;
      return best;
    });

    // Draft only members *directly* similar to the canonical. Transitive
    // chaining (A~B, B~C, C~D) used to merge unrelated topics into one giant
    // cluster and draft dozens of legitimate posts.
    const losers = members.filter((i) => i !== keep && dupPair.has(pk(keep, i)));
    if (!losers.length) continue;

    clusters.push({ keep, losers, size: members.length });
    for (const i of losers) addReason(i, `duplicate of "${rows[keep].title}"`);
  }

  for (const [i, re] of OFF) addReason(i, `off-topic: /${re}/`);
  for (const [i, re] of SLOP) addReason(i, `ai-slop: /${re}/`);
  for (const i of THIN) addReason(i, `thin: ${wc[i]} < ${MIN_WORDS} words`);

  // --- report ---
  console.log(`Published: ${rows.length}`);
  console.log(
    `Flagged -> off-topic ${OFF.size} | ai-slop ${SLOP.size} | thin ${THIN.size} | duplicate-clusters ${clusters.length}`
  );

  console.log(`\n--- DUPLICATE CLUSTERS (${clusters.length}) ---`);
  for (const c of clusters) {
    console.log(`  KEEP  (${wc[c.keep]}w) ${rows[c.keep].title}`);
    for (const i of c.losers) console.log(`  DRAFT (${wc[i]}w) ${rows[i].title}`);
  }

  console.log(`\n--- OFF-TOPIC (${OFF.size}) ---`);
  for (const [i] of OFF) console.log(`  ${rows[i].title}`);

  console.log(`\n--- AI-SLOP (${SLOP.size}) ---`);
  for (const [i] of SLOP) console.log(`  ${rows[i].title}`);

  console.log(`\n--- THIN < ${MIN_WORDS}w (${THIN.size}) ---`);
  for (const i of THIN) console.log(`  (${wc[i]}w) ${rows[i].title}`);

  console.log(`\nTOTAL to draft: ${reasons.size}  ->  ${rows.length - reasons.size} published remaining`);
  const byReason = { duplicate: 0, "off-topic": 0, "ai-slop": 0, thin: 0 };
  for (const rs of reasons.values()) {
    for (const k of Object.keys(byReason)) if (rs.some((r) => r.startsWith(k))) byReason[k]++;
  }
  console.log("breakdown (a row can match several):", JSON.stringify(byReason));

  // Everything the current --only filter selects. Without --only this is all.
  const finalPlan = new Map([...reasons].filter(([, rs]) => selected(rs)));
  if (ONLY.length) {
    console.log(
      `--only=${ONLY.join(",")} selected ${finalPlan.size} of ${reasons.size} ` +
        `-> ${rows.length - finalPlan.size} published remaining`
    );
  }

  if (!APPLY) {
    console.log("\nDRY RUN — nothing changed. Apply with: node database/blog-quality-cleanup.js --apply");
    return;
  }

  // Append to an audit log *before* touching the database, so the exact set of
  // drafted ids (and the reason for each) is always recoverable. To undo:
  //   UPDATE blogs SET status='published' WHERE id = ANY(<ids from this file>);
  const AUDIT = path.join(__dirname, "blog-quality-cleanup.applied.json");
  let audit = [];
  try {
    audit = JSON.parse(fs.readFileSync(AUDIT, "utf8"));
    if (!Array.isArray(audit)) audit = [];
  } catch {
    audit = [];
  }
  const runAt = new Date().toISOString();
  for (const [i, rs] of finalPlan) {
    audit.push({ id: rows[i].id, title: rows[i].title, reasons: rs, at: runAt });
  }
  fs.writeFileSync(AUDIT, JSON.stringify(audit, null, 2));

  let ok = 0;
  let failed = 0;
  for (const i of finalPlan.keys()) {
    // status is the only column this tool ever writes — drafting is reversible,
    // nothing is deleted, so a bad call can always be flipped back.
    const r = await fetch(`${URL_BASE}/rest/v1/blogs?id=eq.${encodeURIComponent(rows[i].id)}`, {
      method: "PATCH",
      headers: HEADERS,
      body: JSON.stringify({ status: "draft" }),
    });
    if (r.ok) {
      ok++;
    } else {
      failed++;
      console.log(`  FAILED: ${rows[i].title} -> HTTP ${r.status} ${await r.text()}`);
    }
  }
  console.log(`\nApplied: ${ok} moved to draft, ${failed} failed. Audit: ${AUDIT}`);

  const after = await fetch(URL_BASE + "/rest/v1/blogs?select=id&status=eq.published&limit=1", {
    headers: { ...HEADERS, Prefer: "count=exact", Range: "0-0" },
  });
  console.log("published now:", after.headers.get("content-range"));
})();
