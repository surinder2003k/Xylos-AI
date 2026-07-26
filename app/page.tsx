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
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden text-gray-900 selection:bg-blue-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Ambient background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern */}
      <div className="fixed inset-0 z-0 cyber-grid-pattern opacity-40" />

      {/* ===== SECTION 1: CLEAN HERO ===== */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="w-full px-6 md:px-12 lg:px-20 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: Text */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">AI Engine v4.0</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-black leading-[0.9] tracking-[-0.04em] text-gray-900">
                  FREE AI
                  <br />
                  CHAT FOR
                  <br />
                  <span className="text-blue-500">EVERYONE.</span>
                </h1>

                <p className="text-gray-500 text-lg max-w-md leading-relaxed">
                  Access Llama 3, Gemini, Mistral and 4 more models in one workspace. Zero cost. Zero limits. Infinite possibilities.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/chat"
                    className="group flex items-center justify-center gap-3 px-8 py-4 bg-blue-500 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                  >
                    Start Free Chat
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/about"
                    className="group flex items-center justify-center gap-3 px-8 py-4 border border-gray-200 text-gray-600 font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                  >
                    Explore Platform
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex gap-12 pt-8 border-t border-gray-100">
                  <div>
                    <p className="text-3xl font-black text-gray-900">7+</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">AI Models</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-gray-900">$0</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Monthly Cost</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-gray-900">24/7</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Available</p>
                  </div>
                </div>
              </div>

              {/* Right: Visual */}
              <div className="hidden lg:block relative">
                <div className="relative bg-gray-50 border border-gray-200 rounded-3xl p-10 space-y-6">
                  <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Unified AI Chat</p>
                      <p className="text-[11px] text-gray-400">7+ models in one interface</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl shadow-sm ml-8">
                    <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                      <Code2 className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Code Assistant</p>
                      <p className="text-[11px] text-gray-400">Full-stack dev tools</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl shadow-sm ml-4">
                    <div className="w-11 h-11 rounded-xl bg-pink-50 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Content Factory</p>
                      <p className="text-[11px] text-gray-400">Blog & social generation</p>
                    </div>
                  </div>

                  {/* Tagline */}
                  <div className="space-y-2 pl-4 border-l-2 border-blue-200 pt-4">
                    <h2 className="text-2xl font-black tracking-tight text-gray-900">Free AI Chat.</h2>
                    <h2 className="text-2xl font-black text-blue-500 tracking-tight">Refine Your Narrative.</h2>
                    <p className="text-gray-400 text-sm">Zero cost. Infinite possibilities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[9px] text-gray-300 uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-4 h-4 text-gray-300" />
        </div>
      </section>

      {/* ===== SECTION 2: FEATURES ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          {/* Feature 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
            <div className="space-y-6">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em]">Platform</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-gray-900 leading-tight">
                Everything you need. <span className="text-gray-300">Nothing you don&apos;t.</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                One interface, seven models. Llama 3, Gemini, Mistral, and more — all routed through our intelligent engine.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Llama 3.3', 'Gemini 2.5', 'Mistral', 'DeepSeek'].map((model) => (
                  <span key={model} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-500">
                    {model}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-white border border-gray-200 rounded-3xl p-8 flex items-center justify-center shadow-sm">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-2">
                    <MessageSquare className="w-6 h-6 text-blue-500" />
                    <p className="text-xs font-bold text-gray-900">Chat</p>
                    <p className="text-[10px] text-gray-400">7+ models</p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl space-y-2">
                    <Code2 className="w-6 h-6 text-purple-500" />
                    <p className="text-xs font-bold text-gray-900">Code</p>
                    <p className="text-[10px] text-gray-400">50+ langs</p>
                  </div>
                  <div className="p-4 bg-pink-50 border border-pink-100 rounded-2xl space-y-2">
                    <FileText className="w-6 h-6 text-pink-500" />
                    <p className="text-xs font-bold text-gray-900">Content</p>
                    <p className="text-[10px] text-gray-400">Auto-blog</p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-100 rounded-2xl space-y-2">
                    <Brain className="w-6 h-6 text-green-500" />
                    <p className="text-xs font-bold text-gray-900">Research</p>
                    <p className="text-[10px] text-gray-400">Deep dive</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-[4/3] bg-white border border-gray-200 rounded-3xl p-8 flex items-center justify-center shadow-sm">
                <div className="space-y-4 w-full">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-bold text-gray-900">AES-256 Encryption</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Lock className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-bold text-gray-900">No Data Training</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Zap className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-bold text-gray-900">Session Purge</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Enterprise-grade security</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em]">Security</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-gray-900 leading-tight">
                Zero Retention. <span className="text-blue-500">Maximum Privacy.</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                Every session is ephemeral. Your data never leaves our encrypted pipeline. We don&apos;t train on your content and don&apos;t sell your information.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <p className="text-[10px] font-bold text-purple-500 uppercase tracking-[0.4em]">Workflow</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-gray-900 leading-tight">
                How it <span className="text-purple-500">Works</span>
              </h2>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Pick a Model', desc: 'Choose from 7+ AI models' },
                  { step: '02', title: 'Ask Anything', desc: 'Chat, code, or create' },
                  { step: '03', title: 'Ship It', desc: 'Export or auto-publish' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <span className="text-2xl font-black text-blue-200">{item.step}</span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-white border border-gray-200 rounded-3xl p-8 flex items-center justify-center shadow-sm">
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-5xl font-black text-gray-900">4.8K</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Active Users</p>
                  </div>
                  <div className="flex justify-center gap-8">
                    <div>
                      <p className="text-2xl font-black text-blue-500">99.9%</p>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest">Uptime</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-purple-500">&lt;2s</p>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest">Response</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: BLOG ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-12">
            <div>
              <p className="text-[10px] font-bold text-purple-500 uppercase tracking-[0.4em] mb-4">Latest Insights</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-gray-900">From the <span className="text-gray-300">Archive</span></h2>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-blue-500 transition-colors uppercase tracking-widest justify-end">
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
                <div className="relative aspect-[16/10] overflow-hidden mb-4 rounded-2xl bg-gray-100">
                  <img
                    src={blog.feature_image_url || "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-blue-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-full">{blog.category}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-500 transition-colors leading-tight mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2">{blog.excerpt}</p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-300 uppercase tracking-widest">
                  <span>{blog.profiles?.full_name || 'Xylos Team'}</span>
                  <span>·</span>
                  <span className="text-blue-400">Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: CTA ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20 bg-gray-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm">
            <div className="p-12 md:p-16 flex items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-gray-900">
                  Start Building <span className="text-blue-500">Today</span>
                </h2>
                <p className="text-gray-500 text-lg">
                  Join thousands of professionals using Xylos AI to amplify their productivity. No credit card required.
                </p>
                <Link
                  href="/chat"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-500 text-white font-bold uppercase tracking-wider rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                >
                  Launch Neural Link
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center bg-gray-50 p-12">
              <div className="space-y-4 w-full max-w-xs">
                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                  <p className="text-xs font-bold text-gray-400">Next available slot</p>
                  <p className="text-lg font-black text-blue-500">Today, 8:00 AM IST</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                  <p className="text-xs font-bold text-gray-400">Models online</p>
                  <p className="text-lg font-black text-gray-900">7 / 7</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                  <p className="text-xs font-bold text-gray-400">Queue status</p>
                  <p className="text-lg font-black text-green-500">Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: FAQ ===== */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em] mb-4">FAQ</p>
            <h2 className="text-4xl font-black tracking-[-0.03em] text-gray-900">Common Questions</h2>
          </div>
          
          <div className="space-y-3">
            {[
              { q: 'Is Xylos AI completely free?', a: 'Yes, we aggregate open-source models like Llama 3, Gemini, and Mistral to provide premium AI at zero cost. No subscriptions, no hidden fees.' },
              { q: 'What models are available?', a: 'We support 7+ models including Llama 3.3, Gemini 2.5 Flash, Mistral Large, Command R+, and DeepSeek V3. Our smart router picks the best one for your task.' },
              { q: 'Is my data private?', a: 'Absolutely. Every session is ephemeral with zero data retention. We don\'t train on your content and don\'t sell your information.' },
            ].map((item, i) => (
              <div key={i} className="group p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.q}</h3>
                <p className="text-gray-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterForm />

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-gray-100 py-16 px-6 md:px-12 lg:px-20 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2 space-y-4">
              <AnimatedLogo />
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                Empowering professionals with top-tier AI models. Zero cost, infinite possibilities.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Platform</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <Link href="/blog" className="hover:text-blue-500 transition-colors">Blog</Link>
                <Link href="/about" className="hover:text-blue-500 transition-colors">About</Link>
                <Link href="/privacy" className="hover:text-blue-500 transition-colors">Privacy</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Connect</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">GitHub</a>
                <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-gray-300 uppercase tracking-widest">© 2026 Xylos Foundation</p>
            <p className="text-[10px] text-gray-300 uppercase tracking-widest">Research by 21dev.in</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
