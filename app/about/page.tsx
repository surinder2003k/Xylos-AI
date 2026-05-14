import type { Metadata } from "next";
import AboutPageClient from "./about-client";

export const metadata: Metadata = {
  title: "About Xylos AI — Our Mission, Technology & Vision",
  description: "Learn about Xylos AI's Aether Intelligence Layer — the multi-model AI stack powering editorial creation with Llama 3, Gemini, and Mistral. Our mission, technology, and team.",
  alternates: {
    canonical: 'https://xylosai.vercel.app/about',
  },
  openGraph: {
    title: "About Xylos AI — Neural Synthesis & Human Intelligence",
    description: "Discover how Xylos AI bridges binary logic and human creativity with industrial-grade AI. Built for the next century of digital storytelling.",
    url: 'https://xylosai.vercel.app/about',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'About Xylos AI' }],
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://xylosai.vercel.app"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "About",
                "item": "https://xylosai.vercel.app/about"
              }
            ]
          })
        }}
      />
      <AboutPageClient />
    </>
  );
}
