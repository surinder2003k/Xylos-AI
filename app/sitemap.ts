import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Fetch all published blog posts
  const { data: posts } = await supabase
    .from('blogs')
    .select('slug, updated_at')
    .eq('status', 'published')

  const blogEntries: MetadataRoute.Sitemap = posts?.map((post) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://xylosai.vercel.app'}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []

  return [
    {
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://xylosai.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://xylosai.vercel.app'}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://xylosai.vercel.app'}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://xylosai.vercel.app'}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    ...blogEntries,
  ]
}
