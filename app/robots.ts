import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-config'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = SITE_URL

  // NOTE: robots entries are prefix matches. '/chat/' does NOT match '/chat',
  // so private routes are listed WITHOUT trailing slash to cover both the
  // route itself and everything under it.
  const privatePaths = [
    '/api/',
    '/login',
    '/dashboard',
    '/chat',
    '/settings',
    '/actions/',
    '/auth/',
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privatePaths,
      },
      {
        // The Googlebot/Bingbot group must repeat the private-path disallows.
        // In robots.txt a more specific group does not inherit from the '*'
        // group, so an allow-only rule here silently re-opened /dashboard/,
        // /chat/, /settings/ and the auth routes to the engines that matter
        // most. The noindex meta on those pages is a safety net, not the plan.
        userAgent: ['Googlebot', 'Bingbot'],
        allow: '/',
        disallow: privatePaths,
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