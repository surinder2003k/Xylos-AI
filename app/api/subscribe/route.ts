import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

// Admin email to notify on new subscriber (works without a custom domain)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'xyzg135@gmail.com';

// Server-side Supabase client using service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    // ── STEP 1: Save subscriber to DB (primary source of truth) ──
    const { error: dbError } = await supabase
      .from('subscribers')
      .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true });

    if (dbError) {
      console.error('[Subscribe] DB Error:', dbError);
      return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 });
    }

    // ── STEP 2: Notify admin (always sends to verified email — no domain required) ──
    // This is a fire-and-forget — we don't fail the request if this errors.
    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ADMIN_EMAIL,
      subject: `🎉 New Xylos Subscriber: ${email}`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%); padding: 32px 40px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Xylos AI</h1>
            <p style="margin: 6px 0 0; opacity: 0.8; font-size: 13px;">Editorial Intelligence Platform</p>
          </div>
          <div style="padding: 32px 40px;">
            <h2 style="margin: 0 0 8px; font-size: 18px; font-weight: 700;">New Subscriber</h2>
            <p style="color: #aaa; font-size: 14px; margin: 0 0 24px;">Someone just joined the Xylos intelligence network.</p>
            <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 16px 20px;">
              <p style="margin: 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Email</p>
              <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #a78bfa;">${email}</p>
            </div>
          </div>
          <div style="padding: 20px 40px; border-top: 1px solid #222;">
            <p style="margin: 0; font-size: 12px; color: #555;">Xylos AI Admin Notification</p>
          </div>
        </div>
      `
    }).catch(err => {
      // Log but don't fail — the subscriber is already saved to DB
      console.warn('[Subscribe] Admin email notification failed:', err?.message);
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed to Xylos intelligence briefings.' 
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    console.error('[Subscribe] Exception:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
