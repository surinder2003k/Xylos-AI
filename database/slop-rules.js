/**
 * Shared content-quality vocabulary for the Xylos AI blog.
 *
 * Single source of truth for:
 *   - database/blog-quality-cleanup.js  (drafts low-value posts)
 *   - database/retitle-slop.js          (rewrites filler headlines)
 *
 * The generator enforces the same three layers at publish time via
 * OFF_TOPIC_TERMS / SLOP_TERMS / TECH_SIGNALS in app/api/automate/route.ts.
 * That file is TypeScript and cannot require this one, so when either side
 * changes, update the other. (A headline banned here must also be banned there,
 * otherwise the archive gets re-polluted as fast as it gets cleaned.)
 */

const STOP = new Set([
  "the", "a", "an", "and", "or", "of", "in", "on", "for", "to", "with", "is", "are",
  "was", "were", "be", "been", "by", "at", "as", "it", "its", "this", "that", "these",
  "those", "from", "into", "your", "you", "our", "we", "how", "why", "what", "when",
  "who", "will", "can", "could", "should", "would", "might", "new", "latest", "2026",
  "2025", "2024", "guide", "explained", "best", "top", "vs", "versus", "after", "before",
  "about", "over", "under", "more", "most", "than", "then", "there", "here", "not",
]);

// Consumer / local-service verticals that have nothing to do with an AI & tech
// publication. These are the subjects that got the site a "low value content"
// flag in the first place.
const OFF_TOPIC = [
  /barca|escursion|arcipelago|maddalena/i,
  /half cow|cow price|beef cost|livestock|cattle/i,
  // "tiny home(s)" plural slipped past a bare /tiny house/ in the first pass.
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
  /remodel|renovat/i,
  /new construction home|builder west|home value|dream home/i,
  // NOTE: deliberately NOT a bare /landscap/ - that also matches legitimate
  // on-topic headlines such as "Navigating the Landscape of Artificial
  // Intelligence". Matches "landscaping" only.
  /landscaping|landscape (design|service|company|contractor|maintenance)/i,
];

// Machine-generated headline jargon: the fingerprint of AI filler. Google's
// helpful-content system demotes these even when the subject is on-domain.
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
  // an all-caps "X ANALYSIS:" prefix, a clickbait opener, or a meaningless
  // "A Futuristic Odyssey" subtitle.
  /^\s*(expert|market|deep|comprehensive)\s+analysis\s*:/i,
  /^\s*(unveiling|unlocking|unearthing|decoding|deciphering|navigating)\b/i,
  /a futuristic odyssey|beyond the nexus|the nexus of/i,
];

module.exports = { STOP, OFF_TOPIC, AI_SLOP, isSlopTitle: (title) => AI_SLOP.some((re) => re.test(title || "")) };
