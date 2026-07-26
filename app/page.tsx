import { createClient as createPublicClient } from "@supabase/supabase-js";
import { ArrowRight, Code2, FileText, Shield, Sparkles, Zap, Globe, MessageSquare, ChevronRight, Brain, Cpu, Lock, ChevronDown, Layers } from "lucide-react";
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
    <div className="flex flex-col min-h-screen relative overflow-hidden text-white selection:bg-violet-500/30" style={{ background: '#0f0f1a' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Multi-layer parallax background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0" style={{ background: '#0f0f1a' }} />
        {/* Deep layer - large slow orbs */}
        <div className="absolute top-[-400px] left-[-200px] w-[900px] h-[900px] bg-indigo-700/10 rounded-full blur-[300px]" />
        <div className="absolute bottom-[-300px] right-[-200px] w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[280px]" />
        {/* Mid layer */}
        <div className="absolute top-1/4 right-[-100px] w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 left-[-50px] w-[400px] h-[400px] bg-fuchsia-500/6 rounded-full blur-[180px]" />
        {/* Front layer - small bright */}
        <div className="absolute top-1/3 left-1/3 w-[200px] h-[200px] bg-indigo-400/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[150px] h-[150px] bg-violet-400/6 rounded-full blur-[100px]" />
      </div>

      {/* Depth grid */}
      <div className="fixed inset-0 z-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        transform: 'perspective(500px) rotateX(60deg)',
        transformOrigin: 'center bottom'
      }} />

      {/* ===== SECTION 1: HERO ===== */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="w-full px-6 md:px-12 lg:px-20 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: Text */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10">
                  <Layers className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] font-semibold text-indigo-300 uppercase tracking-widest">Deep Layers</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-black leading-[0.9] tracking-[-0.04em] text-white">
                  SCROLL
                  <br />
                  THROUGH
                  <br />
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">INTELLIGENCE.</span>
                </h1>

                <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                  Layer upon layer of AI power. 7+ models at different depths, one seamless experience. Zero cost.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/chat"
                    className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-bold text-sm uppercase tracking-wider rounded-2xl hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                  >
                    Start Free Chat
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/about"
                    className="group flex items-center justify-center gap-3 px-8 py-4 border border-indigo-500/30 text-gray-300 font-bold text-sm uppercase tracking-wider rounded-2xl hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all duration-300"
                  >
                    Explore Platform
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex gap-12 pt-8 border-t border-white/5">
                  <div>
                    <p className="text-3xl font-black text-white">7+</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">AI Models</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">$0</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Monthly Cost</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">24/7</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Available</p>
                  </div>
                </div>
              </div>

              {/* Right: Visual - Stacked layers */}
              <div className="hidden lg:block relative">
                <div className="relative">
                  {/* Back layer */}
                  <div className="absolute top-4 left-4 right-4 bottom-0 rounded-3xl" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.08)' }} />
                  {/* Mid layer */}
                  <div className="absolute top-2 left-2 right-2 bottom-2 rounded-3xl" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.1)' }} />
                  {/* Front layer */}
                  <div className="relative rounded-3xl p-10 space-y-6" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)', backdropFilter: 'blur(20px)' }}>
                    <div className="flex items-center gap-4 p-5 rounded-2xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
                      <div className="w-11 h-11 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Unified AI Chat</p>
                        <p className="text-[11px] text-gray-500">7+ models in one interface</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 rounded-2xl ml-8" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.1)' }}>
                      <div className="w-11 h-11 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                        <Code2 className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Code Assistant</p>
                        <p className="text-[11px] text-gray-500">Full-stack dev tools</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 rounded-2xl ml-4" style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.1)' }}>
                      <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Content Factory</p>
                        <p className="text-[11px] text-gray-500">Blog &amp; social generation</p>
                      </div>
                    </div>

                    {/* Tagline */}
                    <div className="space-y-2 pl-4 border-l-2 border-indigo-500/40 pt-4">
                      <h2 className="text-2xl font-black tracking-tight text-white">Free AI Chat.</h2>
                      <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent tracking-tight">Layers of Depth.</h2>
                      <p className="text-gray-500 text-sm">Zero cost. Infinite layers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[9px] text-gray-600 uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </div>
      </section>

      {/* ===== SECTION 2: BLOG ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.4em] mb-4">Latest</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white">Deeper Reads</h2>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-indigo-400 transition-colors uppercase tracking-widest">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs?.map((blog, i) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug || blog.id}`}
                className="group"
                style={{ transform: `translateY(${i * 12}px)` }}
              >
                <div className="relative aspect-[16/10] overflow-hidden mb-4 rounded-2xl" style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.08)' }}>
                  <img
                    src={blog.feature_image_url || "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-indigo-600/80 text-white text-[9px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm">{blog.category}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{blog.excerpt}</p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest">
                  <span>{blog.profiles?.full_name || 'Xylos Team'}</span>
                  <span>·</span>
                  <span className="text-indigo-400">Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: FEATURES - Stacked depth ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.4em] mb-4">Capabilities</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white">Multi-Layered Power</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MessageSquare, title: 'Multi-Model Chat', desc: '7+ frontier AI models unified in one seamless conversational interface.', color: 'indigo' },
              { icon: Brain, title: 'Smart Routing', desc: 'Intelligent engine auto-selects the best model for your specific task.', color: 'violet' },
              { icon: Code2, title: 'Code Generation', desc: 'Write, debug, and refactor across 50+ programming languages instantly.', color: 'purple' },
              { icon: FileText, title: 'Content Creation', desc: 'SEO-optimized articles, social posts, and marketing copy on demand.', color: 'indigo' },
              { icon: Shield, title: 'Zero Retention', desc: 'Enterprise-grade encryption. Your data never leaves the secure pipeline.', color: 'violet' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Sub-2-second responses via our global edge network infrastructure.', color: 'purple' },
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-2xl hover:bg-white/[0.02] transition-all duration-300" style={{ border: '1px solid rgba(99,102,241,0.08)', transform: `translateY(${(i % 3) * 8}px)` }}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  item.color === 'indigo' ? 'bg-indigo-500/20' : item.color === 'violet' ? 'bg-violet-500/20' : 'bg-purple-500/20'
                }`}>
                  <item.icon className={`w-5 h-5 ${
                    item.color === 'indigo' ? 'text-indigo-400' : item.color === 'violet' ? 'text-violet-400' : 'text-purple-400'
                  }`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: PLATFORM ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl" style={{ background: 'rgba(99,102,241,0.03)', border: '1px solid rgba(99,102,241,0.06)', transform: 'translate(8px, 8px)' }} />
            <div className="relative text-center p-12 rounded-3xl" style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)' }}>
              <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em] text-white mb-4">
                The Deepest Free AI Platform
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                Xylos AI operates on multiple layers of intelligence. Our depth-routing system 
                navigates through models like Llama 3.3, Gemini 2.5, and Mistral Large — 
                always free, always multi-dimensional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: FAQ ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.4em] mb-4">FAQ</p>
            <h2 className="text-4xl font-black tracking-[-0.03em] text-white">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-3">
            {[
              { q: 'Is Xylos AI completely free?', a: 'Yes, we aggregate open-source models like Llama 3, Gemini, and Mistral to provide premium AI at zero cost. No subscriptions, no hidden fees.' },
              { q: 'What models are available?', a: 'We support 7+ models including Llama 3.3, Gemini 2.5 Flash, Mistral Large, Command R+, and DeepSeek V3. Our smart router picks the best one for your task.' },
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-2xl hover:bg-white/[0.02] transition-all duration-300" style={{ border: '1px solid rgba(99,102,241,0.08)' }}>
                <h3 className="text-lg font-bold text-white mb-3">{item.q}</h3>
                <p className="text-gray-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: CTA ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-violet-600/10 to-purple-600/5" />
            {/* Decorative depth rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-indigo-500/10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-violet-500/10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-full border border-purple-500/10" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white">
                Dive Deeper
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                Explore every layer of AI with Xylos. Start your deep dive today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/chat"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-bold uppercase tracking-wider rounded-2xl hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 px-8 py-4 border border-indigo-500/30 text-gray-300 font-bold uppercase tracking-wider rounded-2xl hover:bg-indigo-500/10 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsletterForm />

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-white/5 py-16 px-6 md:px-12 lg:px-20" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2 space-y-4">
              <AnimatedLogo />
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                Empowering professionals with top-tier AI models. Zero cost, infinite possibilities.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Platform</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <Link href="/blog" className="hover:text-indigo-400 transition-colors">Blog</Link>
                <Link href="/about" className="hover:text-indigo-400 transition-colors">About</Link>
                <Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Connect</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">GitHub</a>
                <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">© 2026 Xylos Foundation</p>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">Research by 21dev.in</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
