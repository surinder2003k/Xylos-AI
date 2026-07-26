"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut, Terminal } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { AnimatedLogo } from "@/components/premium/animated-logo";
import { signOut } from "@/app/auth/actions";

interface NavbarProps {
  user: any;
}

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: "/chat", label: "neural_chat" },
    { href: "/blog", label: "blog" },
    { href: "/about", label: "about_us" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0a0e14]/90 backdrop-blur-xl border-b border-[#00ff41]/[0.06] transition-all duration-300 font-mono">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <AnimatedLogo />
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-[#00ff41] ${
                isActive(link.href)
                  ? "text-[#00ff41]"
                  : "text-[#00ff41]/25"
              }`}
            >
              {isActive(link.href) && <span className="text-[#00d4ff]/40 mr-1">$</span>}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href={user ? "/dashboard" : "/login"}
            className="px-6 py-2.5 border border-[#00ff41]/10 bg-[#00ff41]/[0.02] text-[#00ff41]/50 hover:bg-[#00ff41] hover:text-black hover:border-[#00ff41] transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            <Terminal className="w-3 h-3 inline mr-2" />
            {user ? "systems" : "sign_in"}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="p-2 border border-[#00ff41]/10 bg-[#00ff41]/[0.02] text-[#00ff41]/50"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`absolute top-full left-0 w-full px-4 pt-2 md:hidden transition-all duration-300 ease-out transform ${
          isOpen 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-[#0a0e14] backdrop-blur-xl border border-[#00ff41]/10 p-8 space-y-6">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className={`text-xl font-black uppercase tracking-tight transition-colors ${
                  isActive(link.href) ? "text-[#00ff41]" : "text-[#00ff41]/25 hover:text-[#00ff41]"
                }`}
              >
                {isActive(link.href) && <span className="text-[#00d4ff]/40 mr-2">$</span>}
                {link.label}
                {isActive(link.href) && (
                  <span className="ml-3 text-[9px] font-bold text-[#00d4ff] uppercase tracking-widest align-middle">— active</span>
                )}
              </Link>
            ))}
          </div>
          
          <div className="pt-6 border-t border-[#00ff41]/[0.06] space-y-4">
            <Link 
              href={user ? "/dashboard" : "/login"}
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-6 py-4 bg-[#00ff41] text-black font-bold text-xs uppercase tracking-[0.2em]"
            >
              <Terminal className="w-4 h-4 inline mr-2" />
              {user ? "enter_systems" : "get_started"}
            </Link>

            {user && (
              <button 
                onClick={async () => {
                  setIsOpen(false);
                  await signOut();
                  router.push('/');
                }}
                className="flex items-center justify-center gap-3 w-full px-6 py-4 border border-[#00ff41]/10 bg-[#00ff41]/[0.02] text-[#00ff41]/25 hover:text-[#ff5f56] hover:border-[#ff5f56]/30 transition-all text-xs font-bold uppercase tracking-widest"
              >
                <LogOut className="w-4 h-4" />
                sign_out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>

  );
}
