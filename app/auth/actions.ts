'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function signInWithGoogle(formData: FormData) {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  // Preserve post-login destination (e.g. /chat) — validated to be a safe relative path
  const rawNext = (formData.get('next') as string) || '/dashboard'
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })

  if (error) {
    console.error('Auth error:', error)
    return redirect('/?error=auth_failed')
  }

  if (data.url) {
    return redirect(data.url)
  }
}

function safeNext(raw: FormDataEntryValue | null): string {
  const value = typeof raw === 'string' ? raw : '/dashboard'
  return value.startsWith('/') && !value.startsWith('//') ? value : '/dashboard'
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const next = safeNext(formData.get('next'))

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    let msg = error.message;
    if (msg === "Invalid login credentials") {
      msg = "Invalid email or password. Please verify your credentials.";
    }
    return redirect(`/login?error=${encodeURIComponent(msg)}&next=${encodeURIComponent(next)}`);
  }

  return redirect(next)
}

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const next = safeNext(formData.get('next'))

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`)
  }

  // Send Welcome Email (Non-blocking)
  try {
    const { sendEmail } = await import('@/lib/mail/resend');
    const { WELCOME_TEMPLATE } = await import('@/lib/mail/templates');
    sendEmail({
      to: email,
      subject: `Welcome to the Neural Matrix, ${fullName || 'Citizen'} | Xylos AI`,
      html: WELCOME_TEMPLATE(fullName)
    });
  } catch (err) {
    console.error('[Auth] Failed to send welcome email:', err);
  }

  return redirect(`/dashboard?message=${encodeURIComponent('Check your email to confirm your account')}`)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/')
}
