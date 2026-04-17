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
  Fingerprint
} from "lucide-react";
import { NewsletterForm } from "@/components/landing/newsletter-form";



export default function AboutPageClient() {

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative overflow-hidden">

      
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-primary/20 blur-[150px] rounded-full" />
         <div className="absolute bottom-[20%] right-[5%] w-[40%] h-[40%] bg-secondary/15 blur-[150px] rounded-full" />
      </div>

      <main className="relative z-10 pt-48 px-6 pb-20 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <Sparkles className="w-3 h-3" />
            Neural Genesis
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-8xl font-black font-fustat tracking-tighter uppercase leading-tight">
              NEURAL <span className="text-primary italic">SYNTHESIS</span><br />
              AND HUMAN <span className="underline decoration-secondary decoration-8 underline-offset-8">INTEL</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
              Xylos AI is more than just a platform—it's a decentralized editorial engine designed to augment human creativity with industrial-grade artificial intelligence.
            </p>
          </div>
        </div>

        {/* Content Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-40">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold font-outfit uppercase tracking-tight flex items-center gap-4">
                <Cpu className="w-8 h-8 text-primary" />
                The Protocol
              </h2>
              <p className="text-muted-foreground leading-loose text-lg">
                At the core of Xylos AI lies the <span className="text-foreground font-bold">Aether Intelligence Layer</span>. This proprietary stack aggregates multi-model responses from Gemini, Llama, and Mistral, refining them through a specialized editorial filter to produce content that feels organic, authoritative, and precise.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
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
            <div className="aspect-video rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-background to-secondary/10 border border-border p-1 overflow-hidden shadow-2xl group">
               <div className="w-full h-full rounded-[2.4rem] overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80" 
                    alt="Neural Network Visualization showing AI interconnected nodes" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                  <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                    <p className="text-2xl font-black font-fustat uppercase tracking-widest text-white leading-relaxed italic">
                      "Bridging the gap between binary logic and human emotion."
                    </p>
                  </div>
               </div>
            </div>
            
            {/* Float Badge */}
            <div className="absolute -bottom-6 -left-6 bg-card border border-border p-6 rounded-3xl shadow-2xl backdrop-blur-xl animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">Active nodes</p>
                  <p className="text-2xl font-bold font-fustat">4,821</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Vision Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
          <StatBox label="Execution Time" value="< 2.4s" />
          <StatBox label="Neural Accuracy" value="99.9%" />
          <StatBox label="Global Reach" value="Syncing" />
        </div>

        {/* Mission Statement */}
        <section className="bg-muted/30 border border-border rounded-[3rem] p-12 md:p-24 text-center space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-5">
              <Layers className="w-64 h-64 text-primary" />
           </div>
           
           <h2 className="text-3xl md:text-5xl font-black font-fustat uppercase italic underline decoration-primary decoration-4 underline-offset-8">Our Mission</h2>
           <p className="text-xl md:text-3xl font-bold font-outfit text-foreground/80 max-w-4xl mx-auto leading-tight italic">
             Xylos was founded on a singular premise: that technology should empower human expression, not replace it. We are building the infrastructure for the next century of digital storytelling.
           </p>
        </section>

        {/* Newsletter Component */}
        <NewsletterForm />
      </main>

      <footer className="py-12 px-6 border-t border-border text-center">
        <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.4em]">
          &copy; 2026 Xylos AI Research Systems // All Rights Reserved
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="bg-card border border-border p-6 rounded-3xl hover:border-primary/30 transition-all group">
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all mb-4">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-bold text-sm uppercase tracking-widest mb-2">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function StatBox({ label, value }: any) {
  return (
    <div className="bg-card border border-border p-8 rounded-[2rem] text-center space-y-2 hover:scale-105 transition-transform cursor-default group">
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">{label}</p>
      <p className="text-4xl font-black font-fustat text-foreground group-hover:text-primary transition-colors">{value}</p>
    </div>
  );
}
