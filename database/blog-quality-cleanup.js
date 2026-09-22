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
 *   node blog-cleanup.js          # dry run (prints the plan, changes nothing)
 *   node blog-cleanup.js --apply  # moves flagged posts to draft
 */
const fs = require("fs");

const APPLY = process.argv.includes("--apply");

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

const MIN_WORDS = 800;

// Consumer verticals that have nothing to do with an AI/tech publication.
const OFF_TOPIC = [
  /barca|escursion|arcipelago|maddalena/i,
  /half cow|cow price|beef cost|livestock|cattle/i,
  /trailer made|tiny house/i,
  /pittsburgh|buy a home|buying a home|home buying|moving to /i,
  /locksmith/i,
  /tile and backsplash|backsplash/i,
  /marketing company in|seo agency services/i,
  /headshots? photographer|photographer/i,
  /peach fuzz|removal in port moody|port moody/i,
  /nursing programs|colleges with the best/i,
  /sedentary behaviour|long-term health/i,
  /dual-system audio|audio improve professional/i,
  /gutter|metal roof|roof replacement|roofing/i,
  /plumb|drain|hvac|pest control|exterminat/i,
  /denture|dental|oral surgery|dentist|chiropract/i,
  /insurance|attorney|lawyer|casino|betting|lottery/i,
  /restaurant|burger|recipe|food near|catering/i,
  /realtor|mortgage|real estate agent|property listing/i,
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
