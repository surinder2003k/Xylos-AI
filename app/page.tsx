import { createClient as createPublicClient } from "@supabase/supabase-js";
import { ArrowRight, Code2, FileText, Shield, Sparkles, Zap, Globe, MessageSquare, ChevronRight, Brain, Cpu, Lock, ChevronDown, Terminal, Brackets, Hash } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatedLogo } from "@/components/premium/animated-logo";

const HeroCTA = dynamic(() => import("@/components/landing/hero-cta").then(m => m.HeroCTA));
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
    <div className="flex flex-col min-h-screen relative overflow-hidden text-green-400 selection:bg-green-500/30 font-mono" style={{ background: '#0a0e14' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Scanlines */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 4px)'
      }} />

      {/* CRT vignette */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)'
      }} />

      {/* ===== HERO ===== */}
      <section className="relative z-10 min-h-screen flex items-center">
        {/* Terminal window chrome */}
        <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-3">
          <div className="max-w-6xl mx-auto flex items-center gap-2 px-4 py-2 rounded-t-lg" style={{ background: '#1a1f2e', borderBottom: '1px solid #2a3040' }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-[11px] text-gray-500 ml-4 font-mono">xylos-ai — bash — 80×24</span>
          </div>
        </div>

        <div className="w-full px-6 md:px-12 lg:px-20 pt-20 pb-24">
          <div className="max-w-6xl mx-auto">
            {/* Terminal prompt */}
            <div className="mb-8 font-mono text-sm">
              <span className="text-gray-500">$</span>
              <span className="text-green-400 ml-2">./launch_xylos_ai</span>
              <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: Text */}
              <div className="space-y-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black leading-[0.9] tracking-[-0.02em] text-white" style={{ fontFamily: 'monospace' }}>
                  <span className="text-green-400">&gt;</span> XYLOS
                  <br />
                  <span className="text-green-400">&gt;</span> FREE_AI
                  <br />
                  <span className="text-green-400">&gt;</span> <span className="text-cyan-400">CHAT</span>
                </h1>

                <div className="space-y-2 font-mono text-sm">
                  <p className="text-gray-500">// Access 7+ AI models in one terminal</p>
                  <p className="text-gray-500">// Zero cost. Zero limits. Pure signal.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/chat"
                    className="group flex items-center justify-center gap-3 px-8 py-4 bg-green-500 text-black font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                  >
                    <Terminal className="w-4 h-4" />
                    EXECUTE
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/about"
                    className="group flex items-center justify-center gap-3 px-8 py-4 border border-green-500/30 text-green-400 font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-300"
                  >
                    DOCS
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex gap-12 pt-8 border-t border-green-500/10 font-mono">
                  <div>
                    <p className="text-3xl font-black text-white">7+</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">MODELS</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">$0</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">COST</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">24/7</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">UPTIME</p>
                  </div>
                </div>
              </div>

              {/* Right: Terminal Visual */}
              <div className="hidden lg:block">
                <div className="rounded-lg overflow-hidden" style={{ background: '#0d1117', border: '1px solid #21262d' }}>
                  {/* Terminal header */}
                  <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#161b22', borderBottom: '1px solid #21262d' }}>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-[10px] text-gray-500 ml-2 font-mono">output</span>
                  </div>
                  {/* Terminal body */}
                  <div className="p-6 space-y-3 font-mono text-sm">
                    <p className="text-gray-500">$ xylos status</p>
                    <p className="text-green-400">✓ Unified AI Chat... <span className="text-cyan-400">ONLINE</span></p>
                    <p className="text-green-400">✓ Code Assistant... <span className="text-cyan-400">ONLINE</span></p>
                    <p className="text-green-400">✓ Content Factory... <span className="text-cyan-400">ONLINE</span></p>
                    <p className="text-gray-500 mt-4">$ xylos models</p>
                    <p className="text-white">→ Llama 3.3 <span className="text-green-400">ready</span></p>
                    <p className="text-white">→ Gemini 2.5 <span className="text-green-400">ready</span></p>
                    <p className="text-white">→ Mistral <span className="text-green-400">ready</span></p>
                    <p className="text-white">→ DeepSeek <span className="text-green-400">ready</span></p>
                    <p className="text-gray-500 mt-4">$ _</p>
                    <p className="inline-block w-2 h-4 bg-green-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: BLOG ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid #21262d' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] font-bold text-green-400 uppercase tracking-[0.4em] mb-4 font-mono">// LATEST LOGS</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white" style={{ fontFamily: 'monospace' }}>cat blog/*</h2>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-green-400 transition-colors uppercase tracking-widest font-mono">
              VIEW ALL <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs?.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug || blog.id}`}
                className="group"
              >
                <div className="relative aspect-[16/10] overflow-hidden mb-4 rounded-lg" style={{ background: '#0d1117', border: '1px solid #21262d' }}>
                  <img
                    src={blog.feature_image_url || "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-90"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-[9px] font-bold uppercase tracking-wider rounded border border-green-500/30 font-mono">{blog.category}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors leading-tight mb-2 line-clamp-2" style={{ fontFamily: 'monospace' }}>
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 font-mono">{blog.excerpt}</p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest font-mono">
                  <span>{blog.profiles?.full_name || 'Xylos Team'}</span>
                  <span>·</span>
                  <span className="text-green-400">READ_MORE →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: FEATURES ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid #21262d' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-green-400 uppercase tracking-[0.4em] mb-4 font-mono">// MODULES</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white" style={{ fontFamily: 'monospace' }}>ls capabilities/</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MessageSquare, title: 'multi_model_chat', desc: '7+ frontier AI models unified in one seamless conversational interface.', color: 'green' },
              { icon: Brain, title: 'smart_router', desc: 'Intelligent engine auto-selects the best model for your specific task.', color: 'cyan' },
              { icon: Code2, title: 'code_gen', desc: 'Write, debug, and refactor across 50+ programming languages instantly.', color: 'green' },
              { icon: FileText, title: 'content_factory', desc: 'SEO-optimized articles, social posts, and marketing copy on demand.', color: 'cyan' },
              { icon: Shield, title: 'zero_retention', desc: 'Enterprise-grade encryption. Your data never leaves the secure pipeline.', color: 'green' },
              { icon: Zap, title: 'low_latency', desc: 'Sub-2-second responses via our global edge network infrastructure.', color: 'cyan' },
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-lg hover:bg-green-500/[0.03] transition-all duration-300" style={{ border: '1px solid #21262d' }}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                  item.color === 'green' ? 'bg-green-500/10 border border-green-500/20' : 'bg-cyan-500/10 border border-cyan-500/20'
                }`}>
                  <item.icon className={`w-5 h-5 ${
                    item.color === 'green' ? 'text-green-400' : 'text-cyan-400'
                  }`} />
                </div>
                <h3 className="text-sm font-bold text-white mb-2 font-mono">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-mono">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: PLATFORM ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid #21262d' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center p-12 rounded-lg" style={{ background: '#0d1117', border: '1px solid #21262d' }}>
            <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em] text-white mb-4" style={{ fontFamily: 'monospace' }}>
              ~/xylos-ai README.md
            </h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed font-mono">
              Xylos AI is the premier free platform for interacting with advanced language models. 
              Our intelligent routing system ensures you always get the best response from models like 
              Llama 3.3, Gemini 2.5, and Mistral Large — always free, always available.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: FAQ ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid #21262d' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-green-400 uppercase tracking-[0.4em] mb-4 font-mono">// HELP</p>
            <h2 className="text-4xl font-black tracking-[-0.03em] text-white" style={{ fontFamily: 'monospace' }}>man faq</h2>
          </div>
          
          <div className="space-y-3">
            {[
              { q: 'Is Xylos AI completely free?', a: 'Yes, we aggregate open-source models like Llama 3, Gemini, and Mistral to provide premium AI at zero cost. No subscriptions, no hidden fees.' },
              { q: 'What models are available?', a: 'We support 7+ models including Llama 3.3, Gemini 2.5 Flash, Mistral Large, Command R+, and DeepSeek V3. Our smart router picks the best one for your task.' },
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-lg hover:bg-green-500/[0.03] transition-all duration-300" style={{ border: '1px solid #21262d' }}>
                <h3 className="text-sm font-bold text-white mb-3 font-mono">> {item.q}</h3>
                <p className="text-gray-400 leading-relaxed text-sm font-mono">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: CTA ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid #21262d' }}>
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-lg overflow-hidden p-12 md:p-16 text-center" style={{ background: 'linear-gradient(135deg, rgba(0,255,65,0.05), rgba(0,212,255,0.05))', border: '1px solid #21262d' }}>
            <div className="relative z-10 space-y-6">
              <p className="text-green-400 font-mono text-sm">$ echo &quot;Welcome to the future&quot;</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white" style={{ fontFamily: 'monospace' }}>
                INITIALIZE
              </h2>
              <p className="text-gray-400 text-sm max-w-xl mx-auto font-mono">
                Boot up your AI workspace. Start your session with Xylos AI today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/chat"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-green-500 text-black font-bold uppercase tracking-wider rounded-lg hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  <Terminal className="w-4 h-4" />
                  RUN
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 px-8 py-4 border border-green-500/30 text-green-400 font-bold uppercase tracking-wider rounded-lg hover:bg-green-500/10 transition-all duration-300"
                >
                  DOCS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsletterForm />

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t py-16 px-6 md:px-12 lg:px-20" style={{ borderColor: '#21262d', background: 'rgba(0,0,0,0.3)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2 space-y-4">
              <AnimatedLogo />
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed font-mono">
                Empowering professionals with top-tier AI models. Zero cost, infinite possibilities.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] font-mono">// PLATFORM</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-500 font-mono">
                <Link href="/blog" className="hover:text-green-400 transition-colors">blog</Link>
                <Link href="/about" className="hover:text-green-400 transition-colors">about</Link>
                <Link href="/privacy" className="hover:text-green-400 transition-colors">privacy</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] font-mono">// CONNECT</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-500 font-mono">
                <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">github</a>
                <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">linkedin</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: '#21262d' }}>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-mono">© 2026 XYLOS FOUNDATION</p>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-mono">RESEARCH BY 21DEV.IN</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
