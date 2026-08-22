"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  Brain,
  ShieldCheck,
  Globe,
  Cpu,
  Layers,
  Fingerprint,
  ArrowRight,
  MessageSquare,
  Code2,
  FileText,
  Zap
} from "lucide-react";
import { NewsletterForm } from "@/components/landing/newsletter-form";

export default function AboutPageClient() {

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0a0b0e', color: '#e2e2e8' }}>
      {/* Subtle ambient depth — single soft cyan radial (matches landing) */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[90vw] max-w-[550px] md:w-[70vw] md:max-w-[800px] h-[60vw] max-h-[350px] md:h-[50vw] md:max-h-[500px] rounded-full blur-[120px] md:blur-[160px]" style={{ background: 'radial-gradient(closest-side, rgba(0,240,255,0.05), transparent)' }} />
      </div>
      </div>

      <main className="relative z-10 pt-32 px-6 pb-20 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-medium tracking-wide"
            style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.2)', color: '#00f0ff' }}
          >
            <Sparkles className="w-3 h-3" />
            About Xylos
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.05] text-white"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              AI and human intelligence,<br />
              <span style={{ color: '#00f0ff' }}>working in harmony.</span>
            </motion.h1>
            <p className="text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed" style={{ color: '#849495' }}>
              Xylos AI is a calm, decentralized workspace that augments human creativity with industrial-grade artificial intelligence.
            </p>
          </div>
        </div>

        {/* Content Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] flex items-center gap-4 text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                <Cpu aria-hidden="true" className="w-7 h-7" style={{ color: '#00f0ff' }} />
                The protocol
              </h2>
              <p className="leading-loose text-lg" style={{ color: '#aeb9bd' }}>
                At the core of Xylos AI lies the <span className="text-white font-semibold">Aether Intelligence Layer</span>. This stack aggregates multi-model responses from Gemini, Llama, and Mistral, refining them through a specialized editorial filter to produce content that feels organic, authoritative, and precise.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FeatureCard
                icon={Fingerprint}
                title="Unique identity"
                desc="Every interaction is unique, ensuring no two narratives are identical."
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Secure core"
                desc="Enterprise-grade encryption protecting your intellectual property."
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="aspect-video rounded-3xl p-1 overflow-hidden glass-card">
               <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
                    alt="Neural network visualization showing AI interconnected nodes"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform [transform:translateZ(0)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-12 text-center">
                    <p className="text-lg sm:text-2xl font-semibold tracking-[-0.01em] text-white leading-relaxed" style={{ fontFamily: 'Sora, sans-serif' }}>
                      &quot;Bridging the gap between logic and human expression.&quot;
                    </p>
                  </div>
               </div>
            </div>

            {/* Float Badge */}
            <div className="absolute -bottom-6 -left-6 p-4 sm:p-6 rounded-2xl" style={{ background: 'rgba(12, 14, 18, 0.85)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,240,255,0.12)' }}>
                  <Brain className="w-6 h-6" style={{ color: '#00f0ff' }} />
                </div>
                <div>
                  <p className="text-[12px] font-medium" style={{ color: '#849495' }}>Active nodes</p>
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>4,821</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="sm:col-span-2 md:col-span-2 p-8 sm:p-10 rounded-2xl glass-card"
          >
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'rgba(0,240,255,0.12)' }}>
                <MessageSquare className="w-8 h-8" style={{ color: '#00f0ff' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>Unified AI chat</h3>
                <p className="text-lg leading-relaxed" style={{ color: '#849495' }}>Access 7+ models including Gemini, Claude, Llama, and Mistral in a single interface.</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-5xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>7+</p>
                <p className="text-[12px] font-medium" style={{ color: '#849495' }}>Models</p>
              </div>
            </div>
          </motion.div>

          <FeatureBento icon={Code2} title="Code assistant" desc="Full-stack development tools powered by AI." />
          <FeatureBento icon={FileText} title="Content factory" desc="Blog & social media content generation." />
          <FeatureBento icon={Zap} title="Smart tools" desc="12+ specialized AI tools for productivity." />
        </div>

        {/* Vision Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-24">
          <StatBox label="Execution time" value="< 2.4s" />
          <StatBox label="Neural accuracy" value="99.9%" />
          <StatBox label="Global reach" value="Syncing" />
        </div>

        {/* Mission Statement */}
        <section className="p-8 sm:p-12 md:p-24 text-center space-y-8 relative overflow-hidden rounded-3xl" style={{ background: 'rgba(0,240,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
           <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.02em] text-white relative z-10" style={{ fontFamily: 'Sora, sans-serif' }}>Our mission</h2>
           <p className="text-lg sm:text-xl md:text-3xl font-medium max-w-4xl mx-auto leading-tight relative z-10" style={{ color: '#aeb9bd' }}>
             Xylos was founded on a singular premise: that technology should empower human expression, not replace it. We are building the infrastructure for the next century of digital storytelling.
           </p>
        </section>

        {/* Newsletter */}
        <NewsletterForm />
      </main>

      <footer className="py-12 px-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-[12px] font-medium" style={{ color: '#5a6c6d' }}>
          &copy; 2026 Xylos AI
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl transition-all duration-300 group glass-card">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#00f0ff] group-hover:bg-[rgba(0,240,255,0.16)] transition-all duration-300 mb-4" style={{ background: 'rgba(0,240,255,0.1)' }}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-semibold text-sm mb-2 text-white" style={{ fontFamily: 'Sora, sans-serif' }}>{title}</h3>
      <p className="text-xs leading-relaxed" style={{ color: '#849495' }}>{desc}</p>
    </div>
  );
}

function FeatureBento({ icon: Icon, title, desc }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 sm:p-10 rounded-2xl glass-card"
    >
      <div className="relative z-10 space-y-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0,240,255,0.12)' }}>
          <Icon className="w-8 h-8" style={{ color: '#00f0ff' }} />
        </div>
        <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>{title}</h3>
        <p className="leading-relaxed" style={{ color: '#849495' }}>{desc}</p>
      </div>
    </motion.div>
  );
}

function StatBox({ label, value }: any) {
  return (
    <div className="p-6 sm:p-8 rounded-2xl text-center space-y-2 transition-all duration-300 cursor-default group glass-card">
      <p className="text-[12px] font-medium" style={{ color: '#849495' }}>{label}</p>
      <p className="text-3xl sm:text-4xl font-bold text-white group-hover:text-[#00f0ff] transition-colors" style={{ fontFamily: 'Sora, sans-serif' }}>{value}</p>
    </div>
  );
}
