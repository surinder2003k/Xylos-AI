import { createClient } from "@/utils/supabase/server";
import { Clock, User, Share2, MessageSquare, Twitter, Facebook, ChevronRight } from "lucide-react";
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

  // Robust Fetching Strategy: Decouple post from profile to avoid 406/404 on missing FKs
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

  // Fallback to ID if slug lookup fails
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
    // Ensure headings have a preceding newline to be correctly parsed by ReactMarkdown
    return content
      .replace(/([^ \n])## /g, "$1\n\n## ")
      .replace(/([^ \n])### /g, "$1\n\n### ")
      .replace(/([^ \n])# /g, "$1\n\n# ");
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
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

      <main className="pt-40 pb-24 px-6 relative">
        <article className="max-w-4xl mx-auto">
          {/* Breadcrumb strip */}
          <div className="flex items-center justify-between mb-12 pb-6 border-b border-border">
            <div className="flex items-center gap-2 md:gap-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 opacity-30" />
              <Link href="/blog" className="hover:text-primary transition-colors">Archive</Link>
              <ChevronRight className="w-3 h-3 opacity-30" />
              <span className="text-primary">{post.category}</span>
            </div>
            <ShareButtons title={post.title} excerpt={post.excerpt} slug={post.slug} />
          </div>

          {/* Editorial Header */}
          <div className="space-y-8 mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
               {post.category} Report
            </div>
            
            <h1 className="text-3xl md:text-7xl font-black font-fustat tracking-tighter leading-[1.1] md:leading-none break-words">
               <AnimeText text={post.title} />
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-y border-border py-6">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
                    {post.author?.avatar_url ? (
                      <img src={post.author.avatar_url} alt={post.author.full_name} title={post.author.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                 </div>
                 <span>By {post.author?.full_name || 'Xylos Editorial Team'}</span>
               </div>
               <div className="hidden md:block w-1 h-1 rounded-full bg-border" />
               <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Published {formatIST(post.published_at || post.created_at)}</div>
               <div className="hidden md:block w-1 h-1 rounded-full bg-border" />
               <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Editorial Review Verified</div>
            </div>
          </div>

          {/* Feature Image with Premium Caption */}
          <div className="w-full aspect-[4/3] md:aspect-[21/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-border shadow-2xl mb-12 md:mb-16 relative group bg-muted/20">
             <Image 
               src={post.feature_image_url} 
               alt={post.alt_text || post.title} 
               title={post.alt_text || post.title}
               fill
               priority
               className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" 
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
             />
             <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-3 md:p-4 rounded-xl md:rounded-2xl bg-background/40 backdrop-blur-md border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-[8px] md:text-[10px] font-bold text-foreground uppercase tracking-widest text-center">Visual Intelligence Sync Status: Calibrated</p>
             </div>
          </div>

          {/* Human-Centric Content Layout */}
          <div className="relative">
            {/* Vertical Accents */}
            <div className="absolute -left-12 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-transparent to-transparent hidden xl:block" />
            
            <div className="prose dark:prose-invert max-w-none 
              [&_*]:text-foreground/90 
              prose-headings:text-foreground prose-headings:font-fustat prose-headings:tracking-tighter
              prose-a:text-primary prose-strong:text-foreground
              prose-blockquote:border-l-primary/40 prose-img:rounded-[2rem] 
              prose-code:text-primary px-0 selection:bg-primary/20 break-words overflow-hidden">
               {post.content && post.content.startsWith('<') ? (
                 <div 
                   className="space-y-6 text-foreground/90" 
                   dangerouslySetInnerHTML={{ 
                     __html: post.content
                       .replace(/color:\s*[^;"]+;?/gi, "") // Aggressively strip ALL explicit colors to allow theme override
                       .replace(/background-color:\s*[^;"]+;?/gi, "") // Aggressively strip inline backgrounds
                       .replace(/background:\s*[^;"]+;?/gi, "") 
                   }} 
                 />
               ) : (
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>{formatMarkdown(post.content)}</ReactMarkdown>
               )}
            </div>
          </div>

          {/* Professional Callouts */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl bg-muted/30 border border-border hover:border-primary/20 transition-colors group">
              <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-3">Key Insight</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">"The intersection of algorithmic accuracy and journalistic integrity defines the next era of news."</p>
            </div>
            <div className="p-8 rounded-3xl bg-muted/30 border border-border hover:border-primary/20 transition-colors">
              <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-3">Verification</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">This report has been cross-referenced with multiple neural nodes to ensure factual reliability.</p>
            </div>
          </div>

          {/* New 21st.dev Inspired Components */}
          <AuthorBio 
            name={post.author?.full_name || 'Xylos Editorial Team'} 
            avatarUrl={post.author?.avatar_url}
          />
          
          <NewsletterCard />

        </article>
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-border py-20 px-8 text-center bg-card/30">
         <div className="max-w-md mx-auto space-y-6">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em]">The Xylos AI Protocol // Human Intelligence Amplified</p>
            <div className="flex justify-center gap-8 opacity-40">
               <span className="text-[9px] font-bold uppercase tracking-widest">Standards</span>
               <span className="text-[9px] font-bold uppercase tracking-widest">Ethics</span>
               <span className="text-[9px] font-bold uppercase tracking-widest">Archive</span>
            </div>
         </div>
      </footer>
    </div>
  );
}

