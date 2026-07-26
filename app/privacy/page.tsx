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
    <div className="min-h-screen bg-[#0d1117] text-white selection:bg-emerald-500/30 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/[0.04] rounded-full blur-[150px]" />
      </div>

      <main className="relative z-10 pt-32 px-6 pb-20 max-w-4xl mx-auto space-y-16">
        {/* Hero */}
        <header className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            <Shield className="w-3 h-3" />
            Data Governance v2.0
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
            Privacy & <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">Ethics</span>
          </h1>
          <p className="text-white/25 text-lg font-medium max-w-2xl mx-auto">
            &quot;Trust is the currency of intelligence. Xylos AI is built on a foundation of zero-compromise data integrity.&quot;
          </p>
        </header>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard 
            icon={Lock} 
            title="Zero Retention" 
            content="We do not store your chat logs or generated content on our servers for training. Every session is ephemeral and remains your intellectual property."
            color="violet"
          />
          <InfoCard 
            icon={Eye} 
            title="Encryption" 
            content="End-to-end encryption for all data transmissions. Your interactions with elite models pass through secure, audited tunnels."
            color="cyan"
          />
          <InfoCard 
            icon={Scale} 
            title="Ethical Models" 
            content="We only aggregate models that adhere to safety alignment and ethical AI development standards defined by the open-source community."
            color="pink"
          />
          <InfoCard 
            icon={FileCheck} 
            title="User Sovereignty" 
            content="You have full control over your data. Delete your profile or history with a single click — no hidden archives, no recovery lags."
            color="violet"
          />
        </section>

        {/* Privacy Details */}
        <article className="space-y-12 text-white/25 leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Database className="w-5 h-5 text-emerald-400" />
              1. Data Collection
            </h2>
            <p className="text-lg">Xylos AI collects minimal metadata required to provide the service. This includes account identifiers and usage logs necessary for system stability. We do NOT monetize user data or sell it to third-party advertisers.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Code className="w-5 h-5 text-amber-400" />
              2. AI Training
            </h2>
            <p className="text-lg">Content synthesized using Xylos AI is NOT used to train the underlying models (Llama, Gemini, Mistral) by default. We leverage API-level privacy flags to ensure your corporate and personal secrets remain private.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Users className="w-5 h-5 text-emerald-400" />
              3. Ethics Commitment
            </h2>
            <p className="text-lg">Our editorial engine is tuned to recognize and mitigate bias. While AI can still generate unexpected responses, our &apos;Aether Intelligence Layer&apos; acts as a secondary filter to maintain professional standards of communication.</p>
          </div>
        </article>

        {/* Footer */}
        <footer className="text-center pt-10 border-t border-white/[0.05]">
          <p className="text-[10px] font-bold text-white/15 uppercase tracking-[0.4em]">
            Last Updated: April 17, 2026 // Xylos Legal Division
          </p>
        </footer>
      </main>
    </div>
  );
}

function InfoCard({ icon: Icon, title, content, color }: any) {
  const colorMap: Record<string, string> = {
    violet: "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20",
    cyan: "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20",
    pink: "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20",
  };
  const borderMap: Record<string, string> = {
    violet: "hover:border-emerald-500/20",
    cyan: "hover:border-amber-500/20",
    pink: "hover:border-emerald-500/20",
  };

  return (
    <div className={`p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] space-y-4 ${borderMap[color]} transition-all group`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${colorMap[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-black uppercase tracking-tight text-white">{title}</h3>
      <p className="text-sm text-white/25 font-medium leading-relaxed">{content}</p>
    </div>
  );
}
