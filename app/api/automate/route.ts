import { generateSmartBlog } from "@/lib/ai/smart-generator";
import { searchSmartImage } from "@/lib/utils/image-search";
import { discoverLatestPosts, discoverInternalPosts } from "@/lib/utils/link-discovery";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createAuthClient } from "@/utils/supabase/server";

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
    const { searchParams } = new URL(req.url);
    const count = Math.min(parseInt(searchParams.get("count") || "1"), 5); // Caps at 5 for stability
    
    const authHeader = req.headers.get("authorization");
    const vercelCronHeader = req.headers.get("x-vercel-cron");
    const isCron = (authHeader === `Bearer ${process.env.CRON_SECRET}`) || (vercelCronHeader === "1");
    
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
        console.error("Auth validation error:", e);
      }
    }

    if (!isCron && !isAuthorizedAdmin && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized neural operation. Validation Failed." }, { status: 401 });
    }

    console.log(`[Neural Sync] Starting automated generation. Count: ${count}, Trigger: ${isCron ? 'Cron' : 'Manual'}`);
    const startTime = Date.now();

    // 3. Fetch Neural Context & Settings
    let recentTitles: string[] = [];
    let activeCategory = "Technology";
    let topics = [
      "Global Technology Advancements", 
      "Startup & VC Ecosystem", 
      "Artificial Intelligence & Ethics", 
      "Cybersecurity Protocols",
      "Neural Networks & Deep Learning",
      "Quantum Computing Frontiers",
      "Renewable Energy Innovation",
      "Biotechnology Breakthroughs"
    ];
    
    try {
      const [latestPosts, categorySetting, topicsSetting] = await Promise.all([
        supabaseAdmin.from("blogs").select("title").order("created_at", { ascending: false }).limit(10),
        supabaseAdmin.from("app_settings").select("value").eq("key", "auto_category").single(),
        supabaseAdmin.from("app_settings").select("value").eq("key", "auto_topics").single()
      ]);
      
      if (latestPosts.data) recentTitles = latestPosts.data.map(p => p.title);
      if (categorySetting.data) activeCategory = categorySetting.data.value;
      if (topicsSetting.data && Array.isArray(topicsSetting.data.value) && topicsSetting.data.value.length > 0) {
        topics = topicsSetting.data.value;
      }
    } catch (err: unknown) {
      console.warn("[Editorial Sync] Settings retrieval failed:", err);
    }

    // Fetch an admin user ID to assign authorship
    let authorId = null;
    try {
      const { data: admins } = await supabaseAdmin.from("profiles").select("user_id").in("role", ["super_admin", "admin"]).limit(1);
      if (admins && admins.length > 0) authorId = admins[0].user_id;
    } catch(e) {
       console.error("[Editorial Sync] Author resolution failure:", e);
    }

    const results = [];

    // 4. Generation Core Loop
    for (let i = 0; i < count; i++) {
        // Pick individual topics with offsets to ensure variety in a single multi-post run
        const now = new Date();
        const baseOffset = i * 3; // Ensure different topics for each post in the batch
        const topicIndex = (now.getDate() + now.getHours() + baseOffset) % topics.length;
        const baseTopic = topics[topicIndex];

        console.log(`[Neural Sync] Initiating Post ${i+1}/${count} | Topic: ${baseTopic} | Category: ${activeCategory}`);

        // --- SEO & LINK DISCOVERY ---
        const partnerSite = "https://pulse-blog-ai.vercel.app/sitemap.xml";
        const [partnerPosts, internalPosts] = await Promise.all([
          discoverLatestPosts(partnerSite, 1), 
          discoverInternalPosts(supabaseAdmin, 3) // Increase internal variety
        ]);

        const internalLinks = internalPosts.map(p => p.url);
        const externalLinks = partnerPosts.map(p => p.url);

        // --- SYNTHESIS ---
        const blogData = await generateSmartBlog(
          baseTopic, 
          recentTitles, 
          activeCategory, 
          internalLinks, 
          externalLinks
        );
        const imageResult = await searchSmartImage(blogData.search_term || blogData.title, blogData.category);

        const slug = blogData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7);

        const postPayload = {
          title: blogData.title,
          slug: slug,
          excerpt: blogData.excerpt,
          content: blogData.content,
          category: activeCategory, // Use the active global category
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
          console.error(`[Neural Sync] Post ${i+1} failed:`, insertError.message);
          continue;
        }

        results.push({ id: newPost.id, title: newPost.title });
        recentTitles.push(newPost.title); // Update context for next iteration
    }

    const duration = (Date.now() - startTime) / 1000;
    console.log(`[Neural Sync] Multi-Post Synthesis completed in ${duration}s. Created ${results.length} posts.`);

    return NextResponse.json({ 
      success: true, 
      count: results.length,
      posts: results,
      duration: `${duration}s`,
      timestamp: new Date().toISOString()
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Orchestration critical failure";
    console.error("[Editorial Engine] Auto-post critical failure:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
