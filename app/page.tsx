// Build Invalidation Trigger: V1.1.1 - ISR Static Optimization & Fixes
import { createClient as createPublicClient } from "@supabase/supabase-js";
import { ArrowRight, Code2, FileText, Shield, Sparkles, Zap, Globe, MessageSquare } from "lucide-react";
import Link from "next/link";
import { RevealText } from "@/components/ui/reveal-text";
import { BentoGrid, BentoCard } from "@/components/premium/bento-grid";
import { BlogGrid } from "@/components/landing/blog-grid";
import { AnimatedHeader, AnimatedItem, FadeIn } from "@/components/landing/animated-sections";
import { TiltCard } from "@/components/premium/tilt-card";
import { AnimatedLogo } from "@/components/premium/animated-logo";
import { NewsletterForm } from "@/components/landing/newsletter-form";
import { HeroCTA } from "@/components/landing/hero-cta";

// ISR: Cache this page at Vercel CDN edge for 30 minutes.
// Eliminates the 960ms document request latency on repeat visits.
export const revalidate = 1800;

export default async function LandingPage() {
  // No server-side auth check — auth is handled client-side by HeroCTA.
  // This makes the page a true ISR static page, cached at Vercel CDN edge.
  const publicSupabase = createPublicClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Initial Fetch: Blogs without join to avoid 406 Not Acceptable errors on missing FKs
  const { data: blogsData, error: blogsError } = await publicSupabase
    .from("blogs")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(6);

  // Manual Enrichment: Fetch profiles for the authors
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
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden selection:bg-primary/30 text-foreground transition-colors duration-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Dynamic Background Glows - Hidden on mobile for performance and clarity */}
      <div className="hidden md:block absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-60">
         <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full mix-blend-overlay animate-pulse" />
         <div className="absolute top-[15%] -right-[5%] w-[40%] h-[40%] bg-secondary/15 blur-[120px] rounded-full mix-blend-overlay animate-pulse [animation-delay:2s]" />
      </div>

      <main className="flex-1 flex flex-col items-center pt-28 md:pt-48 px-4 md:px-6 pb-20 relative z-10 w-full">
        <div className="max-w-6xl w-full text-center space-y-12">
          <div className="hidden md:inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-muted/30 border border-border shadow-sm mb-4">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
             </span>
             <span className="text-[9px] font-black tracking-[0.4em] uppercase text-muted-foreground">
                Xylos Platform <span className="text-primary">v3.5</span> Certified
             </span>
          </div>

          <div className="space-y-4 max-w-5xl mx-auto">
            <h1 className="block">
              <RevealText 
                text="XYLOS AI: FREE AI CHAT. REFINE YOUR NARRATIVE." 
                fontSize="text-[1.5rem] sm:text-[2.2rem] md:text-[4.5rem] lg:text-[5.5rem]"
                textColor="text-foreground"
                overlayColor="text-primary"
                letterDelay={0.04}
              />
              <span className="sr-only">Access Llama 3, Gemini, and Mistral in one free platform.</span>
            </h1>
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="h-px w-8 md:w-16 bg-primary/30" />
              <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-primary italic animate-pulse">Intelligent Editorial Suite</span>
              <div className="h-px w-8 md:w-16 bg-primary/30" />
            </div>
          </div>

          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed mt-4 italic px-4 md:px-0">
            "Bridging the gap between raw information and polished intelligence. Xylos AI empowers professionals to synthesize reality."
          </p>

          <HeroCTA />
        </div>

        {/* Blog Feed Section */}
        <div id="stories" className="w-full mt-20">
          <BlogGrid blogs={blogs || []} />
        </div>

        {/* Modular Systems Section */}
        <div id="features" className="w-full max-w-7xl mx-auto mt-40 space-y-24">
           <AnimatedHeader className="text-center space-y-4 px-4 mt-20 md:mt-40">
              <AnimatedItem className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">Core Capacities</AnimatedItem>
              <AnimatedItem y={20} className="text-3xl md:text-6xl font-black font-fustat uppercase tracking-tighter">Human <span className="italic text-muted-foreground">Intelligence</span> Amplified</AnimatedItem>
              <AnimatedItem y={20} className="hidden md:block text-lg text-muted-foreground font-medium max-w-2xl mx-auto italic">High-fidelity tools meeting modern architectural standards.</AnimatedItem>
           </AnimatedHeader>
           
           <BentoGrid>
             <BentoCard delay={0.1} className="col-span-1 md:col-span-2 bg-card/40 border border-border backdrop-blur-xl group/card">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/card:opacity-10 transition-opacity">
                   <Globe aria-hidden="true" className="w-32 h-32 text-primary" />
                </div>
                <MessageSquare aria-hidden="true" className="w-10 h-10 text-primary mb-8" />
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Unified Intelligence</h3>
                <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-md">Access 7+ industry-leading AI models like Llama 3, Gemini, and Mistral in one interface. Our smart engine routes requests to the optimal provider.</p>
             </BentoCard>

             <BentoCard delay={0.2} className="col-span-1 md:col-span-1 bg-card/40 border border-border backdrop-blur-xl">
                <Code2 className="w-10 h-10 text-secondary mb-8" />
                <h3 className="text-xl font-black mb-4 uppercase tracking-tight italic">Dev Suite</h3>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">Synthesize clean, optimized code. Our assistants are specialized in full-stack architectures and modern frameworks.</p>
             </BentoCard>

             <BentoCard delay={0.3} className="col-span-1 md:col-span-1 bg-card/40 border border-border backdrop-blur-xl">
                <FileText className="w-10 h-10 text-accent mb-8" />
                <h3 className="text-xl font-black mb-4 uppercase tracking-tight italic">Content Intelligence</h3>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">Advanced parsing for large-scale datasets. Extract strategic insights from complex documentation in seconds.</p>
             </BentoCard>

             <BentoCard delay={0.4} className="col-span-1 md:col-span-4 bg-card/40 border border-border backdrop-blur-xl overflow-hidden group/card">
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover/card:opacity-10 transition-opacity">
                   <Shield aria-hidden="true" className="w-64 h-64 text-primary" />
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                  <div className="max-w-2xl space-y-6">
                     <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Security Standards</div>
                     <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none italic">Hardened <span className="text-muted-foreground">Data Governance</span></h2>
                     <p className="text-muted-foreground text-lg font-medium leading-relaxed italic">"Privacy is our foundation." Encrypted workflows and local session storage protect your professional edge.</p>
                  </div>
                  <Shield aria-hidden="true" className="w-32 h-32 text-primary/20 shrink-0" />
                </div>
             </BentoCard>
           </BentoGrid>
         </div>

         {/* About Xylos Text Content for SEO */}
         <div className="w-full max-w-4xl mx-auto mt-32 px-6 text-center space-y-6 bg-card/20 p-8 md:p-12 rounded-[3rem] border border-border/30 backdrop-blur-sm">
           <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">The Ultimate Free AI Chat & Content Platform</h2>
           <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
             Xylos AI is designed to bridge the gap between raw data and polished intelligence. As a premier <strong className="text-foreground">free AI chat</strong> platform, we provide unparalleled access to industry-leading models including <strong className="text-foreground">Llama 3, Gemini, and Mistral</strong> without the burden of subscription fees. Our intelligent routing system automatically selects the optimal neural network for your specific queries, whether you are drafting professional blogs, writing complex code, or conducting deep academic research. By aggregating these powerful tools into a single, unified workspace, Xylos AI empowers creators, developers, and professionals to refine their narratives and amplify their productivity at zero cost. Experience the future of generative AI today.
           </p>
         </div>

        {/* FAQ Section */}
        <div className="w-full max-w-4xl mx-auto mt-40 mb-10 px-6">
          <FadeIn className="text-center mb-16 space-y-4">
             <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Help & Support</div>
             <h2 className="text-4xl font-black uppercase tracking-tighter">Common <span className="italic text-primary">Clarifications</span></h2>
          </FadeIn>
          <div className="space-y-6">
            <TiltCard degree={2}>
              <div className="p-6 md:p-10 rounded-[2rem] bg-card border border-border/50 backdrop-blur-xl shadow-sm hover:border-primary/30 transition-all group h-full relative z-10">
                 <h3 className="text-xl font-black mb-3 uppercase tracking-tight flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary group-hover:animate-bounce" />
                    How is the platform zero-cost?
                 </h3>
                 <p className="text-muted-foreground font-medium leading-relaxed italic">We utilize open-source models and intelligent tiered routing to ensure high-performance AI tools remain accessible for professional research and development.</p>
              </div>
            </TiltCard>
            <TiltCard degree={2}>
              <div className="p-6 md:p-10 rounded-[2rem] bg-card border border-border/50 backdrop-blur-xl shadow-sm hover:border-primary/30 transition-all group h-full relative z-10">
                 <h3 className="text-xl font-black mb-3 uppercase tracking-tight flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-secondary group-hover:animate-spin" />
                    What about reliability?
                 </h3>
                 <p className="text-muted-foreground font-medium leading-relaxed italic">Our infrastructure employs a multi-provider strategy. If a primary model experience latency, the system seamlessly redirects tasks to ensure consistent professional workflows.</p>
              </div>
            </TiltCard>
          </div>
        </div>

        <NewsletterForm />
      </main>
      
      <footer className="border-t border-border pt-16 pb-8 bg-card/40 backdrop-blur-3xl px-8 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-50" />
         <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center md:items-start gap-6">
              <AnimatedLogo className="scale-110 origin-center md:origin-left" />
              <p className="text-xs text-muted-foreground font-medium max-w-xs text-center md:text-left">
                Empowering professionals with top-tier AI models including Llama 3, Gemini, and Mistral.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-12 text-center md:text-left">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.3em]">Platform</h4>
                <div className="flex flex-col gap-3 text-xs text-muted-foreground font-medium">
                  <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                  <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
                  <Link href="/blog" className="hover:text-primary transition-colors">Blog Archive</Link>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.3em]">Connect</h4>
                <div className="flex flex-col gap-3 text-xs text-muted-foreground font-medium">
                  <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Twitter (X)</a>
                  <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
                  <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">YouTube</a>
                  <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Facebook</a>
                  <a href="https://github.com/surinder2003k" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
                <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.3em]">Contact</p>
                <p className="text-xs text-muted-foreground font-medium">100 Innovation Drive</p>
                <p className="text-xs text-muted-foreground font-medium">San Francisco, CA 94105, USA</p>
                <p className="text-xs text-muted-foreground font-medium">+1-800-555-0199</p>
                <p className="text-xs text-muted-foreground font-medium">support@xylosai.com</p>
            </div>
         </div>
         
         <div className="relative z-10 max-w-7xl mx-auto mt-16 pt-8 border-t border-border/50 text-center">
            <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">© 2026 Xylos Foundation // Research by 21dev.in</p>
         </div>
      </footer>
    </div>
  );
}
