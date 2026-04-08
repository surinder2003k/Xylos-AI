"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, X, Info, Sparkles } from "lucide-react";

type ToastType = "success" | "error" | "info" | "neural";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className={`
                flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[320px]
                ${toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : ""}
                ${toast.type === "error" ? "bg-red-600/10 border-red-600/20 text-red-600" : ""}
                ${toast.type === "info" ? "bg-white/5 border-white/10 text-white/70" : ""}
                ${toast.type === "neural" ? "bg-primary/20 border-primary/30 text-primary-light" : ""}
              `}>
                <div className="flex-shrink-0">
                  {toast.type === "success" && <CheckCircle2 className="w-5 h-5" />}
                  {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
                  {toast.type === "info" && <Info className="w-5 h-5" />}
                  {toast.type === "neural" && <Sparkles className="w-5 h-5 animate-pulse" />}
                </div>
                <p className="text-sm font-bold tracking-tight flex-1">{toast.message}</p>
                <button 
                  onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                  className="hover:scale-110 transition-transform opacity-50 hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
