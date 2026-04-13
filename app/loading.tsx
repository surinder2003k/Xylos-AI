"use client";

import { motion } from "framer-motion";
import { XylosLogo } from "@/components/premium/xylos-logo";
import { Sparkles } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
      {/* Deep Neural Field (Background Layers) */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.15, 0.05] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 blur-[130px] rounded-full" 
        />
      </div>

      <div className="relative flex flex-col items-center gap-16">
        <div className="relative">
          {/* Energy Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-16 border border-primary/5 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-10 border border-violet-500/10 rounded-full"
          />
          
          {/* Main Logo with Pulse */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative group"
          >
            <div className="absolute -inset-8 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <XylosLogo size={140} animated={true} />
          </motion.div>
        </div>

        {/* Sync Status Messaging */}
        <div className="flex flex-col items-center gap-8 min-w-[300px]">
          <div className="flex flex-col items-center gap-2">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.4em] text-[10px]"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Neural Synchronization
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-white/30 text-[8px] font-bold uppercase tracking-[0.3em]"
            >
              Accessing Core Editorial Matrix
            </motion.p>
          </div>

          {/* Premium Progress Bar */}
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"
            />
          </div>

          {/* Telemetry Dots */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  delay: i * 0.2 
                }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grid Overlay for Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
    </div>
  );
}
