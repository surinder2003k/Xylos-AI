"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock, User, Bookmark } from "lucide-react";
import Link from "next/link";
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
    <div id="stories" className="w-full max-w-7xl mx-auto px-6 py-24 space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary font-bold text-[10px] uppercase tracking-[0.4em]">
            <Bookmark className="w-4 h-4 fill-primary/20" />
            Curated Insights
          </div>
          <h2 className="text-5xl md:text-7xl font-black font-fustat tracking-tighter uppercase leading-none">
            Human <span className="text-muted-foreground italic">&</span> Tech
          </h2>
        </div>
        <Link href="/blog" className="group text-xs font-black text-muted-foreground hover:text-primary uppercase tracking-[0.3em] transition-all flex items-center gap-2">
           View Full Archive 
           <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {blogs.map((blog, idx) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <TiltCard degree={5} className="h-full">
              <Link href={`/blog/${blog.slug || blog.id}`} className="group block h-full">
                <div className="relative bg-card/40 border border-border/50 rounded-[3rem] overflow-hidden backdrop-blur-xl hover:border-primary/50 transition-all duration-700 h-full flex flex-col hover:shadow-2xl hover:shadow-primary/5">
                  {/* Premium Image Header */}
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <img 
                      src={blog.feature_image_url || "https://images.pexels.com/photos/1031201/pexels-photo-1031201.jpeg?auto=compress&cs=tinysrgb&w=800"} 
                      alt={blog.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                    />
                    <div className="absolute top-6 left-6 z-20">
                      <div className="px-5 py-2 rounded-2xl bg-background/90 backdrop-blur-md border border-border text-[10px] font-black uppercase tracking-[0.2em] text-foreground shadow-xl">
                        {blog.category}
                      </div>
                    </div>
                  </div>

                  {/* Editorial Content body */}
                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6">
                       <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full">
                          <Clock className="w-3 h-3 text-primary" /> 
                          {formatIST(blog.published_at)}
                       </div>
                    </div>

                    <h3 className="text-3xl font-black font-fustat leading-[1] group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tighter mb-5">
                      {blog.title}
                    </h3>

                    <p className="text-base text-muted-foreground font-medium leading-relaxed line-clamp-3 mb-10 opacity-70 group-hover:opacity-100 transition-opacity">
                      {blog.excerpt}
                    </p>

                    <div className="mt-auto pt-8 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-border flex items-center justify-center overflow-hidden">
                            <User className="w-6 h-6 text-primary/60" />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[11px] font-black text-foreground uppercase tracking-widest">{blog.profiles?.full_name || 'Xylos Team'}</span>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Verified Author</span>
                         </div>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-500 group-hover:scale-110">
                         <ArrowUpRight className="w-6 h-6 transition-transform duration-500 group-hover:rotate-45" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

