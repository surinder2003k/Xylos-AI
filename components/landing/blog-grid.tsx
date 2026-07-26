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
    <div id="stories" className="w-full max-w-7xl mx-auto py-8 md:py-12 space-y-8 md:space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-violet-400 font-bold text-[10px] uppercase tracking-[0.4em]">
            <Bookmark className="w-4 h-4 fill-violet-500/15 text-violet-400" />
            Curated Insights
          </div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none text-white">
            Human <span className="text-white/15 italic">&</span> Tech
          </h2>
        </div>
        <Link href="/blog" className="group text-xs font-bold text-white/25 hover:text-violet-400 uppercase tracking-[0.3em] transition-all flex items-center gap-2">
           View Full Archive 
           <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="relative bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden hover:border-violet-500/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.06)] transition-all duration-700 h-full flex flex-col">
                  
                  {/* Image Header */}
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <Image 
                      src={blog.feature_image_url || "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800"} 
                      alt={blog.title}
                      fill
                      className="w-full h-full object-cover grayscale-[0.6] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-1000 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <div className="px-4 py-1.5 bg-violet-500/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-2xl">
                        {blog.category}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">
                       <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1 rounded-2xl border border-white/[0.05]">
                          <Clock className="w-3 h-3 text-white/30" /> 
                          {formatIST(blog.published_at)}
                       </div>
                    </div>

                    <h3 className="text-xl font-black leading-[1.1] group-hover:text-violet-400 transition-colors line-clamp-2 uppercase tracking-tight mb-3 text-white">
                       {blog.title}
                    </h3>

                    <p className="text-sm text-white/25 leading-relaxed line-clamp-3 mb-8 group-hover:text-white/40 transition-colors">
                      {blog.excerpt}
                    </p>

                    <div className="mt-auto pt-6 border-t border-white/[0.05] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center overflow-hidden">
                            <User className="w-5 h-5 text-white/15" />
                         </div>
                         <div className="flex flex-col">
                           <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">{blog.profiles?.full_name || 'Xylos Team'}</span>
                           <span className="text-[9px] font-bold text-white/15 uppercase tracking-widest">Author</span>
                         </div>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:bg-violet-500 group-hover:text-white group-hover:border-violet-500 transition-all duration-300">
                         <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45" />
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
