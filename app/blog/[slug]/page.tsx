import { createClient } from "@/utils/supabase/server";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import { Clock, Share2, Copy, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { formatIST } from "@/lib/utils/date-format";
import { ShareButtons } from "@/components/blog/share-buttons";
import { Metadata } from "next";
import remarkGfm from "remark-gfm";

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<object\b[^>]*>.*?<\/object>/gi, '')
    .replace(/color:\s*[^;"]+;?/gi, "")
    .replace(/background-color:\s*[^;"]+;?/gi, "")
    .replace(/background:\s*[^;"]+;?/gi, "");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const supabase = await createClient();
  const { slug } = await params;
  const { data: post } = await supabase.from("blogs").select("*, profiles(full_name)").eq("slug", slug).single();

  if (!post) return {};

  const canonicalUrl = `https://xylosai.vercel.app/blog/${post.slug}`;
  const imageUrl = post.feature_image_url || 'https://xylosai.vercel.app/og-image.png';

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.keywords,
    authors: [{ name: post.profiles?.full_name || 'Xylos AI Research' }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
      url: canonicalUrl,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at || post.published_at,
      authors: [post.profiles?.full_name || 'Xylos AI Research'],
      tags: post.keywords ? [post.keywords] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: [{ url: imageUrl, alt: post.title }],
    },
  };
}

function extractHeadings(content: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = [];
  const regex = /^#{2,3}\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const text = match[1].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ id, text });
  }
  return headings;
}

function estimateReadTime(content: string): string {
  const words = content?.split(/\s+/).length || 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} MIN READ`;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient();
  const { slug } = await params;

  let { data: post, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (post && post.author_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("user_id", post.author_id)
      .maybeSingle();
    post.author = profile;
  }

  if (!post) {
    const { data: idPost } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", slug)
      .maybeSingle();
    if (idPost) {
      post = idPost;
    } else {
      return notFound();
    }
  }

  const publicSupabase = createPublicClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: relatedPosts } = await publicSupabase
    .from("blogs")
    .select("slug, title, published_at, feature_image_url")
    .eq("status", "published")
    .neq("id", post.id)
    .order("published_at", { ascending: false })
    .limit(3);

  const headings = extractHeadings(post.content || '');
  const readTime = estimateReadTime(post.content || '');
  const pubDate = formatDate(post.published_at || post.created_at);
  const category = post.category || 'CYBER-INTELLIGENCE';

  const formatMarkdown = (content: string) => {
    if (!content) return "";
    return content
      .replace(/([^ \n])## /g, "$1\n\n## ")
      .replace(/([^ \n])### /g, "$1\n\n### ")
      .replace(/([^ \n])# /g, "$1\n\n# ");
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0b0e', color: '#e2e2e8' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.feature_image_url || "https://xylosai.vercel.app/og-image.png",
            "datePublished": post.created_at,
            "dateModified": post.updated_at || post.created_at,
            "author": {
              "@type": "Person",
              "name": post.author?.full_name || 'Xylos Editorial Team'
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://xylosai.vercel.app" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://xylosai.vercel.app/blog" },
              { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://xylosai.vercel.app/blog/${post.slug}` }
            ]
          })
        }}
      />

      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(10, 11, 14, 0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <Link href="/blog" className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 hover:text-[#00f0ff] transition-colors" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
        <ChevronRight className="w-3 h-3 rotate-180" />
        Blog
      </Link>
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-white" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
        <div className="w-5 h-5 rounded flex items-center justify-center text-[8px] text-white font-bold" style={{ background: '#00f0ff' }}>X</div>
        XYLOS AI
      </div>
        <ShareButtons title={post.title} excerpt={post.excerpt} slug={post.slug} />
      </header>

      <main className="pt-20">
        {/* Hero Image */}
        <div className="relative w-full" style={{ height: '70vh', minHeight: '500px' }}>
          <Image
            src={post.feature_image_url || '/og-image.png'}
            alt={post.alt_text || post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(12,14,18,0.3) 0%, rgba(12,14,18,0.6) 50%, rgba(12,14,18,1) 100%)' }} />
        </div>

        {/* Article Container */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 -mt-32 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

            {/* Main Article */}
            <article className="flex-1 max-w-4xl">
              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#00f0ff' }}>
                  {category}
                </span>
                <span className="text-gray-500">{pubDate}</span>
                <span className="text-gray-600">·</span>
                <span className="text-gray-500">{readTime}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-[-0.02em] mb-8" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
                {post.title.split(' ').map((word: string, i: number) => {
                  const highlightWords = ['AI', 'Neural', 'Intelligence', 'Network', 'Consciousness', 'Future', 'Revolution', 'Machine', 'Deep', 'Learning', 'Quantum', 'Autonomous', 'System', 'Algorithm'];
                  if (highlightWords.some(hw => word.toLowerCase().includes(hw.toLowerCase()))) {
                    return <span key={i} style={{ color: '#00f0ff' }}>{word} </span>;
                  }
                  return <span key={i}>{word} </span>;
                })}
              </h1>

              {/* Author Card */}
              <div className="flex items-center gap-4 mb-12 pb-8" style={{ borderBottom: '1px solid rgba(59, 73, 75, 0.15)' }}>
                <div className="w-11 h-11 rounded-full overflow-hidden" style={{ background: 'rgba(0,240,255,0.1)', border: '2px solid rgba(0,240,255,0.25)' }}>
                  {post.author?.avatar_url ? (
                    <img src={post.author.avatar_url} alt={post.author.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#00f0ff] text-sm font-bold">
                      {(post.author?.full_name || 'X')[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
                    {post.author?.full_name || 'Xylos Editorial Team'}
                  </h3>
                  <p className="text-[12px]" style={{ color: '#849495' }}>
                    Lead AI Researcher
                  </p>
                </div>
              </div>

              {/* Article Body */}
              <div className="prose prose-lg dark:prose-invert max-w-none
                [&_*]:text-[#a0a0b0]
                prose-headings:text-white prose-headings:font-bold prose-headings:tracking-[-0.02em]
                prose-a:text-[#00f0ff] prose-strong:text-white
                prose-blockquote:border-l-[#00f0ff] prose-blockquote:text-[#c8c8cc] prose-blockquote:italic
                prose-code:text-[#00f0ff] prose-code:bg-[rgba(0,240,255,0.05)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-[#0a0c10] prose-pre:border prose-pre:border-[rgba(255,255,255,0.08)]
                prose-img:rounded-xl prose-img:border prose-img:border-[rgba(255,255,255,0.08)]
                selection:bg-[rgba(0,240,255,0.25)]
                break-words overflow-hidden"
                style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
                {post.content && post.content.startsWith('<') ? (
                  <div
                    className="space-y-6"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
                  />
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({ children }) => {
                        const text = typeof children === 'string' ? children : '';
                        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        return <h2 id={id}>{children}</h2>;
                      },
                      blockquote: ({ children }) => (
                        <blockquote className="!border-l-2 !pl-6 !py-2 my-8" style={{ background: 'rgba(0,240,255,0.03)', borderLeft: '3px solid #00f0ff', borderRadius: '0 8px 8px 0' }}>
                          {children}
                        </blockquote>
                      ),
                      pre: ({ children }) => (
                        <div className="my-8 rounded-xl overflow-hidden" style={{ background: '#0a0c10', border: '1px solid rgba(59, 73, 75, 0.2)' }}>
                          <div className="flex items-center justify-between px-4 py-2" style={{ background: 'rgba(59, 73, 75, 0.1)', borderBottom: '1px solid rgba(59, 73, 75, 0.15)' }}>
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>code_block</span>
                            <button className="text-[9px] font-bold text-[#00f0ff] uppercase tracking-wider hover:text-white transition-colors" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>COPY</button>
                          </div>
                          <pre className="!bg-transparent !p-4 overflow-x-auto">{children}</pre>
                        </div>
                      ),
                      code: ({ children, className }) => {
                        if (className) return <code className={className}>{children}</code>;
                        return <code>{children}</code>;
                      },
                    }}
                  >
                    {formatMarkdown(post.content)}
                  </ReactMarkdown>
                )}
              </div>

              {/* Comments Section - Terminal Style */}
              <div className="mt-16 pt-8" style={{ borderTop: '1px solid rgba(59, 73, 75, 0.15)' }}>
                <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                  <span className="text-[#00f0ff]">&gt;</span> Terminal Output (Comments)
                </h3>
                <div className="rounded-xl overflow-hidden" style={{ background: '#0a0c10', border: '1px solid rgba(59, 73, 75, 0.2)' }}>
                  <div className="flex items-center gap-2 px-4 py-2" style={{ background: 'rgba(59, 73, 75, 0.1)', borderBottom: '1px solid rgba(59, 73, 75, 0.15)' }}>
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    <span className="text-[9px] text-gray-600 ml-2 uppercase tracking-wider" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>terminal_v1.0</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[#00f0ff] text-sm" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>$</span>
                      <input
                        type="text"
                        placeholder="Initialize input sequence..."
                        className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
                        style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
                      />
                      <button className="px-4 py-1.5 rounded text-[12px] font-semibold uppercase transition-all hover:bg-[#33f3ff]" style={{ background: '#00f0ff', color: '#04141a' }}>
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="mt-20 pt-8 pb-12 text-center" style={{ borderTop: '1px solid rgba(59, 73, 75, 0.15)' }}>
                <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                  © {new Date().getFullYear()} XYLOS AI. TRANSMISSION COMPLETE.
                </p>
                <div className="flex justify-center gap-8 mt-4">
                  <Link href="/privacy" className="text-[9px] text-gray-600 hover:text-[#00f0ff] uppercase tracking-wider transition-colors" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>Privacy</Link>
                  <Link href="/about" className="text-[9px] text-gray-600 hover:text-[#00f0ff] uppercase tracking-wider transition-colors" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>Terms</Link>
                  <span className="text-[9px] text-gray-700 uppercase tracking-wider" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>API Status</span>
                </div>
              </footer>
            </article>

            {/* Right Sidebar */}
            <aside className="w-full lg:w-72 xl:w-80 shrink-0">
              <div className="lg:sticky lg:top-24 space-y-8">
                {/* Table of Contents */}
                {headings.length > 0 && (
                  <div className="rounded-xl p-5" style={{ background: 'rgba(26, 29, 35, 0.6)', border: '1px solid rgba(59, 73, 75, 0.15)' }}>
                    <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-1" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                      Table of Contents
                    </h4>
                    <p className="text-[9px] text-gray-600 mb-4" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>Quick Navigation</p>
                    <nav>
                      <ul className="space-y-1">
                        {headings.map((h, i) => (
                          <li key={i}>
                            <a
                              href={`#${h.id}`}
                              className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-[11px] text-gray-400 hover:text-white hover:bg-[rgba(0,240,255,0.05)] transition-all group"
                              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                            >
                              <span className="material-symbols-outlined text-[14px] text-gray-600 group-hover:text-[#00f0ff] transition-colors">
                                {i === 0 ? 'segment' : i === 1 ? 'architecture' : i === 2 ? 'query_stats' : 'auto_awesome'}
                              </span>
                              {h.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                )}

                {/* Related Logs */}
                {relatedPosts && relatedPosts.length > 0 && (
                  <div className="rounded-xl p-5" style={{ background: 'rgba(26, 29, 35, 0.6)', border: '1px solid rgba(59, 73, 75, 0.15)' }}>
                    <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-4" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                      Related Logs
                    </h4>
                    <div className="space-y-3">
                      {relatedPosts.map((rp, i) => (
                        <Link
                          key={i}
                          href={`/blog/${rp.slug}`}
                          className="block p-3 rounded-lg transition-all hover:bg-[rgba(0,240,255,0.05)] group"
                          style={{ border: '1px solid rgba(59, 73, 75, 0.1)' }}
                        >
                          <span className="text-[9px] text-gray-600 block mb-1" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                            {formatDate(rp.published_at)}
                          </span>
                          <h5 className="text-[12px] font-bold text-gray-300 group-hover:text-white transition-colors leading-snug" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
                            {rp.title}
                          </h5>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
}
