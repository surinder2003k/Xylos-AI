import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "AI Chat — Talk to Llama 3, Gemini & Mistral Free | Xylos AI",
  description: "Chat with 7+ elite AI models including Llama 3, Gemini Pro, and Mistral for free. No subscription needed. Professional-grade AI conversation at zero cost.",
  // Private app surface: keep noindex and do NOT send a canonical.
  // A canonical on a noindex page is contradictory and makes Search Console
  // flip between "Excluded by noindex" and "Duplicate without canonical".
  robots: { index: false, follow: false },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
