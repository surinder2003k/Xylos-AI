"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function BlogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get("category") || "all";
  const currentQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(currentQuery);

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    // Reset to page 1 on filter
    params.delete("page");
    router.push(`/blog?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(`/blog?${params.toString()}`);
  };

  const categories = ["all", "Technology", "Politics", "Science"];

  return (
    <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 py-6 md:py-8 border border-border/80 bg-card px-4 md:px-8 rounded-none shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 order-2 md:order-1">
        {categories.map((cat) => {
          const isActive = currentCategory === cat;
          return (
            <button 
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 md:px-6 py-2 rounded-none font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all ${
                isActive 
                  ? "bg-foreground text-background" 
                  : "bg-muted border border-border text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          );
        })}
      </div>
      
      <form onSubmit={handleSearch} className="flex w-full md:w-auto md:ml-auto items-center gap-3 bg-muted border border-border px-6 py-3 md:py-2 rounded-none group focus-within:border-foreground/50 transition-all order-1 md:order-2">
        <Search className="w-4 h-4 text-muted-foreground/50 group-focus-within:text-foreground" />
        <input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search archive..." 
          className="bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest placeholder:text-muted-foreground/30 w-full md:w-48" 
        />
      </form>
    </div>
  );
}
