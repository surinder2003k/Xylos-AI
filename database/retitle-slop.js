/**
 * URL-safe headline retitler for AI-slop posts.
 * Run without flags to generate database/retitle-slop.plan.json (no DB writes).
 * Review the plan, then run with --apply. Apply changes blogs.title only:
 * slugs, content, metadata, and publication status are never changed.
 */
const fs = require("fs");
const path = require("path");
const { isSlopTitle } = require("./slop-rules");

const ROOT = path.join(__dirname, "..");
const PLAN = path.join(__dirname, "retitle-slop.plan.json");
const APPLY = process.argv.includes("--apply");
const FORCE = process.argv.includes("--force");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const LIMIT = limitArg ? Number(limitArg.split("=")[1]) : Number.POSITIVE_INFINITY;

const env = {};
for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^['\"]|['\"]$/g, "");
}
const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE;
if (!URL_BASE || !KEY) throw new Error("Missing Supabase URL or service-role key in .env.local");
const HEADERS = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
const providerChain = [
  { name: "openrouter", key: env.OPENROUTER_API_KEY, model: "openai/gpt-4o-mini" },
  { name: "mistral", key: env.MISTRAL_API_KEY, model: "mistral-medium-latest" },
  { name: "groq", key: env.GROQ_API_KEY, model: "openai/gpt-oss-120b" },
].filter((p) => p.key);

const plainText = (html) => String(html || "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
const cleanTitle = (value) => String(value || "").replace(/^```[a-z]*\s*|\s*```$/gi, "").replace(/^["']|["']$/g, "").replace(/\s+/g, " ").trim();
function validTitle(title, oldTitle) {
  return title.length >= 28 && title.length <= 100 && title.toLowerCase() !== oldTitle.toLowerCase() && !isSlopTitle(title) && /[A-Za-z]/.test(title) && !/https?:\/\//i.test(title) && !/[^\x20-\x7E]/.test(title) && !/major advancement|quantum leap|game[- ]changer|revolutionary/i.test(title);
}

async function askProvider(provider, row) {
  const banned = "epistemic, deconstruct, omniscience, omniscient, paradigm, juxtaposition, zeitgeist, tapestry, unveiling, unlocking, unearthing, decoding, deciphering, navigating, odyssey, nexus, frontier, imperative, calibration, asymmetry, quantum leap, major advancement, revolutionary";
  const prompt = `You are a factual technology editor rewriting an over-hyped headline.
Return ONLY one JSON object, with no markdown and no explanation. The object must have exactly one field: "title".
Rewrite the headline. Keep the same concrete product, person, method, or topic. State the useful fact directly instead of using promotion. Do not use "major advancement", "quantum leap", "revolutionary", or any other hype. Avoid vague promises, filler, and AI jargon.
TITLE: ${row.title}
ARTICLE EXCERPT: ${plainText(row.content).slice(0, 1400)}
BANNED WORDS: ${banned}`;
  const endpoint = provider.name === "groq" ? "https://api.groq.com/openai/v1/chat/completions" : provider.name === "mistral" ? "https://api.mistral.ai/v1/chat/completions" : "https://openrouter.ai/api/v1/chat/completions";
  const body = { model: provider.model, messages: [{ role: "user", content: prompt }], temperature: 0.2, max_tokens: 180 };
  if (provider.name === "openrouter") body.response_format = { type: "json_object" };
  // The reasoning model does not support Groq's strict JSON response mode.
  // Keep the prompt JSON-shaped and validate the parsed title below.
  const response = await fetch(endpoint, { method: "POST", headers: { Authorization: `Bearer ${provider.key}`, "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${(await response.text()).slice(0, 160)}`);
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  let parsed;
  try { parsed = JSON.parse(text.replace(/^```json\s*|\s*```$/gi, "")); } catch { parsed = { title: text }; }
  const title = cleanTitle(parsed.title);
  if (!validTitle(title, row.title)) throw new Error(`invalid title: ${title}`);
  return title;
}



async function makePlan(rows) {
  const plan = [];
  const existingTitles = new Set(rows.map((r) => r.title.toLowerCase()));
  for (const row of rows.slice(0, LIMIT)) {
    for (const provider of providerChain) {
      try {
        const newTitle = await askProvider(provider, row);
        if (existingTitles.has(newTitle.toLowerCase())) throw new Error(`duplicate title: ${newTitle}`);
        existingTitles.add(newTitle.toLowerCase());
        plan.push({ id: row.id, oldTitle: row.title, newTitle, status: row.status, slug: row.slug });
        console.log(`  [${provider.name}] ${row.title} -> ${newTitle}`);
        break;
      } catch (e) { console.warn(`  [${provider.name}] skipped: ${e.message}`); }
    }
  }
  return plan;
}

(async () => {
  if (APPLY) {
    if (!fs.existsSync(PLAN)) throw new Error(`Plan not found: ${PLAN}. Run without --apply first.`);
    const plan = JSON.parse(fs.readFileSync(PLAN, "utf8"));
    if (!Array.isArray(plan) || !plan.length) throw new Error("Plan is empty.");
    let ok = 0;
    for (const item of plan) {
      if (!validTitle(item.newTitle, item.oldTitle)) { console.log(`SKIP invalid ${item.id}`); continue; }
      const check = await fetch(`${URL_BASE}/rest/v1/blogs?select=title&id=eq.${encodeURIComponent(item.id)}`, { headers: HEADERS });
      const current = (await check.json())?.[0];
      if (!current || current.title !== item.oldTitle) { console.log(`SKIP stale ${item.id}`); continue; }
      const response = await fetch(`${URL_BASE}/rest/v1/blogs?id=eq.${encodeURIComponent(item.id)}`, { method: "PATCH", headers: HEADERS, body: JSON.stringify({ title: item.newTitle }) });
      if (response.ok) { ok++; console.log(`  ${item.oldTitle} -> ${item.newTitle}`); }
      else console.log(`FAILED ${item.id}: HTTP ${response.status}`);
    }
    console.log(`Applied title-only updates: ${ok}/${plan.length}. No slug, content, metadata, or status was changed.`);
    return;
  }
  const response = await fetch(`${URL_BASE}/rest/v1/blogs?select=id,title,slug,status,content&status=in.(published,draft)&order=published_at.asc`, { headers: HEADERS });
  if (!response.ok) throw new Error(`fetch failed: HTTP ${response.status} ${await response.text()}`);
  if (fs.existsSync(PLAN) && !FORCE) throw new Error(`Plan already exists: ${PLAN}. Review it, apply it, or rerun with --force.`);
  const rows = (await response.json()).filter((r) => isSlopTitle(r.title));
  console.log(`AI-slop titles found: ${rows.length}; generating up to ${LIMIT} (dry run).`);
  const plan = await makePlan(rows);
  fs.writeFileSync(PLAN, JSON.stringify(plan, null, 2));
  console.log(`\nReview ${PLAN} (${plan.length} proposals). Nothing was written to the database.`);
  console.log("Apply after review with: node database/retitle-slop.js --apply");
})().catch((e) => { console.error(e.message); process.exitCode = 1; });
