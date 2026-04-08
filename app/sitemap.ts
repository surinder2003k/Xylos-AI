import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://xylos-ai.com'
  const supabase = await createClient()

  // Fetch all published blog posts for the sitemap
  const { data: posts } = await supabase
    .from('blogs')
    .select('slug, updated_at')
    .eq('status', 'published')

  const blogEntries: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/chat`,
      lastModified: new Date(),
      changeFrequency: 'never',
      priority: 0.5,
    },
    ...blogEntries,
  ]
}
