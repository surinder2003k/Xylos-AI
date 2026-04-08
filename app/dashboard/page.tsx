"use client";

import { motion } from "framer-motion";
import { 
  FileText, 
  Code2, 
  Search, 
  Image as ImageIcon, 
  PenTool, 
  Briefcase, 
  Layout, 
  BrainCircuit,
  Plus
} from "lucide-react";
import Link from "next/link";

const tools = [
  { id: "ai-pdf-analyzer", title: "PDF Analyzer", desc: "Extract insights from 256K context documents.", icon: FileText, color: "text-red-500" },
  { id: "ai-code-assistant", title: "Code Assistant", desc: "Polyglot expert for refactoring and debugging.", icon: Code2, color: "text-emerald-500" },
  { id: "ai-research-agent", title: "Research Agent", desc: "Expert deep-dives and cross-referenced synthesis.", icon: Search, color: "text-purple-500" },
  { id: "ai-vision-lab", title: "Vision Lab", desc: "Visual storytelling and layout analysis for diagrams.", icon: ImageIcon, color: "text-orange-500" },
  { id: "ai-content-factory", title: "Content Factory", desc: "Synthesize long-form content into social formats.", icon: PenTool, color: "text-pink-500" },
  { id: "ai-meeting-notes", title: "Drafting Suite", desc: "Transform recordings into polished executive summaries.", icon: Briefcase, color: "text-indigo-500" },
  { id: "ai-model-comparator", title: "Editorial Logic", desc: "Compare multiple perspective streams side-by-side.", icon: Layout, color: "text-cyan-500" },
  { id: "ai-life-coach", title: "Creative Journal", desc: "Private workspace for reflective ideation and drafting.", icon: BrainCircuit, color: "text-rose-500" },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-fustat font-black tracking-tight uppercase leading-none">Your <span className="text-primary italic">Suite</span></h1>
          <p className="text-muted-foreground text-lg">Deploy specialized editorial tools to accelerate your mission.</p>
        </div>
        
        <Link 
          href="/chat"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-foreground text-background font-bold hover:scale-105 transition-all shadow-xl group"
        >
          <Plus className="w-4 h-4" />
          General Workspace
        </Link>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool, idx) => (
          <motion.div 
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link 
              href={`/tools/${tool.id}`}
              className="group flex flex-col h-full p-8 rounded-[2rem] bg-sidebar border border-border/40 hover:border-primary/40 hover:bg-muted/50 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Plus className="w-4 h-4" />
                 </div>
              </div>

              <div className={`p-4 rounded-2xl bg-background border border-border/50 w-fit mb-6 group-hover:scale-110 transition-transform ${tool.color}`}>
                 <tool.icon className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {tool.desc}
              </p>
              
              <div className="mt-8 pt-6 border-t border-border/20 flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-muted-foreground/30">
                 <span>v1.0.2-patch</span>
                 <span className="group-hover:text-primary transition-colors">Open Tool</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
