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

export function BlogGrid({ blogs }: { blogs: Blog[] }) {
  if (!blogs || blogs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.02] px-6 py-16 text-center">
        <h2 className="mb-3 text-xl font-semibold text-[#eeeae2]">No stories published yet</h2>
        <p className="mx-auto max-w-md text-sm leading-6 text-[#8d8b85]">Fresh articles on AI, software, and technology will appear here soon.</p>
      </div>
    );
  }
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {blogs.map((blog, idx) => {
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
                    className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#141518]/90 shadow-[0_14px_40px_rgba(0,0,0,0.16)] transition duration-300 group-hover:-translate-y-1 group-hover:border-[#36b7b0]/40 group-hover:bg-[#18191c] group-hover:shadow-[0_20px_48px_rgba(0,0,0,0.28)]"
                  >

                    {/* Image Header */}
                    <div className="relative aspect-[16/11] overflow-hidden [transform:translateZ(0)]">
                      <Image
                        src={blog.feature_image_url || "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800"}
                        alt={blog.title}
                        fill
                        className="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.src.includes("pexels.com") || !blog.feature_image_url) return;
                          target.src = "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800";
                        }}
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,11,14,0.72), rgba(10,11,14,0.05) 55%)' }} />
                      <div className="absolute top-4 left-4 z-20">
                        <div
                          className="rounded-full border border-[#36b7b0]/30 bg-[#101315]/75 px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#75d5cf] backdrop-blur-md"
                        >
                          {blog.category || "Technology"}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <div className="mb-4 flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#77756f]">
                        <Clock className="h-3.5 w-3.5 text-[#36b7b0]" aria-hidden="true" />
                        <time dateTime={blog.published_at}>{formatIST(blog.published_at)}</time>
                      </div>

                      <h3 className="mb-3 line-clamp-2 text-xl font-bold leading-[1.2] tracking-[-0.02em] text-[#eeeae2] transition-colors group-hover:text-white">
                        {blog.title}
                      </h3>

                      <p className="mb-7 line-clamp-3 text-sm leading-6 text-[#9c9992]">
                        {blog.excerpt}
                      </p>

                      <div className="mt-auto flex items-center justify-between border-t border-white/[0.08] pt-5">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.09] bg-white/[0.04]">
                            <User className="h-4 w-4 text-[#36b7b0]" aria-hidden="true" />
                          </div>
                          <span className="truncate text-xs font-medium text-[#c4c0b8]">
                            By {blog.profiles?.full_name || "Xylos AI team"}
                          </span>
                        </div>
                        <span className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#36b7b0]/20 bg-[#36b7b0]/[0.08] text-[#36b7b0] transition duration-300 group-hover:rotate-6 group-hover:border-[#36b7b0]/50 group-hover:bg-[#36b7b0]/[0.14]">
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </span>
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
