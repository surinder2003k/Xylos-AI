/**
 * Xylos AI - Link Discovery Protocol
 * Programmatically discovers potential backlink targets from partner sitemaps
 */

export interface DiscoveryResult {
  url: string;
  lastmod?: string;
}

/**
 * Fetches and parses a sitemap to find the most recent blog posts.
 * Optimized for standard XML sitemaps.
 */
export async function discoverLatestPosts(sitemapUrl: string, limit: number = 5): Promise<DiscoveryResult[]> {
  try {
    const response = await fetch(sitemapUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.warn(`[LinkDiscovery] Failed to fetch sitemap: ${response.statusText}`);
      return [];
    }

    const xml = await response.text();
    
    // Simple regex to extract <loc> and <lastmod> from sitemap
    const urlRegex = /<url>([\s\S]*?)<\/url>/g;
    const locRegex = /<loc>(.*?)<\/loc>/;
    const lastmodRegex = /<lastmod>(.*?)<\/lastmod>/;

    const results: DiscoveryResult[] = [];
    let match;

    while ((match = urlRegex.exec(xml)) !== null) {
      const urlContent = match[1];
      const locMatch = urlContent.match(locRegex);
      const lastmodMatch = urlContent.match(lastmodRegex);

      if (locMatch && locMatch[1]) {
        // Exclude generic pages if possible (e.g., /about, /contact)
        const url = locMatch[1].trim();
        if (url.includes('/blog/') || url.split('/').length > 4) {
          results.push({
            url,
            lastmod: lastmodMatch ? lastmodMatch[1] : undefined
          });
        }
      }
    }

    // Sort by lastmod descending if available
    results.sort((a, b) => {
      if (!a.lastmod) return 1;
      if (!b.lastmod) return -1;
      return new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime();
    });

    return results.slice(0, limit);
  } catch (error) {
    console.error("[LinkDiscovery] Protocol Error:", error);
    return [];
  }
}

/**
 * Discovers internal posts from Xylos AI database for internal linking
 */
export async function discoverInternalPosts(supabase: any, limit: number = 5): Promise<DiscoveryResult[]> {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("slug")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://xylosai.vercel.app";
    return (data || []).map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`
    }));
  } catch (error) {
    console.error("[LinkDiscovery] Internal Discovery Error:", error);
    return [];
  }
}
