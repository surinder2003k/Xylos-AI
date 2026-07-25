"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
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
    <div className="w-full max-w-5xl mx-auto my-24 glass-card p-6 md:p-12 transition-all duration-300 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 group">
      
      {/* Left Content Area */}
      <div className="relative z-10 w-full lg:w-1/2 space-y-6 text-center lg:text-left">
        <div className="space-y-4">
          <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">Stay ahead with Xylos AI.</h3>
          <p className="text-white/50 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
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
              placeholder="Enter your email" 
              className="w-full bg-white/5 border border-white/10 text-white rounded-none py-4 px-6 text-sm focus:outline-none focus:border-primary/50 transition-all disabled:opacity-50 font-bold uppercase tracking-widest placeholder:text-white/30"
            />
          </div>
          <button 
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="flex items-center justify-center whitespace-nowrap px-8 py-4 rounded-none bg-primary text-black font-black text-[10px] uppercase tracking-widest hover:shadow-[0_0_30px_rgba(210,187,255,0.3)] border border-primary/40 transition-all disabled:opacity-80 disabled:pointer-events-none"
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
              "Subscribe"
            )}
          </button>
        </form>
 
        {message && (
          <div className={`mt-2 text-[10px] font-black uppercase tracking-widest ${status === 'success' ? 'text-primary' : 'text-pink-400'}`}>
            {message}
          </div>
        )}
      </div>
 
      {/* Right Image Area */}
      <div className="relative z-10 w-full lg:w-1/2 flex justify-center lg:justify-end items-center h-48 sm:h-64 lg:h-auto">
         {/* Shadow / Back image */}
         <div className="absolute right-0 top-0 lg:top-auto lg:-right-8 w-[90%] lg:w-full max-w-[400px] aspect-video bg-white/5 rounded-none border border-white/10 pointer-events-none opacity-50 lg:opacity-100" />
         
         {/* Front image */}
         <div className="relative w-[90%] lg:w-full max-w-[400px] aspect-video rounded-none overflow-hidden border border-white/10 group">
           <Image 
             src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" 
             alt="Xylos AI Newsletter — High-tech nature visualization"
             title="Xylos AI Newsletter"
             fill
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
             sizes="(max-width: 768px) 100vw, 400px"
           />
           <div className="absolute inset-0 bg-primary/5 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
         </div>
      </div>
    </div>
  );
}
