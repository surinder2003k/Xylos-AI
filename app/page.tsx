import { createClient as createPublicClient } from "@supabase/supabase-js";
import { ArrowRight, ChevronRight, ChevronDown, Terminal, Lock, Eye, Layers } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/reveal";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion-primitives";

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
    <div className="flex flex-col min-h-screen relative overflow-hidden text-white" style={{ background: '#0a0b0e' }}>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

        {/* Subtle ambient depth — single soft radial, very low opacity (luxury, not neon) */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[90vw] max-w-[600px] md:w-[70vw] md:max-w-[900px] h-[60vw] max-h-[400px] md:h-[50vw] md:max-h-[600px] rounded-full blur-[120px] md:blur-[160px]" style={{ background: 'radial-gradient(closest-side, rgba(0,240,255,0.06), transparent)' }} />
        </div>

        {/* ===== HERO ===== */}
        <section className="relative z-10 min-h-screen flex items-center">
          <div className="w-full px-6 md:px-12 lg:px-20 py-24">
            <div className="max-w-5xl mx-auto">
                <StaggerContainer>
                {/* Badge */}
                <StaggerItem>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00f0ff' }} />
                  <span className="text-[11px] font-medium tracking-wide" style={{ color: '#aeb9bd' }}>Free AI, ready when you are</span>
                </div>
                </StaggerItem>

                {/* Heading */}
                <StaggerItem>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold leading-[1.02] tracking-[-0.03em] text-white mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Intelligence,
                  <br />
                  <span style={{ color: '#00f0ff' }}>beautifully simple.</span>
                </h1>
                </StaggerItem>

                {/* Subheading */}
                <StaggerItem>
                <p className="text-lg md:text-xl max-w-xl leading-relaxed mb-10" style={{ color: '#aeb9bd' }}>
                  One calm workspace for 7+ frontier models — Llama, Gemini, Mistral. No clutter, no cost. Just clear, fast answers.
                </p>
                </StaggerItem>

                {/* Buttons */}
                <StaggerItem>
                <div className="flex flex-col sm:flex-row gap-4 mb-16">
                  <Link
                    href="/dashboard/chat"
                    className="group glass-cta flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold"
                  >
                    Start chatting
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/about"
                    className="group glass-outline flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold"
                  >
                    Learn more
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                </StaggerItem>

                {/* Refined stat row */}
                <StaggerItem>
                <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                  {[
                    { value: '7+', label: 'Frontier models' },
                    { value: '99.9%', label: 'Uptime' },
                    { value: '0', label: 'Cost' },
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-2xl font-bold tracking-tight" style={{ color: '#ffffff', fontFamily: 'Sora, sans-serif' }}>{stat.value}</span>
                      <span className="text-[12px] tracking-wide" style={{ color: '#7d8a8e' }}>{stat.label}</span>
                    </div>
                  ))}
                </div>
                </StaggerItem>
                </StaggerContainer>
              </div>
          </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[11px] tracking-wide" style={{ color: '#7d8a8e' }}>Scroll</span>
          <ChevronDown className="w-4 h-4" style={{ color: '#7d8a8e' }} />
        </div>
      </section>

      {/* ===== HARDWARE_FEATURES ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(59, 73, 75, 0.2)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <Reveal>
            <p className="text-[12px] font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: '#00f0ff' }}>Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em]" style={{ color: '#e2e2e8', fontFamily: 'Sora, sans-serif' }}>Built for focused work</h2>
            </Reveal>
          </div>

          <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Frontier Processing */}
            <div className="glass-card rounded-2xl p-8 group hover:border-[rgba(0,240,255,0.18)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="w-5 h-5" style={{ color: '#00f0ff' }} />
                <h3 className="text-xl font-semibold" style={{ color: '#e2e2e8', fontFamily: 'Sora, sans-serif' }}>Frontier Processing</h3>
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#aeb9bd' }}>
                Access the world&apos;s most powerful LLMs including Xylos-7, Prometheus, and Titan-X. Optimized for low-latency command execution.
              </p>
              <div className="flex gap-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-medium" style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff' }}>7+ models</span>
                <span className="px-3 py-1 rounded-full text-[11px] font-medium" style={{ background: 'rgba(255,255,255,0.06)', color: '#aeb9bd' }}>Real-time</span>
              </div>
            </div>

            {/* Encrypted Core */}
            <div className="glass-card rounded-2xl p-8 group hover:border-[rgba(157,140,255,0.18)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5" style={{ color: '#9d8cff' }} />
                <h3 className="text-xl font-semibold" style={{ color: '#e2e2e8', fontFamily: 'Sora, sans-serif' }}>Encrypted Core</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#aeb9bd' }}>
                End-to-end neural encryption. Your prompts never leave the clean zone.
              </p>
            </div>

            {/* Neural Orb */}
            <div className="glass-card rounded-2xl p-8 group hover:border-[rgba(45,212,191,0.18)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-5 h-5" style={{ color: '#2dd4bf' }} />
                <h3 className="text-xl font-semibold" style={{ color: '#e2e2e8', fontFamily: 'Sora, sans-serif' }}>Neural Orb</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#aeb9bd' }}>
                Visual feedback of active compute cycles.
              </p>
            </div>

            {/* Visual Synthesis */}
            <div className="glass-card rounded-2xl p-8 group hover:border-[rgba(245,196,81,0.18)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Layers className="w-5 h-5" style={{ color: '#f5c451' }} />
                <h3 className="text-xl font-semibold" style={{ color: '#e2e2e8', fontFamily: 'Sora, sans-serif' }}>Visual Synthesis</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#aeb9bd' }}>
                Integrated multimodal vision capabilities. Input imagery, receive neural analysis in milliseconds.
              </p>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      {/* ===== CTA: SYSTEM READY ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(59, 73, 75, 0.2)' }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
          <div className="glass-card rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] mb-4" style={{ color: '#ffffff', fontFamily: 'Sora, sans-serif' }}>
              Ready whenever you are.
            </h2>
            <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: '#b9cacb' }}>
              Join the digital vanguard. Elevate your cognitive output with Xylos AI today.
            </p>
            <Link
              href="/chat"
              className="group glass-cta inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold"
            >
              Try Xylos free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          </Reveal>
        </div>
      </section>

      {/* ===== BLOG: LATEST NEURAL BROADCASTS ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(59, 73, 75, 0.2)' }}>
        <div className="max-w-7xl mx-auto">
          <Reveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: '#00f0ff' }}>From the blog</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em]" style={{ color: '#e2e2e8', fontFamily: 'Sora, sans-serif' }}>Latest writing</h2>
            </div>
            <Link href="/blog" className="hidden md:inline-flex items-center gap-2 text-sm font-medium hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          </Reveal>

          <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs?.map((blog, i) => {
              const accents = ['#00f0ff', '#9d8cff', '#2dd4bf'];
              const acc = accents[i % accents.length];
              return (
              <Link key={blog.id} href={`/blog/${blog.slug || blog.id}`} className="group">
                <div className="relative aspect-[16/10] overflow-hidden mb-4 rounded-xl [transform:translateZ(0)]" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <img
                    src={blog.feature_image_url || "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800"}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-medium" style={{ background: 'rgba(255,255,255,0.08)', color: acc }}>{blog.category}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2 group-hover:text-white transition-colors" style={{ color: '#e2e2e8', fontFamily: 'Sora, sans-serif' }}>
                  {blog.title}
                </h3>
                <p className="text-sm line-clamp-2" style={{ color: '#849495' }}>{blog.excerpt}</p>
                <div className="mt-3 flex items-center gap-2 text-[12px]" style={{ color: '#7d8a8e' }}>
                  <span>{blog.profiles?.full_name || 'Xylos Team'}</span>
                  <span>·</span>
                  <span style={{ color: acc }}>Read →</span>
                </div>
              </Link>
              );
            })}
          </div>
          </Reveal>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(59, 73, 75, 0.2)' }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
          <p className="text-[12px] font-semibold uppercase tracking-[0.25em] mb-4 text-center" style={{ color: '#00f0ff' }}>FAQ</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-center mb-16" style={{ color: '#e2e2e8', fontFamily: 'Sora, sans-serif' }}>Frequently asked</h2>
          </Reveal>

          <Reveal>
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
          </Reveal>
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
