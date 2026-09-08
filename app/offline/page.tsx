import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline — Xylos AI",
  description: "You are currently offline. Some features of Xylos AI require an internet connection.",
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0a0b0e', color: '#e2e2e8' }}>
      <main className="text-center space-y-8 max-w-md">
        <h1 className="text-4xl md:text-6xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Offline</h1>
        <p className="text-lg" style={{ color: '#aeb9bd' }}>
          You are currently offline. Please reconnect to use all features of Xylos AI.
        </p>
        <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          <a href="/" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Home</a>
          <a href="/about" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>About</a>
          <a href="/blog" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Blog</a>
          <a href="/contact" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Contact</a>
          <a href="/terms" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Terms</a>
          <a href="/cookies" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Cookies</a>
          <a href="/privacy" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Privacy</a>
        </div>
      </main>
    </div>
  );
}
