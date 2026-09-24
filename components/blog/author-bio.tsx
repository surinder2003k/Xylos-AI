"use client";

import { User } from "lucide-react";

interface AuthorBioProps {
  name: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
}

export function AuthorBio({ 
  name, 
  role = "Editorial Team",
  bio = "The Xylos AI editorial team covers practical developments in artificial intelligence, software and emerging technology — tested, verified and written for real users.",
  avatarUrl 
}: AuthorBioProps) {
  return (
    <div className="mt-12 p-6 md:p-10 rounded-2xl relative overflow-hidden" style={{ background: 'rgba(20, 21, 24, 0.6)', border: '1px solid rgba(190, 184, 170, 0.2)' }}>
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#36b7b0] to-[#368fa3] p-0.5">
            <div className="w-full h-full rounded-[0.85rem] bg-[#141518] flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-gray-600" />
              )}
            </div>
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#14171c', border: '1px solid rgba(54,183,176,0.35)' }} title="Verified Author">
            <span className="w-2 h-2 rounded-full" style={{ background: '#36b7b0' }} />
          </div>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-black tracking-tighter uppercase text-white">{name}</h3>
            <p className="text-xs font-bold text-[#36b7b0] uppercase tracking-[0.2em]">{role}</p>
          </div>
          
          <p className="text-gray-400 text-sm leading-relaxed font-medium max-w-2xl">
            {bio}
          </p>
        </div>
      </div>
    </div>
  );
}
