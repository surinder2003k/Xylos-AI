"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

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
    <div className="w-full max-w-5xl mx-auto my-24 bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
      
      {/* Left Content Area */}
      <div className="relative z-10 w-full md:w-1/2 space-y-6">
        <div className="space-y-4">
          <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Stay ahead with Xylos AI.</h3>
          <p className="text-gray-400 font-medium leading-relaxed max-w-sm">
            Join thousands of professionals who trust Xylos AI for innovative editorial and design intelligence solutions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
              placeholder="Enter your email" 
              className="w-full bg-[#111111] border border-white/10 text-white rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
            />
          </div>
          <button 
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="flex items-center justify-center whitespace-nowrap px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-100 transition-all disabled:opacity-80 disabled:pointer-events-none"
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            ) : status === 'success' ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Subscribed
              </span>
            ) : (
              "Subscribe Now"
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-2 text-xs font-medium ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </div>
        )}
      </div>

      {/* Right Image Area */}
      <div className="relative z-10 w-full md:w-1/2 flex justify-center md:justify-end items-center h-64 md:h-auto perspective-1000">
         {/* Shadow / Back image */}
         <div className="absolute right-0 top-0 md:top-auto md:-right-8 w-[90%] md:w-full max-w-[400px] aspect-video bg-[#1a1a1a] rounded-2xl transform rotate-3 translate-y-4 shadow-xl pointer-events-none" />
         
         {/* Front image */}
         <div className="relative w-[90%] md:w-full max-w-[400px] aspect-video rounded-2xl overflow-hidden shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500 border border-white/10">
           <img 
             src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80" 
             alt="Landscape" 
             className="w-full h-full object-cover"
           />
         </div>
      </div>
    </div>
  );
}
