"use client";

import { useRef, useEffect } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import Link from 'next/link';

export default function PicExtractor() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-white" style={{ background: '#0a0b0e' }}>
      {/* Aurora Wallpaper and Cursor Follower can be reused if needed, but for simplicity we omit here */}
      <section className="relative z-10 flex-1 flex items-center">
        <div className="w-full px-6 md:px-12 lg:px-20 py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.02] tracking-[-0.03em] text-white mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
              PicExtractor
            </h1>
            <p className="text-lg md:text-xl max-w-xl leading-relaxed mb-10" style={{ color: '#aeb9bd' }}>
              Extract text, colors, and metadata from images.
            </p>
            {/* Scroll-linked animation demo */}
            <div className="mt-16 space-y-20">
              {/* Pinned Section */}
              <motion.div
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileInView={{ y: [-100, 0], opacity: [0, 1] }}
                viewport={{ once: true, amount: 0.2 }}
                className="mb-20 p-8 bg-white/5 rounded-xl border border-white/10"
              >
                <h2 className="text-2xl font-semibold mb-4">Pinned Section (Scroll-triggered)</h2>
                <p className="text-white/80">
                  This section fades in and moves up as you scroll into view. Powered by Framer Motion.
                </p>
              </motion.div>

              {/* Parallax Effect */}
              <div className="relative h-96 overflow-hidden">
                <motion.div
                  style={{
                    transformOrigin: 'top',
                    transform: useScroll(({ scrollYProgress }) => `translate3d(0, ${scrollYProgress * -200}px, 0)`),
                  }}
                  className="absolute inset-0 bg-gradient-to-b from-[#00f0ff33] to-[#9d8cff33]"
                />
                <motion.div
                  style={{
                    transformOrigin: 'top',
                    transform: useScroll(({ scrollYProgress }) => `translate3d(0, ${scrollYProgress * -100}px, 0)`),
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-[#00f0ff22] to-[#2dd4bf22]"
                />
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-3xl">
                  Parallax Layers (Different Speeds)
                </div>
              </div>

              {/* Horizontal Scroll */}
              <div className="mb-20">
                <h2 className="text-2xl font-semibold mb-4">Horizontal Scroll Section</h2>
                <div className="relative h-24 overflow-x-auto whitespace-nowrap rounded-xl bg-white/5 border border-white/10 p-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ x: 0, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      whileInView={{ x: [50, 0], opacity: [0, 1] }}
                      viewport={{ once: true, amount: 0.2 }}
                      className="inline-block w-24 h-24 mr-6 bg-white/10 rounded-lg flex items-center justify-center text-white/80"
                    >
                      Item {i}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Scroll Progress Bar */}
              <div className="relative h-2.5 mb-12 w-full bg-white/5 rounded-full">
                <motion.div
                  style={{
                    width: useScroll(({ scrollYProgress }) => `${scrollYProgress * 100}%`),
                    background: 'linear-gradient(90deg, #00f0ff, #9d8cff)',
                    height: '100%',
                    borderRadius: 'inherit',
                  }}
                  className="absolute left-0 top-0"
                />
              </div>

              {/* Other Scroll-linked Animations */}
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 0, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileInView={{ x: [100, 0], opacity: [0, 1] }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="p-6 bg-white/5 rounded-lg border border-white/10"
                  >
                    <h3 className="font-semibold mb-2">Scroll-linked Animation {i}</h3>
                    <p className="text-white/70">
                      This element fades in and slides from the right as you scroll into view.
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

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

// Import icons locally to avoid circular dependency issues
function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}