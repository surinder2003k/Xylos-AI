"use client";

import { ArrowUpRight, Clock, User, Bookmark } from "lucide-react";
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
 * Cohesive luxury accent set — varied enough to kill the "same-same" feel,
 * but every hue sits cleanly on the dark surface. Red is reserved for errors only.
 */
const ACCENTS: Record<string, { text: string; soft: string; border: string }> = {
  cyan:   { text: "#00f0ff", soft: "rgba(0,240,255,0.12)",  border: "rgba(0,240,255,0.30)" },
  violet: { text: "#9d8cff", soft: "rgba(157,140,255,0.12)", border: "rgba(157,140,255,0.30)" },
  teal:   { text: "#2dd4bf", soft: "rgba(45,212,191,0.12)",  border: "rgba(45,212,191,0.30)" },
  gold:   { text: "#f5c451", soft: "rgba(245,196,81,0.12)",  border: "rgba(245,196,81,0.30)" },
};

function accentFor(key: string) {
  // stable hash -> one of 4 accents so a given category keeps its color
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  const keys = Object.keys(ACCENTS);
  return ACCENTS[keys[h % keys.length]];
}

export function BlogGrid({ blogs }: { blogs: Blog[] }) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <div id="stories" className="w-full max-w-7xl mx-auto py-8 md:py-12 space-y-8 md:space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#00f0ff] font-semibold text-[11px] uppercase tracking-[0.25em]">
            <Bookmark className="w-4 h-4 text-[#00f0ff]" />
            Curated Insights
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.02em] leading-none text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
            Human <span className="text-white/20 italic">&</span> Tech
          </h2>
        </div>
        <Link href="/blog" className="group text-[13px] font-semibold text-gray-400 hover:text-[#00f0ff] tracking-wide transition-colors flex items-center gap-2">
           View Full Archive
           <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className="rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col hover:shadow-[0_18px_50px_rgba(0,0,0,0.5)]"
                    style={{ background: 'rgba(18, 20, 26, 0.6)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >

                    {/* Image Header */}
                    <div className="relative aspect-[16/11] overflow-hidden [transform:translateZ(0)]">
                      <Image
                        src={blog.feature_image_url || "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800"}
                        alt={blog.title}
                        fill
                        className="w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                             <span className="text-[11px] font-semibold text-gray-300 tracking-wide">{blog.profiles?.full_name || 'Xylos Team'}</span>
                             <span className="text-[9px] font-medium text-gray-600 uppercase tracking-widest">Author</span>
                           </div>
                        </div>
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
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
