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
    const count = Math.min(parseInt(searchParams.get("count") || "1"), 3);

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

    // 3. Fetch Context — use separate queries to avoid one failure killing everything
    let recentTitles: string[] = [];
    let activeCategory = "Technology";

    try {
      const { data: latestPosts } = await supabaseAdmin
        .from("blogs")
        .select("title")
        .order("created_at", { ascending: false })
        .limit(10);
      if (latestPosts) recentTitles = latestPosts.map((p) => p.title);
    } catch (err) {
      console.warn("[AutoPost] Could not fetch recent titles:", err);
    }

    try {
      // FIX: Use .maybeSingle() instead of .single() to avoid error on missing row
      const { data: categorySetting } = await supabaseAdmin
        .from("app_settings")
        .select("value")
        .eq("key", "auto_category")
        .maybeSingle();
      if (categorySetting?.value) activeCategory = categorySetting.value;
    } catch (err) {
      console.warn("[AutoPost] Could not fetch auto_category setting, using default:", err);
    }

    // 4. Resolve Author ID
    let authorId: string | null = null;
    try {
      const { data: admins } = await supabaseAdmin
        .from("profiles")
        .select("user_id")
        .in("role", ["super_admin", "admin"])
        .limit(1);
      if (admins && admins.length > 0) authorId = admins[0].user_id;
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

    // 5. Generation Loop
    for (let i = 0; i < count; i++) {
      console.log(`[AutoPost] Generating post ${i + 1}/${count} | Category: ${activeCategory}`);

      // Link Discovery
      let internalLinks: string[] = [];
      let externalLinks: string[] = [];
      try {
        const [partnerPosts, internalPosts] = await Promise.all([
          discoverLatestPosts("https://pulse-blog-ai.vercel.app/sitemap.xml", 1),
          discoverInternalPosts(supabaseAdmin, 3),
        ]);
        internalLinks = internalPosts.map((p) => p.url);
        externalLinks = partnerPosts.map((p) => p.url);
      } catch (err) {
        console.warn("[AutoPost] Link discovery failed, continuing without links:", err);
      }

      // AI Content Generation
      let blogData;
      try {
        blogData = await generateSmartBlog(
          activeCategory,
          recentTitles,
          activeCategory,
          internalLinks,
          externalLinks,
        );
      } catch (genErr: any) {
        console.error(`[AutoPost] AI generation failed:`, genErr.message);
        results.push({ status: "failed", reason: "AI Generation Failure", error: genErr.message });
        continue;
      }

      // Image Search
      let imageResult;
      try {
        imageResult = await searchSmartImage(
          blogData.search_term || blogData.title,
          blogData.category,
        );
      } catch (imgErr: any) {
        console.warn(`[AutoPost] Image search failed, using fallback:`, imgErr.message);
        imageResult = {
          url: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
          alt: "AI Neural Network",
        };
      }

      // Build slug with random suffix to avoid collisions
      const slug =
        blogData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "") +
        "-" +
        Math.random().toString(36).substring(2, 7);

      // Database Insert
      const { data: newPost, error: insertError } = await supabaseAdmin
        .from("blogs")
        .insert({
          title: blogData.title,
          slug,
          excerpt: blogData.excerpt,
          content: blogData.content,
          category: activeCategory,
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

      console.log(`[AutoPost] Post ${i + 1} created: "${newPost.title}" (${newPost.id})`);
      results.push({ status: "success", id: newPost.id, title: newPost.title });
      recentTitles.push(newPost.title);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const successCount = results.filter((r) => r.status === "success").length;
    console.log(`[AutoPost] DONE | ${successCount}/${count} posts created | ${duration}s`);

    return NextResponse.json({
      success: true,
      created: successCount,
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
