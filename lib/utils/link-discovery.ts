/**
 * Xylos AI - Link Discovery Protocol
 * Programmatically discovers potential backlink targets from partner sitemaps
 */

export interface DiscoveryResult {
  url: string;
  lastmod?: string;
}

/**
 * Fetches and parses a sitemap or RSS feed to find the most recent blog posts.
 * Optimized for both standard XML sitemaps and RSS feeds.
 */
export async function discoverLatestPosts(feedUrl: string, limit: number = 5): Promise<DiscoveryResult[]> {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/xml, text/xml, */*'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.warn(`[LinkDiscovery] Failed to fetch feed/sitemap: ${response.statusText}`);
      return [];
    }

    const xml = await response.text();
    const results: DiscoveryResult[] = [];

    // Check if it's an RSS Feed
    if (xml.includes('<rss') || xml.includes('<channel>')) {
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      const linkRegex = /<link>(.*?)<\/link>/;
      const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;
      let match;

      while ((match = itemRegex.exec(xml)) !== null) {
        const itemContent = match[1];
        const linkMatch = itemContent.match(linkRegex);
        const pubDateMatch = itemContent.match(pubDateRegex);

        if (linkMatch && linkMatch[1]) {
          results.push({
            url: linkMatch[1].trim(),
            lastmod: pubDateMatch ? pubDateMatch[1] : undefined
          });
        }
      }
    } else {
      // Standard XML Sitemap
      const urlRegex = /<url>([\s\S]*?)<\/url>/g;
      const locRegex = /<loc>(.*?)<\/loc>/;
      const lastmodRegex = /<lastmod>(.*?)<\/lastmod>/;
      let match;

      while ((match = urlRegex.exec(xml)) !== null) {
        const urlContent = match[1];
        const locMatch = urlContent.match(locRegex);
        const lastmodMatch = urlContent.match(lastmodRegex);

        if (locMatch && locMatch[1]) {
          const url = locMatch[1].trim();
          // Filter to avoid generic pages and target actual articles
          if (url.includes('/blog/') || url.split('/').length > 4) {
            results.push({
              url,
              lastmod: lastmodMatch ? lastmodMatch[1] : undefined
            });
          }
        }
      }
    }

    // Sort by lastmod descending if available
    results.sort((a, b) => {
      if (!a.lastmod) return 1;
      if (!b.lastmod) return -1;
      return new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime();
    });

    return results.slice(0, limit).map(r => ({ ...r, url: sanitizeDiscoveryLink(r.url) }));
  } catch (error) {
    console.error("[LinkDiscovery] Protocol Error:", error);
    return [];
  }
}

/**
 * Ensures links to partner sites are free from known typographical errors
 * that cause 404s.
 */
export function sanitizeDiscoveryLink(url: string): string {
  if (!url) return url;
  
  return url.replace(
    "revisioning-education-through-artificial-intelligence",
    "revolutionizing-education-through-artificial-intelligence"
  );
}

/**
 * Discovers internal posts from Xylos AI database for internal linking
 */
export async function discoverInternalPosts(supabase: import('@supabase/supabase-js').SupabaseClient, limit: number = 5): Promise<DiscoveryResult[]> {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("slug")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://xylosai.vercel.app";
    return (data || []).map((post: { slug: string }) => ({
      url: `${baseUrl}/blog/${post.slug}`
    }));
  } catch (error) {
    console.error("[LinkDiscovery] Internal Discovery Error:", error);
    return [];
  }
}
