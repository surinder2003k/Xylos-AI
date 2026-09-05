import type { Metadata } from "next";
import { Cookie, Shield, Database, Eye, Settings, Link as LinkIcon, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy — Xylos AI",
  description: "Learn how Xylos AI uses cookies and similar tracking technologies. This policy explains what cookies are, how we use them, and your choices regarding cookies.",
  alternates: {
    canonical: 'https://xylosai.vercel.app/cookies',
  },
  openGraph: {
    title: "Cookie Policy — Xylos AI",
    description: "Xylos AI Cookie Policy - how we use cookies and tracking technologies.",
    url: 'https://xylosai.vercel.app/cookies',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Xylos AI Cookie Policy' }],
  },
};

export default function CookiesPage() {
  const lastUpdated = "April 17, 2026";

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0a0b0e', color: '#e2e2e8' }}>
      <main className="relative z-10 pt-32 px-6 pb-20 max-w-4xl mx-auto space-y-16">
        {/* Hero */}
        <header className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-medium tracking-wide" style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}>
            <Cookie className="w-3 h-3" />
            Privacy
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
            Cookie <span style={{ color: '#00f0ff' }}>Policy</span>
          </h1>
          <p className="text-lg font-medium max-w-2xl mx-auto" style={{ color: '#aeb9bd' }}>
            This policy explains how Xylos AI uses cookies and similar technologies to improve your experience.
          </p>
        </header>

        {/* Last Updated */}
        <div className="text-center text-sm" style={{ color: '#849495' }}>
          Last updated: {lastUpdated}
        </div>

        {/* Cookie Policy Content */}
        <article className="space-y-12 leading-relaxed" style={{ color: '#aeb9bd' }}>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Cookie className="w-5 h-5 text-[#00f0ff]" />
              1. What Are Cookies
            </h2>
            <p className="text-lg">
              Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember your preferences, understand how you interact with the site, and provide a better user experience. Cookies can be "persistent" (stored until they expire or you delete them) or "session" (deleted when you close your browser).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Shield className="w-5 h-5 text-[#00f0ff]" />
              2. How We Use Cookies
            </h2>
            <p className="text-lg">Xylos AI uses cookies for the following purposes:</p>
            <ul className="space-y-3 text-lg list-disc list-inside">
              <li><strong>Essential Cookies:</strong> Required for the Platform to function properly (authentication, security, session management). These cannot be disabled.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site (pages visited, time spent, traffic sources) using Google Analytics / Vercel Analytics.</li>
              <li><strong>Preference Cookies:</strong> Remember your settings (theme preference, language, dashboard layout) for a personalized experience.</li>
              <li><strong>Marketing Cookies:</strong> May be used by third-party advertising partners (Google AdSense) to show relevant ads and measure ad performance.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Database className="w-5 h-5 text-[#00f0ff]" />
              3. Specific Cookies We Set
            </h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-semibold text-white">Cookie Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Purpose</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr><td className="py-3 px-4 font-mono">next-auth.callback-url</td><td className="py-3 px-4">OAuth callback handling</td><td className="py-3 px-4">Essential</td><td className="py-3 px-4">Session</td></tr>
                <tr><td className="py-3 px-4 font-mono">next-auth.csrf-token</td><td className="py-3 px-4">CSRF protection</td><td className="py-3 px-4">Essential</td><td className="py-3 px-4">Session</td></tr>
                <tr><td className="py-3 px-4 font-mono">__session</td><td className="py-3 px-4">User session</td><td className="py-3 px-4">Essential</td><td className="py-3 px-4">24 hours</td></tr>
                <tr><td className="py-3 px-4 font-mono">theme</td><td className="py-3 px-4">Dark/light mode preference</td><td className="py-3 px-4">Preference</td><td className="py-3 px-4">1 year</td></tr>
                <tr><td className="py-3 px-4 font-mono">_ga, _ga_*</td><td className="py-3 px-4">Google Analytics</td><td className="py-3 px-4">Analytics</td><td className="py-3 px-4">2 years</td></tr>
                <tr><td className="py-3 px-4 font-mono">__vercel_*</td><td className="py-3 px-4">Vercel Analytics</td><td className="py-3 px-4">Analytics</td><td className="py-3 px-4">Varies</td></tr>
              </tbody>
            </table>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Eye className="w-5 h-5 text-[#00f0ff]" />
              4. Third-Party Cookies
            </h2>
            <p className="text-lg">
              We integrate with the following third-party services that may set their own cookies:
            </p>
            <ul className="space-y-3 text-lg list-disc list-inside">
              <li><strong>Google Analytics / Vercel Analytics:</strong> Aggregate usage statistics. <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer" className="text-[#00f0ff] hover:underline">Google's cookie policy</a>.</li>
              <li><strong>Google AdSense:</strong> If ads are displayed, Google may use cookies to personalize ads. <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-[#00f0ff] hover:underline">AdSense cookie policy</a>.</li>
              <li><strong>Supabase Auth:</strong> Authentication cookies for user sessions.</li>
              <li><strong>Unsplash / Pexels:</strong> Image CDN may set cookies for content delivery.</li>
            </ul>
            <p className="text-lg">
              We do not control third-party cookies. Please refer to their respective privacy policies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Settings className="w-5 h-5 text-[#00f0ff]" />
              5. Your Cookie Choices
            </h2>
            <p className="text-lg">You have the following options to manage cookies:</p>
            <ul className="space-y-3 text-lg list-disc list-inside">
              <li><strong>Browser Settings:</strong> Most browsers allow you to block, delete, or alert you about cookies. Check your browser's help menu.</li>
              <li><strong>Opt-Out Tools:</strong> Use <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#00f0ff] hover:underline">Google Analytics Opt-out</a> or <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-[#00f0ff] hover:underline">NAI Opt-out</a>.</li>
              <li><strong>Platform Settings:</strong> Toggle theme and some preferences in your Xylos AI dashboard.</li>
              <li><strong>Do Not Track:</strong> We respect DNT signals where technically feasible.</li>
            </ul>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.1)' }}>
              <p className="text-sm font-medium" style={{ color: '#00f0ff' }}>
                Note: Disabling essential cookies will break core functionality (login, dashboard, chat).
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <LinkIcon className="w-5 h-5 text-[#00f0ff]" />
              6. Related Policies
            </h2>
            <ul className="space-y-2 text-lg list-disc list-inside">
              <li><a href="/privacy" className="text-[#00f0ff] hover:underline">Privacy Policy</a> — How we collect and use personal data</li>
              <li><a href="/terms" className="text-[#00f0ff] hover:underline">Terms of Service</a> — Platform usage terms</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Mail className="w-5 h-5 text-[#00f0ff]" />
              7. Contact
            </h2>
            <p className="text-lg">
              Questions about this Cookie Policy? Contact us at <a href="mailto:privacy@xylosai.com" className="text-[#00f0ff] hover:underline">privacy@xylosai.com</a> or visit our <a href="/contact" className="text-[#00f0ff] hover:underline">Contact page</a>.
            </p>
          </section>
        </article>

        {/* Footer */}
        <footer className="text-center pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest mb-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <a href="/about" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>About</a>
            <a href="/blog" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Blog</a>
            <a href="/contact" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Contact</a>
            <a href="/terms" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Terms</a>
            <a href="/cookies" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Cookies</a>
            <a href="/privacy" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Privacy</a>
          </div>
          <p className="text-[12px] font-medium" style={{ color: '#5a6c6d' }}>
            &copy; {new Date().getFullYear()} Xylos AI. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}