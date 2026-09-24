import { getProviderResponse } from "./providers";

export type BlogContent = {
  title: string;
  excerpt: string;
  category: string;
  search_term: string;
  alt_text: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  content: string;
  // 2-4 word canonical subject (e.g. "on-device ai smartphones"). Used by the
  // automation route to block near-duplicate posts whose headlines are
  // rephrased but cover the exact same subject.
  subject_key?: string;
};

/**
 * Flesch Reading Ease for a content blob (HTML stripped).
 *
 * This is the same metric audit tools and Google's helpful-content signals lean
 * on. It is driven by two things: words per sentence and SYLLABLES per word.
 * Measured on our own generated drafts the sentence length was already fine
 * (~18) but the syllable density was ~1.89 per word, which is what pinned the
 * score at "college graduate" (28) even though the prose looked tidy.
 */
export function readabilityScore(input: string): {
  words: number;
  sentences: number;
  avgSentenceLength: number;
  avgSyllablesPerWord: number;
  flesch: number;
  grade: string;
} {
  const text = (input || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[AI_IMAGE_PROMPT:[^\]]*\]/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const countSyllables = (word: string): number => {
    const w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (w.length <= 3) return 1;
    const cleaned = w
      .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
      .replace(/^y/, '');
    const groups = cleaned.match(/[aeiouy]{1,2}/g);
    return groups ? groups.length : 1;
  };

  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.split(' ').length > 2);
  const words = text.split(' ').filter(Boolean);
  if (!words.length || !sentences.length) {
    return { words: words.length, sentences: sentences.length, avgSentenceLength: 0, avgSyllablesPerWord: 0, flesch: 0, grade: 'unknown' };
  }

  const syllables = words.reduce((a, w) => a + countSyllables(w), 0);
  const asl = words.length / sentences.length;
  const asw = syllables / words.length;
  const flesch = 206.835 - 1.015 * asl - 84.6 * asw;

  let grade = 'Very difficult (college graduate)';
  if (flesch >= 70) grade = 'Easy (7th grade)';
  else if (flesch >= 60) grade = 'Plain English (8-9th grade)';
  else if (flesch >= 50) grade = 'Fairly difficult (10-12th)';
  else if (flesch >= 30) grade = 'Difficult (college)';

  return {
    words: words.length,
    sentences: sentences.length,
    avgSentenceLength: +asl.toFixed(1),
    avgSyllablesPerWord: +asw.toFixed(2),
    flesch: +flesch.toFixed(1),
    grade,
  };
}

/**
 * Prompt for the plain-English rewrite pass. Returns rewritten HTML only, so the
 * caller can drop the response straight into `content` without re-parsing JSON.
 */
function buildSimplifyPrompt(content: string): string {
  return `You are a plain-English editor. Rewrite the article below so a 14-year-old can read it easily.

HARD RULES:
- Keep every fact, product name, number, link and <h2> heading exactly as it is. Do not add or remove information.
- Shorten words: use "use" not "utilise/leverage", "help" not "facilitate", "build" not "implement", "improve" not "optimise", "big" not "significant", "many" not "numerous", "show" not "demonstrate", "need" not "require", "give" not "provide", "about" not "approximately", "also" not "additionally", "but" not "however", "so" not "therefore".
- Any word with 4 or more syllables that has a short common synonym must be replaced by the short one.
- Keep sentences short: 10-16 words on average. Never more than 25 words. Split long sentences.
- Keep paragraphs 2-4 sentences, under 55 words each.
- Keep technical terms that have no plain equivalent (API, GPU, encryption, LLM). Explain them in the same sentence if unclear.
- Keep the <p> and <h2> tags and the [AI_IMAGE_PROMPT: ...] markers. Keep all <a href> links.
- Do not add a preamble, do not use markdown fences.

Return ONLY the rewritten article HTML.

ARTICLE:
${content}`;
}

/**
 * Tiered Fallback Strategy:
 * 1. Groq (Fastest/Cheapest)
 * 2. OpenAI (Reliable Backup) - Proxied via OpenRouter
 * 3. Gemini (Long-form Depth)
 */
