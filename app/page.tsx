import { createClient as createPublicClient } from "@supabase/supabase-js";
import { ArrowRight, Code2, FileText, Shield, Sparkles, Zap, Globe, MessageSquare, ChevronRight, Brain, Cpu, Lock, ChevronDown, BookOpen } from "lucide-react";
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
    <div className="flex flex-col min-h-screen relative overflow-hidden text-white selection:bg-emerald-500/30" style={{ background: '#0d1117' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Ambient background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0" style={{ background: '#0d1117' }} />
        <div className="absolute top-[-200px] left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-[-200px] right-0 w-[500px] h-[500px] bg-amber-600/8 rounded-full blur-[200px]" />
      </div>

      {/* ===== HERO: Split Screen ===== */}
      <section className="relative z-10 min-h-screen flex">
        {/* Left half - Dark editorial */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 xl:px-24" style={{ background: '#0d1117' }}>
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 w-fit">
              <BookOpen className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-widest">Editorial</span>
            </div>
            
            <h1 className="text-5xl xl:text-6xl font-black leading-[0.95] tracking-[-0.03em] text-white">
              The Future
              <br />
              of Free AI
              <br />
              <span className="text-emerald-400">Starts Here.</span>
            </h1>

            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
              A curated workspace of 7+ premium AI models. Zero cost, editorial quality, infinite depth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/chat"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
              >
                Start Free Chat
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="group flex items-center justify-center gap-3 px-8 py-4 border border-white/10 text-gray-300 font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-white/5 hover:border-white/20 transition-all duration-300"
              >
                Explore
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right half - Amber accent */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center items-center px-16" style={{ background: 'linear-gradient(135deg, #1a1510, #0d1117)' }}>
          <div className="w-full max-w-md space-y-6">
            {/* Feature cards stacked */}
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Unified AI Chat</p>
                  <p className="text-[11px] text-gray-500">7+ models in one interface</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl ml-8" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Code Assistant</p>
                  <p className="text-[11px] text-gray-500">Full-stack dev tools</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl mr-8" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Content Factory</p>
                  <p className="text-[11px] text-gray-500">Blog &amp; social generation</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-6 border-t border-white/5">
              <div>
                <p className="text-2xl font-black text-white">7+</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Models</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">$0</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Cost</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">24/7</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Uptime</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden w-full flex items-center px-6 py-24">
          <div className="max-w-xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <BookOpen className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-widest">Editorial</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-[0.95] tracking-[-0.03em] text-white">
              The Future of Free AI <span className="text-emerald-400">Starts Here.</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              A curated workspace of 7+ premium AI models. Zero cost, editorial quality, infinite depth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/chat" className="group flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition-all duration-300">
                Start Free Chat
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/about" className="group flex items-center justify-center gap-3 px-8 py-4 border border-white/10 text-gray-300 font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-white/5 transition-all duration-300">
                Explore
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="flex gap-8 pt-6 border-t border-white/5">
              <div><p className="text-2xl font-black text-white">7+</p><p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Models</p></div>
              <div><p className="text-2xl font-black text-white">$0</p><p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Cost</p></div>
              <div><p className="text-2xl font-black text-white">24/7</p><p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Uptime</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: BLOG ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.4em] mb-4">Latest</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white">From the Archive</h2>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-emerald-400 transition-colors uppercase tracking-widest">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs?.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug || blog.id}`} className="group">
                <div className="relative aspect-[16/10] overflow-hidden mb-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <img
                    src={blog.feature_image_url || "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-emerald-600/80 text-white text-[9px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm">{blog.category}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{blog.excerpt}</p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest">
                  <span>{blog.profiles?.full_name || 'Xylos Team'}</span>
                  <span>·</span>
                  <span className="text-emerald-400">Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: FEATURES - Split layout ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left - Editorial text */}
            <div className="space-y-6">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.4em]">Capabilities</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white leading-tight">
                Intelligence,
                <br />
                <span className="text-amber-400">Curated.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Each feature is carefully selected and refined. Our editorial approach ensures 
                you get only the highest quality AI capabilities.
              </p>
              <div className="space-y-4 pt-4">
                {[
                  { step: '01', title: 'Multi-Model Chat', desc: '7+ frontier models in one interface' },
                  { step: '02', title: 'Smart Routing', desc: 'Auto-selects the best model for your task' },
                  { step: '03', title: 'Zero Retention', desc: 'Enterprise-grade privacy by design' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <span className="text-xl font-black text-emerald-500/30">{item.step}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Feature grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: MessageSquare, title: 'Chat', sub: '7+ models', color: 'emerald' },
                { icon: Code2, title: 'Code', sub: '50+ langs', color: 'amber' },
                { icon: FileText, title: 'Content', sub: 'Auto-blog', color: 'emerald' },
                { icon: Brain, title: 'Research', sub: 'Deep dive', color: 'amber' },
                { icon: Shield, title: 'Secure', sub: 'AES-256', color: 'emerald' },
                { icon: Zap, title: 'Fast', sub: '<2s response', color: 'amber' },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl" style={{ 
                  background: item.color === 'emerald' ? 'rgba(16,185,129,0.05)' : 'rgba(245,158,11,0.05)', 
                  border: `1px solid ${item.color === 'emerald' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)'}` 
                }}>
                  <item.icon className={`w-6 h-6 mb-3 ${item.color === 'emerald' ? 'text-emerald-400' : 'text-amber-400'}`} />
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: PLATFORM ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="p-12 flex items-center" style={{ background: '#0d1117' }}>
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-[-0.03em] text-white">
                  The Editorial AI Platform
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Xylos AI delivers premium AI through a curated editorial lens. 
                  Models like Llama 3.3, Gemini 2.5, and Mistral Large — always free, always refined.
                </p>
              </div>
            </div>
            <div className="p-12 flex items-center" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(16,185,129,0.08))' }}>
              <div className="space-y-4 w-full">
                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-xs text-gray-500">Models online</p>
                  <p className="text-lg font-black text-emerald-400">7 / 7</p>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-xs text-gray-500">Queue status</p>
                  <p className="text-lg font-black text-amber-400">Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: FAQ ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.4em] mb-4">FAQ</p>
            <h2 className="text-4xl font-black tracking-[-0.03em] text-white">Questions & Answers</h2>
          </div>
          
          <div className="space-y-3">
            {[
              { q: 'Is Xylos AI completely free?', a: 'Yes, we aggregate open-source models like Llama 3, Gemini, and Mistral to provide premium AI at zero cost. No subscriptions, no hidden fees.' },
              { q: 'What models are available?', a: 'We support 7+ models including Llama 3.3, Gemini 2.5 Flash, Mistral Large, Command R+, and DeepSeek V3. Our smart router picks the best one for your task.' },
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-2xl hover:bg-white/[0.02] transition-all duration-300" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="text-lg font-bold text-white mb-3">{item.q}</h3>
                <p className="text-gray-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: CTA ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="p-12 md:p-16 flex items-center" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(245,158,11,0.05))' }}>
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white">
                  Begin Your <span className="text-emerald-400">Story</span>
                </h2>
                <p className="text-gray-400 text-lg">
                  Join thousands using Xylos AI to write their next chapter. No credit card required.
                </p>
                <Link
                  href="/chat"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white font-bold uppercase tracking-wider rounded-xl hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                >
                  Start Free Chat
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex flex-col justify-center p-12" style={{ background: '#0d1117' }}>
              <div className="space-y-4 w-full max-w-xs mx-auto">
                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-xs text-gray-500">Active users</p>
                  <p className="text-lg font-black text-white">4.8K+</p>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-xs text-gray-500">Uptime</p>
                  <p className="text-lg font-black text-emerald-400">99.9%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsletterForm />

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t py-16 px-6 md:px-12 lg:px-20" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
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
                <Link href="/blog" className="hover:text-emerald-400 transition-colors">Blog</Link>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">About</Link>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Connect</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">GitHub</a>
                <a href="https://github.com/surinder203k" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">© 2026 Xylos Foundation</p>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">Research by 21dev.in</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
