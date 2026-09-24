"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function BlogFilters({ categories }: { categories: string[] }) {
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

  return (
    <div className="flex w-full flex-col gap-3 border-b border-white/[0.08] pb-5 md:flex-row md:items-center md:justify-between">
      <div className="scrollbar-hide order-2 flex min-w-0 max-w-full gap-2 overflow-x-auto md:order-1 md:flex-wrap md:justify-start">
        {categories.map((cat) => {
          const isActive = currentCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`shrink-0 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                isActive
                  ? "bg-[#00f0ff] text-[#04141a]"
                  : "text-gray-400 hover:text-white"
              }`}
              style={!isActive ? { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' } : {}}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSearch} className="flex w-full items-center gap-3 border-b border-white/[0.12] px-1 py-2 group transition-colors focus-within:border-[#00f0ff]/60 md:w-auto md:ml-auto">
        <Search className="w-4 h-4 text-[#00f0ff]/40 group-focus-within:text-[#00f0ff] shrink-0" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search archive..."
          className="bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest placeholder:text-gray-400 w-full md:w-48 text-white focus-visible:ring-2 focus-visible:ring-[#00f0ff]/50 rounded-lg"
          aria-label="Search blog archive"
        />
        <button
          type="submit"
          className="shrink-0 p-1.5 rounded-lg text-[#00f0ff]/40 hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]/50"
          aria-label="Submit search"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
