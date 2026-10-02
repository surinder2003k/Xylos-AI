import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import SLUG_REDIRECTS from '@/lib/slug-redirects'

export async function middleware(request: NextRequest) {
  // 301 legacy blog slugs -> their de-slopped equivalents.
  //
  // These URLs were published in the sitemap and may already have inbound links
  // or be indexed, so the slugs were rewritten in the database at the same time
  // as this map was generated (database/slug-redirects.json), and the mapping has
  // to be mirrored here or those signals are lost. Checked before updateSession
  // so it costs nothing on the ~99.9% of requests that are not legacy slugs.
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/blog/')) {
    const legacy = pathname.slice('/blog/'.length)
    const target = SLUG_REDIRECTS[legacy]
    if (target) {
      const url = request.nextUrl.clone()
      url.pathname = `/blog/${target}`
      return NextResponse.redirect(url, 301)
    }
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml, robots.txt (search engine files)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
