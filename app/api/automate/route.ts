import { generateSmartBlog } from "@/lib/ai/smart-generator";
import { searchSmartImage } from "@/lib/utils/image-search";
import {
  discoverLatestPosts,
  discoverInternalPosts,
} from "@/lib/utils/link-discovery";
import { pingIndexNow } from "@/lib/utils/indexnow";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createAuthClient } from "@/utils/supabase/server";

// Vercel Hobby Plan max is 60s. Pro plan allows up to 300s.
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const CATEGORIES = [
  "Technology",
  "AI & Machine Learning",
  "Cybersecurity",
  "Software Development",
  "Cloud & DevOps",
  "Consumer Tech",
  "Blockchain",
  "Space & Astronomy"
];

const CATEGORY_TOPICS: Record<string, string[]> = {
  "Technology": ["Open-source AI tools developers actually use", "How on-device AI is changing smartphones", "The real cost of running AI inference at scale", "Why small language models are winning on the edge"],
  "AI & Machine Learning": ["Prompt engineering techniques that actually improve output", "Retrieval-augmented generation explained for builders", "Fine-tuning vs RAG: choosing the right approach", "How free-tier AI models compare in real benchmarks"],
  "Cybersecurity": ["Passkey adoption and the death of passwords", "Practical API security mistakes developers still make", "How ransomware groups exploit unpatched servers", "Zero-trust architecture for small teams"],
  "Software Development": ["TypeScript patterns that scale in large codebases", "Server-side rendering trade-offs in modern frameworks", "Testing strategies for AI-powered applications", "Why edge computing is reshaping web deployment"],
  "Cloud & DevOps": ["Serverless vs containers for startup workloads", "Cutting cloud costs without cutting reliability", "CI/CD pipelines that deploy in under a minute", "Postgres vs specialized databases for app builders"],
  "Consumer Tech": ["Battery tech breakthroughs coming to laptops", "The best privacy settings on modern browsers", "How foldable hardware finally got practical", "Smart home standards that actually interoperate"],
  "Blockchain": ["Smart contract security audits explained", "Layer-2 scaling and what it means for fees", "Real-world uses of decentralized identity", "Energy use of proof-of-stake vs proof-of-work"],
  "Space & Astronomy": ["Reusable rockets and falling launch costs", "Satellite internet constellations in practice", "AI's role in processing telescope data", "CubeSats and the new space startup wave"]
};

