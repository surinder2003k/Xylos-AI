import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://xylosai.vercel.app').replace(/\/$/, '')

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/private/',
          '/api/',
          '/dashboard/',
          '/chat/',
          '/settings/',
        ],
      },
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: '/',
      },
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'BLEXBot'],
        disallow: '/',
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}