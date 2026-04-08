import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Default testing email allowed without domain verification
      to: email, // Sending to the user who filled the form
      subject: 'Welcome to Xylos!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <h2 style="font-weight: 800; font-size: 24px; margin-bottom: 24px;">Thanks for using our services!</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #444;">
            Welcome aboard. We are absolutely thrilled to have you here at Xylos AI. 
            You will now receive our exclusive intelligence briefings and design updates.
          </p>
          <br/>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 32px 0;" />
          <p style="font-size: 14px; font-weight: 600; color: #666;">- The Xylos Admin Team</p>
        </div>
      `
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
