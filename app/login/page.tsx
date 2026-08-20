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
  FileText
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XylosLogo } from "@/components/premium/xylos-logo";

function LoginContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
  };

  const features = [
    { icon: MessageSquare, title: "Unified AI Chat", sub: "7+ models in one interface", accent: "#00f0ff" },
    { icon: Code2, title: "Code Assistant", sub: "Full-stack dev tools", accent: "#9d8cff" },
    { icon: FileText, title: "Content Factory", sub: "Blog & social generation", accent: "#2dd4bf" },
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: '#0a0b0e', color: '#e2e2e8' }}>
      {/* Subtle ambient depth — single soft cyan radial (matches landing) */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-200px] left-1/4 w-[700px] h-[500px] rounded-full blur-[160px]" style={{ background: 'radial-gradient(closest-side, rgba(0,240,255,0.05), transparent)' }} />
      </div>

      {/* Left Panel - Visual (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 z-10">
        <div className="relative z-10 space-y-10 max-w-md">
          {/* Feature cards */}
          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 p-5 rounded-2xl glass-card"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${f.accent}1f` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.accent }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-[12px]" style={{ color: '#849495' }}>{f.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-2"
          >
            <h2 className="text-3xl font-bold tracking-[-0.02em] text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Free AI Chat.</h2>
            <h2 className="text-3xl font-bold tracking-[-0.02em]" style={{ color: '#00f0ff', fontFamily: 'Sora, sans-serif' }}>Refine your work.</h2>
            <p className="text-sm" style={{ color: '#849495' }}>Zero cost. Infinite possibilities.</p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        {/* Back to home */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:text-[#00f0ff] transition-colors" style={{ color: '#849495' }}>
            ← Back to home
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <XylosLogo size={48} className="mb-6 text-[#00f0ff]" />
            <h1 className="text-2xl font-bold tracking-[-0.02em] text-white text-center" style={{ fontFamily: 'Sora, sans-serif' }}>
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm mt-2 text-center" style={{ color: '#849495' }}>
              {isLogin ? "Access your unified AI workspace." : "Join the ultimate free AI arsenal."}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 border border-red-500/25 rounded-2xl flex items-center gap-3 text-sm"
              style={{ background: 'rgba(255,49,49,0.08)', color: '#ff6b6b' }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Auth Card */}
          <div className="p-8 rounded-2xl glass-card">
            <form action={isLogin ? signInWithEmail : signUpWithEmail} onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium ml-1" style={{ color: '#849495' }}>Full name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5a6c6d' }} />
                    <input
                      name="fullName"
                      type="text"
                      placeholder="Enter your name"
                      required
                      className="w-full rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/40 transition-all text-white placeholder:text-[#5a6c6d] text-sm"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium ml-1" style={{ color: '#849495' }}>Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5a6c6d' }} />
                  <input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="w-full rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/40 transition-all text-white placeholder:text-[#5a6c6d] text-sm"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium ml-1" style={{ color: '#849495' }}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5a6c6d' }} />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/40 transition-all text-white placeholder:text-[#5a6c6d] text-sm"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full glass-cta font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group mt-6 disabled:opacity-50 disabled:pointer-events-none text-sm"
              >
                {isLoading ? "Signing in..." : isLogin ? "Sign in" : "Create account"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}></div>
              </div>
              <div className="relative flex justify-center text-xs font-medium">
                <span className="px-4" style={{ background: '#0a0b0e', color: '#5a6c6d' }}>or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full border font-semibold py-4 rounded-xl flex items-center justify-center gap-3 hover:border-[rgba(0,240,255,0.3)] hover:bg-[rgba(0,240,255,0.04)] transition-all group text-sm text-white"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <Chrome className="w-5 h-5 text-[#00f0ff] group-hover:scale-110 transition-transform" />
              Continue with Google
            </button>
          </div>

          <p className="mt-8 text-center text-sm" style={{ color: '#849495' }}>
            {isLogin ? "New to Xylos AI?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-[#00f0ff] font-semibold hover:underline"
            >
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0b0e' }}><div className="w-8 h-8 rounded-full border-2 border-[#00f0ff] border-t-transparent animate-spin" /></div>}>
       <LoginContent />
    </Suspense>
  );
}
