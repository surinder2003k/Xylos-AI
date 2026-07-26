import { createClient as createPublicClient } from "@supabase/supabase-js";
import { ArrowRight, Code2, FileText, Shield, Zap, Globe, MessageSquare, ChevronRight, Brain, Cpu, Lock, ChevronDown, Terminal } from "lucide-react";
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
    <div className="flex flex-col min-h-screen bg-[#0a0e14] relative overflow-hidden text-[#00ff41] selection:bg-[#00ff41]/20 font-mono">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Ambient background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#0a0e14]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00ff41]/[0.02] rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00d4ff]/[0.015] rounded-full blur-[150px]" />
      </div>

      {/* Scanline overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none terminal-scanline" />

      {/* Grid pattern */}
      <div className="fixed inset-0 z-0 cyber-grid-pattern opacity-30" />

      {/* ===== SECTION 1: TERMINAL HERO ===== */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="w-full px-6 md:px-12 lg:px-20 py-24">
          <div className="max-w-5xl mx-auto">
            {/* Terminal window */}
            <div className="terminal-chrome">
              <div className="terminal-title-bar">
                <div className="terminal-dot bg-[#ff5f56]" />
                <div className="terminal-dot bg-[#ffbd2e]" />
                <div className="terminal-dot bg-[#27c93f]" />
                <span className="ml-3 text-[10px] text-[#00ff41]/30 uppercase tracking-[0.3em]">xylos-ai — neural-engine v4.0</span>
              </div>
              
              <div className="p-8 md:p-12 space-y-8">
                {/* Prompt line */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#00ff41]/40 text-xs">
                    <span className="text-[#00d4ff]">$</span>
                    <span>whoami --title</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-[-0.02em] text-[#00ff41]">
                    FREE AI
                    <br />
                    CHAT FOR
                    <br />
                    <span className="text-[#00d4ff]">EVERYONE.</span>
                  </h1>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#00ff41]/40 text-xs">
                    <span className="text-[#00d4ff]">$</span>
                    <span>cat description.txt</span>
                    <span className="w-2 h-4 bg-[#00ff41] cursor-blink" />
                  </div>
                  <p className="text-[#00ff41]/30 text-sm max-w-md leading-relaxed font-medium">
                    Access Llama 3, Gemini, Mistral and 4 more models in one workspace. 
                    Zero cost. Zero limits. Infinite possibilities.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/chat"
                    className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#00ff41] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#00d4ff] hover:shadow-[0_0_30px_rgba(0,255,65,0.3)] transition-all duration-300"
                  >
                    <Terminal className="w-4 h-4" />
                    Start Free Chat
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/about"
                    className="group flex items-center justify-center gap-3 px-8 py-4 border border-[#00ff41]/20 text-[#00ff41]/50 font-bold text-xs uppercase tracking-wider hover:bg-[#00ff41]/[0.04] hover:border-[#00ff41]/40 transition-all duration-300"
                  >
                    Explore Platform
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Stats bar */}
                <div className="flex flex-wrap gap-8 pt-6 border-t border-[#00ff41]/[0.06]">
                  <div className="flex items-center gap-3">
                    <span className="text-[#00d4ff]/40 text-xs">$</span>
                    <div>
                      <p className="text-2xl font-black text-[#00ff41]">7+</p>
                      <p className="text-[9px] text-[#00ff41]/20 uppercase tracking-widest mt-1">AI Models</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#00d4ff]/40 text-xs">$</span>
                    <div>
                      <p className="text-2xl font-black text-[#00ff41]">$0</p>
                      <p className="text-[9px] text-[#00ff41]/20 uppercase tracking-widest mt-1">Monthly Cost</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#00d4ff]/40 text-xs">$</span>
                    <div>
                      <p className="text-2xl font-black text-[#00d4ff]">24/7</p>
                      <p className="text-[9px] text-[#00ff41]/20 uppercase tracking-widest mt-1">Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[9px] text-[#00ff41]/15 uppercase tracking-widest">scroll</span>
          <ChevronDown className="w-4 h-4 text-[#00ff41]/15" />
        </div>
      </section>

      {/* ===== SECTION 2: FEATURES (Terminal output style) ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Feature 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#00ff41]/40 text-xs">
                <span className="text-[#00d4ff]">$</span>
                <span className="uppercase tracking-widest">cat platform.md</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#00ff41] leading-tight">
                Everything you need. <span className="text-[#00ff41]/20">Nothing you don&apos;t.</span>
              </h2>
              <p className="text-[#00ff41]/30 text-sm leading-relaxed">
                One interface, seven models. Llama 3, Gemini, Mistral, and more — all routed through our intelligent engine.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Llama 3.3', 'Gemini 2.5', 'Mistral', 'DeepSeek'].map((model) => (
                  <span key={model} className="px-3 py-1.5 bg-[#00ff41]/[0.03] border border-[#00ff41]/10 text-[10px] font-bold text-[#00ff41]/40 uppercase tracking-widest">
                    [{model}]
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="terminal-chrome">
                <div className="terminal-title-bar">
                  <div className="terminal-dot bg-[#ff5f56]" />
                  <div className="terminal-dot bg-[#ffbd2e]" />
                  <div className="terminal-dot bg-[#27c93f]" />
                  <span className="ml-3 text-[10px] text-[#00ff41]/30">modules</span>
                </div>
                <div className="p-8 grid grid-cols-2 gap-3">
                  {[
                    { icon: MessageSquare, label: 'chat', desc: '7+ models', color: '#00ff41' },
                    { icon: Code2, label: 'code', desc: '50+ langs', color: '#00d4ff' },
                    { icon: FileText, label: 'content', desc: 'auto-blog', color: '#00ff41' },
                    { icon: Brain, label: 'research', desc: 'deep dive', color: '#00d4ff' },
                  ].map((item) => (
                    <div key={item.label} className="p-4 bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06] space-y-2 hover:border-[#00ff41]/20 transition-all">
                      <item.icon className="w-5 h-5" style={{ color: item.color }} />
                      <p className="text-[10px] font-bold text-[#00ff41] uppercase tracking-widest">{item.label}</p>
                      <p className="text-[9px] text-[#00ff41]/25">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
            <div className="order-2 lg:order-1 relative">
              <div className="terminal-chrome">
                <div className="terminal-title-bar">
                  <div className="terminal-dot bg-[#ff5f56]" />
                  <div className="terminal-dot bg-[#ffbd2e]" />
                  <div className="terminal-dot bg-[#27c93f]" />
                  <span className="ml-3 text-[10px] text-[#00ff41]/30">security-check</span>
                </div>
                <div className="p-8 space-y-4">
                  {[
                    { icon: Shield, label: 'AES-256 Encryption', status: '[ACTIVE]' },
                    { icon: Lock, label: 'No Data Training', status: '[ACTIVE]' },
                    { icon: Zap, label: 'Session Purge', status: '[ACTIVE]' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06]">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-[#00ff41]" />
                        <span className="text-xs font-bold text-[#00ff41]/60">{item.label}</span>
                      </div>
                      <span className="text-[9px] font-bold text-[#27c93f] uppercase tracking-widest">{item.status}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-[#00ff41]/[0.06]">
                    <p className="text-[9px] text-[#00ff41]/15 uppercase tracking-widest">// enterprise-grade security</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="flex items-center gap-2 text-[#00ff41]/40 text-xs">
                <span className="text-[#00d4ff]">$</span>
                <span className="uppercase tracking-widest">cat security.md</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#00ff41] leading-tight">
                Zero Retention. <span className="text-[#00d4ff]">Maximum Privacy.</span>
              </h2>
              <p className="text-[#00ff41]/30 text-sm leading-relaxed">
                Every session is ephemeral. Your data never leaves our encrypted pipeline. We don&apos;t train on your content and don&apos;t sell your information.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#00ff41]/40 text-xs">
                <span className="text-[#00d4ff]">$</span>
                <span className="uppercase tracking-widest">cat how-it-works.sh</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#00ff41] leading-tight">
                How it <span className="text-[#00d4ff]">Works</span>
              </h2>
              <div className="space-y-4">
                {[
                  { step: '01', title: 'Pick a Model', desc: 'Choose from 7+ AI models' },
                  { step: '02', title: 'Ask Anything', desc: 'Chat, code, or create' },
                  { step: '03', title: 'Ship It', desc: 'Export or auto-publish' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4 p-3 bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.04]">
                    <span className="text-lg font-black text-[#00d4ff]/40">[{item.step}]</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#00ff41] uppercase tracking-widest">{item.title}</h4>
                      <p className="text-[10px] text-[#00ff41]/25 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="terminal-chrome">
                <div className="terminal-title-bar">
                  <div className="terminal-dot bg-[#ff5f56]" />
                  <div className="terminal-dot bg-[#ffbd2e]" />
                  <div className="terminal-dot bg-[#27c93f]" />
                  <span className="ml-3 text-[10px] text-[#00ff41]/30">stats</span>
                </div>
                <div className="p-8 text-center space-y-6">
                  <div>
                    <p className="text-5xl font-black text-[#00ff41]">4.8K</p>
                    <p className="text-[9px] text-[#00ff41]/20 uppercase tracking-widest mt-2">// active_users</p>
                  </div>
                  <div className="flex justify-center gap-8">
                    <div>
                      <p className="text-2xl font-black text-[#00d4ff]">99.9%</p>
                      <p className="text-[8px] text-[#00ff41]/15 uppercase tracking-widest">uptime</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-[#00ff41]">&lt;2s</p>
                      <p className="text-[8px] text-[#00ff41]/15 uppercase tracking-widest">response</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: BLOG ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20 border-t border-[#00ff41]/[0.04]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#00ff41]/40 text-xs">
                <span className="text-[#00d4ff]">$</span>
                <span className="uppercase tracking-widest">ls ./blog/ --latest</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#00ff41]">From the <span className="text-[#00ff41]/20">Archive</span></h2>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-[10px] font-bold text-[#00ff41]/25 hover:text-[#00d4ff] transition-colors uppercase tracking-widest justify-end">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {blogs?.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug || blog.id}`}
                className="group"
              >
                <div className="terminal-chrome hover:border-[#00ff41]/20 transition-all duration-300">
                  <div className="terminal-title-bar">
                    <div className="terminal-dot bg-[#ff5f56]" />
                    <div className="terminal-dot bg-[#ffbd2e]" />
                    <div className="terminal-dot bg-[#27c93f]" />
                    <span className="ml-3 text-[9px] text-[#00ff41]/20 uppercase">{blog.category}</span>
                  </div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={blog.feature_image_url || "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800"}
                      alt={blog.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-[#0a0e14]/50 to-transparent" />
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-sm font-bold text-[#00ff41] group-hover:text-[#00d4ff] transition-colors leading-tight line-clamp-2 uppercase tracking-tight">
                      {blog.title}
                    </h3>
                    <p className="text-[10px] text-[#00ff41]/20 line-clamp-2">{blog.excerpt}</p>
                    <div className="flex items-center gap-2 text-[9px] text-[#00ff41]/15 uppercase tracking-widest pt-2 border-t border-[#00ff41]/[0.06]">
                      <span>{blog.profiles?.full_name || 'Xylos Team'}</span>
                      <span>·</span>
                      <span className="text-[#00d4ff]/40">Read More →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: CTA ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="terminal-chrome">
            <div className="terminal-title-bar">
              <div className="terminal-dot bg-[#ff5f56]" />
              <div className="terminal-dot bg-[#ffbd2e]" />
              <div className="terminal-dot bg-[#27c93f]" />
              <span className="ml-3 text-[10px] text-[#00ff41]/30">deploy</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-12 md:p-16 bg-[#00ff41]/[0.01]">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-[#00ff41]/40 text-xs">
                    <span className="text-[#00d4ff]">$</span>
                    <span>./start.sh</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#00ff41]">
                    Start Building <span className="text-[#00d4ff]">Today</span>
                  </h2>
                  <p className="text-[#00ff41]/25 text-sm">
                    Join thousands of professionals using Xylos AI to amplify their productivity. No credit card required.
                  </p>
                  <Link
                    href="/chat"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-[#00ff41] text-black font-bold uppercase tracking-wider hover:bg-[#00d4ff] hover:shadow-[0_0_30px_rgba(0,255,65,0.3)] transition-all duration-300 text-xs"
                  >
                    <Terminal className="w-4 h-4" />
                    Launch Neural Link
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex flex-col justify-center p-12 bg-[#00ff41]/[0.02] border-l border-[#00ff41]/[0.06]">
                <div className="space-y-3 w-full max-w-xs">
                  {[
                    { label: 'next_slot', value: 'Today, 8:00 AM IST', color: '#00ff41' },
                    { label: 'models_online', value: '7 / 7', color: '#00d4ff' },
                    { label: 'queue_status', value: 'Available', color: '#27c93f' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06]">
                      <span className="text-[9px] font-bold text-[#00ff41]/30 uppercase tracking-widest">{item.label}</span>
                      <span className="text-[10px] font-bold" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: FAQ ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20 border-t border-[#00ff41]/[0.04]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="flex items-center justify-center gap-2 text-[#00ff41]/40 text-xs">
              <span className="text-[#00d4ff]">$</span>
              <span className="uppercase tracking-widest">cat faq.md</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-[#00ff41]">Common Questions</h2>
          </div>
          
          <div className="space-y-3">
            {[
              { q: 'Is Xylos AI completely free?', a: 'Yes, we aggregate open-source models like Llama 3, Gemini, and Mistral to provide premium AI at zero cost. No subscriptions, no hidden fees.' },
              { q: 'What models are available?', a: 'We support 7+ models including Llama 3.3, Gemini 2.5 Flash, Mistral Large, Command R+, and DeepSeek V3. Our smart router picks the best one for your task.' },
              { q: 'Is my data private?', a: 'Absolutely. Every session is ephemeral with zero data retention. We don\'t train on your content and don\'t sell your information.' },
            ].map((item, i) => (
              <div key={i} className="group p-6 bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06] hover:border-[#00ff41]/20 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <span className="text-[#00d4ff]/40 text-xs mt-0.5">[{String(i + 1).padStart(2, '0')}]</span>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-[#00ff41] uppercase tracking-widest">{item.q}</h3>
                    <p className="text-[#00ff41]/25 leading-relaxed text-xs">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterForm />

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-[#00ff41]/[0.04] py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2 space-y-4">
              <AnimatedLogo />
              <p className="text-[10px] text-[#00ff41]/20 max-w-xs leading-relaxed">
                Empowering professionals with top-tier AI models. Zero cost, infinite possibilities.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[9px] font-bold text-[#00ff41]/30 uppercase tracking-[0.3em]">// platform</h4>
              <div className="flex flex-col gap-2 text-[10px] text-[#00ff41]/20">
                <Link href="/blog" className="hover:text-[#00ff41] transition-colors">blog</Link>
                <Link href="/about" className="hover:text-[#00ff41] transition-colors">about</Link>
                <Link href="/privacy" className="hover:text-[#00ff41] transition-colors">privacy</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[9px] font-bold text-[#00ff41]/30 uppercase tracking-[0.3em]">// connect</h4>
              <div className="flex flex-col gap-2 text-[10px] text-[#00ff41]/20">
                <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ff41] transition-colors">github</a>
                <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ff41] transition-colors">linkedin</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-[#00ff41]/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[9px] text-[#00ff41]/10 uppercase tracking-widest">© 2026 Xylos Foundation</p>
            <p className="text-[9px] text-[#00ff41]/10 uppercase tracking-widest">Research by 21dev.in</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
