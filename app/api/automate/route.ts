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
    const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    
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

    const synthesizedPosts = [];

    // 3. Parallel Multi-Post Protocol (Limits Vercel Timeout)
    // Execute both post generations simultaneously to fit within Hobby 10s limit
    const promises = Array(2).fill(null).map(async (_, i) => {
        // Fetch context to prevent duplicate topics
        let recentTitles: string[] = [];
        try {
          const { data: posts } = await supabaseAdmin.from("blogs").select("title").order("created_at", { ascending: false }).limit(10);
          if (posts) recentTitles = posts.map(p => p.title);
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : "Archive sync failed";
          console.warn("[Editorial Sync] Context block unavailable:", errMsg);
        }

        // Fetch an admin user ID to assign authorship
        let authorId = null;
        try {
          const { data: admins } = await supabaseAdmin
             .from("profiles")
             .select("user_id")
             .in("role", ["super_admin", "admin"])
             .limit(1);
          if (admins && admins.length > 0) authorId = admins[0].user_id;
        } catch(e) {}

        const topics = ["Global Technology Advancements", "Startup & VC Ecosystem", "Artificial Intelligence & Ethics", "Cybersecurity Protocols"];
        const baseTopic = topics[i % topics.length];

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
        };

        const { data, error } = await supabaseAdmin.from("blogs").insert(postPayload).select().single();
        if (!error && data) {
           synthesizedPosts.push({ id: data.id, title: data.title });
        } else {
           console.error("[Editorial Sync] DB Insert Failed:", error);
        }
    });

    await Promise.all(promises);

    return NextResponse.json({ 
      success: true, 
      count: synthesizedPosts.length, 
      generated: synthesizedPosts,
      timestamp: new Date().toISOString()
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Orchestration critical failure";
    console.error("[Editorial Engine] Auto-post critical failure:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
