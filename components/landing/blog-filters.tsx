"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

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
    <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 py-6 md:py-8 px-4 md:px-8 rounded-2xl" style={{ background: 'rgba(12, 14, 18, 0.6)', border: '1px solid rgba(59, 73, 75, 0.2)' }}>
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 order-2 md:order-1">
        {categories.map((cat) => {
          const isActive = currentCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 md:px-6 py-2 rounded-xl font-bold text-[9px] md:text-[10px] uppercase tracking-widest transition-all ${
                isActive
                  ? "bg-[#00f0ff] text-[#04141a]"
                  : "text-gray-400 hover:text-white"
              }`}
              style={!isActive ? { background: 'rgba(59, 73, 75, 0.15)', border: '1px solid rgba(59, 73, 75, 0.2)' } : {}}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSearch} className="flex w-full md:w-auto md:ml-auto items-center gap-3 px-5 py-3 md:py-2 rounded-xl group transition-all order-1 md:order-2" style={{ background: 'rgba(59, 73, 75, 0.15)', border: '1px solid rgba(59, 73, 75, 0.2)' }}>
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
