export const WELCOME_TEMPLATE = (fullName: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Xylos AI</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #050505; margin: 0; padding: 0; color: #ffffff; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 24px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #6c63ff 0%, #3b82f6 100%); padding: 60px 40px; text-align: center; }
    .logo { font-size: 32px; font-weight: 900; letter-spacing: -1px; margin: 0; text-transform: uppercase; color: #ffffff; }
    .tagline { font-size: 14px; font-weight: 500; opacity: 0.8; margin-top: 8px; text-transform: uppercase; letter-spacing: 4px; }
    .content { padding: 40px; line-height: 1.6; }
    .greeting { font-size: 24px; font-weight: 700; margin-bottom: 20px; color: #a78bfa; }
    .text { font-size: 16px; color: #d1d5db; margin-bottom: 30px; }
    .cta-container { text-align: center; margin: 40px 0; }
    .button { background-color: #ffffff; color: #000000; padding: 16px 32px; border-radius: 12px; font-weight: 900; text-decoration: none; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; transition: transform 0.2s; display: inline-block; }
    .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 40px; border-top: 1px solid #1a1a1a; padding-top: 40px; }
    .feature-item { background: #111; padding: 20px; border-radius: 16px; border: 1px solid #222; }
    .feature-title { font-weight: 700; font-size: 13px; color: #a78bfa; margin-bottom: 5px; text-transform: uppercase; }
    .feature-desc { font-size: 12px; color: #888; margin: 0; }
    .footer { padding: 40px; background-color: #080808; border-top: 1px solid #1a1a1a; text-align: center; }
    .footer-text { font-size: 12px; color: #555; margin-bottom: 10px; }
    .social-links { margin-top: 20px; font-size: 10px; color: #333; text-transform: uppercase; letter-spacing: 2px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">XYLOS AI</h1>
      <p class="tagline">Neural Matrix Initialized</p>
    </div>
    <div class="content">
      <h2 class="greeting">Welcome to the Network, ${fullName || 'Citizen'}</h2>
      <p class="text">
        You have successfully synchronized with the Xylos Intelligence Platform. Your editorial architecture is now live, granting you access to elite generative models and strategic content synthesis.
      </p>
      
      <div class="cta-container">
        <a href="https://xylos-ai.com/dashboard" class="button">Access Command Center</a>
      </div>

      <div class="feature-grid">
        <div class="feature-item">
          <p class="feature-title">Strategic Chat</p>
          <p class="feature-desc">Engage with Llama 3, Gemini, and Mistral in one zero-cost interface.</p>
        </div>
        <div class="feature-item">
          <p class="feature-title">Smart Editorial</p>
          <p class="feature-desc">Generate SEO-optimized blog posts with autonomous image synthesis.</p>
        </div>
      </div>
    </div>
    <div class="footer">
      <p class="footer-text">This is an automated transmission from the Xylos AI Core.</p>
      <p class="footer-text">&copy; 2026 Xylos AI Platform. All rights reserved.</p>
      <div class="social-links">STATUS: SYNCHRONIZED | PROTOCOL: SECURE</div>
    </div>
  </div>
</body>
</html>
`;

export const SUBSCRIBE_TEMPLATE = (email: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Intelligence Feed Active</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #050505; margin: 0; padding: 0; color: #ffffff; }
    .container { max-width: 500px; margin: 40px auto; background-color: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 32px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.8); }
    .status-bar { background: #1a1a1a; padding: 12px 30px; border-bottom: 1px solid #222; display: flex; align-items: center; }
    .status-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block; margin-right: 10px; box-shadow: 0 0 10px #10b981; }
    .status-text { font-size: 10px; font-weight: 900; color: #10b981; text-transform: uppercase; letter-spacing: 2px; }
    .hero { padding: 60px 40px; text-align: center; }
    .icon { font-size: 48px; margin-bottom: 20px; }
    .title { font-size: 28px; font-weight: 900; margin: 0; color: #ffffff; letter-spacing: -0.5px; }
    .subtitle { font-size: 14px; opacity: 0.6; margin-top: 10px; line-height: 1.6; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, #333, transparent); margin: 40px 0; }
    .content { padding: 0 40px 60px; text-align: center; }
    .email-chip { background: #111; border: 1px solid #222; padding: 12px 24px; border-radius: 100px; display: inline-block; color: #a78bfa; font-weight: 700; font-size: 13px; margin-bottom: 30px; }
    .footer { padding: 30px; background: #080808; text-align: center; font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 1px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="status-bar">
      <div class="status-dot"></div>
      <div class="status-text">Intelligence Briefing Engaged</div>
    </div>
    <div class="hero">
      <div class="icon">🛰️</div>
      <h1 class="title">Feed Active.</h1>
      <p class="subtitle">Your digital terminal has been successfully registered to the Xylos Intelligence Network.</p>
    </div>
    <div class="content">
      <div class="divider"></div>
      <div class="email-chip">${email}</div>
      <p style="font-size: 13px; color: #888; margin: 0;">Expect low-volume, high-impact tactical updates from the AI frontier.</p>
    </div>
    <div class="footer">
      Xylos AI // Transmission Secure // v2.0
    </div>
  </div>
</body>
</html>
`;
