"use client";

import { Send, BellRing, Terminal } from "lucide-react";
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
    <div className="mt-8 p-8 bg-gradient-to-br from-[#00ff41]/[0.06] via-[#00ff41]/[0.02] to-transparent border border-[#00ff41]/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <Terminal className="w-32 h-32 text-[#00ff41]" />
      </div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3 text-[#00ff41]">
            <BellRing className="w-5 h-5 animate-bounce" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Editorial Intelligence</span>
          </div>
          <h3 className="text-2xl font-black tracking-tighter uppercase leading-tight text-[#00ff41]">
            Stay Ahead of the <span className="text-[#00d4ff] italic">Curve</span>
          </h3>
          <p className="text-[#00ff41]/25 text-xs font-medium max-w-md">
            Join 12,000+ top strategists getting weekly human-curated editorial insights and deep-dives directly in their inbox.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@email.com" 
            className="px-6 py-4 bg-[#00ff41]/[0.03] border border-[#00ff41]/[0.06] focus:outline-none focus:border-[#00ff41]/30 font-medium text-xs w-full sm:min-w-[300px] text-[#00ff41] placeholder:text-[#00ff41]/15 font-mono"
            required
          />
          <button 
            type="submit"
            className="px-8 py-4 bg-[#00ff41] text-black font-bold uppercase text-xs tracking-widest hover:bg-[#00d4ff] hover:shadow-[0_0_30px_rgba(0,255,65,0.3)] transition-all flex items-center justify-center gap-2"
          >
            Join Elite <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
}
