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

// Available categories to rotate through
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

// Available topics mapped to categories
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

export async function GET(req: Request) {
  const startTime = Date.now();

  try {
    // 1. Initialize Admin Client (bypasses RLS)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // 2. Authorization Check
    const { searchParams } = new URL(req.url);
    const count = Math.min(parseInt(searchParams.get("count") || "2"), 3);

    const authHeader = req.headers.get("authorization");
    const vercelCronHeader = req.headers.get("x-vercel-cron");

    // Vercel sends "x-vercel-cron: 1" on all cron triggers
    const isCron =
      vercelCronHeader === "1" ||
      (process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`);

    let isAuthorizedAdmin = false;
    if (!isCron) {
      try {
        const authClient = await createAuthClient();
        const { data: { user } } = await authClient.auth.getUser();
        if (user) {
          const superAdmins = ["sendltestmaill@gmail.com", "xyzg135@gmail.com"];
          if (superAdmins.includes(user.email || "")) {
            isAuthorizedAdmin = true;
          } else {
            const { data: profile } = await authClient
              .from("profiles")
              .select("role")
              .eq("user_id", user.id)
              .single();
            if (profile && (profile.role === "admin" || profile.role === "super_admin")) {
              isAuthorizedAdmin = true;
            }
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

    // 3. Fetch ALL existing titles for deduplication
    let allExistingTitles: string[] = [];
    let recentTitles: string[] = [];
    let activeCategory = "Technology";

    try {
      const { data: latestPosts } = await supabaseAdmin
        .from("blogs")
        .select("title, category")
        .order("created_at", { ascending: false })
        .limit(100); // Fetch more for better dedup
      if (latestPosts) {
        allExistingTitles = latestPosts.map((p) => p.title);
        recentTitles = latestPosts.slice(0, 10).map((p) => p.title);
      }
    } catch (err) {
      console.warn("[AutoPost] Could not fetch recent titles:", err);
    }

    // 4. Get or auto-select category with rotation
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

    // Category rotation: use the configured category for first post, then rotate
    let currentCategory = activeCategory;

    // 5. Resolve Author ID
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
        // Fallback 1: Check for hardcoded super admin emails
        const { data: fallbackAdmins } = await supabaseAdmin
          .from("profiles")
          .select("user_id")
          .in("email", ["sendltestmaill@gmail.com", "xyzg135@gmail.com"])
          .limit(1);
        if (fallbackAdmins && fallbackAdmins.length > 0) {
          authorId = fallbackAdmins[0].user_id;
        } else {
          // Fallback 2: Get any profile from the table to prevent cron failure
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

    // 6. Generation Loop
    for (let i = 0; i < count; i++) {
      // Check remaining time - abort if less than 15 seconds left
      const elapsed = Date.now() - startTime;
      if (elapsed > 45000) {
        console.warn(`[AutoPost] Timeout approaching after ${i} posts. Aborting remaining.`);
        break;
      }

      // Rotate category for each post to avoid duplicate content
      if (i > 0) {
        const categoryIndex = CATEGORIES.indexOf(currentCategory);
        const nextCategoryIndex = (categoryIndex + 1) % CATEGORIES.length;
        currentCategory = CATEGORIES[nextCategoryIndex];
      } else {
        currentCategory = activeCategory;
      }

      // Get topic for the current category
      const topics = CATEGORY_TOPICS[currentCategory] || ["Latest Developments", "Industry Trends", "Expert Analysis"];
      const topicIndex = allExistingTitles.length % topics.length;
      const currentTopic = topics[topicIndex];

      console.log(`[AutoPost] Generating post ${i + 1}/${count} | Category: ${currentCategory} | Topic: ${currentTopic}`);

      // Link Discovery
      let internalLinks: string[] = [];
      let externalLinks: string[] = [];
      try {
        const [partner1Posts, partner2Posts, internalPosts] = await Promise.all([
          discoverLatestPosts("https://techcrunch.com/feed/", 1),
          discoverLatestPosts("https://www.theverge.com/rss/index.xml", 1),
          discoverInternalPosts(supabaseAdmin, 3),
        ]);
        internalLinks = internalPosts.map((p) => p.url);
        externalLinks = [
          ...partner1Posts.map((p) => p.url),
          ...partner2Posts.map((p) => p.url)
        ];
      } catch (err) {
        console.warn("[AutoPost] Link discovery failed, continuing without links:", err);
      }

      // AI Content Generation with dedup context
      let blogData;
      try {
        blogData = await generateSmartBlog(
          currentTopic,
          allExistingTitles, // Pass ALL existing titles for better dedup
          currentCategory,
          internalLinks,
          externalLinks,
        );
      } catch (genErr: any) {
        console.error(`[AutoPost] AI generation failed:`, genErr.message);
        results.push({ status: "failed", reason: "AI Generation Failure", error: genErr.message });
        continue;
      }

      // Check for duplicate title - if too similar to existing, skip
      const titleLower = blogData.title.toLowerCase();
      const isDuplicate = allExistingTitles.some(existingTitle => {
        const existingLower = existingTitle.toLowerCase();
        // Check if title is exactly same or very similar
        if (existingLower === titleLower) return true;
        // Check if share more than 60% of words (indicating similar content)
        const existingWords = new Set(existingLower.split(/\s+/));
        const newWords = titleLower.split(/\s+/);
        const commonWords = newWords.filter(w => existingWords.has(w));
        const similarity = commonWords.length / Math.max(newWords.length, existingWords.size);
        return similarity > 0.6;
      });

      if (isDuplicate) {
        console.warn(`[AutoPost] DUPLICATE DETECTED: "${blogData.title}" is too similar to existing posts. Skipping.`);
        results.push({ status: "skipped", reason: "Duplicate content detected", title: blogData.title });
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

      // Build slug with random suffix to avoid collisions
      const baseSlug = blogData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      const slug = baseSlug + "-" + Math.random().toString(36).substring(2, 7);

      // Database Insert
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
        console.error(`[AutoPost] DB insert failed for post ${i + 1}:`, insertError.message);
        results.push({ status: "failed", reason: "Database Insert Error", error: insertError.message });
        continue;
      }

      console.log(`[AutoPost] Post ${i + 1} created: "${newPost.title}" (${newPost.id}) | Category: ${currentCategory}`);
      results.push({ status: "success", id: newPost.id, title: newPost.title, category: currentCategory });

      // Add to existing titles for subsequent dedup checks
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