import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { Search, Filter, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { BlogGrid } from "@/components/landing/blog-grid";
import { BlogFilters } from "@/components/landing/blog-filters";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import { XylosLogo } from "@/components/premium/xylos-logo";


export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }): Promise<Metadata> {
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");
  const category = sp.category || "all";

  const pageSuffix = page > 1 ? `?page=${page}` : "";
  const canonical = `https://xylosai.vercel.app/blog${pageSuffix}`;
  const catSuffix = category !== "all" ? ` — ${category}` : "";
  const pageTitle = page > 1
    ? `AI Blog — Page ${page}${catSuffix} | Xylos AI`
    : `AI Blog — Insights on Technology, AI & Innovation${catSuffix} | Xylos AI`;

  return {
    title: pageTitle,
    description: "Explore expert articles on artificial intelligence, technology trends, and digital innovation. Written and curated by the Xylos AI editorial engine.",
    alternates: { canonical },
    openGraph: {
      title: pageTitle,
      description: "Deep-dive articles on AI, machine learning, and emerging tech — curated by automated intelligence.",
      url: canonical,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Xylos AI Blog' }],
    },
  };
}

export const revalidate = 600;

const CANONICAL_CATEGORIES = [
  "Technology", "AI & Machine Learning", "Cybersecurity",
  "Software Development", "Cloud & DevOps", "Consumer Tech",
  "Blockchain & Crypto", "Space & Science",
] as const;

function sanitizeSearchTerm(raw: string): string {
  return raw
    .replace(/[\\%_]/g, (m) => `\\${m}`)
    .replace(/["'(),{}[\]\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

function qs(value: string): string {
  return encodeURIComponent(value);
}

export default async function BlogArchivePage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, parseInt(searchParams.page || "1") || 1);
  const category = searchParams.category || "all";
  const query = (searchParams.q || "").trim();

  const limit = 9;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();

  // Fetch real categories from DB so the filter UI reflects actual content
  const { data: catRows } = await supabase
    .from("blogs")
    .select("category")
    .not("category", "is", null)
    .eq("status", "published");

  const realCats = Array.from(new Set(catRows?.map((r) => r.category).filter(Boolean))) as string[];
  const orderedCategories = [...CANONICAL_CATEGORIES].filter((c) => realCats.includes(c));
  const extraCategories = realCats.filter((c) => !(CANONICAL_CATEGORIES as readonly string[]).includes(c));
  const availableCategories = ["all", ...orderedCategories, ...extraCategories.sort()];

  const sanitizedQuery = query ? sanitizeSearchTerm(query) : "";

  let queryBuilder = supabase
    .from("blogs")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (sanitizedQuery) {
    queryBuilder = queryBuilder.or("title.like:*" + sanitizedQuery + "*,content.like:*" + sanitizedQuery + "*");
  }
  if (category !== "all") {
    queryBuilder = queryBuilder.ilike("category", category);
  }

  const { data: postsData, error: fetchError, count: totalCount } = await queryBuilder.range(from, to);
  const postsFinal = postsData || [];

  const totalPages = totalCount ? Math.ceil(totalCount / limit) : 0;
  const currentPage = Math.min(page, Math.max(1, totalPages));

  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (query) params.set("q", query);
    params.set("page", String(targetPage));
    return `/blog?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00f0ff] via-[#a78bfa] to-[#fb7185] bg-clip-text text-transparent">
            AI Blog — Insights on Technology, AI & Innovation
          </h1>
          <p className="text-gray-400 text-base max-w-2xl mx-auto">
            Deep-dive articles on AI, machine learning, and emerging tech — curated by automated intelligence.
          </p>
        </section>

        <Suspense fallback={<div className="text-center py-8">Loading filters…</div>}>
          <div className="mb-8">
            <BlogFilters categories={availableCategories} />
          </div>
        </Suspense>

        <div className="flex justify-between items-center mb-6 text-sm">
          <span className="text-gray-400">
            {totalCount} {totalCount === 1 ? "article" : "articles"} found
            {category !== "all" ? ` in ${category}` : ""}
            {query ? ` for "${query}"` : ""}
          </span>
        </div>

        <BlogGrid blogs={postsFinal} />

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-8 pt-12 mt-20" style={{ borderTop: '1px solid rgba(59, 73, 75, 0.2)' }}>
            {hasPrev ? (
              <Link href={buildHref(currentPage - 1)} className="px-8 py-4 rounded-xl font-semibold text-sm hover:bg-[rgba(0,240,255,0.12)] hover:text-[#00f0ff] transition-all duration-300" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Previous
              </Link>
            ) : (
              <div className="px-8 py-4 rounded-xl text-gray-600 font-semibold text-sm cursor-not-allowed" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Previous
              </div>
            )}

            <div className="text-sm font-semibold" style={{ color: '#849495' }}>
              {currentPage} / {totalPages}
            </div>

            {hasNext ? (
              <Link href={buildHref(currentPage + 1)} className="px-8 py-4 rounded-xl font-semibold text-sm hover:bg-[rgba(0,240,255,0.12)] hover:text-[#00f0ff] transition-all duration-300" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Next
              </Link>
            ) : (
              <div className="px-8 py-4 rounded-xl text-gray-600 font-semibold text-sm cursor-not-allowed" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Next
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-16 px-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <Link href="/about" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>About</Link>
            <Link href="/blog" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Blog</Link>
            <Link href="/contact" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Contact</Link>
            <Link href="/terms" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Terms</Link>
            <Link href="/cookies" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Cookies</Link>
            <Link href="/privacy" className="hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>Privacy</Link>
          </div>
          <p className="text-[12px] font-medium" style={{ color: '#5a6c6d' }}>
            &copy; {new Date().getFullYear()} Xylos AI
          </p>
        </div>
      </footer>
    </div>
  );
}
