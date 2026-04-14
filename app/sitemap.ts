import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://xylosai.vercel.app').replace(/\/$/, '')
  
  // Use generic client to prevent cookie errors during static/dynamic generation outside of request boundaries
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Fetch all published blog posts for the sitemap
  let blogEntries: MetadataRoute.Sitemap = []
  
  try {
    const { data: posts, error } = await supabase
      .from('blogs')
      .select('slug, updated_at')
      .eq('status', 'published')

    if (!error && posts) {
      blogEntries = posts
        .filter(post => post.slug)
        .map((post) => ({
          url: `${siteUrl}/blog/${post.slug}`,
          lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }))
    }
  } catch (err) {
    console.error("[Sitemap] Failed to fetch blog posts:", err)
  }

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
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...blogEntries,
  ]
}
