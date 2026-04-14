import { createClient } from "@/utils/supabase/server";
import { generateSmartBlog } from "@/lib/ai/smart-generator";
import { searchSmartImage } from "@/lib/utils/image-search";
import { generateAIImage } from "@/lib/ai/image-generator";
import { slugify } from "@/lib/utils/slugify";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // 1. Parse Request Body
    const body = await req.json().catch(() => ({}));
    const userPrompt = body.prompt || "";
    const userCategory = body.category || "";

    // Get Auth User for author_id
    const { data: { user } } = await supabase.auth.getUser();

    // 2. Fetch Recent Blog Titles & internal links (Context & SEO Injection)
    let recentTitles: string[] = [];
    let linkingContext: string[] = [];
    try {
      const { data: posts } = await supabase
        .from("blogs")
        .select("title, slug")
        .order("created_at", { ascending: false })
        .limit(15);
      
      if (posts) {
        recentTitles = posts.map(p => p.title);
        linkingContext = posts.slice(0, 3).map(p => `https://xylosai.vercel.app/blog/${p.slug}`); // Internal Backlinks
      }
    } catch {
      console.warn("[Strategy Sync] Failed to fetch context, proceeding without it.");
    }

    // Attempt to grab latest partner site post for external backlinking strategy
    try {
      const partnerRes = await fetch("https://pulse-blog-ai.vercel.app/", { next: { revalidate: 3600 } });
      const html = await partnerRes.text();
      const match = html.match(/"\/blog\/([^"?]+)"/);
      if (match && match[1] && match[1] !== 'undefined') {
        const partnerLink = `https://pulse-blog-ai.vercel.app/blog/${match[1]}`;
        linkingContext.push(partnerLink);
        console.log(`[SEO Engine] Linked Partner Site Post: ${partnerLink}`);
      }
    } catch (err) {
      console.warn("[SEO Engine] Partner site link fetching failed.", err);
    }

    // 3. Generate AI Content (With Multi-Provider Fallback)
    const blogData = await generateSmartBlog(
      userPrompt || "Latest Global Technological & Strategic Shifts 2026", 
      recentTitles,
      userCategory,
      linkingContext
    );

    // 4. AI Image Production Engine (Feature Image)
    console.log("[Neural Engine] Initiating Image Production...");
    let featureImageUrl = null;
    try {
      // Try high-fidelity generation first
      featureImageUrl = await generateAIImage(blogData.search_term || blogData.title);
    } catch (err) {
      console.warn(`[Neural Engine] AI Image Generation failed (${err instanceof Error ? err.message : 'Unknown error'}), falling back to stock search.`);
    }

    // Fallback to stock search if generation fails
    if (!featureImageUrl) {
      const imageResult = await searchSmartImage(
        `${blogData.search_term || blogData.title} ${Math.random().toString(36).substring(7)}`, 
        blogData.category
      );
      featureImageUrl = imageResult.url;
    }

    // 5. In-Article Image Processing
    let processedContent = blogData.content;
    const imageMarkers = blogData.content.match(/\[AI_IMAGE_PROMPT: (.*?)\]/g);
    
    if (imageMarkers && imageMarkers.length > 0) {
      console.log(`[Neural Engine] Found ${imageMarkers.length} in-article image markers.`);
      for (const marker of imageMarkers) {
        let prompt = marker.replace("[AI_IMAGE_PROMPT: ", "").replace("]", "");
        try {
          // 1. Attempt High-Fidelity Generation
          let inArticleUrl = await generateAIImage(prompt);
          
          // 2. Fallback to Stock Search on failure
          if (!inArticleUrl) {
            console.log(`[Neural Engine] Generation failed for segment, falling back to stock search: ${prompt}`);
            const stockResult = await searchSmartImage(`${prompt} ${Math.random().toString(36).substring(7)}`, blogData.category);
            inArticleUrl = stockResult.url;
          }

          if (inArticleUrl) {
            const imgHtml = `<figure class="my-8"><img src="${inArticleUrl}" alt="${prompt}" title="${prompt}" class="rounded-2xl border border-white/10 shadow-2xl w-full h-auto" /><figcaption class="text-center text-[10px] text-muted-foreground uppercase tracking-widest mt-3">${prompt}</figcaption></figure>`;
            processedContent = processedContent.replace(marker, imgHtml);
          } else {
            processedContent = processedContent.replace(marker, ""); 
          }
        } catch (err) {
          console.warn(`[Neural Engine] In-article image processing failed for: ${prompt}`, err);
          processedContent = processedContent.replace(marker, "");
        }
      }
    }

    // 6. Automated Publication Check
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

    // 7. Final Save to Supabase
    try {
      const postPayload = {
        title: blogData.title,
        excerpt: blogData.excerpt,
        content: processedContent,
        category: blogData.category,
        feature_image_url: featureImageUrl,
        alt_text: blogData.alt_text,
        meta_title: blogData.meta_title,
        meta_description: blogData.meta_description,
        keywords: blogData.keywords,
        slug: slugify(blogData.title),
        status: autoPublish ? "published" : "draft",
        published_at: autoPublish ? new Date().toISOString() : null,
        author_id: user?.id || null, // Ensure author is linked
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
          content: processedContent,
          feature_image_url: featureImageUrl,
          created_at: new Date().toISOString(),
          status: "generated_preview"
        },
        warning: `Content synthesized but DB sync failed. You can still edit and manually publish from the editor.`
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
