import type { Metadata } from "next";
import { Shield, Lock, Eye, Gavel, Scale, FileCheck } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Privacy & Ethics — Xylos AI Governance Standards",
  description: "Learn about Xylos AI's commitment to data privacy, zero-retention policies, and ethical AI development. Our governance standards for a decentralized editorial future.",
  alternates: {
    canonical: 'https://xylosai.vercel.app/privacy',
  },
};

export default async function PrivacyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative overflow-hidden">
      <Navbar user={user} />
      
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-10">
         <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full" />
      </div>

      <main className="relative z-10 pt-48 px-6 pb-20 max-w-4xl mx-auto space-y-20">
        <header className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
            <Shield className="w-3 h-3" />
            Data Governance v2.0
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-fustat uppercase tracking-tighter italic">
            Privacy & <span className="text-primary">Ethics</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto italic">
            "Trust is the currency of intelligence. Xylos AI is built on a foundation of zero-compromise data integrity."
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InfoCard 
            icon={Lock} 
            title="Zero Retention" 
            content="We do not store your chat logs or generated content on our servers for training. Every session is ephemeral and remains your intellectual property."
          />
          <InfoCard 
            icon={Eye} 
            title="Encryption" 
            content="End-to-end encryption for all data transmissions. Your interactions with elite models pass through secure, audited tunnels."
          />
          <InfoCard 
            icon={Scale} 
            title="Ethical Models" 
            content="We only aggregate models that adhere to safety alignment and ethical AI development standards defined by the open-source community."
          />
          <InfoCard 
            icon={FileCheck} 
            title="User Sovereignty" 
            content="You have full control over your data. Delete your profile or history with a single click — no hidden archives, no recovery lags."
          />
        </section>

        <article className="prose dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight font-fustat">1. Data Collection</h2>
            <p>Xylos AI collects minimal metadata required to provide the service. This includes account identifiers and usage logs necessary for system stability. We do NOT monetize user data or sell it to third-party advertisers.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight font-fustat">2. AI Training</h2>
            <p>Content synthesized using Xylos AI is NOT used to train the underlying models (Llama, Gemini, Mistral) by default. We leverage API-level privacy flags to ensure your corporate and personal secrets remain private.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight font-fustat">3. Ethics Commitment</h2>
            <p>Our editorial engine is tuned to recognize and mitigate bias. While AI can still generate unexpected responses, our 'Aether Intelligence Layer' acts as a secondary filter to maintain professional standards of communication.</p>
          </div>
        </article>

        <footer className="text-center pt-10 border-t border-border/50">
          <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.4em]">
            Last Updated: April 17, 2026 // Xylos Legal Division
          </p>
        </footer>
      </main>
    </div>
  );
}

function InfoCard({ icon: Icon, title, content }: any) {
  return (
    <div className="p-8 rounded-3xl bg-card/40 border border-border backdrop-blur-md space-y-4 hover:border-primary/20 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-black uppercase font-fustat tracking-tight italic">{title}</h3>
      <p className="text-sm text-muted-foreground font-medium leading-relaxed">{content}</p>
    </div>
  );
}
