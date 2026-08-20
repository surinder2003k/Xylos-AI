import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { Search, Filter, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { BlogGrid } from "@/components/landing/blog-grid";
import { BlogFilters } from "@/components/landing/blog-filters";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import { XylosLogo } from "@/components/premium/xylos-logo";


export const metadata: Metadata = {
  title: "AI Blog — Insights on Technology, AI & Innovation",
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

export const revalidate = 600;

export default async function BlogArchivePage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || "1");
  const category = searchParams.category || "all";
  const query = searchParams.q || "";
  
  const limit = 9;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const publicSupabase = createPublicClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  
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
    <div className="min-h-screen" style={{ background: '#0a0b0e', color: '#e2e2e8' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://xylosai.vercel.app" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://xylosai.vercel.app/blog" }
            ]
          })
        }}
      />

      <main className="pt-32 md:pt-40 pb-24 px-6 relative">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
          {/* Hero */}
          <div className="text-center space-y-6 max-w-4xl mx-auto">
             <div className="flex justify-center">
                <div className="px-5 py-2 rounded-full text-[11px] font-medium tracking-wide flex items-center gap-2" style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}>
                   <BookOpen className="w-3 h-3" /> The Perspective
                </div>
             </div>
             <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.02] text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
               Editorial <br />
               <span style={{ color: '#00f0ff' }}>Archives</span>
             </h1>
             <p className="text-gray-400 text-lg font-medium pt-4 max-w-2xl mx-auto leading-relaxed">
               Deep dives into the intersection of artificial intelligence, high-stakes reporting, and the human narrative.
             </p>
          </div>

          {/* Filters */}
          <div className="py-8" style={{ borderTop: '1px solid rgba(59, 73, 75, 0.2)', borderBottom: '1px solid rgba(59, 73, 75, 0.2)' }}>
            <Suspense fallback={<div className="h-20" />}>
              <BlogFilters />
            </Suspense>
          </div>

          {/* Blog Grid */}
          <BlogGrid blogs={blogs || []} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-8 pt-12 mt-20" style={{ borderTop: '1px solid rgba(59, 73, 75, 0.2)' }}>
              {page > 1 ? (
                 <Link href={`/blog?page=${page - 1}${category !== 'all' ? `&category=${category}` : ''}${query ? `&q=${query}` : ''}`} className="px-8 py-4 rounded-xl font-semibold text-[13px] hover:bg-[rgba(0,240,255,0.12)] hover:text-[#00f0ff] transition-all duration-300" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                   Previous
                 </Link>
              ) : (
                 <div className="px-8 py-4 rounded-xl text-gray-600 font-semibold text-[13px] cursor-not-allowed" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                   Previous
                 </div>
              )}
              
              <div className="text-[13px] font-semibold" style={{ color: '#849495' }}>
                {page} / {totalPages}
              </div>

              {page < totalPages ? (
                  <Link href={`/blog?page=${page + 1}${category !== 'all' ? `&category=${category}` : ''}${query ? `&q=${query}` : ''}`} className="px-8 py-4 rounded-xl font-semibold text-[13px] hover:bg-[rgba(0,240,255,0.12)] hover:text-[#00f0ff] transition-all duration-300" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                   Next
                 </Link>
              ) : (
                 <div className="px-8 py-4 rounded-xl text-gray-600 font-semibold text-[13px] cursor-not-allowed" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                   Next
                 </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-24 px-8 text-center" style={{ borderTop: '1px solid rgba(59, 73, 75, 0.2)' }}>
         <div className="max-w-2xl mx-auto space-y-8">
            <XylosLogo className="w-12 h-12 mx-auto opacity-15" />
            <p className="text-[12px] font-medium" style={{ color: '#5a6c6d' }}>Xylos Editorial</p>
            <div className="flex justify-center gap-10 text-[13px] font-medium">
               <Link href="/privacy" className="text-gray-600 hover:text-[#00f0ff] transition-colors">Privacy Policy</Link>
               <Link href="/about" className="text-gray-600 hover:text-[#00f0ff] transition-colors">About Xylos</Link>
               <Link href="/blog" className="text-gray-600 hover:text-[#00f0ff] transition-colors">Archive</Link>
            </div>
         </div>
      </footer>
    </div>
  );
}
