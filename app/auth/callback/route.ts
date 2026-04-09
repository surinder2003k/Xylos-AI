import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Check if this is a new user to send welcome email
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Check if profile was created in the last 10 seconds
          const { data: profile } = await supabase
            .from('profiles')
            .select('created_at, full_name')
            .eq('user_id', user.id)
            .single();

          if (profile && new Date().getTime() - new Date(profile.created_at).getTime() < 10000) {
            const { sendEmail } = await import('@/lib/mail/resend');
            const { WELCOME_TEMPLATE } = await import('@/lib/mail/templates');
            
            await sendEmail({
              to: user.email!,
              subject: `Welcome to the Neural Matrix, ${profile.full_name || 'Citizen'} | Xylos AI`,
              html: WELCOME_TEMPLATE(profile.full_name || '')
            });
          }
        }
      } catch (err) {
        console.error('[AuthCallback] Welcome email error:', err);
      }

      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
