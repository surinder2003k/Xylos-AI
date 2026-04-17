import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "AI Chat — Talk to Llama 3, Gemini & Mistral Free | Xylos AI",
  description: "Chat with 7+ elite AI models including Llama 3, Gemini Pro, and Mistral for free. No subscription needed. Professional-grade AI conversation at zero cost.",
  alternates: {
    canonical: 'https://xylosai.vercel.app/chat',
  },
  openGraph: {
    title: "Free AI Chat — Llama 3, Gemini & Mistral | Xylos AI",
    description: "Access the world's best AI models in one free chat interface. Zero cost, professional grade.",
    url: 'https://xylosai.vercel.app/chat',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Xylos AI Chat' }],
  },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
