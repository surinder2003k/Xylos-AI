import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateSmartBlog } from "@/lib/ai/smart-generator";
import { searchSmartImage } from "@/lib/utils/image-search";

export const maxDuration = 60; // Max execution time to prevent Vercel timeouts

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
    if (!isCron && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized neural operation. Validation Failed." }, { status: 401 });
    }

    const synthesizedPosts = [];

    // 3. Sequential Multi-Post Protocol (2 Iterations for 8AM/8PM IST)
    for (let i = 0; i < 2; i++) {
        // Fetch context to prevent duplicate topics
        let recentTitles: string[] = [];
        try {
          const { data: posts } = await supabaseAdmin.from("blogs").select("title").order("created_at", { ascending: false }).limit(10);
          if (posts) recentTitles = posts.map(p => p.title);
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : "Archive sync failed";
          console.warn("[Editorial Sync] Context block unavailable:", errMsg);
        }

        const topics = ["Global Technology Advancements", "Startup & VC Ecosystem", "Artificial Intelligence & Ethics", "Cybersecurity Protocols"];
        const baseTopic = topics[i % topics.length];

        const blogData = await generateSmartBlog(baseTopic, recentTitles, "Technology");
        const imageResult = await searchSmartImage(blogData.search_term || blogData.title, blogData.category);

        const postPayload = {
          title: blogData.title,
          excerpt: blogData.excerpt,
          content: blogData.content,
          category: blogData.category,
          feature_image_url: imageResult.url,
          alt_text: blogData.alt_text || imageResult.alt,
          status: "published",
          published_at: new Date().toISOString(),
        };

        const { data, error } = await supabaseAdmin.from("blogs").insert(postPayload).select().single();
        if (!error && data) {
           synthesizedPosts.push({ id: data.id, title: data.title });
        } else {
           console.error("[Editorial Sync] DB Insert Failed:", error);
        }
    }

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
