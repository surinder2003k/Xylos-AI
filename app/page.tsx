import { createClient as createPublicClient } from "@supabase/supabase-js";
import { ArrowRight, Code2, FileText, Shield, Zap, Globe, MessageSquare, ChevronRight, Brain, ChevronDown, Terminal, Lock, Eye, Cpu, Radio, Layers } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const NewsletterForm = dynamic(() => import("@/components/landing/newsletter-form").then(m => m.NewsletterForm));

export const revalidate = 1800;

export default async function LandingPage() {
  const publicSupabase = createPublicClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: blogsData } = await publicSupabase
    .from("blogs")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  let blogs = blogsData;
  if (blogsData && blogsData.length > 0) {
    const authorIds = [...new Set(blogsData.map(b => b.author_id))];
    const { data: profiles } = await publicSupabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", authorIds);
    blogs = blogsData.map(blog => ({
      ...blog,
      profiles: profiles?.find(p => p.user_id === blog.author_id)
    }));
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Xylos AI completely free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Xylos AI aggregates top free AI models like Llama 3, Gemini, and Mistral, allowing you to use them without subscription costs.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the best free alternative to ChatGPT?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Xylos AI acts as a superior free ChatGPT alternative by giving you access to 7 different top-tier AI models in one premium workspace.'
        }
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden text-white" style={{ background: '#0c0e12' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Scanlines overlay */}
      <div className="fixed inset-0 z-50 scanlines opacity-30" />
      
      {/* Noise texture overlay */}
      <div className="fixed inset-0 z-40 noise-texture" />

      {/* Ambient neon glow */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0" style={{ background: '#0c0e12' }} />
        <div className="absolute top-[-200px] left-1/4 w-[700px] h-[700px] rounded-full blur-[220px]" style={{ background: 'rgba(0, 240, 255, 0.04)' }} />
        <div className="absolute bottom-[-200px] right-1/3 w-[600px] h-[600px] rounded-full blur-[200px]" style={{ background: 'rgba(0, 153, 255, 0.03)' }} />
        <div className="absolute top-1/2 left-[-100px] w-[500px] h-[500px] rounded-full blur-[180px]" style={{ background: 'rgba(0, 240, 255, 0.03)' }} />
      </div>

      {/* ===== HERO ===== */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="w-full px-6 md:px-12 lg:px-20 py-24">
          <div className="max-w-6xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ border: '1px solid rgba(0, 240, 255, 0.2)', background: 'rgba(0, 240, 255, 0.05)' }}>
              <Radio className="w-3 h-3 animate-neon-pulse" style={{ color: '#00f0ff' }} />
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace' }}>Neural Link Established</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-black leading-[0.9] tracking-[-0.04em] text-white mb-8" style={{ fontFamily: 'Sora, sans-serif' }}>
              UNLEASH THE GHOST
              <br />
              <span className="neon-glow-cyan" style={{ color: '#00f0ff' }}>IN THE MACHINE.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg max-w-xl leading-relaxed mb-10" style={{ color: '#b9cacb' }}>
              Premium access to 7+ frontier models. Xylos AI delivers high-compute intelligence through a high-precision noir interface.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                href="/dashboard/chat"
                className="group glass-cta flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-wider"
              >
                Initialize Protocol
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="group glass-outline flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-wider"
              >
                View Specs
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* System Status Bar */}
            <div className="glass-panel rounded-xl p-4 flex flex-wrap items-center gap-6 mb-16">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace' }}>SYSTEM_STATUS</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-neon-pulse" style={{ background: '#00f0ff' }} />
                <span className="text-[11px] uppercase tracking-wider" style={{ color: '#b9cacb', fontFamily: 'JetBrains Mono, monospace' }}>LATENCY: 12ms</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00ff88' }} />
                <span className="text-[11px] uppercase tracking-wider" style={{ color: '#b9cacb', fontFamily: 'JetBrains Mono, monospace' }}>UPTIME: 99.99%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-neon-pulse" style={{ background: '#00f0ff' }} />
                <span className="text-[11px] uppercase tracking-wider" style={{ color: '#b9cacb', fontFamily: 'JetBrains Mono, monospace' }}>CORE: XYLOS-v7.1</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '1.2B', label: 'PARAMETERS_SYNSAPSED' },
                { value: '0.02ms', label: 'CORE_LATENCY' },
                { value: '99.9%', label: 'UPTIME_RELIABILITY' },
                { value: '7+', label: 'FRONTIER_MODELS' },
              ].map((stat, i) => (
                <div key={i} className="glass-panel rounded-xl p-5 cyber-border-tr">
                  <p className="text-3xl font-black mb-1 neon-glow-cyan" style={{ color: '#00f0ff', fontFamily: 'Sora, sans-serif' }}>{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: '#849495', fontFamily: 'JetBrains Mono, monospace' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[9px] uppercase tracking-widest" style={{ color: '#849495', fontFamily: 'JetBrains Mono, monospace' }}>Scroll</span>
          <ChevronDown className="w-4 h-4" style={{ color: '#849495' }} />
        </div>
      </section>

      {/* ===== HARDWARE_FEATURES ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(59, 73, 75, 0.2)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4" style={{ color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace' }}>HARDWARE_FEATURES</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Frontier Processing */}
            <div className="glass-panel rounded-xl p-8 cyber-border-tr group hover:border-[rgba(0,240,255,0.2)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="w-5 h-5" style={{ color: '#00f0ff' }} />
                <h3 className="text-xl font-bold" style={{ color: '#e2e2e8', fontFamily: 'Sora, sans-serif' }}>Frontier Processing</h3>
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#b9cacb' }}>
                Access the world&apos;s most powerful LLMs including Xylos-7, Prometheus, and Titan-X. Optimized for low-latency command execution.
              </p>
              <div className="flex gap-3">
                <span className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider" style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace' }}>7+ MODELS</span>
                <span className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider" style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace' }}>REAL-TIME</span>
              </div>
            </div>

            {/* Encrypted Core */}
            <div className="glass-panel rounded-xl p-8 cyber-border-tr group hover:border-[rgba(0,240,255,0.2)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5" style={{ color: '#00f0ff' }} />
                <h3 className="text-xl font-bold" style={{ color: '#e2e2e8', fontFamily: 'Sora, sans-serif' }}>Encrypted Core</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#b9cacb' }}>
                End-to-end neural encryption. Your prompts never leave the clean zone.
              </p>
            </div>

            {/* Neural Orb */}
            <div className="glass-panel rounded-xl p-8 cyber-border-tr group hover:border-[rgba(0,240,255,0.2)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-5 h-5 animate-neon-pulse" style={{ color: '#00f0ff' }} />
                <h3 className="text-xl font-bold" style={{ color: '#e2e2e8', fontFamily: 'Sora, sans-serif' }}>Neural Orb</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#b9cacb' }}>
                Visual feedback of active compute cycles.
              </p>
            </div>

            {/* Visual Synthesis */}
            <div className="glass-panel rounded-xl p-8 cyber-border-tr group hover:border-[rgba(0,240,255,0.2)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Layers className="w-5 h-5" style={{ color: '#00f0ff' }} />
                <h3 className="text-xl font-bold" style={{ color: '#e2e2e8', fontFamily: 'Sora, sans-serif' }}>Visual Synthesis</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#b9cacb' }}>
                Integrated multimodal vision capabilities. Input imagery, receive neural analysis in milliseconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA: SYSTEM READY ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(59, 73, 75, 0.2)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel rounded-2xl overflow-hidden p-12 md:p-16 text-center cyber-border-tr">
            <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em] mb-4 neon-glow-cyan" style={{ color: '#00f0ff', fontFamily: 'Sora, sans-serif' }}>
              System ready for deployment.
            </h2>
            <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: '#b9cacb' }}>
              Join the digital vanguard. Elevate your cognitive output with Xylos AI today.
            </p>
            <Link
              href="/chat"
              className="group glass-cta inline-flex items-center gap-3 px-10 py-5 text-sm font-bold uppercase tracking-wider"
            >
              Establish Connection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BLOG: LATEST NEURAL BROADCASTS ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(59, 73, 75, 0.2)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4" style={{ color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace' }}>LATEST_BROADCASTS</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em]" style={{ color: '#e2e2e8', fontFamily: 'Sora, sans-serif' }}>From the Neural Core</h2>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-[#00f0ff] transition-colors" style={{ color: '#849495', fontFamily: 'JetBrains Mono, monospace' }}>
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs?.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug || blog.id}`} className="group">
                <div className="relative aspect-[16/10] overflow-hidden mb-4 rounded-xl cyber-border-tr" style={{ background: 'rgba(0,240,255,0.02)', border: '1px solid rgba(59, 73, 75, 0.2)' }}>
                  <img
                    src={blog.feature_image_url || "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm" style={{ background: 'rgba(0, 240, 255, 0.2)', color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace' }}>{blog.category}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2 group-hover:text-[#00f0ff] transition-colors" style={{ color: '#e2e2e8', fontFamily: 'Sora, sans-serif' }}>
                  {blog.title}
                </h3>
                <p className="text-sm line-clamp-2" style={{ color: '#849495' }}>{blog.excerpt}</p>
                <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: '#5a6c6d', fontFamily: 'JetBrains Mono, monospace' }}>
                  <span>{blog.profiles?.full_name || 'Xylos Team'}</span>
                  <span>·</span>
                  <span style={{ color: '#00f0ff' }}>Decode →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(59, 73, 75, 0.2)' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 text-center" style={{ color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace' }}>NEURAL_FAQ</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-center mb-16" style={{ color: '#e2e2e8', fontFamily: 'Sora, sans-serif' }}>Frequently Asked Protocols</h2>

          <div className="space-y-4">
            {[
              {
                q: 'Is Xylos AI completely free?',
                a: 'Yes, Xylos AI aggregates top free AI models like Llama 3, Gemini, and Mistral, allowing you to use them without subscription costs. Premium access, zero fees.'
              },
              {
                q: 'What is the best free alternative to ChatGPT?',
                a: 'Xylos AI acts as a superior free ChatGPT alternative by giving you access to 7 different top-tier AI models in one premium workspace — all without paying a cent.'
              },
              {
                q: 'Which AI models does Xylos AI support?',
                a: 'Xylos AI routes your queries across 7+ frontier models including Llama 3.3, Gemini 2.5, Mistral Large, and specialized fine-tuned variants. The system auto-selects the optimal model for your task.'
              },
              {
                q: 'How does Xylos AI ensure data privacy?',
                a: 'Enterprise-grade encryption protects your prompts end-to-end. Our zero-retention policy means your data never leaves the secure pipeline — no storage, no training on your conversations.'
              },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl overflow-hidden transition-all duration-300" style={{ border: '1px solid rgba(59, 73, 75, 0.2)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-[rgba(0,240,255,0.02)] transition-colors">
                  <span className="text-base font-bold pr-4" style={{ color: '#e2e2e8', fontFamily: 'Sora, sans-serif' }}>{faq.q}</span>
                  <ChevronDown className="w-5 h-5 shrink-0 group-open:rotate-180 transition-transform" style={{ color: '#00f0ff' }} />
                </summary>
                <div className="px-6 pb-6">
                  <p style={{ color: '#849495' }}>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <NewsletterForm />

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 py-12 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(59, 73, 75, 0.2)', background: 'rgba(0,0,0,0.3)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#849495', fontFamily: 'JetBrains Mono, monospace' }}>Xylos AI</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-[10px] uppercase tracking-widest hover:text-[#00f0ff] transition-colors" style={{ color: '#849495', fontFamily: 'JetBrains Mono, monospace' }}>About</Link>
              <Link href="/blog" className="text-[10px] uppercase tracking-widest hover:text-[#00f0ff] transition-colors" style={{ color: '#849495', fontFamily: 'JetBrains Mono, monospace' }}>Blog</Link>
              <Link href="/privacy" className="text-[10px] uppercase tracking-widest hover:text-[#00f0ff] transition-colors" style={{ color: '#849495', fontFamily: 'JetBrains Mono, monospace' }}>Privacy</Link>
            </div>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: '#849495', fontFamily: 'JetBrains Mono, monospace' }}>© 2026 Xylos Foundation</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
