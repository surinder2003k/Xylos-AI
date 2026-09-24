import type { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Free AI Tools — PDF Analyzer, Code Assistant & Chat | Xylos AI",
  description:
    "Explore free AI tools by Xylos AI: AI PDF analyzer & summarizer, AI code assistant, free AI chat with Llama 3, Gemini & Mistral, and more. No cost, no paywall.",
  alternates: {
    canonical: "https://xylosai.vercel.app/tools",
  },
  openGraph: {
    title: "Free AI Tools | Xylos AI",
    description:
      "A collection of tiny, free AI utilities built with Xylos AI — PDF analysis, code assistance, file sharing and more.",
    url: "https://xylosai.vercel.app/tools",
    type: "website",
  },
};

export default function ToolsPage() {
  return (
    <div className="editorial-page min-h-screen flex flex-col relative overflow-hidden text-white">
      <section className="relative z-10 flex-1 flex items-center">
        <div className="w-full px-6 md:px-12 lg:px-20 py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.02] tracking-[-0.03em] text-white mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
              Tools
            </h1>
            <p className="text-lg md:text-xl max-w-xl leading-relaxed mb-10" style={{ color: '#b8b4ac' }}>
              A collection of tiny utilities built with Xylos AI.
            </p>
            <div className="mt-16 space-y-6">
              {/* Dropzone Share */}
              <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                <h2 className="font-semibold mb-2 text-xl">Dropzone Share</h2>
                <p className="text-white/70">
                  Drag and drop files to share them instantly via a shareable link.
                </p>
                <Link href="/tools/dropzone-share" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80">
                  Open Tool
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* PicExtractor */}
              <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                <h2 className="font-semibold mb-2 text-xl">PicExtractor</h2>
                <p className="text-white/70">
                  Extract text, colors, and metadata from images.
                </p>
                <Link href="/tools/pic-extractor" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80">
                  Open Tool
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Add more tools here as they are built */}
            </div>

            <Link href="/" className="mt-12 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80">
              â† Back to Home
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Import icons locally to avoid circular dependency issues
function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}

function ArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );
}
