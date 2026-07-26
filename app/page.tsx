import { createClient as createPublicClient } from "@supabase/supabase-js";
import { ArrowRight, Code2, FileText, Shield, Sparkles, Zap, Globe, MessageSquare, ChevronRight, Brain, Cpu, Lock, ChevronDown, Flame } from "lucide-react";
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
    <div className="flex flex-col min-h-screen relative overflow-hidden text-white selection:bg-amber-500/30" style={{ background: '#141008' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Warm ambient glow */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0" style={{ background: '#141008' }} />
        <div className="absolute top-[-300px] left-1/3 w-[800px] h-[800px] bg-amber-700/12 rounded-full blur-[280px]" />
        <div className="absolute bottom-[-200px] right-1/4 w-[600px] h-[600px] bg-orange-800/10 rounded-full blur-[220px]" />
        <div className="absolute top-1/2 left-[-100px] w-[400px] h-[400px] bg-yellow-700/8 rounded-full blur-[180px]" />
      </div>

      {/* Warm grain texture */}
      <div className="fixed inset-0 z-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 30% 40%, rgba(245,158,11,0.4) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(217,119,6,0.3) 0%, transparent 35%)`
      }} />

      {/* ===== HERO ===== */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="w-full px-6 md:px-12 lg:px-20 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: Text */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-widest">AI That Feels Human</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-black leading-[0.9] tracking-[-0.04em] text-white">
                  AI THAT
                  <br />
                  FEELS
                  <br />
                  <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">HUMAN.</span>
                </h1>

                <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                  Experience warmth in every conversation. 7+ AI models, zero cost, genuine connection. Your premium AI companion.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/chat"
                    className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:from-amber-500 hover:to-orange-500 hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                  >
                    Start Free Chat
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/about"
                    className="group flex items-center justify-center gap-3 px-8 py-4 border border-amber-500/30 text-gray-300 font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-amber-500/10 hover:border-amber-500/50 transition-all duration-300"
                  >
                    Explore the Craft
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

              {/* Right: Visual */}
              <div className="hidden lg:block relative">
                <div className="relative rounded-3xl p-10 space-y-6" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.1)', backdropFilter: 'blur(20px)' }}>
                  <div className="flex items-center gap-4 p-5 rounded-2xl" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.08)' }}>
                    <div className="w-11 h-11 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Unified AI Chat</p>
                      <p className="text-[11px] text-gray-500">7+ models in one interface</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 rounded-2xl ml-8" style={{ background: 'rgba(217,119,6,0.05)', border: '1px solid rgba(217,119,6,0.08)' }}>
                    <div className="w-11 h-11 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                      <Code2 className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Code Assistant</p>
                      <p className="text-[11px] text-gray-500">Full-stack dev tools</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 rounded-2xl ml-4" style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.08)' }}>
                    <div className="w-11 h-11 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Content Factory</p>
                      <p className="text-[11px] text-gray-500">Blog &amp; social generation</p>
                    </div>
                  </div>

                  {/* Tagline */}
                  <div className="space-y-2 pl-4 border-l-2 border-amber-500/40 pt-4">
                    <h2 className="text-2xl font-black tracking-tight text-white">Free AI Chat.</h2>
                    <h2 className="text-2xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent tracking-tight">Refine Your Narrative.</h2>
                    <p className="text-gray-500 text-sm">Zero cost. Infinite possibilities.</p>
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
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.4em] mb-4">Latest</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white">From the Hearth</h2>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-amber-400 transition-colors uppercase tracking-widest">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs?.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug || blog.id}`} className="group">
                <div className="relative aspect-[16/10] overflow-hidden mb-4 rounded-2xl" style={{ background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.06)' }}>
                  <img
                    src={blog.feature_image_url || "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-amber-600/80 text-white text-[9px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm">{blog.category}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-tight mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{blog.excerpt}</p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest">
                  <span>{blog.profiles?.full_name || 'Xylos Team'}</span>
                  <span>·</span>
                  <span className="text-amber-400">Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: FEATURES ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.4em] mb-4">Crafted</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white">Warmth Meets Power</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MessageSquare, title: 'Multi-Model Chat', desc: '7+ frontier AI models unified in one seamless conversational interface.', color: 'amber' },
              { icon: Brain, title: 'Smart Routing', desc: 'Intelligent engine auto-selects the best model for your specific task.', color: 'orange' },
              { icon: Code2, title: 'Code Generation', desc: 'Write, debug, and refactor across 50+ programming languages instantly.', color: 'yellow' },
              { icon: FileText, title: 'Content Creation', desc: 'SEO-optimized articles, social posts, and marketing copy on demand.', color: 'amber' },
              { icon: Shield, title: 'Zero Retention', desc: 'Enterprise-grade encryption. Your data never leaves the secure pipeline.', color: 'orange' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Sub-2-second responses via our global edge network infrastructure.', color: 'yellow' },
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-2xl hover:bg-white/[0.02] transition-all duration-300" style={{ border: '1px solid rgba(245,158,11,0.06)' }}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  item.color === 'amber' ? 'bg-amber-500/20' : item.color === 'orange' ? 'bg-orange-500/20' : 'bg-yellow-500/20'
                }`}>
                  <item.icon className={`w-5 h-5 ${
                    item.color === 'amber' ? 'text-amber-400' : item.color === 'orange' ? 'text-orange-400' : 'text-yellow-400'
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
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center p-12 rounded-3xl" style={{ background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.08)' }}>
            <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em] text-white mb-4">
              The Warmest Free AI Platform
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Xylos AI brings genuine warmth to artificial intelligence. 
              Our crafted routing system guides your queries through models like Llama 3.3, Gemini 2.5, 
              and Mistral Large — always free, always human.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: FAQ ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.4em] mb-4">FAQ</p>
            <h2 className="text-4xl font-black tracking-[-0.03em] text-white">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-3">
            {[
              { q: 'Is Xylos AI completely free?', a: 'Yes, we aggregate open-source models like Llama 3, Gemini, and Mistral to provide premium AI at zero cost. No subscriptions, no hidden fees.' },
              { q: 'What models are available?', a: 'We support 7+ models including Llama 3.3, Gemini 2.5 Flash, Mistral Large, Command R+, and DeepSeek V3. Our smart router picks the best one for your task.' },
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-2xl hover:bg-white/[0.02] transition-all duration-300" style={{ border: '1px solid rgba(245,158,11,0.06)' }}>
                <h3 className="text-lg font-bold text-white mb-3">{item.q}</h3>
                <p className="text-gray-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: CTA ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.08))', border: '1px solid rgba(245,158,11,0.15)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-orange-600/5" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white">
                Join the Golden Circle
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                Experience the warmth of human-AI interaction. Start your journey with Xylos AI today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/chat"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold uppercase tracking-wider rounded-xl hover:from-amber-500 hover:to-orange-500 hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 px-8 py-4 border border-amber-500/30 text-gray-300 font-bold uppercase tracking-wider rounded-xl hover:bg-amber-500/10 transition-all duration-300"
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
      <footer className="relative z-10 border-t py-16 px-6 md:px-12 lg:px-20" style={{ borderColor: 'rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.2)' }}>
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
                <Link href="/blog" className="hover:text-amber-400 transition-colors">Blog</Link>
                <Link href="/about" className="hover:text-amber-400 transition-colors">About</Link>
                <Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Connect</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">GitHub</a>
                <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">© 2026 Xylos Foundation</p>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">Research by 21dev.in</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
