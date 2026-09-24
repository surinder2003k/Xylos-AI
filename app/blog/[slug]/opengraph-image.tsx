import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const alt = 'Xylos AI — Blog';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Public fetch — no cookies needed (safe for image generation)
  let title = 'Xylos AI — Free AI Chat & Blog';
  let category = 'Technology';
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: post } = await supabase
      .from('blogs')
      .select('title, category')
      .eq('slug', slug)
      .maybeSingle();
    if (post) {
      title = post.title;
      if (post.category) category = post.category;
    }
  } catch {
    // Fallback to default title on DB error — image still renders
  }

  // Truncate long titles to 3 lines
  const displayTitle = title.length > 140 ? title.slice(0, 137) + '...' : title;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 70px',
          background: 'linear-gradient(135deg, #0d0e10 0%, #0d1117 60%, #101725 100%)',
          color: '#eeeae2',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: -180,
            left: '25%',
            width: 700,
            height: 400,
            borderRadius: 9999,
            background: 'radial-gradient(closest-side, rgba(54,183,176,0.12), transparent)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            right: '10%',
            width: 500,
            height: 350,
            borderRadius: 9999,
            background: 'radial-gradient(closest-side, rgba(255,49,49,0.07), transparent)',
            display: 'flex',
          }}
        />

        {/* Top brand row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: '#36b7b0',
                color: '#17181b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              X
            </div>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#eeeae2', letterSpacing: 2 }}>XYLOS AI</span>
          </div>
          <div
            style={{
              display: 'flex',
              padding: '8px 20px',
              borderRadius: 9999,
              border: '1px solid rgba(54,183,176,0.35)',
              background: 'rgba(54,183,176,0.08)',
              color: '#36b7b0',
              fontSize: 16,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            {category}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: -1,
            color: '#ffffff',
            maxWidth: 1000,
          }}
        >
          {displayTitle}
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, color: '#8d8b85', display: 'flex' }}>xylosai.vercel.app</span>
          <span style={{ fontSize: 18, color: '#5a6c6d', display: 'flex' }}>Free AI Chat · Llama 3 · Gemini · Mistral</span>
        </div>
      </div>
    ),
    { ...size }
  );
}