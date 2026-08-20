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
  FileText
} from "lucide-react";
import { NewsletterForm } from "@/components/landing/newsletter-form";

export default function AboutPageClient() {

  return (
    <div className="min-h-screen selection:bg-red-500/30 relative overflow-hidden" style={{ background: '#0c0e12', color: '#e2e2e8' }}>

      {/* Background glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-500/6 rounded-full blur-[120px]" />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(rgba(0,240,255,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <main className="relative z-10 pt-32 px-6 pb-20 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.3em]"
            style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.2)', color: '#00f0ff' }}
          >
            <Sparkles className="w-3 h-3" />
            Neural Genesis
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-tight text-white">
              XYLOS AI: NEURAL SYNTHESIS<br />
              <span className="bg-gradient-to-r from-[#00f0ff] via-[#0099ff] to-[#00f0ff] bg-clip-text text-transparent">AND HUMAN INTELLIGENCE</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
              Xylos AI is more than just a platform — it&apos;s a decentralized editorial engine designed to augment human creativity with industrial-grade artificial intelligence.
            </p>
          </div>
        </div>

        {/* Content Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight flex items-center gap-4 text-white">
                <Cpu aria-hidden="true" className="w-8 h-8 text-red-500" />
                The Protocol
              </h2>
              <p className="text-gray-400 leading-loose text-lg">
                At the core of Xylos AI lies the <span className="text-white font-bold">Aether Intelligence Layer</span>. This proprietary stack aggregates multi-model responses from Gemini, Llama, and Mistral, refining them through a specialized editorial filter to produce content that feels organic, authoritative, and precise.
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-video rounded-3xl p-1 overflow-hidden group" style={{ background: 'rgba(12, 14, 18, 0.6)', border: '1px solid rgba(59, 73, 75, 0.2)' }}>
               <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80" 
                    alt="Neural Network Visualization showing AI interconnected nodes" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-12 text-center">
                    <p className="text-lg sm:text-2xl font-black uppercase tracking-widest text-white leading-relaxed">
                      &quot;Bridging the gap between binary logic and human emotion.&quot;
                    </p>
                  </div>
               </div>
            </div>
            
            {/* Float Badge */}
            <div className="absolute -bottom-6 -left-6 p-4 sm:p-6 rounded-2xl" style={{ background: 'rgba(12, 14, 18, 0.8)', border: '1px solid rgba(59, 73, 75, 0.2)' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Active nodes</p>
                  <p className="text-2xl font-black text-white">4,821</p>
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
            className="sm:col-span-2 md:col-span-2 p-8 sm:p-10 rounded-2xl relative overflow-hidden"
            style={{ background: 'rgba(12, 14, 18, 0.6)', border: '1px solid rgba(59, 73, 75, 0.2)' }}
          >
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">
                <MessageSquare className="w-8 h-8 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white mb-2">Unified AI Chat</h3>
                <p className="text-gray-400 text-lg leading-relaxed">Access 7+ models including Gemini, Claude, Llama, and Mistral in a single interface.</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-5xl font-black text-white">7+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Models</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="p-8 sm:p-10 rounded-2xl relative overflow-hidden"
            style={{ background: 'rgba(12, 14, 18, 0.6)', border: '1px solid rgba(59, 73, 75, 0.2)' }}
          >
            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                <Code2 className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-black text-white">Code Assistant</h3>
              <p className="text-gray-400 leading-relaxed">Full-stack development tools powered by AI.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="p-8 sm:p-10 rounded-2xl relative overflow-hidden"
            style={{ background: 'rgba(12, 14, 18, 0.6)', border: '1px solid rgba(59, 73, 75, 0.2)' }}
          >
            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                <FileText className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-black text-white">Content Factory</h3>
              <p className="text-gray-400 leading-relaxed">Blog & social media content generation.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="p-8 sm:p-10 rounded-2xl relative overflow-hidden"
            style={{ background: 'rgba(12, 14, 18, 0.6)', border: '1px solid rgba(59, 73, 75, 0.2)' }}
          >
            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
                <Zap className="w-8 h-8 text-[#00f0ff]" />
              </div>
              <h3 className="text-xl font-black text-white">Smart Tools</h3>
              <p className="text-gray-400 leading-relaxed">12+ specialized AI tools for productivity.</p>
            </div>
          </motion.div>
        </div>

        {/* Vision Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-24">
          <StatBox label="Execution Time" value="< 2.4s" />
          <StatBox label="Neural Accuracy" value="99.9%" />
          <StatBox label="Global Reach" value="Syncing" />
        </div>

        {/* Mission Statement */}
        <section className="p-8 sm:p-12 md:p-24 text-center space-y-8 relative overflow-hidden rounded-3xl" style={{ background: 'rgba(255, 49, 49, 0.03)', border: '1px solid rgba(59, 73, 75, 0.2)' }}>
           <h2 className="text-3xl md:text-5xl font-black uppercase text-white relative z-10">Our Mission</h2>
           <p className="text-lg sm:text-xl md:text-3xl font-bold text-gray-400 max-w-4xl mx-auto leading-tight relative z-10">
             Xylos was founded on a singular premise: that technology should empower human expression, not replace it. We are building the infrastructure for the next century of digital storytelling.
           </p>
        </section>

        {/* Newsletter */}
        <NewsletterForm />
      </main>

      <footer className="py-12 px-6 text-center" style={{ borderTop: '1px solid rgba(59, 73, 75, 0.2)' }}>
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.4em]">
          &copy; 2026 Xylos AI Research Systems // All Rights Reserved
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl transition-all duration-300 group" style={{ background: 'rgba(12, 14, 18, 0.6)', border: '1px solid rgba(59, 73, 75, 0.2)' }}>
      <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-[#00f0ff] group-hover:bg-red-500/30 transition-all duration-300 mb-4">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-black text-sm uppercase tracking-widest mb-2 text-white">{title}</h3>
      <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function StatBox({ label, value }: any) {
  return (
    <div className="p-6 sm:p-8 rounded-2xl text-center space-y-2 transition-all duration-300 cursor-default group" style={{ background: 'rgba(12, 14, 18, 0.6)', border: '1px solid rgba(59, 73, 75, 0.2)' }}>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">{label}</p>
      <p className="text-3xl sm:text-4xl font-black text-white group-hover:text-[#00f0ff] transition-colors">{value}</p>
    </div>
  );
}
