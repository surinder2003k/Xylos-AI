"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Brain, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Cpu,
  Layers,
  Fingerprint,
  ArrowRight,
  MessageSquare,
  Code2,
  FileText,
  Terminal
} from "lucide-react";
import { NewsletterForm } from "@/components/landing/newsletter-form";



export default function AboutPageClient() {

  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#00ff41] selection:bg-[#00ff41]/20 relative overflow-hidden font-mono">

      <main className="relative z-10 pt-32 px-6 pb-20 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#00ff41]/10 border border-[#00ff41]/20 text-[#00ff41] text-[10px] font-bold uppercase tracking-[0.3em]"
          >
            <Sparkles className="w-3 h-3" />
            Neural Genesis
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight text-[#00ff41]">
              XYLOS AI: NEURAL SYNTHESIS<br />
              <span className="text-[#00d4ff]">AND HUMAN INTELLIGENCE</span>
            </h1>
            <p className="text-[#00ff41]/25 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
              Xylos AI is more than just a platform — it&apos;s a decentralized editorial engine designed to augment human creativity with industrial-grade artificial intelligence.
            </p>
          </div>
        </div>

        {/* Content Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 text-[#00ff41]">
                <Cpu aria-hidden="true" className="w-6 h-6 text-[#00ff41]" />
                The Protocol
              </h2>
              <p className="text-[#00ff41]/25 leading-loose text-lg">
                At the core of Xylos AI lies the <span className="text-[#00ff41] font-bold">Aether Intelligence Layer</span>. This proprietary stack aggregates multi-model responses from Gemini, Llama, and Mistral, refining them through a specialized editorial filter to produce content that feels organic, authoritative, and precise.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FeatureCard 
                icon={Fingerprint}
                title="Unique Identity"
                desc="Every interaction is unique, ensuring no two narratives are identical."
              />
              <FeatureCard 
                icon={ShieldCheck}
                title="Secure Core"
                desc="Enterprise-grade encryption protecting your intellectual property."
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06] p-1 overflow-hidden shadow-md group">
               <div className="w-full h-full overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80" 
                    alt="Neural Network Visualization showing AI interconnected nodes" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-[#0a0e14]/50 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                    <p className="text-xl font-black uppercase tracking-widest text-[#00ff41] leading-relaxed">
                      &quot;Bridging the gap between binary logic and human emotion.&quot;
                    </p>
                  </div>
               </div>
            </div>
            
            {/* Float Badge */}
            <div className="absolute -bottom-6 -left-6 bg-[#0a0e14] backdrop-blur-xl border border-[#00ff41]/[0.06] p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#00ff41]/10 flex items-center justify-center text-[#00ff41]">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#00ff41]/25">active_nodes</p>
                  <p className="text-2xl font-black text-[#00ff41]">4,821</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06] p-10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ff41]/[0.03] via-transparent to-transparent" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-16 h-16 bg-[#00ff41]/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-8 h-8 text-[#00ff41]" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-[#00ff41] mb-2">Unified AI Chat</h3>
                <p className="text-[#00ff41]/25 text-lg leading-relaxed">Access 7+ models including Gemini, Claude, Llama, and Mistral in a single interface.</p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-5xl font-black text-[#00ff41]">7+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#00ff41]/25">models</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06] p-10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/[0.03] via-transparent to-transparent" />
            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 bg-[#00d4ff]/10 flex items-center justify-center">
                <Code2 className="w-8 h-8 text-[#00d4ff]" />
              </div>
              <h3 className="text-xl font-black text-[#00ff41]">Code Assistant</h3>
              <p className="text-[#00ff41]/25 leading-relaxed">Full-stack development tools powered by AI.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06] p-10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ff41]/[0.03] via-transparent to-transparent" />
            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 bg-[#00ff41]/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-[#00ff41]" />
              </div>
              <h3 className="text-xl font-black text-[#00ff41]">Content Factory</h3>
              <p className="text-[#00ff41]/25 leading-relaxed">Blog & social media content generation.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06] p-10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ff41]/[0.03] via-transparent to-transparent" />
            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 bg-[#00ff41]/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-[#00ff41]" />
              </div>
              <h3 className="text-xl font-black text-[#00ff41]">Smart Tools</h3>
              <p className="text-[#00ff41]/25 leading-relaxed">12+ specialized AI tools for productivity.</p>
            </div>
          </motion.div>
        </div>

        {/* Vision Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-24">
          <StatBox label="execution_time" value="< 2.4s" />
          <StatBox label="neural_accuracy" value="99.9%" />
          <StatBox label="global_reach" value="syncing" />
        </div>

        {/* Mission Statement */}
        <section className="bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06] p-12 md:p-24 text-center space-y-8 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-[#00ff41]/[0.02] via-transparent to-[#00d4ff]/[0.02]" />
           <h2 className="text-3xl md:text-5xl font-black uppercase text-[#00ff41] relative z-10">// our_mission</h2>
           <p className="text-xl md:text-3xl font-bold text-[#00ff41]/40 max-w-4xl mx-auto leading-tight relative z-10">
             Xylos was founded on a singular premise: that technology should empower human expression, not replace it. We are building the infrastructure for the next century of digital storytelling.
           </p>
        </section>

        {/* Newsletter */}
        <NewsletterForm />
      </main>

      <footer className="py-12 px-6 border-t border-[#00ff41]/[0.06] text-center">
        <p className="text-[10px] font-bold text-[#00ff41]/15 uppercase tracking-[0.4em]">
          &copy; 2026 Xylos AI Research Systems // All Rights Reserved
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06] p-6 hover:border-[#00ff41]/20 transition-all duration-300 group">
      <div className="w-10 h-10 bg-[#00ff41]/10 flex items-center justify-center text-[#00ff41] group-hover:bg-[#00ff41]/20 transition-all duration-300 mb-4">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-black text-sm uppercase tracking-widest mb-2 text-[#00ff41]">{title}</h3>
      <p className="text-xs text-[#00ff41]/25 leading-relaxed">{desc}</p>
    </div>
  );
}

function StatBox({ label, value }: any) {
  return (
    <div className="bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06] p-8 text-center space-y-2 transition-all duration-300 hover:border-[#00ff41]/20 cursor-default group">
      <p className="text-[10px] font-bold text-[#00ff41]/25 uppercase tracking-[0.3em]">{label}</p>
      <p className="text-4xl font-black text-[#00ff41] group-hover:text-[#00d4ff] transition-colors">{value}</p>
    </div>
  );
}
