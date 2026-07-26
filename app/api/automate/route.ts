import { generateSmartBlog } from "@/lib/ai/smart-generator";
import { searchSmartImage } from "@/lib/utils/image-search";
import {
  discoverLatestPosts,
  discoverInternalPosts,
} from "@/lib/utils/link-discovery";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createAuthClient } from "@/utils/supabase/server";

// Vercel Hobby Plan max is 60s. Pro plan allows up to 300s.
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const CATEGORIES = [
  "Technology",
  "Business",
  "Science",
  "Health",
  "AI & Machine Learning",
  "Cybersecurity",
  "Blockchain",
  "Space & Astronomy"
];

const CATEGORY_TOPICS: Record<string, string[]> = {
  "Technology": ["Global Technology Advancements", "Future of Computing", "Digital Transformation", "Emerging Tech Trends"],
  "Business": ["Startup & VC Ecosystem", "Market Analysis", "Business Strategy", "Economic Trends"],
  "Science": ["Scientific Breakthroughs", "Research & Development", "Innovation in Science", "Discovery & Exploration"],
  "Health": ["Healthcare Innovation", "Medical Breakthroughs", "Wellness & Technology", "Public Health Trends"],
  "AI & Machine Learning": ["Artificial Intelligence & Ethics", "Neural Networks & Deep Learning", "AI in Enterprise", "Machine Learning Applications"],
  "Cybersecurity": ["Cybersecurity Protocols", "Data Privacy", "Network Security", "Threat Intelligence"],
  "Blockchain": ["Blockchain Technology", "DeFi & Web3", "Cryptocurrency Trends", "Smart Contracts"],
  "Space & Astronomy": ["Space Exploration", "Astronomy Discoveries", "Space Technology", "Cosmic Phenomena"]
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

export async function GET(req: Request) {
  const startTime = Date.now();

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { searchParams } = new URL(req.url);
    const count = Math.min(parseInt(searchParams.get("count") || "2"), 3);

    const authHeader = req.headers.get("authorization");
    const vercelCronHeader = req.headers.get("x-vercel-cron");

    const isCron =
      vercelCronHeader === "1" ||
      (process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`);

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
      if (categorySetting?.value) activeCategory = categorySetting.value;
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
      
      // Check remaining time - more lenient: allow up to 55 seconds
      const elapsed = Date.now() - startTime;
      if (elapsed > 55000) {
        console.warn(`[AutoPost] Timeout approaching after ${attempts} attempts (${(elapsed/1000).toFixed(1)}s). Aborting.`);
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
      const isDuplicate = allExistingTitles.some(existingTitle => {
        const existingLower = existingTitle.toLowerCase();
        if (existingLower === titleLower) return true;
        const existingWords = new Set(existingLower.split(/\s+/));
        const newWords = titleLower.split(/\s+/);
        const commonWords = newWords.filter(w => existingWords.has(w));
        const similarity = commonWords.length / Math.max(newWords.length, existingWords.size);
        return similarity > 0.6;
      });

      if (isDuplicate) {
        console.warn(`[AutoPost] DUPLICATE DETECTED: "${blogData.title}". Retrying with different topic.`);
        // Change topic for retry
        const nextTopicIndex = (topicIndex + 1) % topics.length;
        allExistingTitles.push(`_dummy_${attempts}_`); // Force different topic index
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

      const slug = blogData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
        .replace(/^-+|-+$/g, "")
        .substring(0, 80);

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
