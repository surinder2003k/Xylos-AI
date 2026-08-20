import type { Metadata } from "next";
import { Shield, Lock, Eye, Scale, FileCheck, Database, Code, Users } from "lucide-react";


export const metadata: Metadata = {
  title: "Privacy & Ethics — Xylos AI Governance Standards",
  description: "Learn about Xylos AI's commitment to data privacy, zero-retention policies, and ethical AI development. Our governance standards for a decentralized editorial future.",
  alternates: {
    canonical: 'https://xylosai.vercel.app/privacy',
  },
};

export default function PrivacyPage() {

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0a0b0e', color: '#e2e2e8' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://xylosai.vercel.app" },
              { "@type": "ListItem", "position": 2, "name": "Privacy", "item": "https://xylosai.vercel.app/privacy" }
            ]
          })
        }}
      />

      <main className="relative z-10 pt-32 px-6 pb-20 max-w-4xl mx-auto space-y-16">
        {/* Hero */}
        <header className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-medium tracking-wide" style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}>
            <Shield className="w-3 h-3" />
            Data governance
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
            Privacy &amp; <span style={{ color: '#00f0ff' }}>ethics</span>
          </h1>
          <p className="text-lg font-medium max-w-2xl mx-auto" style={{ color: '#aeb9bd' }}>
            &quot;Trust is the currency of intelligence. Xylos AI is built on a foundation of zero-compromise data integrity.&quot;
          </p>
        </header>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard icon={Lock} title="Zero retention" content="We do not store your chat logs or generated content on our servers for training. Every session is ephemeral and remains your intellectual property." />
          <InfoCard icon={Eye} title="Encryption" content="End-to-end encryption for all data transmissions. Your interactions with elite models pass through secure, audited tunnels." />
          <InfoCard icon={Scale} title="Ethical models" content="We only aggregate models that adhere to safety alignment and ethical AI development standards defined by the open-source community." />
          <InfoCard icon={FileCheck} title="User sovereignty" content="You have full control over your data. Delete your profile or history with a single click — no hidden archives, no recovery lags." />
        </section>

        {/* Privacy Details */}
        <article className="space-y-12 leading-relaxed" style={{ color: '#aeb9bd' }}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Database className="w-5 h-5 text-[#00f0ff]" />
              1. Data collection
            </h2>
            <p className="text-lg">Xylos AI collects minimal metadata required to provide the service. This includes account identifiers and usage logs necessary for system stability. We do NOT monetize user data or sell it to third-party advertisers.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Code className="w-5 h-5 text-[#00f0ff]" />
              2. AI training
            </h2>
            <p className="text-lg">Content synthesized using Xylos AI is NOT used to train the underlying models (Llama, Gemini, Mistral) by default. We leverage API-level privacy flags to ensure your corporate and personal secrets remain private.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Users className="w-5 h-5 text-[#00f0ff]" />
              3. Ethics commitment
            </h2>
            <p className="text-lg">Our editorial engine is tuned to recognize and mitigate bias. While AI can still generate unexpected responses, our 'Aether Intelligence Layer' acts as a secondary filter to maintain professional standards of communication.</p>
          </div>
        </article>

        {/* Footer */}
        <footer className="text-center pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[12px] font-medium" style={{ color: '#5a6c6d' }}>
            Last updated: April 17, 2026
          </p>
        </footer>
      </main>
    </div>
  );
}

function InfoCard({ icon: Icon, title, content }: any) {
  return (
    <div className="p-8 rounded-2xl space-y-4 transition-all group glass-card">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all" style={{ background: 'rgba(0,240,255,0.12)' }}>
        <Icon className="w-6 h-6 text-[#00f0ff]" />
      </div>
      <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>{title}</h3>
      <p className="text-sm font-medium leading-relaxed" style={{ color: '#849495' }}>{content}</p>
    </div>
  );
}
