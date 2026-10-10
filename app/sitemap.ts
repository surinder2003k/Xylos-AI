import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { SITE_URL } from '@/lib/site-config'
import SLUG_REDIRECTS from '@/lib/slug-redirects'

// Only REAL functional routes go in the sitemap.
// The 9 ai-* entries used to live here, but they resolve to the thin
// app/tools/[tool] proxy template (same layout, only title/desc swapped) and
// have zero internal links pointing at them (the /tools hub only links the
// two real utilities below). Orphaned thin URLs in the sitemap are exactly
// what Search Console reports as "Crawled - currently not indexed" and
// "Duplicate without user-selected canonical", so they stay OUT until each
// tool gets its own real UI + unique content. The [tool] route itself is
// noindex (see its generateMetadata) so nothing listed here can 404.
const TOOL_PAGES = [
  'dropzone-share',
  'pic-extractor',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = SITE_URL
  // Legacy slugs serve a 301, not a 200. Submitting a redirecting URL makes
  // Search Console report it as indexed-then-404/redirect confusion, so never
  // list a legacy slug — only its canonical target belongs here.
  const legacySlugs = new Set(Object.keys(SLUG_REDIRECTS))

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Fetch all published blog posts
  let blogEntries: MetadataRoute.Sitemap = []
  try {
    const { data: posts } = await supabase
      .from('blogs')
      .select('slug, updated_at')
      .eq('status', 'published')

    if (posts) {
      blogEntries = posts
        .filter((post: any) => post.slug && !legacySlugs.has(post.slug))
        .map((post: any) => ({
          url: `${siteUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at || new Date()),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
    }
  } catch (err) {
    console.error('[Sitemap] Failed to fetch blog posts:', err)
  }

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${siteUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    ...TOOL_PAGES.map((slug) => ({
      url: `${siteUrl}/tools/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...blogEntries,
  ]
}