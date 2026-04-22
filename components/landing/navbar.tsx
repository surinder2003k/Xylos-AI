"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { AnimatedLogo } from "@/components/premium/animated-logo";

interface NavbarProps {
  user: any;
}

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/chat", label: "Neural Chat" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About Us" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <nav className="fixed top-0 w-full z-50 px-4 py-4 md:px-6 md:py-6 transition-all duration-300">
      <div className="max-w-4xl mx-auto flex items-center justify-between bg-card/40 backdrop-blur-3xl border border-border/50 rounded-2xl px-4 py-2 md:px-6 md:py-3 shadow-2xl shadow-black/5">
        
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group/logo cursor-pointer"
          onMouseEnter={() => {
            const audio = new Audio("/sounds/anime-ahh.mp3");
            audio.play().catch(e => console.log("Audio play blocked:", e));
          }}
        >
          <AnimatedLogo />
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-primary ${
                isActive(link.href)
                  ? "text-primary underline underline-offset-4 decoration-primary/40"
                  : "text-muted-foreground/60"
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
            className="px-6 py-2.5 rounded-xl border border-border bg-background hover:border-primary/50 transition-all text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-primary/20"
          >
            {user ? "Systems" : "Sign In"}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full px-4 pt-2 md:hidden"
          >
            <div className="bg-background/95 backdrop-blur-3xl border border-border rounded-[2rem] p-8 shadow-2xl space-y-6">
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    onClick={() => setIsOpen(false)}
                    className={`text-2xl font-black font-fustat uppercase tracking-tight transition-colors ${
                      isActive(link.href) ? "text-primary" : "hover:text-primary"
                    }`}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span className="ml-3 text-[9px] font-black text-primary/60 uppercase tracking-widest align-middle">— Active</span>
                    )}
                  </Link>
                ))}
              </div>
              
              <div className="pt-6 border-t border-border">
                <Link 
                  href={user ? "/dashboard" : "/login"}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-6 py-4 rounded-2xl bg-primary text-black font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
                >
                  {user ? "Enter Systems" : "Get Started"}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
