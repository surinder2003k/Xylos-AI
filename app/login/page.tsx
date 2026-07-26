"use client";

import { motion } from "framer-motion";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/app/auth/actions";
import { Suspense, useState } from "react";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Chrome,
  AlertCircle,
  MessageSquare,
  Code2,
  FileText,
  Terminal
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatedLogo } from "@/components/premium/animated-logo";


function LoginContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#00ff41] flex relative overflow-hidden selection:bg-[#00ff41]/20 font-mono">
      {/* Left Panel - Visual (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        {/* Background gradients */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff41]/[0.04] rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#00d4ff]/[0.03] rounded-full blur-[120px]" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 cyber-grid-pattern opacity-20" />

        {/* Scanline overlay */}
        <div className="absolute inset-0 terminal-scanline pointer-events-none" />

        <div className="relative z-10 space-y-10 max-w-md">
          {/* Terminal window */}
          <div className="terminal-chrome">
            <div className="terminal-title-bar">
              <div className="terminal-dot bg-[#ff5f56]" />
              <div className="terminal-dot bg-[#ffbd2e]" />
              <div className="terminal-dot bg-[#27c93f]" />
              <span className="ml-3 text-[10px] text-[#00ff41]/30">features.sh</span>
            </div>
            <div className="p-6 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 p-4 bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06]"
              >
                <div className="w-10 h-10 bg-[#00ff41]/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#00ff41]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#00ff41]">Unified AI Chat</p>
                  <p className="text-[10px] text-[#00ff41]/25">7+ models in one interface</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 p-4 bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06] ml-6"
              >
                <div className="w-10 h-10 bg-[#00d4ff]/10 flex items-center justify-center shrink-0">
                  <Code2 className="w-5 h-5 text-[#00d4ff]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#00ff41]">Code Assistant</p>
                  <p className="text-[10px] text-[#00ff41]/25">Full-stack dev tools</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4 p-4 bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06] ml-3"
              >
                <div className="w-10 h-10 bg-[#00ff41]/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#00ff41]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#00ff41]">Content Factory</p>
                  <p className="text-[10px] text-[#00ff41]/25">Blog & social generation</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-2"
          >
            <h2 className="text-2xl font-black tracking-tight">Free AI Chat.</h2>
            <h2 className="text-2xl font-black text-[#00d4ff] tracking-tight">Refine Your Narrative.</h2>
            <p className="text-[#00ff41]/25 text-xs">Zero cost. Infinite possibilities.</p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        {/* Back to home */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#00ff41]/25 hover:text-[#00ff41] transition-colors">
            ← back_to_home
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <AnimatedLogo className="scale-125 mb-6" />
            <h1 className="text-xl font-bold tracking-tight text-[#00ff41] text-center">
              {isLogin ? "$ welcome back, pilot" : "$ create your neural id"}
            </h1>
            <p className="text-[#00ff41]/25 text-xs mt-2 text-center">
              {isLogin ? "Access your unified AI workspace." : "Join the ultimate free AI arsenal."}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-[#ff5f56]/10 border border-[#ff5f56]/20 flex items-center gap-3 text-[#ff5f56] text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Auth Card */}
          <div className="bg-[#00ff41]/[0.02] border border-[#00ff41]/[0.06] p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ff41]/[0.02] via-transparent to-transparent" />
            
            <form action={isLogin ? signInWithEmail : signUpWithEmail} onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#00ff41]/25 uppercase tracking-widest ml-1">// full_name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00ff41]/15" />
                    <input 
                      name="fullName"
                      type="text" 
                      placeholder="enter your name" 
                      required
                      className="w-full bg-[#00ff41]/[0.03] border border-[#00ff41]/[0.06] py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#00ff41]/30 transition-all text-[#00ff41] placeholder:text-[#00ff41]/15 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#00ff41]/25 uppercase tracking-widest ml-1">// email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00ff41]/15" />
                  <input 
                    name="email"
                    type="email" 
                    placeholder="name@example.com" 
                    required
                    className="w-full bg-[#00ff41]/[0.03] border border-[#00ff41]/[0.06] py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#00ff41]/30 transition-all text-[#00ff41] placeholder:text-[#00ff41]/15 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#00ff41]/25 uppercase tracking-widest ml-1">// password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00ff41]/15" />
                  <input 
                    name="password"
                    type="password" 
                    placeholder="••••••••" 
                    required
                    className="w-full bg-[#00ff41]/[0.03] border border-[#00ff41]/[0.06] py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#00ff41]/30 transition-all text-[#00ff41] placeholder:text-[#00ff41]/15 text-xs font-mono"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00ff41] text-black font-bold py-4 hover:bg-[#00d4ff] hover:shadow-[0_0_30px_rgba(0,255,65,0.3)] transition-all duration-300 flex items-center justify-center gap-2 group mt-6 disabled:opacity-50 disabled:pointer-events-none text-xs uppercase tracking-wider"
              >
                <Terminal className="w-4 h-4" />
                {isLoading ? "synchronizing..." : isLogin ? "launch_workspace" : "generate_neural_id"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="relative my-8 z-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#00ff41]/[0.06]"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="bg-[#0a0e14] px-4 text-[#00ff41]/12">// or deploy via</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full bg-[#00ff41]/[0.03] border border-[#00ff41]/[0.06] text-[#00ff41]/50 font-semibold py-4 flex items-center justify-center gap-3 hover:bg-[#00ff41]/[0.06] hover:text-[#00ff41] transition-all group relative z-10 text-xs"
            >
              <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
              continue_with_google
            </button>
          </div>

          <p className="mt-8 text-center text-[#00ff41]/25 text-xs">
            {isLogin ? "New to Xylos AI?" : "Already have an ID?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-[#00ff41] font-bold hover:underline"
            >
              {isLogin ? "create_account" : "sign_in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0e14] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#00ff41] border-t-transparent animate-spin" /></div>}>
       <LoginContent />
    </Suspense>
  );
}
