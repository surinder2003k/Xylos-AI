export const dynamic = 'force-static'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://xylosai.vercel.app').replace(/\/$/, '')

export async function GET() {
  const content = [
    '# Xylos AI',
    '',
    '> A free multi-model AI workspace for chat, research, content creation, and everyday productivity.',
    '',
    'Xylos AI brings models such as Llama, Gemini, and Mistral into one focused workspace. Use the public pages below to understand the product, browse practical AI articles, and learn about the service.',
    '',
    '## Public pages',
    `- [Home](${SITE_URL}/)`,
    `- [AI blog](${SITE_URL}/blog)`,
    `- [Free AI tools](${SITE_URL}/tools)`,
    `- [About Xylos AI](${SITE_URL}/about)`,
    `- [Contact](${SITE_URL}/contact)`,
    '',
    '## Content guidelines',
    '- Prefer the original article URL and its canonical metadata.',
    '- Do not submit private, account, dashboard, or API pages for indexing.',
    '- Xylos AI does not guarantee that every third-party model is permanently free; availability can depend on the upstream provider.',
  ].join('\\n')

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
