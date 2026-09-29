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
//
// This list is a NECESSARY-ONLY backstop. Enumerating every local-service noun
// is whack-a-mole: 18 published off-topic posts (Brooklyn electricians, Irish
// transformer suppliers, Iskin jewelry, Section 125 cafeteria plans) all slipped
// past the original hand-written list. The structural gate below — TECH_SIGNAL —
// is what actually stops them, because an article with no technology vocabulary
// in its headline cannot be a technology publication's post. Add nouns here only
// when a subject is on-topic-adjacent enough that it *does* carry a tech word
// (e.g. "supply chain for logistics software") and still needs a veto.
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

  // --- Apr–Aug 2026 residue: the verticals that produced the 18 published
  // off-topic posts the previous list did not catch. All consumer/local-service
  // or HR/finance topics with no technology subject matter.
  /electrical compan|electrician|transformer suppl|fastener suppl|aerospace fastener/i,
  /benefits provider|self-insured|medical reimbursement|healthcare cost|diabetes|personal trainer/i,
  /logistics (recruitment|company)|recruitment agency|staffing agency/i,
  /clerical (job|role|work)|elite jobs?|job openings|resume|cover letter/i,
  /section 125|cafeteria plan|hr benefits|employee benefits/i,
  /vinyl wrap|ceramic tint|window tint|car wrap|film on (your )?(car|vehicle)/i,
  /jewelry|jewellery|iskin|jeweler|jeweller/i,
  /virtual design consultation|interior design consultation|home staging/i,
  /supply chain (management|advantage)|lock(ing)? in your supply/i,
  /mental health|body focused|repetitive behaviors?|therapy|counselling|counseling/i,
  /your land (looks|is)|buy land|land parcel|acreage/i,
  /content creation services|website content services|seo services/i,
];

// Structural gate. A headline with NO technology vocabulary is off-topic by
// definition for this publication — this is what actually catches the long tail
// of consumer spam, and it is why the backstop list above no longer has to be
// exhaustive.
//
// Kept deliberately generous: an over-tight list would flag legitimate posts
// ("Examining Changes in the Startup and Venture Capital Ecosystem" has no
// obvious tech noun), and a false positive here means silently drafting a good
// article. Generics like "technology"/"features"/"system" count, because real
// product announcements rely on them.
const TECH_SIGNAL =
  /\b(ai|a\.i\.|artificial intelligence|machine learning|deep learning|neural|llm|large language model|language model|chatbot|prompt|prompting|inference|algorithm|neural network|openai|gpt-?4|gemini|llama|mistral|claude|anthropic|deepseek|qwen|agentic|agents?|rag|retrieval|embedding|transformer|diffusion|fine-?tun)\b/i;

const TECH_SIGNAL_SOFT =
  /\b(software|hardware|developer|developers|devops|code|coding|programming|api|apis|sdk|framework|library|open source|opensource|github|git|database|databases|sql|postgres|postgresql|mysql|mongodb|redis|server|servers|cloud|aws|azure|gcp|vercel|netlify|container|containers|kubernetes|docker|terraform|ci\/cd|pipeline|frontend|backend|full-?stack|typescript|javascript|python|rust|golang|java|c\+\+|c#|\.net|ruby|php|swift|kotlin|react|vue|angular|next\.?js|node|web app|mobile app|application|architecture|platform|protocol|bandwidth|latency|throughput|encryption|cyber|security|malware|ransomware|phishing|firewall|vulnerability|exploit|passkey|authentication|zero-?trust|chip|chips|processor|processors|soc|asic|gpu|cpu|fpga|risc-?v|semiconductor|silicon|nvidia|amd|intel|arm|qualcomm|tsmc|open-?titan|blockchain|crypto|web3|defi|nft|smart contract|token|quantum|satellite|rocket|nasa|spacex|orbit|astronom|battery|ev\b|electric vehicle|robot|robotics|drone|iot|5g|6g|edge comput|serverless|microservice|dev sec|observability|telemetry|benchmark|performance|optimization|compilation|parser|compiler|runtime|virtual machine|operating system|linux|unix|windows|android|ios|browser|firefox|chrome|chromium|safari|search engine|seo|sem search|analytics|data|dataset|training|inference|model|models|automation|internet|network|networking|router|wifi|wi-?fi|laptop|smartphone|iphone|android|gadget|wearable|smartwatch|headphone|earbuds|display|processor|technology|tech|electronics|firmware|integration|interface|tooling|productivity|saas|platforms?|computing|computer|engineer|engineering|mechanical|manufacturing|cnc|industrial|emission|automotive|vehicle|drivetrain|circuit|electronic|transistor|sensor|volt|watt|gigawatt|terawatt|solar|turbine|grid|power grid|keyword|crawl|indexing|sitemap|serialization|bandwidth|algorithm|encryption|openai)\b/i;

const hasTechSignal = (text) =>
  TECH_SIGNAL.test(text || "") || TECH_SIGNAL_SOFT.test(text || "");

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

module.exports = {
  STOP,
  OFF_TOPIC,
  AI_SLOP,
  hasTechSignal,
  isSlopTitle: (title) => AI_SLOP.some((re) => re.test(title || "")),
};
