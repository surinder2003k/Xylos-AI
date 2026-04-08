import { createClient as createPublicClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight, MessageSquare, Code2, FileText, Shield, Sparkles, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { RevealText } from "@/components/ui/reveal-text";
import { BentoGrid, BentoCard } from "@/components/premium/bento-grid";
import { BlogGrid } from "@/components/landing/blog-grid";
import { AnimatedHeader, AnimatedItem, FadeIn } from "@/components/landing/animated-sections";
import { TiltCard } from "@/components/premium/tilt-card";
import { AnimatedLogo } from "@/components/premium/animated-logo";
import { NewsletterForm } from "@/components/landing/newsletter-form";
import { Navbar } from "@/components/landing/navbar";

export default async function LandingPage() {
  const supabase = await createClient();
  const publicSupabase = createPublicClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  
  const { data: { user } } = await supabase.auth.getUser();
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
      
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-60">
         <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full mix-blend-overlay animate-pulse" />
         <div className="absolute top-[15%] -right-[5%] w-[40%] h-[40%] bg-secondary/15 blur-[120px] rounded-full mix-blend-overlay animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Navbar user={user} />

      <main className="flex-1 flex flex-col items-center pt-48 px-6 pb-20 relative z-10 w-full">
        <div className="max-w-6xl w-full text-center space-y-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-muted/30 border border-border shadow-sm mb-4">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
             </span>
             <span className="text-[9px] font-black tracking-[0.4em] uppercase text-muted-foreground">
                Xylos Platform <span className="text-primary">v3.5</span> Certified
             </span>
          </div>

          <div className="space-y-4 max-w-5xl mx-auto">
            <RevealText 
              text="REFINE YOUR NARRATIVE." 
              fontSize="text-[3rem] md:text-[5.5rem] lg:text-[7rem]"
              textColor="text-foreground"
              overlayColor="text-primary"
              letterDelay={0.05}
            />
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="h-px w-8 md:w-16 bg-primary/30" />
              <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-primary italic animate-pulse">Intelligent Editorial Suite</span>
              <div className="h-px w-8 md:w-16 bg-primary/30" />
            </div>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed mt-4 italic">
            "Bridging the gap between raw information and polished intelligence. Xylos AI empowers professionals to synthesize reality."
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link 
              href={user ? "/dashboard" : "/login"}
              className="flex items-center gap-4 px-12 py-5 rounded-2xl bg-foreground text-background font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all group w-full sm:w-auto"
            >
              {user ? "Go to Dashboard" : "Start Building"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link 
              href="#stories"
              className="px-12 py-5 rounded-2xl border border-border bg-card/40 backdrop-blur-md font-black text-xs uppercase tracking-widest hover:bg-muted/50 transition-all w-full sm:w-auto text-foreground"
            >
              Browse Stories
            </Link>
          </div>
        </div>

        {/* Blog Feed Section */}
        <div id="stories" className="w-full mt-20">
          <BlogGrid blogs={blogs || []} />
        </div>

        {/* Modular Systems Section */}
        <div id="features" className="w-full max-w-7xl mx-auto mt-40 space-y-24">
           <AnimatedHeader className="text-center space-y-4 px-4">
              <AnimatedItem className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">Core Capacities</AnimatedItem>
              <AnimatedItem y={20} className="text-4xl md:text-6xl font-black font-fustat uppercase tracking-tighter">Human <span className="italic text-muted-foreground">Intelligence</span> Amplified</AnimatedItem>
              <AnimatedItem y={20} className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto italic">High-fidelity tools meeting modern architectural standards.</AnimatedItem>
           </AnimatedHeader>
           
           <BentoGrid>
             <BentoCard delay={0.1} className="col-span-1 md:col-span-2 bg-card/40 border border-border backdrop-blur-xl group/card">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/card:opacity-10 transition-opacity">
                   <Globe className="w-32 h-32 text-primary" />
                </div>
                <MessageSquare className="w-10 h-10 text-primary mb-8" />
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Unified Intelligence</h3>
                <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-md">Access 7+ industry-leading AI models in one interface. Our smart engine automatically routes requests to the optimal provider for your specific needs.</p>
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

              <div className="col-span-1 md:col-span-4" style={{ perspective: "2000px" }}>
                <div 
                  style={{ transform: "rotateX(12deg) scale(0.97)", transformOrigin: "top center" }} 
                  className="flex flex-col md:flex-row items-center gap-12 justify-between bg-primary text-black p-12 rounded-[2.5rem] overflow-hidden relative border-none shadow-2xl shadow-primary/20 transition-all duration-700 hover:rotateX(4deg) hover:scale-100 will-change-transform"
                >
                 <div className="absolute -left-[5%] top-0 bottom-0 w-[20%] bg-white/30 blur-[100px] animate-pulse" />
                 <div className="max-w-2xl space-y-6 relative z-10">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Security Standards</div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none italic">Hardened Data Governance</h2>
                    <p className="text-lg font-bold opacity-80 leading-relaxed italic">"Privacy is our foundation." Encrypted workflows, local session storage, and zero-data-retention models to protect your professional edge.</p>
                 </div>
                 <Shield className="w-32 h-32 opacity-20 relative z-10" />
               </div>
             </div>
           </BentoGrid>
        </div>

        {/* FAQ Section */}
        <div className="w-full max-w-4xl mx-auto mt-40 mb-10 px-6">
          <FadeIn className="text-center mb-16 space-y-4">
             <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Help & Support</div>
             <h2 className="text-4xl font-black uppercase tracking-tighter">Common <span className="italic text-primary">Clarifications</span></h2>
          </FadeIn>
          <div className="space-y-6">
            <TiltCard degree={4}>
              <div className="p-10 rounded-[2rem] bg-card border border-border/50 backdrop-blur-xl shadow-sm hover:border-primary/30 transition-all group h-full relative z-10">
                 <h3 className="text-xl font-black mb-3 uppercase tracking-tight flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary group-hover:animate-bounce" />
                    How is the platform zero-cost?
                 </h3>
                 <p className="text-muted-foreground font-medium leading-relaxed italic">We utilize open-source models and intelligent tiered routing to ensure high-performance AI tools remain accessible for professional research and development.</p>
              </div>
            </TiltCard>
            <TiltCard degree={4}>
              <div className="p-10 rounded-[2rem] bg-card border border-border/50 backdrop-blur-xl shadow-sm hover:border-primary/30 transition-all group h-full relative z-10">
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
      
      {/* Footer */}
      <footer className="border-t border-border py-16 bg-card/40 backdrop-blur-3xl px-8 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-50" />
         <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col items-center gap-6">
              <AnimatedLogo className="scale-110" />
              
              <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-8">
                 <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
                 <Link href="#" className="hover:text-primary transition-colors">Ethics</Link>
                 <Link href="#" className="hover:text-primary transition-colors">Resources</Link>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.6em] mb-4">Professional Intelligence Standard</p>
                <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">© 2026 Xylos Foundation // Research by 21dev.in</p>
              </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
