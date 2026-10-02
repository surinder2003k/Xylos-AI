import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://xylosai.vercel.app').replace(/\/$/, '')

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/login',
          '/dashboard/',
          '/chat/',
          '/settings/',
          '/actions/',
          '/auth/',
        ],
      },
      {
        // The Googlebot/Bingbot group must repeat the private-path disallows.
        // In robots.txt a more specific group does not inherit from the '*'
        // group, so an allow-only rule here silently re-opened /dashboard/,
        // /chat/, /settings/ and the auth routes to the engines that matter
        // most. The noindex meta on those pages is a safety net, not the plan.
        userAgent: ['Googlebot', 'Bingbot'],
        allow: '/',
        disallow: [
          '/api/',
          '/login',
          '/dashboard/',
          '/chat/',
          '/settings/',
          '/actions/',
          '/auth/',
        ],
      },
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'BLEXBot'],
        disallow: '/',
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}