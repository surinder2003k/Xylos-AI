'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, ArrowUpRight } from 'lucide-react';

/**
 * Floating "Ask AI" launcher — the bottom-right chat bubble seen on AI API
 * sites. Only renders on public marketing surfaces (hidden inside /dashboard,
 * /chat, /login, /settings where a chat already exists) and opens a compact
 * card that deep-links into the full AI chat.
 */

const HIDDEN_PREFIXES = ['/dashboard', '/chat', '/login', '/settings', '/offline'];

export function FloatingAIChat() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const isHidden = HIDDEN_PREFIXES.some((prefix) => pathname?.startsWith(prefix));
  if (!mounted || isHidden) return null;

  return (
    <>
      {/* Click-away backdrop */}
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            aria-label="Close AI assistant"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[94] bg-black/20"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-5 right-5 z-[95] flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-[min(21rem,calc(100vw-2.5rem))] origin-bottom-right rounded-2xl p-5 shadow-2xl"
              style={{
                background: 'rgba(17, 19, 23, 0.98)',
                border: '1px solid rgba(190, 184, 170, 0.16)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
              }}
              role="dialog"
              aria-label="AI assistant"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-xl"
                    style={{ background: 'rgba(54,183,176,0.12)', border: '1px solid rgba(54,183,176,0.28)' }}
                  >
                    <Sparkles className="h-4 w-4" style={{ color: '#36b7b0' }} />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-white" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
                      Aether Assistant
                    </p>
                    <p className="text-[10px] text-gray-500" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                      ONLINE · FREE
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="grid h-7 w-7 place-items-center rounded-lg text-gray-500 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-4 text-[12.5px] leading-relaxed text-gray-400">
                Chat with 7+ elite AI models — Llama 3, Gemini, Mistral — in one premium workspace. No subscription, zero cost.
              </p>

              <Link
                href="/dashboard/chat"
                onClick={() => setOpen(false)}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl py-2.5 text-[12.5px] font-semibold text-[#06251f] transition-transform hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg,#36b7b0,#2a8f89)' }}
              >
                Start chatting
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setOpen((o) => !o)}
          whileTap={{ scale: 0.92 }}
          aria-label="Open AI assistant"
          className="relative grid h-14 w-14 place-items-center rounded-full"
          style={{
            background: 'linear-gradient(135deg,#36b7b0,#2a8f89)',
            boxShadow: '0 10px 30px rgba(54,183,176,0.35)',
          }}
        >
          {!open && (
            <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#36b7b0] opacity-20" />
          )}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? 'x' : 'spark'}
              initial={{ opacity: 0, rotate: -30 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 30 }}
              transition={{ duration: 0.15 }}
              className="text-white"
            >
              {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
