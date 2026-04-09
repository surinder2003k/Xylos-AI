"use client";

import { Twitter, Facebook, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface ShareButtonsProps {
  title: string;
  excerpt: string;
  slug: string;
}

export function ShareButtons({ title, excerpt, slug }: ShareButtonsProps) {
  const { showToast } = useToast();
  const url = `https://xylos-ai.com/blog/${slug}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, text: excerpt, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard!", "success");
    }
  };

  return (
    <div className="hidden md:flex items-center gap-4 border-r border-border pr-6 mr-2">
      <a 
        href={`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <Twitter className="w-4 h-4" />
      </a>
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <Facebook className="w-4 h-4" />
      </a>
      <button 
        onClick={handleShare} 
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  );
}
