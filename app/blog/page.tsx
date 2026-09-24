import { SITE_URL } from "@/lib/site-config";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { BlogGrid } from "@/components/landing/blog-grid";


export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }): Promise<Metadata> {
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");

  const pageSuffix = page > 1 ? `?page=${page}` : "";
  const canonical = `${SITE_URL}/blog${pageSuffix}`;
  const pageTitle = page > 1
    ? `AI Blog — Page ${page} | Xylos AI`
    : `AI Blog — Insights on Technology, AI & Innovation | Xylos AI`;

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

export default async function BlogArchivePage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, parseInt(searchParams.page || "1") || 1);
  const limit = 9;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const supabase = await createClient();

  // Fetch only card fields; article content can be very large and slows the archive.
  const queryBuilder = supabase
    .from("blogs")
    .select("id, slug, title, excerpt, feature_image_url, category, published_at", { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const { data: postsData, count: totalCount } = await queryBuilder.range(from, to);
  const postsFinal = postsData || [];

  const totalPages = totalCount ? Math.ceil(totalCount / limit) : 0;
  const currentPage = Math.min(page, Math.max(1, totalPages));

  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  const buildHref = (targetPage: number) => `/blog?page=${targetPage}`;

  return (
    <div className="editorial-page min-h-screen overflow-x-hidden bg-[#0d0e10] text-white">
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 md:px-8 md:pt-32">
        <section className="relative mb-12 overflow-hidden border-b border-white/[0.08] pb-10 md:mb-16 md:pb-14">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#36b7b0]/[0.07] blur-3xl" aria-hidden="true" />
          <div className="relative grid gap-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#36b7b0]">
                The Xylos AI journal
              </p>
              <h1 className="max-w-4xl text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-[#eeeae2] sm:text-5xl md:text-6xl">
                Ideas for an <span className="text-[#36b7b0]">intelligent</span> future.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#a8a59e] md:text-lg">
                Clear, practical writing on artificial intelligence, software, and the technologies shaping how we work.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start border-l border-[#36b7b0]/30 pl-4 md:self-end">
              <span className="font-mono text-2xl font-semibold text-[#eeeae2]">{totalCount ?? 0}</span>
              <span className="max-w-[72px] font-mono text-[9px] uppercase leading-4 tracking-[0.16em] text-[#77756f]">
                Published stories
              </span>
            </div>
          </div>
        </section>

        <div className="mb-7 flex items-center gap-4">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b8b4ac]">Latest stories</span>
          <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" aria-hidden="true" />
        </div>

        <BlogGrid blogs={postsFinal} />

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-8 pt-12 mt-20" style={{ borderTop: '1px solid rgba(190, 184, 170, 0.2)' }}>
            {hasPrev ? (
              <Link href={buildHref(currentPage - 1)} className="px-8 py-4 rounded-xl font-semibold text-sm hover:bg-[rgba(54,183,176,0.12)] hover:text-[#36b7b0] transition-all duration-300" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Previous
              </Link>
            ) : (
              <div className="px-8 py-4 rounded-xl text-gray-600 font-semibold text-sm cursor-not-allowed" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Previous
              </div>
            )}

            <div className="text-sm font-semibold" style={{ color: '#8d8b85' }}>
              {currentPage} / {totalPages}
            </div>

            {hasNext ? (
              <Link href={buildHref(currentPage + 1)} className="px-8 py-4 rounded-xl font-semibold text-sm hover:bg-[rgba(54,183,176,0.12)] hover:text-[#36b7b0] transition-all duration-300" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
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
            <Link href="/about" className="hover:text-[#36b7b0] transition-colors" style={{ color: '#8d8b85' }}>About</Link>
            <Link href="/blog" className="hover:text-[#36b7b0] transition-colors" style={{ color: '#8d8b85' }}>Blog</Link>
            <Link href="/contact" className="hover:text-[#36b7b0] transition-colors" style={{ color: '#8d8b85' }}>Contact</Link>
            <Link href="/terms" className="hover:text-[#36b7b0] transition-colors" style={{ color: '#8d8b85' }}>Terms</Link>
            <Link href="/cookies" className="hover:text-[#36b7b0] transition-colors" style={{ color: '#8d8b85' }}>Cookies</Link>
            <Link href="/privacy" className="hover:text-[#36b7b0] transition-colors" style={{ color: '#8d8b85' }}>Privacy</Link>
          </div>
          <p className="text-[12px] font-medium" style={{ color: '#5a6c6d' }}>
            &copy; {new Date().getFullYear()} Xylos AI
          </p>
        </div>
      </footer>
    </div>
  );
}
