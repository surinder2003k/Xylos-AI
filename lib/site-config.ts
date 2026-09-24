export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://xylosai.vercel.app').replace(/\/$/, '')

export const SITE_NAME = 'Xylos AI'
export const SITE_DESCRIPTION = 'A free multi-model AI workspace for chat, research, content creation, and everyday productivity.'
export const SITE_AUTHOR = 'Xylos AI team'
export const SITE_EMAIL = 'xyzg135@gmail.com'

export function absoluteUrl(path = '/') {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
