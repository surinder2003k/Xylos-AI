import { Resend } from 'resend';

// Constructed on first use, not at module load. `new Resend()` throws when
// RESEND_API_KEY is missing, and a module-scope call made importing this file —
// and therefore building the app, or serving an unrelated route — fail on any
// environment without the key (a fresh CI runner, for example). The key is only
// required when an email is actually sent.
let client: Resend | null = null;
function getResend(): Resend {
  if (!client) client = new Resend(process.env.RESEND_API_KEY!);
  return client;
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Shared utility to send emails via Resend.
 * Defaults to the verified onboarding email if no custom domain is configured.
 */
export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Mail] Skipping email send: RESEND_API_KEY not configured.');
    return null;
  }

  try {
    const { data, error } = await getResend().emails.send({
      from: from || 'Xylos AI <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[Mail] Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('[Mail] Unexpected error:', error);
    return { success: false, error };
  }
}
