const fs = require("fs");

// Parse .env.local
const envVars = {};
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) envVars[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
}
const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const key = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE;
const H = { apikey: key, Authorization: `Bearer ${key}` };

const actions = JSON.parse(fs.readFileSync("actions.json", "utf8"));
let ok = 0, fail = 0;
const failIds = [];
let doneCount = 0;
const total = actions.length;

const applyPatch = async (id, patch) => {
  // Use `in=.` syntax with parentheses to avoid URL parsing issues with UUID hyphens
  const res = await fetch(`${url}/rest/v1/blogs?id=in.(${id})`, {
    method: "PATCH",
    headers: { ...H, "Content-Type": "application/json", "Prefer": "return=minimal" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
};

(async () => {
  console.log(`Loaded ${total} actions from actions.json`);
  console.log(`Starting ${total} tasks with 2 workers...\n`);

  const WORKER_COUNT = 2;
  const queue = [...actions];

  const workers = Array.from({ length: WORKER_COUNT }, async () => {
    while (true) {
      const action = queue.shift();
      if (!action) break;
      try {
        if (action.decision === "archive") {
          await applyPatch(action.id, { status: "archived", archived_reason: action.reason });
        } else if (action.decision === "rewrite") {
          await applyPatch(action.id, { status: "rewrite_needed", rewrite_reason: action.reason });
        } else if (action.decision === "enhance") {
          await applyPatch(action.id, { status: "enhance_needed", enhance_reason: action.reason });
        } else if (action.newCat) {
          await applyPatch(action.id, { category: action.newCat });
        }
        ok++;
      } catch (e) {
        fail++;
        failIds.push({ id: action.id, title: action.title, reason: e.message });
      }
      doneCount++;
      if (doneCount % 10 === 0 || doneCount === total) {
        console.log(`  progress: ${doneCount}/${total} | ok=${ok} fail=${fail}`);
      }
    }
  });

  await Promise.all(workers);
  console.log(`\n=== DONE: ${ok} ok, ${fail} failed ===`);

  if (failIds.length) {
    console.log("\n=== FAILED ===");
    failIds.forEach(f => console.log(`  id=${f.id} [${f.title}]: ${f.reason}`));
  }

  console.log("\n=== APPLY SUMMARY ===");
  const byDecision = {};
  actions.forEach(a => { byDecision[a.decision] = (byDecision[a.decision] || 0) + 1; });
  Object.entries(byDecision).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
  console.log(`  TOTAL: ${actions.length}`);
  console.log(`  SUCCESS: ${ok}`);
  console.log(`  FAILED: ${fail}`);
})();
