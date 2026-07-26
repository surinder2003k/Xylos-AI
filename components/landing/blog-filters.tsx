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
    <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 py-6 md:py-8 bg-white border border-gray-200 px-4 md:px-8 rounded-2xl shadow-sm">
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 order-2 md:order-1">
        {categories.map((cat) => {
          const isActive = currentCategory === cat;
          return (
            <button 
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 md:px-6 py-2 rounded-xl font-bold text-[9px] md:text-[10px] uppercase tracking-widest transition-all ${
                isActive 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-50 border border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              }`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          );
        })}
      </div>
      
      <form onSubmit={handleSearch} className="flex w-full md:w-auto md:ml-auto items-center gap-3 bg-gray-50 border border-gray-200 px-6 py-3 md:py-2 rounded-xl group focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all order-1 md:order-2">
        <Search className="w-4 h-4 text-gray-300 group-focus-within:text-gray-500" />
        <input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search archive..." 
          className="bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest placeholder:text-gray-300 w-full md:w-48 text-gray-900" 
        />
      </form>
    </div>
  );
}
