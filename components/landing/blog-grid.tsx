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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-blue-500 font-bold text-[10px] uppercase tracking-[0.4em]">
            <Bookmark className="w-4 h-4 fill-blue-100 text-blue-500" />
            Curated Insights
          </div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none text-gray-900">
            Human <span className="text-gray-200 italic">&</span> Tech
          </h2>
        </div>
        <Link href="/blog" className="group text-xs font-bold text-gray-400 hover:text-blue-500 uppercase tracking-[0.3em] transition-all flex items-center gap-2">
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
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-200 hover:shadow-md transition-all duration-300 h-full flex flex-col">
                  
                  {/* Image Header */}
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <Image 
                      src={blog.feature_image_url || "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800"} 
                      alt={blog.title}
                      fill
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-all duration-1000 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <div className="px-4 py-1.5 bg-blue-500 text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-full">
                        {blog.category}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
                       <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                          <Clock className="w-3 h-3 text-gray-300" /> 
                          {formatIST(blog.published_at)}
                       </div>
                    </div>

                    <h3 className="text-xl font-black leading-[1.1] group-hover:text-blue-500 transition-colors line-clamp-2 uppercase tracking-tight mb-3 text-gray-900">
                       {blog.title}
                    </h3>

                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-8 group-hover:text-gray-500 transition-colors">
                      {blog.excerpt}
                    </p>

                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                            <User className="w-5 h-5 text-gray-300" />
                         </div>
                         <div className="flex flex-col">
                           <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">{blog.profiles?.full_name || 'Xylos Team'}</span>
                           <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Author</span>
                         </div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all duration-300">
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