export async function generateSmartBlog(
  prompt: string, 
  recentTitles: string[] = [], 
  category?: string,
  internalLinks: string[] = [],
  externalLinks: string[] = [],
  deadlineAt?: number,
  /**
   * Rotates which provider is tried first. Post #2 of a run starts on a
   * different provider so a single free-tier TPM ceiling (Groq = 8k/min) cannot
   * starve the second article — the previous cause of "all providers failed".
   */
  providerOffset: number = 0
): Promise<BlogContent> {
  // Only attempt providers whose key is actually configured. A missing key used
  // to cost a full timeout window per attempt before failing, which pushed the
  // whole run past the serverless deadline (504). Groq is the primary and needs
  // GROQ_API_KEY; the rest are optional fallbacks.
  const PROVIDER_KEY_ENV: Record<string, string> = {
    groq: 'GROQ_API_KEY',
    gemini: 'GOOGLE_GEMINI_API_KEY',
    openrouter: 'OPENROUTER_API_KEY',
    mistral: 'MISTRAL_API_KEY',
    cerebras: 'CEREBRAS_API_KEY',
    'huggingface': 'HF_TOKEN',
    cloudflare: 'CLOUDFLARE_API_TOKEN',
  };

  const providerChain = [
    // llama-3.3-70b-versatile: no hidden reasoning tokens, so the full
    // maxTokens budget goes to the article JSON instead of being truncated.
    { name: 'groq', model: 'llama-3.3-70b-versatile', timeoutMs: 25_000 },
    { name: 'gemini', model: 'gemini-2.5-flash', timeoutMs: 20_000 },
    { name: 'openrouter', model: 'nvidia/nemotron-3-super-120b-a12b:free', timeoutMs: 20_000 },
    // Last-resort attempts for a reasoning-capable model: capping the reasoning
    // budget keeps the JSON intact.
    { name: 'groq', model: 'openai/gpt-oss-120b', timeoutMs: 18_000 },
    { name: 'cerebras', model: 'gpt-oss-120b', timeoutMs: 18_000 },
    { name: 'mistral', model: 'mistral-medium-latest', timeoutMs: 18_000 },
  ].filter((p) => {
    const envVar = PROVIDER_KEY_ENV[p.name];
    const hasKey = !!process.env[envVar];
    if (!hasKey) console.warn(`[Neural Sync] Skipping ${p.name}: ${envVar} is not set.`);
    return hasKey;
  });

  // De-duplicate by provider (Groq appears twice with different models) while
  // keeping order, then rotate the starting point.
  const seen = new Set<string>();
  const unique = providerChain.filter((p) => {
    if (seen.has(p.name)) return false;
    seen.add(p.name);
    return true;
  });

  const ordered = unique.length
    ? [...unique.slice(providerOffset % unique.length), ...unique.slice(0, providerOffset % unique.length)]
    : [{ name: 'groq', model: 'llama-3.3-70b-versatile', timeoutMs: 25_000 }];

  // Each provider gets one shot; a second Groq attempt is appended with the
  // reasoning model only when Groq is the first choice (its TPM allows two
  // small calls, not two large ones).
  const providers =
    ordered[0]?.name === 'groq' && unique.length > 0
      ? [ordered[0], { name: 'groq', model: 'openai/gpt-oss-120b', timeoutMs: 18_000 }, ...ordered.slice(1)]
      : ordered;

  const systemPrompt = `You are the Xylos Neural Engine, a senior technology journalist writing for Xylos AI.

  TASK: Write a definitive, original technology article about "${prompt.toUpperCase()}" (category: ${category || 'Technology'}).
  If that topic is generic, pick one concrete development inside the same domain and write about that instead.

  ALREADY PUBLISHED (never repeat, never reword these subjects):
  ${recentTitles.filter((t) => t && !t.startsWith("_")).join("\n") || "None"}

  SUBJECT DEDUPLICATION: rewording a published subject is a rejection. REJECTED example: existing "On-Device AI: The Silent Revolution Reshaping Smartphones" -> new "On-Device AI: The Quiet Engine Redefining Smartphones". Also return "subject_key": the canonical 2-4 word lowercase subject (example: "on-device ai smartphones") that matches no published subject above.

  TOPIC LOCK (violation = rejected): technology only — AI, software, cybersecurity, chips, cloud, robotics, blockchain, space tech, or a clearly tech-driven angle. NEVER write about insurance, legal or medical advice, food, travel, home services (roofing, plumbing), real estate, gambling, or consumer listicles. If a topic drifts, pivot to its closest technology angle.

  TITLE RULES: plain, specific, human — the reader must know what they get. Banned words: epistemic, paradigm, imperative, omniscience, deconstruct, re-architect, asymmetric, calibration, nuance, frontier, realm, delve, unleash, revolutionize, supercharge, game-changer, cutting-edge, tapestry, zeitgeist, unveiling, unlocking, unearthing, deciphering, decoding, navigating, odyssey, nexus, juxtaposition, synergy. Banned shapes: "The X Imperative", "The X Paradox", "The X Horizon", "Beyond X: Y", "X vs Y: The Definitive Guide", "Unveiling the X", "Unlocking the X", "Navigating the X", "Mastering the X", and any "A Futuristic Odyssey" subtitle. If the title still reads like a vague teaser rather than a concrete claim, rewrite it. Good examples: "How On-Device AI Models Are Cutting Cloud Costs for Mobile Apps", "Passkeys Explained: What Changes for Developers in 2026".

  LINKS (inside content, <a href> with target="_blank" rel="noopener noreferrer"):
  - 1+ INTERNAL link from: ${internalLinks.length > 0 ? internalLinks.join(" | ") : "any relevant /blog post on this site"}
  - 1+ EXTERNAL partner link from: ${externalLinks.length > 0 ? externalLinks.join(" | ") : "any authoritative technology source"}
  - 2+ high-authority citations (Wikipedia or official company/product pages) on the exact term. Never "click here".

  STRUCTURE — six sections, each an <h2> plus 3-4 paragraphs:
  1. What Happened (150+ words): the concrete change; name company, product and a number in the first two sentences.
  2. How We Got Here (170+ words): the short history behind it.
  3. How It Actually Works (260+ words): mechanism step by step, one <ol> list, a real product name, one number, jargon explained inline.
  4. Who Wins and Who Loses (170+ words): named companies and groups, concrete costs and gains.
  5. What Can Still Go Wrong (170+ words): real limits (bugs, cost, speed, privacy, rules) plus a short <ul>.
  6. What To Watch Next (150+ words): 3-4 checkable things to track over 12 months.

  READABILITY (hard requirement, Flesch 60+, grade 9 or below):
  - Sentences average 12-18 words, never over 30. Paragraphs 2-4 sentences, under 60 words. One idea per paragraph.
  - Active voice. Address the reader as "you". Define each technical term the first time you use it.
  - Short words only: utilise/leverage->use, facilitate->help, implement->build, optimise->improve, comprehensive->full, significant->big, numerous->many, demonstrate->show, require->need, provide->give, approximately->about, additionally/however/therefore->also/but/so, functionality->features, infrastructure->systems, architecture->design.
  - Every section carries one concrete number, product name or real example.
  - Banned filler: "In the fast-paced world of", "In today's digital age", "It is important to note that", "When it comes to", "In conclusion", "plays a pivotal role", "in the realm of", "testament to". No emoji, no rhetorical questions, no padding.

  LENGTH (hard gate, under 1000 words is discarded): 1000-1300 words total, aim 1150, reached with concrete detail instead of adjectives.
  Format: <h2> for headers, <p> for paragraphs, every block separated by a blank line. Add 2-3 [AI_IMAGE_PROMPT: cinematic scene description] markers between sections.

  METADATA: keywords = 10-15 high-intent LSI keywords. alt_text = factual SEO description naming the subject. search_term = vivid photographic scene description for the image search. excerpt = 1-2 plain sentences, 120-200 characters. meta_description = 140-160 characters, plain and specific.

  Return ONLY raw JSON, no markdown fences, "content" is one string:
  {
    "title": "...",
    "excerpt": "...",
    "meta_title": "SEO meta title, about 60 characters",
    "meta_description": "SEO meta description, 140-160 characters",
    "keywords": "comma, separated, high-intent, lsi, keywords",
    "subject_key": "canonical 2-4 word lowercase subject",
    "category": "Technology | AI & ML | Cybersecurity | Software Development | Cloud & DevOps | Consumer Tech | Blockchain | Space",
    "search_term": "vivid photorealistic scene description",
    "alt_text": "fact-based SEO description of the feature image",
    "content": "<p>opening paragraph</p> <h2>Section</h2> <p>...</p> [AI_IMAGE_PROMPT: scene description] ..."
  }
  Pick the category from that list only, never invent one.`;


  let lastError: Error | null = null;
  const providerErrors: string[] = [];

  for (const provider of providers) {
    // Dynamic per-provider timeout: never let a provider call run past the
    // serverless deadline (60s on Hobby). Skip provider if < 10s remain;
    // otherwise give the AI the full remaining window minus a 10s reserve
    // (headroom for image search + DB insert + IndexNow ping).
    const remaining = deadlineAt ? deadlineAt - Date.now() : provider.timeoutMs;
    const effectiveTimeout = Math.min(provider.timeoutMs, remaining - 10_000);
    if (effectiveTimeout < 10_000) {
      console.warn(`[Neural Sync] Skipping ${provider.name}: only ${(remaining / 1000).toFixed(1)}s of budget left.`);
      continue;
    }
    try {
      console.log(`[Neural Sync] Attempting generation with ${provider.name} (timeout ${(effectiveTimeout / 1000).toFixed(0)}s)...`);
      // Fail-fast per-provider timeout so the 60s serverless budget is respected.
      // Without this, a hung provider burns the whole function window -> 504.
      const response = await Promise.race([
        getProviderResponse(
          provider.name,
          provider.model,
          [{ role: 'user', content: systemPrompt }],
          // Blog generation always needs one raw JSON object. maxTokens covers a
          // 1000-1300 word HTML article (~2.4k tokens) with headroom so the JSON
          // is never cut mid-object; reasoning models get their hidden budget
          // capped so it cannot eat that allowance.
          { jsonMode: true, maxTokens: 5000, reasoningEffort: 'low' }
        ),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`${provider.name} timed out after ${effectiveTimeout}ms`)), effectiveTimeout)
        ),
      ]);

      // Clean and parse JSON
      const blogData = parseNeuralJson(response.content);
      
      if (blogData.title && blogData.content) {
        // Sanitize content from unwanted tags/markdown artifacts
        blogData.content = sanitizeNeuralContent(blogData.content);

        // READABILITY GATE -------------------------------------------------
        // Audit tools and Google's helpful-content signals punish dense prose.
        // The draft above measured Flesch ~28 (college graduate) purely because
        // of long Latinate words, not sentence length. When that happens, spend
        // one extra provider call on a plain-English rewrite — but only if the
        // serverless budget can still absorb it.
        const before = readabilityScore(blogData.content);
        const budgetLeft = deadlineAt ? deadlineAt - Date.now() : 0;
        if (before.flesch < 58 && before.words >= 700 && budgetLeft > 30_000) {
          try {
            console.log(
              `[Neural Sync] Readability ${before.flesch} (${before.grade}, ${before.avgSyllablesPerWord} syl/word) — running plain-English simplify pass...`,
            );
            const rewriteTimeout = Math.min(28_000, budgetLeft - 15_000);
            const simplified = await Promise.race([
              getProviderResponse(provider.name, provider.model, [
                { role: 'user', content: buildSimplifyPrompt(blogData.content) },
              ]),
              new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error(`simplify pass timed out after ${rewriteTimeout}ms`)), rewriteTimeout),
              ),
            ]);

            const rewritten = sanitizeNeuralContent(
              (simplified.content || '')
                .replace(/^```[a-z]*\s*/i, '')
                .replace(/```\s*$/i, '')
                .trim(),
            );
            const after = readabilityScore(rewritten);

            // Accept only when readability actually improved and the article did
            // not collapse (a truncated rewrite must never replace the draft).
            if (after.flesch > before.flesch && after.words >= Math.min(850, before.words * 0.7)) {
              console.log(
                `[Neural Sync] Simplify pass accepted: Flesch ${before.flesch} -> ${after.flesch} (${after.grade})`,
              );
              blogData.content = rewritten;
            } else {
              console.warn(
                `[Neural Sync] Simplify pass rejected (Flesch ${after.flesch}, ${after.words} words vs ${before.words}) — keeping original draft.`,
              );
            }
          } catch (err: any) {
            console.warn(`[Neural Sync] Simplify pass skipped: ${err.message}`);
          }
        } else {
          console.log(
            `[Neural Sync] Readability ${before.flesch} (${before.grade}) — no rewrite needed or no budget (${(budgetLeft / 1000).toFixed(0)}s left).`,
          );
        }

        console.log(`[Neural Sync] Success with ${provider.name}`);
        return blogData;
      }
    } catch (err: any) {
      console.warn(`[Neural Sync] ${provider.name} failed:`, err.message);
      providerErrors.push(`${provider.name}: ${err.message}`);
      continue; // Try next provider
    }
  }

  throw new Error(`All AI providers failed. ${providerErrors.join(' | ')}`);
}

