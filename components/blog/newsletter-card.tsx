"use client";

import { Send, BellRing, Sparkles } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";

export function NewsletterCard() {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error('Subscribe failed');
      showToast("Subscription successful! Welcome to the circle.", "success");
      setEmail("");
    } catch {
      showToast("Subscription failed. Please try again.", "error");
    }
  };

  return (
    <div className="mt-8 p-8 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(59, 73, 75, 0.15), rgba(12, 14, 18, 0.6))', border: '1px solid rgba(59, 73, 75, 0.2)' }}>
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles className="w-32 h-32 text-[#ff3131]" />
      </div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3 text-[#ff3131]">
            <BellRing className="w-5 h-5 animate-bounce" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Editorial Intelligence</span>
          </div>
          <h3 className="text-3xl font-black tracking-tighter uppercase leading-tight text-white">
            Stay Ahead of the <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent italic">Curve</span>
          </h3>
          <p className="text-gray-400 text-sm font-medium max-w-md">
            Join 12,000+ top strategists getting weekly human-curated editorial insights and deep-dives directly in their inbox.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email..." 
            className="px-6 py-4 rounded-xl focus:outline-none focus:ring-2 font-medium text-sm w-full sm:min-w-[300px] text-white placeholder:text-gray-500"
            style={{ background: 'rgba(59, 73, 75, 0.15)', border: '1px solid rgba(59, 73, 75, 0.2)' }}
            required
          />
          <button 
            type="submit"
            className="px-8 py-4 rounded-xl bg-[#ff3131] text-white font-bold uppercase text-xs tracking-widest hover:bg-[#ff5e00] transition-all flex items-center justify-center gap-2"
          >
            Join Elite <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
}
