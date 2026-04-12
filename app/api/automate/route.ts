import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createAuthClient } from "@/utils/supabase/server";
import { generateSmartBlog } from "@/lib/ai/smart-generator";
import { searchSmartImage } from "@/lib/utils/image-search";

export const maxDuration = 60; // Max execution time to prevent Vercel timeouts
export const dynamic = "force-dynamic"; // Prevent aggressive route caching for auth checks

export async function GET(req: Request) {
  try {
    // 1. Initialize Admin Neural Client to bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 2. Automated Trigger Authorization
    const authHeader = req.headers.get("authorization");
    const vercelCronHeader = req.headers.get("x-vercel-cron");
    
    // Support both manual CRON_SECRET and standard Vercel Cron headers
    const isCron = (authHeader === `Bearer ${process.env.CRON_SECRET}`) || (vercelCronHeader === "1");
    
    let isAuthorizedAdmin = false;
    if (!isCron) {
      try {
        const authClient = await createAuthClient();
        const { data: { user } } = await authClient.auth.getUser();
        if (user) {
          // Hardcoded Super Admin Check (Mirroring layout.tsx)
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
        console.error("Auth validation error:", e);
      }
    }

    if (!isCron && !isAuthorizedAdmin && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized neural operation. Validation Failed." }, { status: 401 });
    }

    console.log(`[Neural Sync] Starting automated generation. Trigger: ${isCron ? 'Cron' : 'Manual'}`);
    const startTime = Date.now();

    // 3. Single-Post Protocol (Optimized for Hobby Tier 10s Limit)
    // Fetch context to prevent duplicate topics
    let recentTitles: string[] = [];
    try {
      const { data: posts } = await supabaseAdmin
        .from("blogs")
        .select("title")
        .order("created_at", { ascending: false })
        .limit(10);
      if (posts) recentTitles = posts.map(p => p.title);
    } catch (err: unknown) {
      console.warn("[Editorial Sync] Context block unavailable:", err);
    }

    // Fetch an admin user ID to assign authorship
    let authorId = null;
    try {
      const { data: admins } = await supabaseAdmin
         .from("profiles")
         .select("user_id")
         .in("role", ["super_admin", "admin"])
         .limit(1);
      
      if (admins && admins.length > 0) {
        authorId = admins[0].user_id;
      } else {
        // Fallback to a valid profile ID if no admin found (if needed)
        console.warn("[Editorial Sync] No admin profile found. Proceeding with null author.");
      }
    } catch(e) {
      console.error("[Editorial Sync] Author resolution failure:", e);
    }

    const topics = [
      "Global Technology Advancements", 
      "Startup & VC Ecosystem", 
      "Artificial Intelligence & Ethics", 
      "Cybersecurity Protocols",
      "Neural Networks & Deep Learning",
      "Quantum Computing Frontiers"
    ];
    
    // Pick a topic based on day + hour to ensure variety even with 4 calls/day
    const now = new Date();
    const topicIndex = (now.getDate() + now.getHours()) % topics.length;
    const baseTopic = topics[topicIndex];

    console.log(`[Neural Sync] Targeted Topic: ${baseTopic}`);

    const blogData = await generateSmartBlog(baseTopic, recentTitles, "Technology");
    const imageResult = await searchSmartImage(blogData.search_term || blogData.title, blogData.category);

    // Generate a URL-friendly slug
    const slug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString(36);

    const postPayload = {
      title: blogData.title,
      slug: slug,
      excerpt: blogData.excerpt,
      content: blogData.content,
      category: blogData.category,
      feature_image_url: imageResult.url,
      alt_text: blogData.alt_text || imageResult.alt,
      status: "published",
      author_id: authorId,
      published_at: new Date().toISOString(),
      meta_title: blogData.meta_title,
      meta_description: blogData.meta_description,
      keywords: blogData.keywords
    };

    const { data: newPost, error: insertError } = await supabaseAdmin
      .from("blogs")
      .insert(postPayload)
      .select()
      .single();

    if (insertError) {
      throw new Error(`DB Insert Failed: ${insertError.message}`);
    }

    const duration = (Date.now() - startTime) / 1000;
    console.log(`[Neural Sync] Synthesis completed in ${duration}s`);

    return NextResponse.json({ 
      success: true, 
      id: newPost.id, 
      title: newPost.title,
      duration: `${duration}s`,
      timestamp: new Date().toISOString()
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Orchestration critical failure";
    console.error("[Editorial Engine] Auto-post critical failure:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
