"use client";

import { Send, BellRing, Sparkles } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";

export function NewsletterCard() {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast("Subscription successful! Welcome to the circle.", "success");
    setEmail("");
  };

  return (
    <div className="mt-12 p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 via-card to-background border border-primary/20 shadow-lg relative overflow-hidden group animate-in zoom-in duration-700">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles className="w-32 h-32 text-primary" />
      </div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3 text-primary">
            <BellRing className="w-5 h-5 animate-bounce" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono">Editorial Intelligence</span>
          </div>
          <h3 className="text-3xl font-black font-fustat tracking-tighter uppercase leading-tight">
            Stay Ahead of the <span className="text-primary italic">Curve</span>
          </h3>
          <p className="text-muted-foreground text-sm font-medium max-w-md">
            Join 12,000+ top strategists getting weekly human-curated editorial insights and deep-dives directly in their inbox.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email..." 
            className="px-6 py-4 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium text-sm min-w-[300px]"
            required
          />
          <button 
            type="submit"
            className="px-8 py-4 rounded-xl bg-primary text-black font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-neon flex items-center justify-center gap-2"
          >
            Join Elite <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
}
