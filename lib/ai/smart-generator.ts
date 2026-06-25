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
};

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
  externalLinks: string[] = []
): Promise<BlogContent> {
  const providers = [
    { name: 'groq', model: 'llama-3.3-70b-versatile' },
    { name: 'openrouter', model: 'openai/gpt-4o-mini' },
    { name: 'gemini', model: 'gemini-1.5-flash' },
  ];

  const systemPrompt = `You are the Xylos Neural Engine, a senior investigative journalist and content strategist.
  
  CORE MISSION: 
  Analyze, research, and synthesize a definitive, long-form report on the provided topic. 
  If the topic is generic, identify a NEW trending development from the last 48 hours within that domain (especially focusing on ${category || 'Global Technology'}) and write about it with authority.
  
  CONTEXT (RECENT TITLES):
  ${recentTitles.length > 0 ? recentTitles.join("\n") : "None"}

  PRIMARY DIRECTIVE: 
  Write a high-authority, definitive article about: "${prompt.toUpperCase()}" in the context of ${category || 'General Technology'}.
  DO NOT repeat any of the recent titles mentioned above. Provide a fresh, insightful perspective.
  
  SEO & LINKING ARCHITECTURE (CRITICAL):
  You MUST naturally weave internal citations, external partner citations, and general high-authority reference citations into the narrative using <a> tags with target="_blank" and rel="noopener noreferrer".
  
  1. INTERNAL TARGETS (Link at least ONE of these for deep-dive contextual exploration):
  ${internalLinks.length > 0 ? internalLinks.join("\n") : "None provided. Use relevant internal site structure references."}
  
  2. EXTERNAL PARTNER TARGETS (Link at least ONE of these for global authority/verification):
  ${externalLinks.length > 0 ? externalLinks.join("\n") : "None provided. Use generic high-authority citations if needed."}
  
  3. GENERAL HIGH-AUTHORITY CITATIONS (Link at least TWO of these to key concepts/keywords in the article):
  - Hyperlink major technologies, companies, or scientific terms to their official websites or highly authoritative Wikipedia pages.
  - Examples of keywords and their targets:
    * "artificial intelligence", "AI" or "machine learning" -> link to "https://en.wikipedia.org/wiki/Artificial_intelligence" or "https://arxiv.org"
    * "Next.js", "React", "TypeScript", "Node.js", "Python" -> link to their official websites ("https://nextjs.org", "https://react.dev", "https://www.typescriptlang.org", "https://nodejs.org", "https://www.python.org")
    * "OpenAI", "Gemini", "Llama 3", "Mistral AI", "Google DeepMind" -> link to their official pages ("https://openai.com", "https://deepmind.google/technologies/gemini/", "https://llama.meta.com", "https://mistral.ai", "https://deepmind.google")
  - Avoid generic "click here" text. The hyperlinked text MUST be the exact name of the concept, technology, or company.

  MANDATORY RULE: You MUST include AT LEAST ONE link from the Internal Targets list, AT LEAST ONE link from the External Partner Targets list, and AT LEAST TWO General High-Authority Citations in the body content.
  
  STRUCTURE & LENGTH REQUIREMENTS (MINIMUM 1500 TO 2000+ WORDS TOTAL):
  You must ensure the article is highly exhaustive and detailed. Write at least 4-5 long, detailed paragraphs for each section:
  1. Introduction (250+ words): Start with a profound global perspective. Establish the gravity of the subject, citing societal, corporate, or technological paradigms.
  2. Background, Evolution & Genesis (350+ words): Detailed historical context, tracing the evolution of this technology or event over the past decade to the current state.
  3. Strategic Deep Dive & Technical Analysis (550+ words): High-fidelity, granular analysis of the core dynamics, architectural patterns, implementation protocols, major players, and specific case studies or code architectures.
  4. Global Market & Sociopolitical/Economic Implications (350+ words): Broad evaluation of how this shapes industries, global economies, supply chains, regulatory environments, or international relations.
  5. Technical Challenges, Limitations & Neural Outlook (350+ words): Critical analysis of technical bottlenecks, security challenges, scaling issues, and a visionary 5-to-10-year forecast of the domain.
  6. Final Authoritative Verdict & Synthesis (150+ words): Authoritative conclusion, summarizing key takeaways and the future state.

  WRITING STYLE:
  - Professional, sophisticated, and slightly futuristic/noir.
  - High vocabulary but clear logic.
  - Avoid generic "AI-isms" (e.g., "In the fast-paced world of...").
  - Use <h2> for section headers and <p> for paragraphs within the text.
  - IMPORTANT: You MUST ensure every header (<h2>) and every paragraph block is preceded and followed by TWO NEWLINES (\n\n) to ensure correct structural parsing. DO NOT omit these newlines.

  METADATA QUALITY STANDARDS:
  - keywords: Provide 10-15 high-intent, LSI (Latent Semantic Indexing) keywords that match the investigative depth of the article.
  - alt_text: Write a factual, SEO-rich description of the feature image that MENTIONS the article's core subject.
  - search_term: Provide a VIVID, PHOTOGRAPHIC SCENE DESCRIPTION (not just keywords). Example: Instead of "AI", use "A sleek futuristic neural processor glowing in a dimly lit high-tech laboratory with blue fiber-optic cables, 8k resolution, cinematic."

  Format your response STRICTLY as a valid JSON object:
  {
    "title": "A high-authority, cinematic headline",
    "excerpt": "A concise executive summary",
    "meta_title": "SEO Optimized Meta Title (60 chars)",
    "meta_description": "Compelling SEO Meta Description (160 chars)",
    "keywords": "comma, separated, high-intent, lsi, keywords",
    "category": "Technology/Business/Politics/Science/Sports/Culture",
    "search_term": "A vivid photorealistic scene description for the feature image",
    "alt_text": "Fact-based SEO description mentioning the subject",
    "content": "THE FULL ARTICLE IN HTML-COMPATIBLE MARKDOWN WITH <h2> AND <p> TAGS. IMPORTANT: Insert [AI_IMAGE_PROMPT: vivid cinematic scene description related to the adjacent text] markers between sections (2-3 times) where an image would be beneficial."
  }

  IMPORTANT:
  - Return ONLY raw JSON. No markdown fences around the JSON.
  - Ensure the "content" field is a single string containing the HTML-style markdown.
  - Minimum total word count: 1800+ words. Aim for 2000+ words. Do NOT summarize or write brief lists; expand every section with deep analyses, detailed descriptions, and historical context.`;

  let lastError: any = null;

  for (const provider of providers) {
    try {
      console.log(`[Neural Sync] Attempting generation with ${provider.name}...`);
      const response = await getProviderResponse(
        provider.name,
        provider.model,
        [{ role: 'user', content: systemPrompt }]
      );

      // Clean and parse JSON
      const blogData = parseNeuralJson(response.content);
      
      if (blogData.title && blogData.content) {
        // Sanitize content from unwanted tags/markdown artifacts
        blogData.content = sanitizeNeuralContent(blogData.content);
        
        console.log(`[Neural Sync] Success with ${provider.name}`);
        return blogData;
      }
    } catch (err: any) {
      console.warn(`[Neural Sync] ${provider.name} failed:`, err.message);
      lastError = err;
      continue; // Try next provider
    }
  }

  throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
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
      category: extract("category") || "Technology",
      search_term: extract("search_term"),
      alt_text: extract("alt_text"),
      content: extract("content")
    };

    if (!data.title || !data.content) throw new Error("JSON Parsing failed");
    return data;
  }
}
