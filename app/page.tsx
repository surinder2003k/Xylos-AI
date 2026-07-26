import { createClient as createPublicClient } from "@supabase/supabase-js";
import { ArrowRight, Code2, FileText, Shield, Sparkles, Zap, Globe, MessageSquare, ChevronRight, Brain, Cpu, Lock, ChevronDown } from "lucide-react";
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
    <div className="flex flex-col min-h-screen bg-[#0d1117] relative overflow-hidden text-white selection:bg-emerald-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Ambient background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#0d1117]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[150px]" />
      </div>

      {/* ===== SECTION 1: SPLIT-SCREEN HERO ===== */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left: Text Content */}
          <div className="flex items-center px-6 md:px-12 lg:px-16 py-24">
            <div className="space-y-8 max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em]">Neural Engine v4.0 Online</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-black leading-[0.9] tracking-[-0.04em]">
                <span className="block text-white">FREE AI</span>
                <span className="block text-white">CHAT FOR</span>
                <span className="block text-emerald-400">EVERYONE.</span>
              </h1>

              <p className="text-white/35 text-lg max-w-md leading-relaxed">
                Access Llama 3, Gemini, Mistral and 4 more models in one workspace. Zero cost. Zero limits. Infinite possibilities.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/chat"
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition-all duration-300"
                >
                  Start Free Chat
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="group flex items-center justify-center gap-3 px-8 py-4 border border-white/10 text-white/50 font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-white/[0.04] transition-all duration-300"
                >
                  Explore Platform
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-12 pt-8 border-t border-white/[0.05]">
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

          {/* Right: Visual Panel */}
          <div className="hidden lg:flex items-center justify-center relative border-l border-white/[0.04]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent" />
            <div className="relative z-10 space-y-8 p-12">
              {/* Floating feature cards */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-xl">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Unified AI Chat</p>
                    <p className="text-[11px] text-white/25">7+ models in one interface</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-xl ml-8">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Code2 className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Code Assistant</p>
                    <p className="text-[11px] text-white/25">Full-stack dev tools</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-xl ml-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Content Factory</p>
                    <p className="text-[11px] text-white/25">Blog & social generation</p>
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-2 pl-4 border-l-2 border-emerald-500/30">
                <h2 className="text-2xl font-black tracking-tight">Free AI Chat.</h2>
                <h2 className="text-2xl font-black text-emerald-400 tracking-tight">Refine Your Narrative.</h2>
                <p className="text-white/25 text-sm">Zero cost. Infinite possibilities.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[9px] text-white/15 uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-4 h-4 text-white/15" />
        </div>
      </section>

      {/* ===== SECTION 2: SPLIT FEATURES (Alternating) ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Feature 1: Left Text / Right Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
            <div className="space-y-6">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.4em]">Platform</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white leading-tight">
                Everything you need. <span className="text-white/20">Nothing you don&apos;t.</span>
              </h2>
              <p className="text-white/35 text-lg leading-relaxed">
                One interface, seven models. Llama 3, Gemini, Mistral, and more — all routed through our intelligent engine.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Llama 3.3', 'Gemini 2.5', 'Mistral', 'DeepSeek'].map((model) => (
                  <span key={model} className="px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs font-bold text-white/40">
                    {model}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-white/[0.02] border border-white/[0.05] p-8 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2">
                    <MessageSquare className="w-6 h-6 text-emerald-400" />
                    <p className="text-xs font-bold text-white">Chat</p>
                    <p className="text-[10px] text-white/25">7+ models</p>
                  </div>
                  <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-2">
                    <Code2 className="w-6 h-6 text-amber-400" />
                    <p className="text-xs font-bold text-white">Code</p>
                    <p className="text-[10px] text-white/25">50+ langs</p>
                  </div>
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2">
                    <FileText className="w-6 h-6 text-emerald-400" />
                    <p className="text-xs font-bold text-white">Content</p>
                    <p className="text-[10px] text-white/25">Auto-blog</p>
                  </div>
                  <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-2">
                    <Brain className="w-6 h-6 text-amber-400" />
                    <p className="text-xs font-bold text-white">Research</p>
                    <p className="text-[10px] text-white/25">Deep dive</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Right Text / Left Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-[4/3] rounded-2xl bg-white/[0.02] border border-white/[0.05] p-8 flex items-center justify-center">
                <div className="space-y-4 w-full">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white">AES-256 Encryption</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white">No Data Training</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-bold text-white">Session Purge</span>
                  </div>
                  <div className="pt-4 border-t border-white/[0.05]">
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">Enterprise-grade security</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.4em]">Security</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white leading-tight">
                Zero Retention. <span className="text-emerald-400">Maximum Privacy.</span>
              </h2>
              <p className="text-white/35 text-lg leading-relaxed">
                Every session is ephemeral. Your data never leaves our encrypted pipeline. We don&apos;t train on your content and don&apos;t sell your information.
              </p>
            </div>
          </div>

          {/* Feature 3: Left Text / Right Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.4em]">Workflow</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white leading-tight">
                How it <span className="text-amber-400">Works</span>
              </h2>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Pick a Model', desc: 'Choose from 7+ AI models' },
                  { step: '02', title: 'Ask Anything', desc: 'Chat, code, or create' },
                  { step: '03', title: 'Ship It', desc: 'Export or auto-publish' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <span className="text-2xl font-black text-emerald-500/30">{item.step}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-white/25">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-white/[0.02] border border-white/[0.05] p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-5xl font-black text-white">4.8K</p>
                    <p className="text-[10px] text-white/25 uppercase tracking-widest mt-1">Active Users</p>
                  </div>
                  <div className="flex justify-center gap-8">
                    <div>
                      <p className="text-2xl font-black text-emerald-400">99.9%</p>
                      <p className="text-[9px] text-white/20 uppercase tracking-widest">Uptime</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-amber-400">&lt;2s</p>
                      <p className="text-[9px] text-white/20 uppercase tracking-widest">Response</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: BLOG ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-12">
            <div>
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.4em] mb-4">Latest Insights</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white">From the <span className="text-white/20">Archive</span></h2>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-xs font-bold text-white/30 hover:text-emerald-400 transition-colors uppercase tracking-widest justify-end">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs?.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug || blog.id}`}
                className="group"
              >
                <div className="relative aspect-[16/10] overflow-hidden mb-4 rounded-2xl bg-white/[0.03]">
                  <img
                    src={blog.feature_image_url || "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800"}
                    alt={blog.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-emerald-500/90 text-white text-[9px] font-bold uppercase tracking-wider rounded-full">{blog.category}</span>
                  </div>
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors leading-tight mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-white/25 line-clamp-2">{blog.excerpt}</p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-white/15 uppercase tracking-widest">
                  <span>{blog.profiles?.full_name || 'Xylos Team'}</span>
                  <span>·</span>
                  <span className="text-emerald-400/60">Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: CTA ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-white/[0.05]">
            {/* Left: Text */}
            <div className="p-12 md:p-16 bg-white/[0.02] flex items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white">
                  Start Building <span className="text-emerald-400">Today</span>
                </h2>
                <p className="text-white/30 text-lg">
                  Join thousands of professionals using Xylos AI to amplify their productivity. No credit card required.
                </p>
                <Link
                  href="/chat"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white font-bold uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition-all duration-300"
                >
                  Launch Neural Link
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            {/* Right: Visual */}
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-emerald-500/[0.05] to-amber-500/[0.03] p-12">
              <div className="space-y-4 w-full max-w-xs">
                <div className="p-4 bg-white/[0.03] border border-white/[0.05] rounded-xl">
                  <p className="text-xs font-bold text-white/40">Next available slot</p>
                  <p className="text-lg font-black text-emerald-400">Today, 8:00 AM IST</p>
                </div>
                <div className="p-4 bg-white/[0.03] border border-white/[0.05] rounded-xl">
                  <p className="text-xs font-bold text-white/40">Models online</p>
                  <p className="text-lg font-black text-white">7 / 7</p>
                </div>
                <div className="p-4 bg-white/[0.03] border border-white/[0.05] rounded-xl">
                  <p className="text-xs font-bold text-white/40">Queue status</p>
                  <p className="text-lg font-black text-amber-400">Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: FAQ ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.4em] mb-4">FAQ</p>
            <h2 className="text-4xl font-black tracking-[-0.03em] text-white">Common Questions</h2>
          </div>
          
          <div className="space-y-3">
            {[
              { q: 'Is Xylos AI completely free?', a: 'Yes, we aggregate open-source models like Llama 3, Gemini, and Mistral to provide premium AI at zero cost. No subscriptions, no hidden fees.' },
              { q: 'What models are available?', a: 'We support 7+ models including Llama 3.3, Gemini 2.5 Flash, Mistral Large, Command R+, and DeepSeek V3. Our smart router picks the best one for your task.' },
              { q: 'Is my data private?', a: 'Absolutely. Every session is ephemeral with zero data retention. We don\'t train on your content and don\'t sell your information.' },
            ].map((item, i) => (
              <div key={i} className="group p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-emerald-500/20 transition-all duration-300">
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
                <Link href="/blog" className="hover:text-emerald-400 transition-colors">Blog</Link>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">About</Link>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Connect</h4>
              <div className="flex flex-col gap-2 text-sm text-white/25">
                <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">GitHub</a>
                <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">LinkedIn</a>
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
