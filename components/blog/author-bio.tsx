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
    <div className="mt-12 p-6 md:p-10 bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00ff41]/[0.02] to-transparent" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-[#00ff41] to-[#00d4ff] p-0.5">
            <div className="w-full h-full bg-[#0a0e14] flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-[#00ff41]/15" />
              )}
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#27c93f] border-4 border-[#0a0e14]" title="Verified Author" />
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <h3 className="text-xl font-black tracking-tighter uppercase text-[#00ff41]">{name}</h3>
            <p className="text-[10px] font-bold text-[#00d4ff] uppercase tracking-[0.2em]">{role}</p>
          </div>
          
          <p className="text-[#00ff41]/25 text-xs leading-relaxed font-medium max-w-2xl">
            {bio}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
            <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#00ff41]/[0.03] border border-[#00ff41]/[0.06] hover:bg-[#00ff41]/20 hover:text-[#00ff41] hover:border-[#00ff41]/20 transition-all inline-flex text-[#00ff41]/25" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#00ff41]/[0.03] border border-[#00ff41]/[0.06] hover:bg-[#00ff41]/20 hover:text-[#00ff41] hover:border-[#00ff41]/20 transition-all inline-flex text-[#00ff41]/25" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#00ff41]/[0.03] border border-[#00ff41]/[0.06] hover:bg-[#00ff41]/20 hover:text-[#00ff41] hover:border-[#00ff41]/20 transition-all inline-flex text-[#00ff41]/25" aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
