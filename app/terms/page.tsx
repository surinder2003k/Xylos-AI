import type { Metadata } from "next";
import { Shield, Scale, FileText, Clock, Lock, AlertCircle, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — Xylos AI",
  description: "Terms of Service for Xylos AI. By using our platform, you agree to these terms covering acceptable use, intellectual property, disclaimers, and liability limitations.",
  alternates: {
    canonical: 'https://xylosai.vercel.app/terms',
  },
  openGraph: {
    title: "Terms of Service — Xylos AI",
    description: "Read the Terms of Service for Xylos AI platform.",
    url: 'https://xylosai.vercel.app/terms',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Xylos AI Terms of Service' }],
  },
};

export default function TermsPage() {
  const lastUpdated = "April 17, 2026";

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0a0b0e', color: '#e2e2e8' }}>
      <main className="relative z-10 pt-32 px-6 pb-20 max-w-4xl mx-auto space-y-16">
        {/* Hero */}
        <header className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-medium tracking-wide" style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}>
            <Scale className="w-3 h-3" />
            Legal
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
            Terms of <span style={{ color: '#00f0ff' }}>Service</span>
          </h1>
          <p className="text-lg font-medium max-w-2xl mx-auto" style={{ color: '#aeb9bd' }}>
            Please read these terms carefully before using Xylos AI. By accessing our platform, you agree to be bound by these terms.
          </p>
        </header>

        {/* Last Updated */}
        <div className="text-center text-sm" style={{ color: '#849495' }}>
          Last updated: {lastUpdated}
        </div>

        {/* Terms Content */}
        <article className="space-y-12 leading-relaxed" style={{ color: '#aeb9bd' }}>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Shield className="w-5 h-5 text-[#00f0ff]" />
              1. Acceptance of Terms
            </h2>
            <p className="text-lg">
              By accessing and using Xylos AI ("the Platform", "we", "us", "our"), you ("User", "you") agree to be bound by these Terms of Service ("Terms") and our <a href="/privacy" className="text-[#00f0ff] hover:underline">Privacy Policy</a>. If you do not agree with any part of these Terms, you may not use the Platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <FileText className="w-5 h-5 text-[#00f0ff]" />
              2. Description of Service
            </h2>
            <p className="text-lg">
              Xylos AI is an AI-powered content platform that aggregates multiple large language models (including but not limited to Llama, Gemini, and Mistral) to provide chat, content generation, and editorial assistance services. The Platform is provided "as is" and we reserve the right to modify, suspend, or discontinue any aspect of the service at any time without notice.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Lock className="w-5 h-5 text-[#00f0ff]" />
              3. User Accounts & Registration
            </h2>
            <ul className="space-y-3 text-lg list-disc list-inside">
              <li>You must provide accurate, current, and complete information during registration.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must notify us immediately of any unauthorized use of your account.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Scale className="w-5 h-5 text-[#00f0ff]" />
              4. Acceptable Use
            </h2>
            <p className="text-lg">You agree not to use the Platform for:</p>
            <ul className="space-y-3 text-lg list-disc list-inside">
              <li>Any illegal activity or violation of applicable laws</li>
              <li>Generating harmful, abusive, hateful, or discriminatory content</li>
              <li>Infringing intellectual property rights of others</li>
              <li>Attempting to reverse engineer, decompile, or extract source code</li>
              <li>Automated scraping, crawling, or data extraction without permission</li>
              <li>Transmitting malware, viruses, or harmful code</li>
              <li>Impersonating any person or entity</li>
              <li>Interfering with the Platform's security or performance</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <FileText className="w-5 h-5 text-[#00f0ff]" />
              5. Intellectual Property
            </h2>
            <ul className="space-y-3 text-lg list-disc list-inside">
              <li><strong>Our Content:</strong> All Platform content, features, and functionality (excluding User Content) are owned by Xylos AI and protected by international copyright laws.</li>
              <li><strong>User Content:</strong> You retain ownership of content you create using the Platform. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content solely for providing the Platform services.</li>
              <li><strong>AI-Generated Content:</strong> Content generated by AI models through our Platform is provided for your use. We make no ownership claims over AI-generated outputs.</li>
              <li><strong>Feedback:</strong> Any feedback, suggestions, or ideas you provide become our property without compensation.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Shield className="w-5 h-5 text-[#00f0ff]" />
              6. Privacy & Data
            </h2>
            <p className="text-lg">
              Your privacy is important to us. Our <a href="/privacy" className="text-[#00f0ff] hover:underline">Privacy Policy</a> explains how we collect, use, and protect your information. By using the Platform, you consent to our data practices as described in the Privacy Policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <AlertCircle className="w-5 h-5 text-[#00f0ff]" />
              7. Disclaimers & No Warranties
            </h2>
            <p className="text-lg"><strong>THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.</strong></p>
            <ul className="space-y-3 text-lg list-disc list-inside">
              <li>We do not warrant that the Platform will be uninterrupted, error-free, or secure.</li>
              <li>AI-generated content may be inaccurate, incomplete, or inappropriate. You are solely responsible for verifying any content before use.</li>
              <li>We do not endorse or guarantee the accuracy of third-party models integrated into the Platform.</li>
              <li>The Platform is not intended for use in high-risk activities (medical, legal, financial, safety-critical systems).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Scale className="w-5 h-5 text-[#00f0ff]" />
              8. Limitation of Liability
            </h2>
            <p className="text-lg">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, XYLOS AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES, ARISING FROM YOUR USE OF THE PLATFORM. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SERVICE IN THE PRECEDING 12 MONTHS (OR $100 IF NO PAYMENT WAS MADE).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Lock className="w-5 h-5 text-[#00f0ff]" />
              9. Indemnification
            </h2>
            <p className="text-lg">
              You agree to indemnify, defend, and hold harmless Xylos AI and its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorney fees) arising from your use of the Platform, violation of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Clock className="w-5 h-5 text-[#00f0ff]" />
              10. Termination
            </h2>
            <ul className="space-y-3 text-lg list-disc list-inside">
              <li>We may suspend or terminate your access at any time for violation of these Terms.</li>
              <li>You may terminate your account at any time through account settings.</li>
              <li>Upon termination, your right to use the Platform ceases immediately.</li>
              <li>Provisions that should survive termination (IP, disclaimers, liability limits) will remain in effect.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <FileText className="w-5 h-5 text-[#00f0ff]" />
              11. Governing Law & Disputes
            </h2>
            <p className="text-lg">
              These Terms are governed by the laws of the jurisdiction where Xylos AI operates. Any disputes will be resolved through binding arbitration in accordance with applicable arbitration rules, except for injunctive relief which may be sought in courts of competent jurisdiction.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Shield className="w-5 h-5 text-[#00f0ff]" />
              12. Changes to Terms
            </h2>
            <p className="text-lg">
              We may update these Terms from time to time. Material changes will be communicated via email or prominent notice on the Platform. Continued use after changes constitutes acceptance. Please review periodically.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Mail className="w-5 h-5 text-[#00f0ff]" />
              13. Contact
            </h2>
            <p className="text-lg">
              Questions about these Terms? Contact us at <a href="mailto:legal@xylosai.com" className="text-[#00f0ff] hover:underline">legal@xylosai.com</a> or visit our <a href="/contact" className="text-[#00f0ff] hover:underline">Contact page</a>.
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