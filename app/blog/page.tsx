import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { ArrowLeft, Diamond, Search, Filter, BookOpen } from "lucide-react";
import Link from "next/link";
import { BlogGrid } from "@/components/landing/blog-grid";
import { BlogFilters } from "@/components/landing/blog-filters";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import { XylosLogo } from "@/components/premium/xylos-logo";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "AI Blog — Insights on Technology, AI & Innovation | Xylos AI",
  description: "Explore expert articles on artificial intelligence, technology trends, and digital innovation. Written and curated by the Xylos AI editorial engine.",
  alternates: {
    canonical: 'https://xylosai.vercel.app/blog',
  },
  openGraph: {
    title: "AI Blog — Technology & Innovation Insights | Xylos AI",
    description: "Deep-dive articles on AI, machine learning, and emerging tech — curated by automated intelligence.",
    url: 'https://xylosai.vercel.app/blog',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Xylos AI Blog' }],
  },
};

export default async function BlogArchivePage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || "1");
  const category = searchParams.category || "all";
  const query = searchParams.q || "";
  
  const limit = 9;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const publicSupabase = createPublicClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  
  // Robust Fetching: Decouple post from profile to avoid 406/404 on missing FKs
  let dbQuery = publicSupabase
    .from("blogs")
    .select("*", { count: 'exact' })
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (category && category !== "all") {
    dbQuery = dbQuery.eq("category", category);
  }
  
  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`);
  }

  const { data: blogsData, count } = await dbQuery.range(from, to);

  // Manual Enrichment: Fetch profiles for the authors
  let blogs = blogsData;
  if (blogsData && blogsData.length > 0) {
    const authorIds = [...new Set(blogsData.map(b => b.author_id))].filter(Boolean);
    const { data: profiles } = await publicSupabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", authorIds);

    blogs = blogsData.map(blog => ({
      ...blog,
      profiles: profiles?.find(p => p.user_id === blog.author_id)
    }));
  }

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Editorial Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group/logo cursor-pointer">
            <XylosLogo className="w-10 h-10" />
            <span className="font-fustat font-black text-2xl tracking-tighter uppercase">Xylos<span className="text-primary italic">AI</span></span>
          </Link>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Link 
              href="/"
              className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all flex items-center group/back"
            >
               <ArrowLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" /> Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-40 pb-24 px-6 relative">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Refined Editorial Hero */}
          <div className="text-center space-y-6 max-w-4xl mx-auto">
             <div className="flex justify-center">
                <div className="px-5 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                   <BookOpen className="w-3 h-3" /> The Perspective
                </div>
             </div>
             <h1 className="text-6xl md:text-8xl font-black font-fustat tracking-[ -0.05em] uppercase leading-[0.85] italic">Editorial <br /><span className="text-muted-foreground underline decoration-primary/30 underline-offset-8">Archives</span></h1>
             <p className="text-muted-foreground text-xl font-medium pt-4 max-w-2xl mx-auto leading-relaxed">
               Deep dives into the intersection of artificial intelligence, high-stakes reporting, and the human narrative.
             </p>
          </div>

          <div className="border-y border-border py-8">
            <Suspense fallback={<div className="h-20" />}>
              <BlogFilters />
            </Suspense>
          </div>

          <BlogGrid blogs={blogs || []} />

          {/* Pagination Component */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-8 pt-12 border-t border-border mt-20">
              {page > 1 ? (
                 <Link href={`/blog?page=${page - 1}${category !== 'all' ? `&category=${category}` : ''}${query ? `&q=${query}` : ''}`} className="px-8 py-4 rounded-2xl bg-muted border border-border text-foreground font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary hover:text-black hover:border-primary transition-all">
                   Previous
                 </Link>
              ) : (
                 <div className="px-8 py-4 rounded-2xl bg-muted/50 border border-border/50 text-muted-foreground/30 font-black text-[10px] uppercase tracking-[0.3em] cursor-not-allowed">
                   Previous
                 </div>
              )}
              
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em]">
                {page} / {totalPages}
              </div>

              {page < totalPages ? (
                  <Link href={`/blog?page=${page + 1}${category !== 'all' ? `&category=${category}` : ''}${query ? `&q=${query}` : ''}`} className="px-8 py-4 rounded-2xl bg-muted border border-border text-foreground font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary hover:text-black hover:border-primary transition-all">
                   Next
                 </Link>
              ) : (
                 <div className="px-8 py-4 rounded-2xl bg-muted/50 border border-border/50 text-muted-foreground/30 font-black text-[10px] uppercase tracking-[0.3em] cursor-not-allowed">
                   Next
                 </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-border py-24 px-8 text-center bg-card">
         <div className="max-w-2xl mx-auto space-y-8">
            <XylosLogo className="w-12 h-12 mx-auto opacity-20" />
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.6em]">Xylos Editorial Core // Human-Guided AI</p>
            <div className="flex justify-center gap-10 opacity-30 text-[9px] font-bold uppercase tracking-widest">
               <a href="#" className="hover:text-primary transition-colors">Integrity Policy</a>
               <a href="#" className="hover:text-primary transition-colors">Neural Standards</a>
               <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            </div>
         </div>
      </footer>
    </div>
  );
}

