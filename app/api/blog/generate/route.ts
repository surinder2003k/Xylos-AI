import { createClient } from "@/utils/supabase/server";
import { generateSmartBlog } from "@/lib/ai/smart-generator";
import { searchSmartImage } from "@/lib/utils/image-search";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // 1. Parse Request Body
    const body = await req.json().catch(() => ({}));
    const userPrompt = body.prompt || "";
    const userCategory = body.category || "";

    // 2. Fetch Recent Blog Titles (Context Injection)
    let recentTitles: string[] = [];
    try {
      const { data: posts } = await supabase
        .from("blogs")
        .select("title")
        .order("created_at", { ascending: false })
        .limit(15);
      
      if (posts) recentTitles = posts.map(p => p.title);
    } catch {
      console.warn("[Strategy Sync] Failed to fetch context, proceeding without it.");
    }

    // 3. Generate AI Content (With Multi-Provider Fallback)
    const blogData = await generateSmartBlog(
      userPrompt || "Latest Global Technological & Strategic Shifts 2026", 
      recentTitles,
      userCategory
    );

    // 4. Fetch Feature Image (Tiered Search)
    const imageResult = await searchSmartImage(
      blogData.search_term || blogData.title,
      blogData.category
    );

    // 5. Automated Publication Check
    let autoPublish = true;
    try {
      const { data: publishSet } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "auto_publish")
        .single();
      if (publishSet) autoPublish = publishSet.value;
    } catch {
      console.warn("[Strategy Sync] Settings fetch failed, using default: auto_publish=true");
    }

    // 6. Final Save to Supabase
    try {
      const postPayload = {
        title: blogData.title,
        excerpt: blogData.excerpt,
        content: blogData.content,
        category: blogData.category,
        feature_image_url: imageResult.url,
        alt_text: blogData.alt_text || imageResult.alt,
        status: autoPublish ? "published" : "draft",
        published_at: autoPublish ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from("blogs")
        .insert(postPayload)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ 
        success: true, 
        post: data,
        message: `Successfully synchronized: "${blogData.title}"`
      });
    } catch (dbError: unknown) {
      const errorMsg = dbError instanceof Error ? dbError.message : "Database persistence failed";
      console.error("[Strategy Sync] Database persistence failed:", errorMsg);
      
      // CRITICAL FALLBACK: Return the generated content so the UI can display it
      return NextResponse.json({ 
        success: true, 
        post: {
          ...blogData,
          feature_image_url: imageResult.url,
          alt_text: blogData.alt_text || imageResult.alt,
          created_at: new Date().toISOString(),
          status: "generated_preview"
        },
        warning: `Content synthesized but DB sync failed (Code: ${typeof dbError === 'object' && dbError !== null && 'code' in dbError ? (dbError as {code: string}).code : 'UNKNOWN'}). You can still edit and manually publish from the editor.`
      });
    }

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "An unexpected strategy desync occurred.";
    console.error("[Strategy Sync] Critical system failure:", errorMsg);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
