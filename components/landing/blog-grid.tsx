"use client";

import { ArrowUpRight, Clock, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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

/**
 * Single restrained accent — keeps the archive calm and editorial.
 * Multi-hue card accents read as playful; one accent reads as premium.
 */
const ACCENT = { text: "#00f0ff", soft: "rgba(0,240,255,0.08)", border: "rgba(0,240,255,0.22)" };

function accentFor(_key: string) {
  return ACCENT;
}

export function BlogGrid({ blogs }: { blogs: Blog[] }) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <div id="stories" className="w-full max-w-7xl mx-auto py-2 md:py-4">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {blogs.map((blog, idx) => {
          const accent = accentFor(blog.category || blog.title);
          return (
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
                  <div
                    className="rounded-2xl overflow-hidden h-full flex flex-col"
                    style={{ background: 'rgba(18, 20, 26, 0.6)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >

                    {/* Image Header */}
                    <div className="relative aspect-[16/11] overflow-hidden [transform:translateZ(0)]">
                      <Image
                        src={blog.feature_image_url || "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800"}
                        alt={blog.title}
                        fill
                        className="w-full h-full object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.src.includes("pexels.com") || !blog.feature_image_url) return;
                          target.src = "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800";
                        }}
                      />
                      {/* subtle gradient scrim for legibility */}
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,11,14,0.55), rgba(10,11,14,0) 45%)' }} />
                      <div className="absolute top-4 left-4 z-20">
                        <div
                          className="px-4 py-1.5 text-white text-[9px] font-semibold uppercase tracking-[0.2em] rounded-full backdrop-blur-sm"
                          style={{ background: accent.soft, border: `1px solid ${accent.border}`, color: accent.text }}
                        >
                          {blog.category}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-[9px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-4">
                         <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <Clock className="w-3 h-3" style={{ color: accent.text, opacity: 0.6 }} />
                            {formatIST(blog.published_at)}
                         </div>
                      </div>

                      <h3 className="text-xl font-bold leading-[1.15] group-hover:text-white transition-colors line-clamp-2 tracking-tight mb-3 text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                         {blog.title}
                      </h3>

                      <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-8 transition-colors">
                        {blog.excerpt}
                      </p>

                      <div className="mt-auto pt-6 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                              <User className="w-5 h-5" style={{ color: accent.text, opacity: 0.5 }} />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[11px] font-semibold text-gray-300 tracking-wide">{blog.profiles?.full_name || 'Teamx'}</span>
                             <span className="text-[9px] font-medium text-gray-600 uppercase tracking-widest">Author</span>
                           </div>
                        </div>
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                          style={{ background: accent.soft, border: `1px solid ${accent.border}` }}
                        >
                           <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45" style={{ color: accent.text }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
