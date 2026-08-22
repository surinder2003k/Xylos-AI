import Link from 'next/link';

export default function PicExtractorPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-white" style={{ background: '#0a0b0e' }}>
      <section className="relative z-10 flex-1 flex items-center">
        <div className="w-full px-6 md:px-12 lg:px-20 py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.02] tracking-[-0.03em] text-white mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
              PicExtractor
            </h1>
            <p className="text-lg md:text-xl max-w-xl leading-relaxed mb-10" style={{ color: '#aeb9bd' }}>
              Extract text, colors, and metadata from images.
            </p>
            <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80">
              ← Back to Tools
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}