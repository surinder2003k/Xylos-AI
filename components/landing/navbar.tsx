"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut, Settings } from "lucide-react";

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
    { href: "/chat", label: "Neural Chat" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About Us" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-navbar border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <AnimatedLogo />
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-primary ${
                isActive(link.href)
                  ? "text-white underline underline-offset-4 decoration-primary"
                  : "text-white/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href={user ? "/dashboard" : "/login"}
            className="px-6 py-2.5 rounded-none border border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all text-[10px] font-black uppercase tracking-widest shadow-sm"
          >
            {user ? "Systems" : "Sign In"}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="p-2 rounded-none bg-white/10 text-white border border-white/10"
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
        <div className="glass-card p-8 space-y-6">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className={`text-2xl font-black font-fustat uppercase tracking-tight transition-colors ${
                  isActive(link.href) ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="ml-3 text-[9px] font-black text-primary/60 uppercase tracking-widest align-middle">— Active</span>
                )}
              </Link>
            ))}
          </div>
          
          <div className="pt-6 border-t border-white/10 space-y-4">
            <Link 
              href={user ? "/dashboard" : "/login"}
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-6 py-4 rounded-none bg-primary text-black font-black text-xs uppercase tracking-[0.2em] shadow-lg"
            >
              {user ? "Enter Systems" : "Get Started"}
            </Link>

            {user && (
              <button 
                onClick={async () => {
                  setIsOpen(false);
                  await signOut();
                  router.push('/');
                }}
                className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-none border border-white/10 bg-white/5 text-white/50 hover:text-red-400 transition-all text-xs font-black uppercase tracking-widest"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>

  );
}
