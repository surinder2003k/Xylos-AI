import { createClient as createPublicClient } from "@supabase/supabase-js";
import { ArrowRight, Code2, FileText, Shield, Sparkles, Zap, Globe, MessageSquare, ChevronRight, Brain, Cpu, Lock } from "lucide-react";
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
    <div className="flex flex-col min-h-screen bg-[#0f0f14] relative overflow-hidden text-white selection:bg-violet-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Ambient background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#0f0f14]" />
        <div className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-violet-500/[0.06] rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/[0.03] rounded-full blur-[200px]" />
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      {/* ===== SECTION 1: HERO ===== */}
      <section className="relative z-10 min-h-screen flex items-center px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto w-full pt-24">
          <div className="space-y-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/5 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.3em]">Neural Engine v4.0 Online</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[90px] font-black leading-[0.88] tracking-[-0.04em]">
              <span className="block text-white">FREE AI</span>
              <span className="block text-white">CHAT FOR</span>
              <span className="block bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">EVERYONE.</span>
            </h1>

            <p className="text-white/35 text-lg max-w-lg leading-relaxed">
              Access Llama 3, Gemini, Mistral and 4 more models in one workspace. Zero cost. Zero limits. Infinite possibilities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/chat"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-bold text-sm uppercase tracking-wider rounded-2xl hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all duration-300"
              >
                Start Free Chat
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="group flex items-center justify-center gap-3 px-8 py-4 border border-white/10 text-white/50 font-bold text-sm uppercase tracking-wider rounded-2xl hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300"
              >
                Explore Platform
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-12 pt-8">
              <div>
                <p className="text-3xl font-black text-white">7+</p>
                <p className="text-[10px] text-white/25 uppercase tracking-widest mt-1">AI Models</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">$0</p>
                <p className="text-[10px] text-white/25 uppercase tracking-widest mt-1">Monthly Cost</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">24/7</p>
                <p className="text-[10px] text-white/25 uppercase tracking-widest mt-1">Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[9px] text-white/15 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/15 to-transparent" />
        </div>
      </section>

      {/* ===== SECTION 2: BENTO GRID ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="mb-16">
            <p className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.4em] mb-4">Platform</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white">
              Everything you need. <span className="text-white/20">Nothing you don&apos;t.</span>
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">
            {/* Card 1: Large - AI Chat (2 cols) */}
            <div className="md:col-span-2 bento-card group min-h-[320px]">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.06] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6">
                    <MessageSquare className="w-6 h-6 text-violet-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">Unified AI Chat</h3>
                  <p className="text-white/35 leading-relaxed max-w-md">One interface, seven models. Llama 3, Gemini, Mistral, and more — all routed through our intelligent engine.</p>
                </div>
                <div className="flex items-center gap-3 mt-8">
                  {['Llama 3.3', 'Gemini 2.5', 'Mistral', 'DeepSeek'].map((model, i) => (
                    <span key={model} className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full text-[10px] font-bold text-white/40 uppercase tracking-wider">
                      {model}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Tall - Privacy */}
            <div className="bento-card group row-span-2 min-h-[320px]">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.06] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">Zero Retention</h3>
                <p className="text-white/35 leading-relaxed mb-8">Every session is ephemeral. Your data never leaves our encrypted pipeline.</p>
                <div className="mt-auto space-y-3">
                  {['AES-256 Encryption', 'No Data Training', 'Session Purge'].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <Lock className="w-3 h-3 text-cyan-400/60" />
                      <span className="text-xs text-white/30">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Standard - Code */}
            <div className="bento-card group min-h-[200px]">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/[0.06] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6">
                  <Code2 className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Code Assistant</h3>
                <p className="text-sm text-white/30">Full-stack generation in 50+ languages.</p>
              </div>
            </div>

            {/* Card 4: Standard - Blog */}
            <div className="bento-card group min-h-[200px]">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.04] via-transparent to-cyan-500/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Content Factory</h3>
                <p className="text-sm text-white/30">Auto-post blogs with AI editorial.</p>
              </div>
            </div>

            {/* Card 5: Wide - How it works */}
            <div className="md:col-span-2 bento-card group min-h-[240px]">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.04] via-cyan-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <h3 className="text-xl font-black text-white mb-8">How it Works</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { step: '01', title: 'Pick a Model', desc: 'Choose from 7+ AI models' },
                    { step: '02', title: 'Ask Anything', desc: 'Chat, code, or create' },
                    { step: '03', title: 'Ship It', desc: 'Export or auto-publish' },
                  ].map((item) => (
                    <div key={item.step} className="space-y-3">
                      <span className="text-3xl font-black text-violet-500/30">{item.step}</span>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-white/25">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 6: Stats */}
            <div className="bento-card group min-h-[200px] flex items-center justify-center text-center">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-500/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 space-y-4">
                <div>
                  <p className="text-5xl font-black text-white">4.8K</p>
                  <p className="text-[10px] text-white/25 uppercase tracking-widest mt-1">Active Users</p>
                </div>
                <div className="flex justify-center gap-8">
                  <div>
                    <p className="text-2xl font-black text-violet-400">99.9%</p>
                    <p className="text-[9px] text-white/20 uppercase tracking-widest">Uptime</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-cyan-400">&lt;2s</p>
                    <p className="text-[9px] text-white/20 uppercase tracking-widest">Response</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: BLOG HORIZONTAL SCROLL ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.4em] mb-4">Latest Insights</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white">From the <span className="text-white/20">Archive</span></h2>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-xs font-bold text-white/30 hover:text-violet-400 transition-colors uppercase tracking-widest">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6">
            {blogs?.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug || blog.id}`}
                className="group flex-shrink-0 w-[320px] md:w-[400px] snap-center"
              >
                <div className="relative aspect-[16/10] overflow-hidden mb-4 rounded-2xl bg-white/[0.03]">
                  <img
                    src={blog.feature_image_url || "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800"}
                    alt={blog.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-violet-500/90 text-white text-[9px] font-bold uppercase tracking-wider rounded-full">{blog.category}</span>
                  </div>
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-violet-400 transition-colors leading-tight mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-white/25 line-clamp-2">{blog.excerpt}</p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-white/15 uppercase tracking-widest">
                  <span>{blog.profiles?.full_name || 'Xylos Team'}</span>
                  <span>·</span>
                  <span className="text-violet-400/60">Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: CTA ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500/10 via-[#0f0f14] to-cyan-500/5 border border-white/[0.05] p-12 md:p-20 text-center">
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/8 rounded-full blur-[100px]" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-black tracking-[-0.03em] text-white">
                Start Building <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Today</span>
              </h2>
              <p className="text-white/30 text-lg max-w-xl mx-auto">
                Join thousands of professionals using Xylos AI to amplify their productivity. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/chat"
                  className="group flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-bold uppercase tracking-wider rounded-2xl hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all duration-300"
                >
                  Launch Neural Link
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: FAQ ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.4em] mb-4">FAQ</p>
            <h2 className="text-4xl font-black tracking-[-0.03em] text-white">Common Questions</h2>
          </div>
          
          <div className="space-y-3">
            {[
              { q: 'Is Xylos AI completely free?', a: 'Yes, we aggregate open-source models like Llama 3, Gemini, and Mistral to provide premium AI at zero cost. No subscriptions, no hidden fees.' },
              { q: 'What models are available?', a: 'We support 7+ models including Llama 3.3, Gemini 2.5 Flash, Mistral Large, Command R+, and DeepSeek V3. Our smart router picks the best one for your task.' },
              { q: 'Is my data private?', a: 'Absolutely. Every session is ephemeral with zero data retention. We don\'t train on your content and don\'t sell your information.' },
            ].map((item, i) => (
              <div key={i} className="group p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-white/[0.08] transition-all duration-300">
                <h3 className="text-lg font-bold text-white mb-3">{item.q}</h3>
                <p className="text-white/30 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterForm />

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-white/[0.04] py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2 space-y-4">
              <AnimatedLogo />
              <p className="text-sm text-white/25 max-w-xs leading-relaxed">
                Empowering professionals with top-tier AI models. Zero cost, infinite possibilities.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Platform</h4>
              <div className="flex flex-col gap-2 text-sm text-white/25">
                <Link href="/blog" className="hover:text-violet-400 transition-colors">Blog</Link>
                <Link href="/about" className="hover:text-violet-400 transition-colors">About</Link>
                <Link href="/privacy" className="hover:text-violet-400 transition-colors">Privacy</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Connect</h4>
              <div className="flex flex-col gap-2 text-sm text-white/25">
                <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 transition-colors">GitHub</a>
                <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-white/15 uppercase tracking-widest">© 2026 Xylos Foundation</p>
            <p className="text-[10px] text-white/15 uppercase tracking-widest">Research by 21dev.in</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
