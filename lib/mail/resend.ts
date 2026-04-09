import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { data, error } = await resend.emails.send({
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
