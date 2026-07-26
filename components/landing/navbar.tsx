"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";

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
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl border-b transition-all duration-300" style={{ background: 'rgba(20,16,8,0.85)', borderColor: 'rgba(245,158,11,0.08)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <AnimatedLogo />
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-amber-400 ${
                isActive(link.href)
                  ? "text-white"
                  : "text-gray-500"
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
            className="px-6 py-2.5 rounded-xl border bg-white/5 text-gray-300 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all text-[10px] font-bold uppercase tracking-widest shadow-sm"
            style={{ borderColor: 'rgba(245,158,11,0.15)' }}
          >
            {user ? "Systems" : "Sign In"}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="p-2 rounded-xl border"
            style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.1)', color: 'rgba(255,255,255,0.6)' }}
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
        <div className="p-8 rounded-2xl shadow-lg space-y-6" style={{ background: 'rgba(20,16,8,0.95)', border: '1px solid rgba(245,158,11,0.1)' }}>
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className={`text-2xl font-black uppercase tracking-tight transition-colors ${
                  isActive(link.href) ? "text-white" : "text-gray-500 hover:text-white"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="ml-3 text-[9px] font-bold text-amber-400 uppercase tracking-widest align-middle">— Active</span>
                )}
              </Link>
            ))}
          </div>
          
          <div className="pt-6 space-y-4" style={{ borderTop: '1px solid rgba(245,158,11,0.1)' }}>
            <Link 
              href={user ? "/dashboard" : "/login"}
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-6 py-4 rounded-xl bg-amber-500 text-white font-bold text-xs uppercase tracking-[0.2em]"
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
                className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl border bg-white/5 text-gray-400 hover:text-red-500 transition-all text-xs font-bold uppercase tracking-widest"
                style={{ borderColor: 'rgba(245,158,11,0.1)' }}
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