// Keyword-to-URL mapping for auto external linking
const KEYWORD_LINK_MAP: Record<string, string> = {
  "artificial intelligence": "https://en.wikipedia.org/wiki/Artificial_intelligence",
  "machine learning": "https://en.wikipedia.org/wiki/Machine_learning",
  "deep learning": "https://en.wikipedia.org/wiki/Deep_learning",
  "neural network": "https://en.wikipedia.org/wiki/Neural_network",
  "natural language processing": "https://en.wikipedia.org/wiki/Natural_language_processing",
  "openai": "https://openai.com",
  "chatgpt": "https://openai.com/chatgpt",
  "gpt-4": "https://openai.com/index/gpt-4",
  "gpt-4o": "https://openai.com/index/hello-gpt-4o",
  "gemini": "https://deepmind.google/technologies/gemini/",
  "google gemini": "https://deepmind.google/technologies/gemini/",
  "llama": "https://llama.meta.com",
  "llama 3": "https://llama.meta.com",
  "meta ai": "https://ai.meta.com",
  "mistral": "https://mistral.ai",
  "mistral ai": "https://mistral.ai",
  "anthropic": "https://www.anthropic.com",
  "claude": "https://www.anthropic.com",
  "react": "https://react.dev",
  "next.js": "https://nextjs.org",
  "nextjs": "https://nextjs.org",
  "typescript": "https://www.typescriptlang.org",
  "node.js": "https://nodejs.org",
  "nodejs": "https://nodejs.org",
  "python": "https://www.python.org",
  "rust": "https://www.rust-lang.org",
  "blockchain": "https://en.wikipedia.org/wiki/Blockchain",
  "bitcoin": "https://bitcoin.org",
  "ethereum": "https://ethereum.org",
  "web3": "https://en.wikipedia.org/wiki/Web3",
  "defi": "https://en.wikipedia.org/wiki/Decentralized_finance",
  "quantum computing": "https://en.wikipedia.org/wiki/Quantum_computing",
  "cybersecurity": "https://en.wikipedia.org/wiki/Computer_security",
  "cloud computing": "https://en.wikipedia.org/wiki/Cloud_computing",
  "aws": "https://aws.amazon.com",
  "google cloud": "https://cloud.google.com",
  "microsoft azure": "https://azure.microsoft.com",
  "spacex": "https://www.spacex.com",
  "nasa": "https://www.nasa.gov",
  "space exploration": "https://en.wikipedia.org/wiki/Space_exploration",
  "biotechnology": "https://en.wikipedia.org/wiki/Biotechnology",
  "crispr": "https://en.wikipedia.org/wiki/CRISPR_gene_editing",
  "renewable energy": "https://en.wikipedia.org/wiki/Renewable_energy",
  "electric vehicle": "https://en.wikipedia.org/wiki/Electric_car",
  "tesla": "https://www.tesla.com",
  "apple": "https://www.apple.com",
  "microsoft": "https://www.microsoft.com",
  "google": "https://www.google.com",
  "amazon": "https://www.amazon.com",
  "meta platforms": "https://about.meta.com",
  "nvidia": "https://www.nvidia.com",
  "intel": "https://www.intel.com",
  "amd": "https://www.amd.com",
  "ibm": "https://www.ibm.com",
  "samsung": "https://www.samsung.com",
  "github": "https://github.com",
  "docker": "https://www.docker.com",
  "kubernetes": "https://kubernetes.io",
  "linux": "https://www.linux.org",
  "ubuntu": "https://ubuntu.com",
  "supabase": "https://supabase.com",
  "vercel": "https://vercel.com",
  "tailwind css": "https://tailwindcss.com",
  "graphql": "https://graphql.org",
  "postgresql": "https://www.postgresql.org",
  "mongodb": "https://www.mongodb.com",
  "redis": "https://redis.io",
  "elasticsearch": "https://www.elastic.co",
};

function injectExternalLinks(content: string, keywords: string): string {
  if (!content || !keywords) return content;
  
  const keywordList = keywords.split(",").map(k => k.trim().toLowerCase());
  let modifiedContent = content;
  let linksAdded = 0;
  const maxLinks = 8;

  for (const keyword of keywordList) {
    if (linksAdded >= maxLinks) break;
    
    const url = KEYWORD_LINK_MAP[keyword];
    if (!url) continue;

    // Check if this keyword already has a link in the content
    const linkPattern = new RegExp(`<a[^>]*href=["']${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`, 'i');
    if (linkPattern.test(modifiedContent)) continue;

    // Find the keyword in content (case-insensitive) and add link if not already linked
    const keywordRegex = new RegExp(`(?<!<a[^>]*>)(?<!</a>)\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b(?![^<]*</a>)`, 'gi');
    const matches = modifiedContent.match(keywordRegex);
    
    if (matches && matches.length > 0) {
      // Only link the first occurrence
      const firstMatch = matches[0];
      const escapedKeyword = firstMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const linkRegex = new RegExp(`(?<!<a[^>]*>)\\b(${escapedKeyword})\\b(?![^<]*</a>)`, 'i');
      modifiedContent = modifiedContent.replace(linkRegex, `<a href="${url}" target="_blank" rel="noopener noreferrer">$1</a>`);
      linksAdded++;
    }
  }

  return modifiedContent;
}

// ---------------------------------------------------------------------------
// Content quality guards
// ---------------------------------------------------------------------------

