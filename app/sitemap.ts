import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://xylosai.vercel.app').replace(/\/$/, '')

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
        .filter((post: any) => post.slug)
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
    ...blogEntries,
  ]
}