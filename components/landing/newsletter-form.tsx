"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight, Terminal } from "lucide-react";
import Image from "next/image";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      setStatus("success");
      setMessage("Message sent! Check your inbox.");
      setEmail("");
      
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Failed to send message. Please try again.");
      
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-24 bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06] p-6 md:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 font-mono">
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 terminal-scanline pointer-events-none" />

      {/* Left Content Area */}
      <div className="relative z-10 w-full lg:w-1/2 space-y-6 text-center lg:text-left">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#00ff41]/40 text-xs justify-center lg:justify-start">
            <span className="text-[#00d4ff]">$</span>
            <span>subscribe --newsletter</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-[#00ff41] tracking-tight">Stay ahead with Xylos AI.</h3>
          <p className="text-[#00ff41]/25 leading-relaxed max-w-md mx-auto lg:mx-0 text-xs">
            Join thousands of professionals who trust Xylos AI for innovative editorial and design intelligence solutions.
          </p>
        </div>
 
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto lg:mx-0">
          <div className="relative flex-1">
            <input 
              type="email" 
              required
              aria-label="Email address for newsletter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
              placeholder="user@email.com" 
              className="w-full bg-[#00ff41]/[0.03] border border-[#00ff41]/[0.06] text-[#00ff41] py-4 px-6 text-xs focus:outline-none focus:border-[#00ff41]/30 transition-all disabled:opacity-50 placeholder:text-[#00ff41]/15 font-mono"
            />
          </div>
          <button 
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="flex items-center justify-center whitespace-nowrap px-8 py-4 bg-[#00ff41] text-black font-bold text-[10px] uppercase tracking-widest hover:bg-[#00d4ff] hover:shadow-[0_0_30px_rgba(0,255,65,0.3)] transition-all disabled:opacity-80 disabled:pointer-events-none"
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Processing
              </span>
            ) : status === 'success' ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Verified
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Terminal className="w-3 h-3" />
                Subscribe
                <ArrowRight className="w-3 h-3" />
              </span>
            )}
          </button>
        </form>
 
        {message && (
          <div className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${status === 'success' ? 'text-[#27c93f]' : 'text-[#ff5f56]'}`}>
            {message}
          </div>
        )}
      </div>
 
      {/* Right Image Area */}
      <div className="relative z-10 w-full lg:w-1/2 flex justify-center lg:justify-end items-center h-48 sm:h-64 lg:h-auto">
         <div className="relative w-[90%] lg:w-full max-w-[400px] aspect-video overflow-hidden border border-[#00ff41]/[0.06] group">
            <Image 
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" 
              alt="Xylos AI Newsletter — High-tech nature visualization"
              title="Xylos AI Newsletter"
              fill
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-[#0a0e14]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
         </div>
      </div>
    </div>
  );
}
