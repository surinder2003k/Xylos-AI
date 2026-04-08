"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle2, Info, Sparkles } from "lucide-react";
import { useEffect } from "react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  type?: "info" | "success" | "warning" | "error";
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  description,
  type = "info",
  onConfirm,
  confirmText = "Confirmed",
  cancelText = "Dismiss",
}: CustomModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const icons = {
    info: <Info className="w-6 h-6 text-blue-400" />,
    success: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-400" />,
    error: <X className="w-6 h-6 text-red-500" />,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm transition-all"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-card border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto relative"
            >
              {/* Artistic Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              
              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 shadow-inner">
                      {icons[type]}
                    </div>
                    <div>
                      <h3 className="text-xl font-black font-fustat uppercase tracking-tight text-white/90">
                        {title}
                      </h3>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        Intelligence Protocol
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-white/5 transition-colors text-muted-foreground hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-muted-foreground font-medium leading-relaxed italic">
                    "{description}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  {onConfirm ? (
                    <>
                      <button
                        onClick={() => {
                          onConfirm();
                          onClose();
                        }}
                        className="flex-1 px-6 py-3 rounded-2xl bg-primary text-black font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-neon"
                      >
                        {confirmText}
                      </button>
                      <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-white/60 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                      >
                        {cancelText}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={onClose}
                      className="w-full px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-white/60 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                      {cancelText}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
