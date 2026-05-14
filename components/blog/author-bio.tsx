"use client";

import { User, Twitter, Linkedin, Github } from "lucide-react";
import Image from "next/image";

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
    <div className="mt-24 p-6 md:p-10 rounded-[2.5rem] bg-card border border-border shadow-sm backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5 animate-in fade-in duration-1000">
            <div className="w-full h-full rounded-[0.9rem] bg-background flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-primary/40" />
              )}
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-background" title="Verified Author" />
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-black font-fustat tracking-tighter uppercase">{name}</h3>
            <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">{role}</p>
          </div>
          
          <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-2xl">
            {bio}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
            <button className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-black transition-all cursor-pointer">
              <Twitter className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-black transition-all cursor-pointer">
              <Linkedin className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-black transition-all cursor-pointer">
              <Github className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
