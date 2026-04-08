"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Trash2, ShieldAlert } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isLoading = false,
}: ConfirmationModalProps) {
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[1000] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-navy-950 border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto"
            >
              <div className="p-8 space-y-6">
                {/* Icon & Close */}
                <div className="flex items-start justify-between">
                  <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center
                    ${type === "danger" ? "bg-red-500/10 text-red-500" : ""}
                    ${type === "warning" ? "bg-yellow-500/10 text-yellow-500" : ""}
                    ${type === "info" ? "bg-primary/10 text-primary" : ""}
                  `}>
                    {type === "danger" && <Trash2 className="w-7 h-7" />}
                    {type === "warning" && <AlertTriangle className="w-7 h-7" />}
                    {type === "info" && <ShieldAlert className="w-7 h-7" />}
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/40" />
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-outfit tracking-tight">{title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all text-sm"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`
                      flex-1 px-6 py-4 rounded-2xl font-bold transition-all text-sm flex items-center justify-center gap-2
                      ${type === "danger" ? "bg-red-500 text-white hover:bg-red-600" : ""}
                      ${type === "warning" ? "bg-yellow-500 text-black hover:bg-yellow-600" : ""}
                      ${type === "info" ? "bg-primary text-black hover:scale-105 shadow-neon" : ""}
                      disabled:opacity-50
                    `}
                  >
                    {isLoading ? "Wait..." : confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