// Words that carry no topical meaning — ignored when comparing subjects.
const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "of", "in", "on", "for", "to", "with", "is", "are",
  "was", "were", "be", "been", "by", "at", "as", "it", "its", "this", "that", "these",
  "those", "from", "into", "your", "you", "our", "we", "how", "why", "what", "when",
  "who", "will", "can", "could", "should", "would", "might", "new", "latest", "2026",
  "2025", "2024", "guide", "explained", "best", "top", "vs", "versus", "after", "before",
  "about", "over", "under", "more", "most", "than", "then", "there", "here", "not",
]);

/**
 * Normalise a headline/subject into comparable significant tokens.
 * Handles unicode hyphen look-alikes (U+2010..U+2015, non-breaking hyphen) that
 * previously made "On‑Device" and "On-Device" look like different words.
 */
function significantTokens(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[\u2010-\u2015\u2212\u00ad]/g, "-")
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

/**
 * True when the incoming article covers a subject that a recent post already
 * covered. Two signals, either one is enough:
 *  1. Token-overlap (Jaccard) above the threshold — catches reworded headlines.
 *  2. Every significant token of the canonical subject_key already appears in a
 *     recent title — catches "same subject, different headline" duplicates such
 *     as "On-Device AI: The Silent Revolution Reshaping Smartphones" vs
 *     "On-Device AI: The Quiet Engine Redefining Smartphones".
 */
function isNearDuplicate(
  title: string,
  subjectKey: string | undefined,
  recentTitles: string[],
): { duplicate: boolean; matchedTitle: string | null; reason: string } {
  const newTokens = significantTokens(title);
  const subjectTokens = subjectKey ? significantTokens(subjectKey) : [];
  const newSet = new Set(newTokens);

  for (const existing of recentTitles) {
    if (!existing || existing.startsWith("_")) continue;

    // Signal 2: canonical subject fully contained in an existing headline.
    if (subjectTokens.length >= 2) {
      const existingTokens = new Set(significantTokens(existing));
      const allPresent = subjectTokens.every((t) => existingTokens.has(t));
      if (allPresent) {
        return { duplicate: true, matchedTitle: existing, reason: "same subject_key" };
      }
    }

    // Signal 1: reworded headline similarity.
    const existingTokens = significantTokens(existing);
    if (existingTokens.length === 0) continue;
    const existingSet = new Set(existingTokens);
    const common = newTokens.filter((w) => existingSet.has(w)).length;
    const union = new Set([...newSet, ...existingSet]).size;
    const jaccard = union === 0 ? 0 : common / union;
    if (jaccard >= 0.45 || (common >= 4 && jaccard >= 0.35)) {
      return { duplicate: true, matchedTitle: existing, reason: `similarity ${jaccard.toFixed(2)}` };
    }
  }

  return { duplicate: false, matchedTitle: null, reason: "" };
}

