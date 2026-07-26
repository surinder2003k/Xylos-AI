"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
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
    <div className="w-full max-w-5xl mx-auto my-24 p-6 md:p-12 rounded-3xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12" style={{ background: 'rgba(20,16,8,0.6)', border: '1px solid rgba(245,158,11,0.08)' }}>
      
      {/* Left Content Area */}
      <div className="relative z-10 w-full lg:w-1/2 space-y-6 text-center lg:text-left">
        <div className="space-y-4">
          <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">Stay ahead with Xylos AI.</h3>
          <p className="text-gray-400 leading-relaxed max-w-md mx-auto lg:mx-0">
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
              className="w-full rounded-xl py-4 px-6 text-sm focus:outline-none focus:ring-2 transition-all disabled:opacity-50 placeholder:text-gray-500 text-white"
              style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.12)', focusRingColor: 'rgba(245,158,11,0.2)' }}
            />
          </div>
          <button 
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="flex items-center justify-center whitespace-nowrap px-8 py-4 rounded-xl bg-amber-500 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all disabled:opacity-80 disabled:pointer-events-none"
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing
              </span>
            ) : status === 'success' ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Verified
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Subscribe
                <ArrowRight className="w-3 h-3" />
              </span>
            )}
          </button>
        </form>
 
        {message && (
          <div className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </div>
        )}
      </div>
 
      {/* Right Image Area */}
      <div className="relative z-10 w-full lg:w-1/2 flex justify-center lg:justify-end items-center h-48 sm:h-64 lg:h-auto">
         <div className="relative w-[90%] lg:w-full max-w-[400px] aspect-video rounded-2xl overflow-hidden group" style={{ border: '1px solid rgba(245,158,11,0.1)' }}>
           <Image 
             src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" 
             alt="Xylos AI Newsletter — High-tech nature visualization"
             title="Xylos AI Newsletter"
             fill
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
             sizes="(max-width: 768px) 100vw, 400px"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
         </div>
      </div>
    </div>
  );
}