/**
 * Strips common LLM artifacts like code fences, <html> tags, etc. 
 * that shouldn't be in the final content payload.
 */
function sanitizeNeuralContent(content: string): string {
  if (!content) return "";

  return content
    // Strip markdown code spans/fences if they escaped into the string
    .replace(/^```[a-z]*\n/gmi, '')
    .replace(/\n```$/gmi, '')
    .replace(/```/g, '')
    
    // Strip redundant global tags if LLM misunderstood "HTML-compatible"
    .replace(/<!DOCTYPE html>/gi, '')
    .replace(/<html[^>]*>/gi, '')
    .replace(/<\/html>/gi, '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
    
    // Clean up excessive newlines but ensure structural integrity
    .replace(/\n{3,}/g, '\n\n')
    
    // Guarantee newlines before headers if missing
    .replace(/([^\n])<(h[2-3]|p)>/gi, '$1\n\n<$2>')
    .replace(/<\/(h[2-3]|p)>([^\n])/gi, '</$1>\n\n$2')
    
    .trim();
}

function parseNeuralJson(raw: string): BlogContent {
  try {
    const cleanJson = raw
      .replace(/^```json/i, '')
      .replace(/^```/i, '')
      .replace(/```$/i, '')
      .trim();
      
    const start = cleanJson.indexOf('{');
    const end = cleanJson.lastIndexOf('}');
    
    if (start === -1 || end === -1) throw new Error("No JSON object found");
    
    const jsonStr = cleanJson.slice(start, end + 1);
    
    // Robust cleaning while preserving inner string newlines
    const refinedJson = jsonStr
      .replace(/\\n/g, "\\n") // Preserve escaped newlines
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]");
      
    return JSON.parse(refinedJson);
  } catch (error) {
    // Regex extraction fallback
    const extract = (field: string) => {
      const regex = new RegExp(`"${field}"\\s*:\\s*"([\\s\\S]*?)"(?=[\\s\\n]*,|\\s*})`, 'i');
      const match = raw.match(regex);
      return match ? match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').trim() : "";
    };
    
    const data = {
      title: extract("title"),
      excerpt: extract("excerpt"),
      meta_title: extract("meta_title"),
      meta_description: extract("meta_description"),
      keywords: extract("keywords"),
      subject_key: extract("subject_key"),
      category: extract("category") || "Technology",
      search_term: extract("search_term"),
      alt_text: extract("alt_text"),
      content: extract("content")
    };

    if (!data.title || !data.content) throw new Error("JSON Parsing failed");
    return data;
  }
}
