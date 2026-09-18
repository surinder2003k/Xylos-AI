import Link from "next/link";
import { XylosLogo } from "@/components/premium/xylos-logo";
import { ArrowLeft, Cpu, MessageSquare, Search, FileText, Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ background: '#0a0b0e', color: '#e2e2e8' }}>
      {/* Subtle ambient depth */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[90vw] max-w-[700px] h-[400px] md:h-[500px] rounded-full blur-[120px] md:blur-[160px]" style={{ background: 'radial-gradient(closest-side, rgba(0,240,255,0.05), transparent)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-10 max-w-xl flex-1 py-12">
        <XylosLogo size={48} className="text-[#00f0ff]" />

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-medium tracking-wide" style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}>
            <Cpu className="w-3 h-3" />
            Error 404
          </div>

          <h1 className="text-[7rem] sm:text-[8rem] font-bold leading-none tracking-[-0.04em]" style={{ fontFamily: 'Sora, sans-serif' }}>
            <span className="text-white">4</span>
            <span style={{ color: '#00f0ff' }}>0</span>
            <span className="text-white">4</span>
          </h1>

          <p className="text-lg text-gray-400 font-medium leading-relaxed">
            This page doesn&apos;t exist. The link you followed may be broken or the page may have moved.
          </p>
        </div>

        {/* Search the blog */}
        <form action="/blog" method="get" className="w-full flex items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5a6c6d' }} />
            <input
              type="text"
              name="q"
              placeholder="Search the blog…"
              className="w-full py-3.5 pl-11 pr-4 rounded-xl text-sm text-white placeholder:text-[#5a6c6d] focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/40 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,73,75,0.3)' }}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-widest transition-all"
            style={{ background: '#00f0ff', color: '#04141a' }}
          >
            Search
          </button>
        </form>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl glass-cta font-semibold text-sm transition-all w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <Link
            href="/chat"
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl glass-outline font-semibold text-sm transition-all w-full sm:w-auto"
          >
            <MessageSquare className="w-4 h-4" />
            Open chat
          </Link>
        </div>

        {/* Popular destinations */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/blog', label: 'AI Blog', icon: FileText },
            { href: '/tools', label: 'Free Tools', icon: Wrench },
            { href: '/about', label: 'About', icon: Cpu },
            { href: '/contact', label: 'Contact', icon: MessageSquare },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl text-[11px] font-semibold text-gray-400 hover:text-white transition-all group"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,73,75,0.2)' }}
            >
              <item.icon className="w-4 h-4 text-gray-500 group-hover:text-[#00f0ff] transition-colors" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-8 px-6 text-center w-full" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          <a href="/about" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>About</a>
          <a href="/blog" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Blog</a>
          <a href="/contact" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Contact</a>
          <a href="/terms" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Terms</a>
          <a href="/cookies" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Cookies</a>
          <a href="/privacy" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Privacy</a>
        </div>
        <p className="text-[12px] font-medium" style={{ color: '#5a6c6d' }}>
          &copy; {new Date().getFullYear()} Xylos AI
        </p>
      </footer>
    </div>
  );
}
