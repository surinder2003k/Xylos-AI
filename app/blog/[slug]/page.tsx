import { createClient } from "@/utils/supabase/server";
import { Clock, User, Share2, MessageSquare, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { AnimeText } from "@/components/premium/anime-text";
import { formatIST } from "@/lib/utils/date-format";
import { AuthorBio } from "@/components/blog/author-bio";
import { NewsletterCard } from "@/components/blog/newsletter-card";
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
    const { data: idPost, error: idError } = await supabase
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

  const formatMarkdown = (content: string) => {
    if (!content) return "";
    return content
      .replace(/([^ \n])## /g, "$1\n\n## ")
      .replace(/([^ \n])### /g, "$1\n\n### ")
      .replace(/([^ \n])# /g, "$1\n\n# ");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-100">
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
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://xylosai.vercel.app"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://xylosai.vercel.app/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://xylosai.vercel.app/blog/${post.slug}`
              }
            ]
          })
        }}
      />

      <main className="pt-40 pb-24 px-6 relative">
        <article className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center justify-between mb-12 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 md:gap-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
              <ChevronRight aria-hidden="true" className="w-3 h-3 opacity-30" />
              <Link href="/blog" className="hover:text-blue-500 transition-colors">Archive</Link>
              <ChevronRight aria-hidden="true" className="w-3 h-3 opacity-30" />
              <span className="text-blue-500">{post.category}</span>
            </div>
            <ShareButtons title={post.title} excerpt={post.excerpt} slug={post.slug} />
          </div>

          {/* Editorial Header */}
          <div className="space-y-8 mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em]">
               {post.category} Report
            </div>
            
            <h1 className="text-3xl md:text-7xl font-black tracking-tighter leading-[1.1] md:leading-none break-words">
               <AnimeText text={post.title} />
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-y border-gray-100 py-6">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                    {post.author?.avatar_url ? (
                      <img src={post.author.avatar_url} alt={post.author.full_name} title={post.author.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-gray-300" />
                    )}
                 </div>
                 <span>By {post.author?.full_name || 'Xylos Editorial Team'}</span>
               </div>
               <div className="hidden md:block w-1 h-1 rounded-full bg-gray-200" />
               <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" /> Published {formatIST(post.published_at || post.created_at)}</div>
               <div className="hidden md:block w-1 h-1 rounded-full bg-gray-200" />
               <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-gray-300" /> Editorial Review Verified</div>
            </div>
          </div>

          {/* Feature Image */}
          <div className="w-full aspect-[4/3] md:aspect-[21/9] rounded-2xl overflow-hidden border border-gray-200 mb-12 md:mb-16 relative group bg-gray-100 shadow-sm">
             <Image 
               src={post.feature_image_url} 
               alt={post.alt_text || post.title} 
               title={post.alt_text || post.title}
               fill
               priority
               className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" 
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
             />
          </div>

          {/* Content */}
          <div className="relative">
            <div className="prose prose-lg dark:prose-invert max-w-none 
              [&_*]:text-gray-600 
              prose-headings:text-gray-900 prose-headings:font-black prose-headings:tracking-tight
              prose-a:text-blue-500 prose-strong:text-gray-900
              prose-blockquote:border-l-blue-200 prose-img:rounded-2xl prose-img:border prose-img:border-gray-100
              prose-code:text-purple-500 px-0 selection:bg-blue-100 break-words overflow-hidden">
                {post.content && post.content.startsWith('<') ? (
                  <div 
                    className="space-y-6 text-gray-600" 
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} 
                  />
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{formatMarkdown(post.content)}</ReactMarkdown>
                )}
            </div>
          </div>

          {/* Professional Callouts */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200 hover:border-blue-200 transition-colors">
              <h4 className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-3">Key Insight</h4>
              <p className="text-sm text-gray-500 leading-relaxed">&quot;The intersection of algorithmic accuracy and journalistic integrity defines the next era of news.&quot;</p>
            </div>
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200 hover:border-blue-200 transition-colors">
              <h4 className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-3">Verification</h4>
              <p className="text-sm text-gray-500 leading-relaxed">This report has been cross-referenced with multiple neural nodes to ensure factual reliability.</p>
            </div>
          </div>

          <AuthorBio 
            name={post.author?.full_name || 'Xylos Editorial Team'} 
            avatarUrl={post.author?.avatar_url}
          />
          
          <NewsletterCard />

        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-20 px-8 text-center bg-gray-50/30">
         <div className="max-w-md mx-auto space-y-6">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.5em]">The Xylos AI Protocol // Human Intelligence Amplified</p>
            <div className="flex justify-center gap-8">
               <Link href="/about" className="text-[9px] font-bold uppercase tracking-widest hover:text-blue-500 transition-colors text-gray-400">Standards</Link>
               <Link href="/about" className="text-[9px] font-bold uppercase tracking-widest hover:text-blue-500 transition-colors text-gray-400">Ethics</Link>
               <Link href="/blog" className="text-[9px] font-bold uppercase tracking-widest hover:text-blue-500 transition-colors text-gray-400">Archive</Link>
            </div>
         </div>
      </footer>
    </div>
  );
}
