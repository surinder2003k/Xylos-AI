import { getProviderResponse } from "./providers";

export type BlogContent = {
  title: string;
  excerpt: string;
  category: string;
  search_term: string;
  alt_text: string;
  content: string;
};

/**
 * Tiered Fallback Strategy:
 * 1. Groq (Fastest/Cheapest)
 * 2. OpenAI (Reliable Backup) - Proxied via OpenRouter
 * 3. Gemini (Long-form Depth)
 */
export async function generateSmartBlog(prompt: string, recentTitles: string[] = [], category?: string): Promise<BlogContent> {
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
  
  STRUCTURE & LENGTH REQUIREMENTS (MINIMUM 1000 WORDS TOTAL):
  1. Introduction (250+ words): Start with a profound global perspective. Establish the gravity of the subject.
  2. Background & Genesis (200+ words): Historical context and the evolution of the current state.
  3. Strategic Deep Dive (350+ words): Intense analysis of core dynamics, data points, and key stakeholders.
  4. Global & Sociopolitical Implications (200+ words): How this reshapes industries or global relations.
  5. Challenges & Neural Outlook (200+ words): Critical hurdles and a visionary future forecast.
  6. Synthesis/Conclusion (150+ words): Final authoritative verdict.

  WRITING STYLE:
  - Professional, sophisticated, and slightly futuristic/noir.
  - High vocabulary but clear logic.
  - Avoid generic "AI-isms" (e.g., "In the fast-paced world of...").
  - Use <h2> for section headers and <p> for paragraphs.

  Format your response STRICTLY as a valid JSON object:
  {
    "title": "A high-authority, cinematic headline",
    "excerpt": "A concise executive summary",
    "category": "Technology/Business/Politics/Science/Sports/Culture",
    "search_term": "Specific keywords for high-definition professional imagery",
    "alt_text": "Descriptive alt text for the feature image",
    "content": "THE FULL ARTICLE IN HTML-COMPATIBLE MARKDOWN WITH <h2> AND <p> TAGS"
  }

  IMPORTANT:
  - Return ONLY raw JSON.
  - Ensure the "content" field is a single string containing the HTML-style markdown.
  - Minimum total world count: 1200+ words.`;

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
    
    // Clean up excessive newlines
    .replace(/\n{3,}/g, '\n\n')
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
    
    // Robust cleaning
    const refinedJson = jsonStr
      .replace(/\\n/g, "\\n")
      .replace(/\r?\n|\r/g, " ")
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
      category: extract("category") || "Technology",
      search_term: extract("search_term"),
      alt_text: extract("alt_text"),
      content: extract("content")
    };

    if (!data.title || !data.content) throw new Error("JSON Parsing failed");
    return data;
  }
}
