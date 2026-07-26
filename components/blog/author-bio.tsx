"use client";

import { User, Twitter, Linkedin, Github } from "lucide-react";

interface AuthorBioProps {
  name: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
}

export function AuthorBio({ 
  name, 
  role = "Senior Investigative Analyst", 
  bio = "A specialist in high-fidelity news synthesis and strategic intelligence. Focused on the intersection of human creativity and technical journalism.", 
  avatarUrl 
}: AuthorBioProps) {
  return (
    <div className="mt-12 p-6 md:p-10 rounded-3xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 p-0.5">
            <div className="w-full h-full rounded-[0.9rem] bg-[#0d1117] flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-white/15" />
              )}
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-[#0d1117]" title="Verified Author" />
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-black tracking-tighter uppercase text-white">{name}</h3>
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em]">{role}</p>
          </div>
          
          <p className="text-white/25 text-sm leading-relaxed font-medium max-w-2xl">
            {bio}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
            <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="p-2 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/20 transition-all inline-flex text-white/25" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="p-2 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/20 transition-all inline-flex text-white/25" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="p-2 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/20 transition-all inline-flex text-white/25" aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
