/**
 * IndexNow ping helper — instant indexing for Bing, Yandex, Seznam, Naver.
 * Key file must be publicly reachable at /{INDEXNOW_KEY}.txt (see public/).
 * Fire-and-forget safe: never throws.
 */
export const INDEXNOW_KEY = '7d3f8e21a9c44b6e8f2a5d1c9b0e4f7a';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://xylosai.vercel.app';
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');

export async function pingIndexNow(urls: string[]): Promise<boolean> {
  if (!urls || urls.length === 0) return false;
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: SITE_HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls.slice(0, 10000),
      }),
      // Do not let this block the response path for long
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok && res.status !== 202 && res.status !== 200) {
      console.warn(`[IndexNow] Ping returned ${res.status}`);
      return false;
    }
    console.log(`[IndexNow] Pinged ${urls.length} URL(s) successfully.`);
    return true;
  } catch (err: unknown) {
    console.warn('[IndexNow] Ping failed (non-blocking):', err instanceof Error ? err.message : err);
    return false;
  }
}