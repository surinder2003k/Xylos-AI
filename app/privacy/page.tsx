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
    <div className="min-h-screen relative overflow-hidden selection:bg-red-500/30" style={{ background: '#0c0e12', color: '#e2e2e8' }}>

      <main className="relative z-10 pt-32 px-6 pb-20 max-w-4xl mx-auto space-y-16">
        {/* Hero */}
        <header className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.3em]" style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}>
            <Shield className="w-3 h-3" />
            Data Governance v2.0
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
            Privacy & <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Ethics</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">
            &quot;Trust is the currency of intelligence. Xylos AI is built on a foundation of zero-compromise data integrity.&quot;
          </p>
        </header>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard 
            icon={Lock} 
            title="Zero Retention" 
            content="We do not store your chat logs or generated content on our servers for training. Every session is ephemeral and remains your intellectual property."
            color="amber"
          />
          <InfoCard 
            icon={Eye} 
            title="Encryption" 
            content="End-to-end encryption for all data transmissions. Your interactions with elite models pass through secure, audited tunnels."
            color="orange"
          />
          <InfoCard 
            icon={Scale} 
            title="Ethical Models" 
            content="We only aggregate models that adhere to safety alignment and ethical AI development standards defined by the open-source community."
            color="amber"
          />
          <InfoCard 
            icon={FileCheck} 
            title="User Sovereignty" 
            content="You have full control over your data. Delete your profile or history with a single click — no hidden archives, no recovery lags."
            color="orange"
          />
        </section>

        {/* Privacy Details */}
        <article className="space-y-12 text-gray-400 leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Database className="w-5 h-5 text-red-500" />
              1. Data Collection
            </h2>
            <p className="text-lg">Xylos AI collects minimal metadata required to provide the service. This includes account identifiers and usage logs necessary for system stability. We do NOT monetize user data or sell it to third-party advertisers.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Code className="w-5 h-5 text-orange-500" />
              2. AI Training
            </h2>
            <p className="text-lg">Content synthesized using Xylos AI is NOT used to train the underlying models (Llama, Gemini, Mistral) by default. We leverage API-level privacy flags to ensure your corporate and personal secrets remain private.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Users className="w-5 h-5 text-red-500" />
              3. Ethics Commitment
            </h2>
            <p className="text-lg">Our editorial engine is tuned to recognize and mitigate bias. While AI can still generate unexpected responses, our &apos;Aether Intelligence Layer&apos; acts as a secondary filter to maintain professional standards of communication.</p>
          </div>
        </article>

        {/* Footer */}
        <footer className="text-center pt-10" style={{ borderTop: '1px solid rgba(59, 73, 75, 0.2)' }}>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.4em]">
            Last Updated: April 17, 2026 // Xylos Legal Division
          </p>
        </footer>
      </main>
    </div>
  );
}

function InfoCard({ icon: Icon, title, content, color }: any) {
  const colorMap: Record<string, string> = {
    amber: "bg-red-500/10 text-red-500",
    orange: "bg-orange-500/10 text-orange-500",
  };
  const borderHover: Record<string, string> = {
    amber: "hover:border-red-500/20",
    orange: "hover:border-orange-500/20",
  };

  return (
    <div className={`p-8 rounded-2xl space-y-4 transition-all group ${borderHover[color]}`} style={{ background: 'rgba(12,14,18,0.6)', border: '1px solid rgba(59, 73, 75, 0.2)' }}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${colorMap[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-black uppercase tracking-tight text-white">{title}</h3>
      <p className="text-sm text-gray-400 font-medium leading-relaxed">{content}</p>
    </div>
  );
}