export async function GET(req: Request) {
  const startTime = Date.now();

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { searchParams } = new URL(req.url);
    const count = Math.min(parseInt(searchParams.get("count") || "2"), 3);
    const isDiagnostics = searchParams.get("diagnostics") === "1";

    const authHeader = req.headers.get("authorization");
    const vercelCronSchedule = req.headers.get("x-vercel-cron-schedule");
    const vercelCronAuthToken = req.headers.get("x-vercel-cron-auth-token");
    const userAgent = req.headers.get("user-agent") || "";
    const legacyCronHeader = req.headers.get("x-vercel-cron");

    // Vercel has shipped several cron identification mechanisms over time, so we
    // accept all of them. Relying on a single legacy header caused the daily cron
    // to silently 401 in production and skip posting entirely.
    const cronSignals = [
      vercelCronSchedule ? "x-vercel-cron-schedule" : null,
      vercelCronAuthToken ? "x-vercel-cron-auth-token" : null,
      legacyCronHeader ? "x-vercel-cron" : null,
      /vercel-cron/i.test(userAgent) ? "user-agent" : null,
    ].filter(Boolean) as string[];

    const hasCronSecretBearer =
      !!process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;

    const isCron = cronSignals.length > 0 || hasCronSecretBearer;

    let isAuthorizedAdmin = false;
    if (!isCron) {
      try {
        const authClient = await createAuthClient();
        const { data: { user } } = await authClient.auth.getUser();
        if (user) {
          const { data: profile } = await authClient
            .from("profiles")
            .select("role")
            .eq("user_id", user.id)
            .maybeSingle();
          if (profile && (profile.role === "admin" || profile.role === "super_admin")) {
            isAuthorizedAdmin = true;
          }
        }
      } catch (e) {
        console.error("[Auth] Validation error:", e);
      }
    }

    if (!isCron && !isAuthorizedAdmin && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Unauthorized. Cron secret or admin session required." },
        { status: 401 },
      );
    }

    const trigger = isCron ? "Cron" : "Manual";
    console.log(`[AutoPost] START | Trigger: ${trigger} | Count: ${count}`);

    let allExistingTitles: string[] = [];
    let activeCategory = "Technology";

    try {
      const { data: latestPosts } = await supabaseAdmin
        .from("blogs")
        .select("title, category")
        .order("created_at", { ascending: false })
        .limit(100);
      if (latestPosts) {
        allExistingTitles = latestPosts.map((p) => p.title);
      }
    } catch (err) {
      console.warn("[AutoPost] Could not fetch recent titles:", err);
    }

    try {
      const { data: categorySetting } = await supabaseAdmin
        .from("app_settings")
        .select("value")
        .eq("key", "auto_category")
        .maybeSingle();
      if (categorySetting?.value && CATEGORIES.includes(categorySetting.value)) {
        activeCategory = categorySetting.value;
      }
    } catch (err) {
      console.warn("[AutoPost] Could not fetch auto_category setting, using default:", err);
    }

    let currentCategory = activeCategory;

    let authorId: string | null = null;
    try {
      const { data: admins } = await supabaseAdmin
        .from("profiles")
        .select("user_id")
        .in("role", ["super_admin", "admin"])
        .limit(1);
      if (admins && admins.length > 0) {
        authorId = admins[0].user_id;
      } else {
        const { data: fallbackAdmins } = await supabaseAdmin
          .from("profiles")
          .select("user_id")
          .in("role", ["super_admin", "admin"])
          .limit(1);
        if (fallbackAdmins && fallbackAdmins.length > 0) {
          authorId = fallbackAdmins[0].user_id;
        } else {
          const { data: anyProfile } = await supabaseAdmin
            .from("profiles")
            .select("user_id")
            .limit(1);
          if (anyProfile && anyProfile.length > 0) {
            authorId = anyProfile[0].user_id;
          }
        }
      }
    } catch (e) {
      console.error("[AutoPost] Author resolution failed:", e);
    }

    if (!authorId) {
      console.error("[AutoPost] CRITICAL: No admin author found. Cannot create post.");
      return NextResponse.json(
        { error: "No admin author found in profiles table. Run Supabase init SQL first." },
        { status: 500 }
      );
    }

    const results: any[] = [];
    const pingUrls: string[] = [];
    let attempts = 0;
    const maxAttempts = count + 2; // Allow extra attempts for retries

    // Pre-fetch links once (not per post)
    let internalLinks: string[] = [];
    let externalLinks: string[] = [];
    try {
      const [partner1Posts, partner2Posts, internalPosts] = await Promise.all([
        discoverLatestPosts("https://techcrunch.com/feed/", 2),
        discoverLatestPosts("https://www.theverge.com/rss/index.xml", 2),
        discoverInternalPosts(supabaseAdmin, 5),
      ]);
      internalLinks = internalPosts.map((p) => p.url);
      externalLinks = [
        ...partner1Posts.map((p) => p.url),
        ...partner2Posts.map((p) => p.url)
      ];
    } catch (err) {
      console.warn("[AutoPost] Link discovery failed, continuing without links:", err);
    }

    while (results.filter(r => r.status === "success").length < count && attempts < maxAttempts) {
      attempts++;
      
      // Check remaining time — a full generation cycle takes 15-30s, so any
      // attempt started after this budget would finish past the 60s function
      // limit and 504, losing BOTH the post and the IndexNow ping.
      const elapsed = Date.now() - startTime;
      if (elapsed > 35000) {
        console.warn(`[AutoPost] Time budget exhausted after ${attempts} attempts (${(elapsed/1000).toFixed(1)}s). Aborting cleanly.`);
        break;
      }

      const i = results.filter(r => r.status === "success").length;

      // Rotate category
      if (i > 0) {
        const categoryIndex = CATEGORIES.indexOf(currentCategory);
        const nextCategoryIndex = (categoryIndex + 1) % CATEGORIES.length;
        currentCategory = CATEGORIES[nextCategoryIndex];
      } else {
        currentCategory = activeCategory;
      }

      const topics = CATEGORY_TOPICS[currentCategory] || ["Latest Developments", "Industry Trends", "Expert Analysis"];
      const topicIndex = (allExistingTitles.length + attempts) % topics.length;
      const currentTopic = topics[topicIndex];

      console.log(`[AutoPost] Generating post ${i + 1}/${count} (attempt ${attempts}) | Category: ${currentCategory} | Topic: ${currentTopic}`);

      let blogData;
      try {
        blogData = await generateSmartBlog(
          currentTopic,
          allExistingTitles,
          currentCategory,
          internalLinks,
          externalLinks,
          startTime + 55_000, // hard deadline: 5s headroom before the 60s function limit
        );
      } catch (genErr: any) {
        console.error(`[AutoPost] AI generation failed:`, genErr.message);
        results.push({ status: "failed", reason: "AI Generation Failure", error: genErr.message });
        continue;
      }

      // Inject external links based on keywords
      if (blogData.content && blogData.keywords) {
        blogData.content = injectExternalLinks(blogData.content, blogData.keywords);
      }

      // Check for duplicate title
      const titleLower = blogData.title.toLowerCase();

      // Guard against off-topic / consumer-spam subjects that trigger
      // "low value content" flags in Google Search Console & AdSense review.
      // Layer 1: hard blacklist of consumer-service verticals. Keep adding any
      // new vertical a model manages to slip through.
      const OFF_TOPIC_TERMS = [
        "insurance", "denture", "dental", "oral surgery", "attorney", "lawyer", "legal advice",
        "burger", "restaurant", "recipe", "food near", "catering", "cuisine",
        "roof", "gutter", "plumb", "drain", "hvac", "pest control", "pest ", "exterminat",
        "remodel", "renovation", "landscap", "fence ", "siding", "flooring", "window replacement",
        "casino", "betting", "slot ", "lottery", "poker",
        "half-cow", "cow price", "beef cost", "livestock", "cattle",
        "real estate agent", "realtor", "mortgage", "property listing",
        "dentist", "chiropract", "massager", "supplement", "weight loss", "skin care",
        "boat tour", "boat trips", "excursion", "escursion", "barca", "arcipelago", "maddalena",
        "hotel deal", "flight deal", "vacation package", "itinerary",
        "wedding", "divorce", "towing", "movers", "cleaning service", "lawn care",
        "tiny house", "trailer made", "camper", "rv ", "buy a home", "buying a home",
        "home buying", "home in ", "moving to ", "best places to live", "neighborhood",
        "cost of living", "salary", "job openings", "hiring ", "resume", "cover letter",
      ];

      // Layer 2: AI-slop headline jargon. These phrases are the fingerprint of
      // machine-generated filler and are aggressively demoted by Google's
      // helpful-content system, even when the topic itself is on-domain.
      const SLOP_TERMS = [
        "epistemic", "paradigm", "imperative", "omniscience", "omniscient",
        "deconstruct", "re-architect", "rearchitect", "asymmetric", "asymmetry",
        "calibration", "zeitgeist", "tapestry", "synergy", "leverage the",
        "unleash", "revolutionize", "supercharge", "game-changer", "game changer",
        "cutting-edge", "state-of-the-art", "delve into", "navigate the",
        "frontier of", "nexus", "juxtaposition", "symphony of", "dance of",
      ];

      // Layer 3: the headline MUST carry a technology signal. If it does not,
      // the model drifted off-domain — reject and retry with another topic.
      const TECH_SIGNALS = [
        "ai", "artificial intelligence", "machine learning", "deep learning", "neural",
        "llm", "language model", "chatbot", "prompt", "inference", "algorithm",
        "software", "app", "application", "developer", "code", "coding", "programming",
        "api", "sdk", "open source", "framework", "database", "server", "devops",
        "cloud", "saas", "data", "analytics", "big data", "dataset",
        "cyber", "security", "encryption", "privacy", "malware", "ransomware", "hacker",
        "quantum", "semiconductor", "chip", "gpu", "processor", "hardware", "silicon",
        "robot", "automation", "autonomous", "drone",
        "blockchain", "crypto", "web3", "defi", "smart contract", "token",
        "space", "satellite", "rocket", "mars", "nasa", "spacex", "orbit",
        "startup", "venture", "tech", "technology", "digital", "internet", "network",
        "browser", "mobile", "smartphone", "gadget", "device", "platform",
        "seo", "search engine", "web", "website", "e-commerce", "ecommerce",
        "biotech", "genome", "crispr", "renewable", "electric vehicle", "battery",
        "5g", "6g", "iot", "edge computing", "virtual reality", "augmented reality",
      ];

      const matchesWord = (haystack: string, needle: string) =>
        new RegExp(`(^|[^a-z0-9])${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`, "i").test(haystack);

      const blockedTerm = OFF_TOPIC_TERMS.find((t) => titleLower.includes(t));
      const slopTerm = SLOP_TERMS.find((t) => titleLower.includes(t));
      const hasTechSignal = TECH_SIGNALS.some((t) => matchesWord(titleLower, t));

      if (blockedTerm || slopTerm || !hasTechSignal) {
        console.warn(
          `[AutoPost] OFF-TOPIC REJECTED: "${blogData.title}" | reason: ${
            blockedTerm
              ? `blacklisted term "${blockedTerm}"`
              : slopTerm
                ? `AI-slop jargon "${slopTerm}"`
                : "no technology signal in headline"
          }. Retrying with different topic.`,
        );
        allExistingTitles.push(`_offtopic_${attempts}_`);
        continue;
      }

      // Duplicate guard: catches reworded headlines AND same-subject rewrites
      // that share no literal words (see isNearDuplicate above).
      const duplicateCheck = isNearDuplicate(blogData.title, blogData.subject_key, allExistingTitles);

      if (duplicateCheck.duplicate) {
        console.warn(
          `[AutoPost] DUPLICATE DETECTED: "${blogData.title}" matches "${duplicateCheck.matchedTitle}" (${duplicateCheck.reason}). Retrying with different topic.`,
        );
        allExistingTitles.push(`_dummy_${attempts}_`); // Force different topic index
        continue;
      }

      // ---------------------------------------------------------------------
      // Post-generation quality gate
      // The model produced content — but is it publishable? These checks run
      // before the DB insert so a bad article is discarded instead of shipped.
      // ---------------------------------------------------------------------
      const plainContent = (blogData.content || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&[a-z]+;/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

      const wordCount = plainContent ? plainContent.split(" ").length : 0;

      // Minimum substance: thin posts are the single biggest "low value
      // content" trigger in Search Console, so refuse anything under 700 words.
      if (wordCount < 700) {
        console.warn(
          `[AutoPost] TOO THIN REJECTED: "${blogData.title}" has only ${wordCount} words. Retrying.`,
        );
        allExistingTitles.push(`_thin_${attempts}_`);
        continue;
      }

      // AI-slop density: count how many filler phrases leaked into the body.
      // A couple are tolerable, a cluster is a fingerprint of machine filler.
      const bodySlop = SLOP_TERMS.filter((t) => plainContent.toLowerCase().includes(t));
      if (bodySlop.length >= 4) {
        console.warn(
          `[AutoPost] SLOP REJECTED: "${blogData.title}" contains ${bodySlop.length} filler phrases (${bodySlop.slice(0, 4).join(", ")}). Retrying.`,
        );
        allExistingTitles.push(`_slop_${attempts}_`);
        continue;
      }

      // Excerpt sanity: a missing or stub excerpt renders an empty card.
      const excerptOk = (blogData.excerpt || "").trim().length >= 60;
      const metaOk = (blogData.meta_description || "").trim().length >= 70;

      if (!excerptOk || !metaOk) {
        console.warn(
          `[AutoPost] INCOMPLETE METADATA: excerpt=${(blogData.excerpt || "").length} chars, meta=${(blogData.meta_description || "").length} chars. Retrying.`,
        );
        allExistingTitles.push(`_meta_${attempts}_`);
        continue;
      }

      // Image Search
      let imageResult;
      try {
        imageResult = await searchSmartImage(
          blogData.search_term || blogData.title,
          blogData.category || currentCategory,
        );
      } catch (imgErr: any) {
        console.warn(`[AutoPost] Image search failed, using fallback:`, imgErr.message);
        imageResult = {
          url: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
          alt: "AI Neural Network",
        };
      }

      // Slug must be unique — a collision makes the whole attempt fail at the DB
      // layer. Probe first and add a short numeric suffix instead of losing the post.
      const baseSlug = blogData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 80);

      let slug = baseSlug || `tech-post-${Date.now()}`;
      const { data: slugClash } = await supabaseAdmin
        .from("blogs")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (slugClash) {
        slug = `${baseSlug.substring(0, 72)}-${Date.now().toString(36).slice(-5)}`;
        console.log(`[AutoPost] Slug collision on "${baseSlug}" — using "${slug}" instead.`);
      }

      const { data: newPost, error: insertError } = await supabaseAdmin
        .from("blogs")
        .insert({
          title: blogData.title,
          slug,
          excerpt: blogData.excerpt,
          content: blogData.content,
          category: currentCategory,
          feature_image_url: imageResult.url,
          alt_text: blogData.alt_text || imageResult.alt,
          status: "published",
          author_id: authorId,
          published_at: new Date().toISOString(),
          meta_title: blogData.meta_title,
          meta_description: blogData.meta_description,
          keywords: blogData.keywords,
        })
        .select()
        .single();

      if (insertError) {
        console.error(`[AutoPost] DB insert failed:`, insertError.message);
        results.push({ status: "failed", reason: "Database Insert Error", error: insertError.message });
        continue;
      }

      console.log(`[AutoPost] Post created: "${newPost.title}" (${newPost.id}) | Category: ${currentCategory}`);
      results.push({ status: "success", id: newPost.id, title: newPost.title, category: currentCategory });
      allExistingTitles.push(newPost.title);

      // Collect for a single IndexNow ping after the loop (see below)
      pingUrls.push(`https://xylosai.vercel.app/blog/${newPost.slug}`);
    }

    // Instant-indexing ping to Bing/Yandex/Seznam via IndexNow.
    // Awaited (with internal timeout) so the request is not dropped when the
    // serverless function freezes after the response is sent.
    if (pingUrls.length > 0) {
      pingUrls.push("https://xylosai.vercel.app/blog");
      await pingIndexNow(pingUrls);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const successCount = results.filter((r) => r.status === "success").length;
    const skippedCount = results.filter((r) => r.status === "skipped").length;
    console.log(`[AutoPost] DONE | ${successCount}/${count} posts created | ${skippedCount} skipped | ${duration}s`);

    return NextResponse.json({
      success: true,
      created: successCount,
      skipped: skippedCount,
      total_requested: count,
      posts: results,
      duration: `${duration}s`,
      timestamp: new Date().toISOString(),
    });

  } catch (err: unknown) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const errMsg = err instanceof Error ? err.message : "Unknown critical failure";
    console.error(`[AutoPost] CRITICAL FAILURE after ${duration}s:`, errMsg);
    return NextResponse.json({ error: errMsg, duration: `${duration}s` }, { status: 500 });
  }
}
