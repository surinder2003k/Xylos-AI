import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://xylosai.vercel.app').replace(/\/$/, '')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  interface SitemapEntry {
    url: string
    lastmod: string
    changefreq: string
    priority: number
  }

  let blogEntries: SitemapEntry[] = []

  try {
    const { data: posts, error } = await supabase
      .from('blogs')
      .select('slug, updated_at')
      .eq('status', 'published')

    if (!error && posts) {
      blogEntries = posts
        .filter((post: any) => post.slug)
        .map((post: any) => ({
          url: `${siteUrl}/blog/${post.slug}`,
          lastmod: post.updated_at ? new Date(post.updated_at).toISOString() : new Date().toISOString(),
          changefreq: 'weekly' as const,
          priority: 0.7,
        }))
    }
  } catch (err) {
    console.error('[Sitemap] Failed to fetch blog posts:', err)
  }

  const staticEntries: SitemapEntry[] = [
    { url: siteUrl, lastmod: new Date().toISOString(), changefreq: 'daily', priority: 1.0 },
    { url: `${siteUrl}/blog`, lastmod: new Date().toISOString(), changefreq: 'daily', priority: 0.8 },
    { url: `${siteUrl}/about`, lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.8 },
  ]

  const allEntries = [...staticEntries, ...blogEntries]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${allEntries
    .map(
      (entry) => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      'X-Robots-Tag': 'noindex',
    },
  })
}
