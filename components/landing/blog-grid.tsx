"use client";


import { ArrowUpRight, Clock, User, Bookmark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TiltCard } from "../premium/tilt-card";
import { formatIST } from "@/lib/utils/date-format";

interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  feature_image_url: string;
  category: string;
  published_at: string;
  profiles?: { full_name: string | null } | null;
}

export function BlogGrid({ blogs }: { blogs: Blog[] }) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <div id="stories" className="w-full max-w-7xl mx-auto px-6 py-12 md:py-24 space-y-12 md:space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-foreground font-bold text-[10px] uppercase tracking-[0.4em]">
            <Bookmark className="w-4 h-4 fill-foreground/15 text-foreground" />
            Curated Insights
          </div>
          <h2 className="text-4xl md:text-7xl font-black font-fustat tracking-tighter uppercase leading-none">
            Human <span className="text-muted-foreground italic">&</span> Tech
          </h2>
        </div>
        <Link href="/blog" className="group text-xs font-black text-muted-foreground hover:text-foreground uppercase tracking-[0.3em] transition-all flex items-center gap-2">
           View Full Archive 
           <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {blogs.map((blog, idx) => (
          <div
            key={blog.id}
            className="animate-in fade-in slide-in-from-bottom-5 fill-mode-both"
            style={{
              animationDuration: '600ms',
              animationDelay: `${idx * 100}ms`,
              animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
          >
            <div>
              <Link href={`/blog/${blog.slug || blog.id}`} aria-label={`Read full article: ${blog.title}`} className="group block h-full">
                <div className="relative bg-card border border-border/80 rounded-none overflow-hidden hover:border-foreground/35 hover:shadow-[0_12px_32px_rgba(0,0,0,0.03)] transition-all duration-700 h-full flex flex-col group/blog">
                  
                  {/* Premium Image Header */}
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <Image 
                      src={blog.feature_image_url || "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800"} 
                      alt={blog.title}
                      fill
                      className="w-full h-full object-cover grayscale-[0.6] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-1000 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-6 left-6 z-20">
                      <div className="px-4 py-1.5 bg-foreground text-background text-[9px] font-bold uppercase tracking-[0.2em] shadow-md rounded-none">
                        {blog.category}
                      </div>
                    </div>
                  </div>

                  {/* Editorial Content body */}
                  <div className="p-8 md:p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6">
                       <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-none border border-border/60">
                          <Clock className="w-3 h-3 text-foreground/75" /> 
                          {formatIST(blog.published_at)}
                       </div>
                    </div>

                    <h3 className="text-2xl font-black font-fustat leading-[1.1] group-hover:text-foreground/80 transition-colors line-clamp-2 uppercase tracking-tighter mb-5">
                       {blog.title}
                    </h3>

                    <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-3 mb-10 group-hover:text-foreground transition-colors">
                      {blog.excerpt}
                    </p>

                    <div className="mt-auto pt-8 border-t border-border/70 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-none bg-muted border border-border flex items-center justify-center overflow-hidden">
                            <User className="w-6 h-6 text-foreground/45" />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[11px] font-black text-foreground uppercase tracking-widest">{blog.profiles?.full_name || 'Xylos Team'}</span>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Verified Author</span>
                         </div>
                      </div>
                      <div className="w-12 h-12 rounded-none bg-muted border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-300">
                         <ArrowUpRight className="w-5 h-5 transition-transform duration-500 group-hover:rotate-45" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

