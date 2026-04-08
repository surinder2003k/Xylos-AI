"use client";

import { useState } from "react";
import { Search, Loader2, Image as ImageIcon, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PEXELS_API_KEY = "hbOSnkQWR075kZRaeNOJFcfmpdIGaVfQo52TleTWVZCtiELKkDVatskt";

interface PexelsLibraryProps {
  onSelect: (url: string, alt: string) => void;
  currentUrl?: string;
}

export function PexelsLibrary({ onSelect, currentUrl }: PexelsLibraryProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchPexels = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`,
        {
          headers: { Authorization: PEXELS_API_KEY },
        }
      );
      const data = await res.json();
      setResults(data.photos || []);
    } catch (err) {
      console.error("Pexels search failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchPexels()}
          placeholder="Search global imagery..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
        <button 
          onClick={searchPexels}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-primary text-black text-[10px] font-bold rounded-md hover:scale-105 transition-transform"
        >
          FIND
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
        {loading ? (
          <div className="col-span-2 py-10 flex flex-col items-center gap-3 opacity-20">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Scanning Pexels...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="col-span-2 py-10 flex flex-col items-center gap-3 opacity-10">
            <ImageIcon className="w-6 h-6" />
            <p className="text-[10px] font-bold uppercase tracking-widest">No assets found</p>
          </div>
        ) : (
          results.map((photo) => (
            <motion.button
              key={photo.id}
              whileHover={{ scale: 0.95 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSelect(photo.src.large2x, photo.alt || query)}
              className="relative aspect-video rounded-lg overflow-hidden border border-white/5 group shadow-lg"
            >
              <img 
                src={photo.src.medium} 
                alt={photo.alt} 
                className="w-full h-full object-cover transition-opacity group-hover:opacity-100 opacity-60" 
              />
              {currentUrl === photo.src.large2x && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                </div>
              )}
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}
