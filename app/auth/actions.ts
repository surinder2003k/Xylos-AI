'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function signInWithGoogle() {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
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

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    let msg = error.message;
    if (msg === "Invalid login credentials") {
      msg = "Invalid email or password. Please verify your credentials.";
    }
    return redirect(`/login?error=${encodeURIComponent(msg)}`);
  }

  return redirect('/dashboard')
}

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

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
    return redirect(`/login?error=${encodeURIComponent(error.message)}`)
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

  return redirect('/dashboard?message=Check your email to confirm your account')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/')
}
