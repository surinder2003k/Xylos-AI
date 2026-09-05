import type { Metadata } from "next";
import { Mail, MapPin, MessageSquare, Github, Twitter, Linkedin, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Xylos AI — Get in Touch",
  description: "Contact Xylos AI for partnerships, press inquiries, technical support, or general questions. We're here to help with your AI content and research needs.",
  alternates: {
    canonical: 'https://xylosai.vercel.app/contact',
  },
  openGraph: {
    title: "Contact Xylos AI",
    description: "Get in touch with the Xylos AI team for partnerships, support, or inquiries.",
    url: 'https://xylosai.vercel.app/contact',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Contact Xylos AI' }],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0a0b0e', color: '#e2e2e8' }}>
      <main className="relative z-10 pt-32 px-6 pb-20 max-w-4xl mx-auto space-y-16">
        {/* Hero */}
        <header className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-medium tracking-wide" style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}>
            <MessageSquare className="w-3 h-3" />
            Get in touch
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
            Let&apos;s <span style={{ color: '#00f0ff' }}>connect</span>
          </h1>
          <p className="text-lg font-medium max-w-2xl mx-auto" style={{ color: '#aeb9bd' }}>
            Have questions about Xylos AI? Want to partner with us? Need support? We&apos;d love to hear from you.
          </p>
        </header>

        {/* Contact Methods */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContactCard
            icon={Mail}
            title="Email Us"
            description="For partnerships, press, and general inquiries"
            action={
              <a href="mailto:hello@xylosai.com" className="text-[#00f0ff] hover:underline text-sm font-medium">
                hello@xylosai.com
              </a>
            }
          />
          <ContactCard
            icon={MapPin}
            title="Location"
            description="We operate globally with a distributed team"
            action={
              <span className="text-sm font-medium" style={{ color: '#849495' }}>
                Remote-first, Worldwide
              </span>
            }
          />
          <ContactCard
            icon={Github}
            title="Open Source"
            description="Contribute, report issues, or explore our code"
            action={
              <Link href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="text-[#00f0ff] hover:underline text-sm font-medium flex items-center gap-1">
                GitHub <ArrowUpRight className="w-3 h-3" />
              </Link>
            }
          />
        </section>

        {/* Contact Form */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
            <Mail className="w-5 h-5 text-[#00f0ff]" />
            Send a Message
          </h2>
          <ContactForm />
        </section>

        {/* Social Links */}
        <section className="text-center pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-sm font-medium mb-4" style={{ color: '#849495' }}>Follow our journey</p>
          <div className="flex justify-center gap-4">
            <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl flex items-center justify-center transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Github className="w-5 h-5" style={{ color: '#849495' }} />
            </a>
            <a href="https://twitter.com/xylos_ai" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl flex items-center justify-center transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Twitter className="w-5 h-5" style={{ color: '#849495' }} />
            </a>
            <a href="https://linkedin.com/company/xylos-ai" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl flex items-center justify-center transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Linkedin className="w-5 h-5" style={{ color: '#849495' }} />
            </a>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest mb-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          <a href="/about" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>About</a>
          <a href="/blog" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Blog</a>
          <a href="/contact" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Contact</a>
          <a href="/terms" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Terms</a>
          <a href="/cookies" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Cookies</a>
          <a href="/privacy" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Privacy</a>
        </div>
        <p className="text-[12px] font-medium" style={{ color: '#5a6c6d' }}>
          &copy; {new Date().getFullYear()} Xylos AI. Built with precision.
        </p>
      </footer>
    </div>
  );
}

function ContactCard({ icon: Icon, title, description, action }: any) {
  return (
    <div className="p-8 rounded-2xl space-y-4 transition-all group glass-card">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,240,255,0.12)' }}>
        <Icon className="w-6 h-6 text-[#00f0ff]" />
      </div>
      <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>{title}</h3>
      <p className="text-sm font-medium leading-relaxed" style={{ color: '#849495' }}>{description}</p>
      <div className="pt-2">{action}</div>
    </div>
  );
}