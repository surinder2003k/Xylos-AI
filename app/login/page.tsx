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
    <div className="min-h-screen flex relative overflow-hidden selection:bg-amber-500/30" style={{ background: '#141008', color: 'white' }}>
      {/* Left Panel - Visual (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12" style={{ background: 'rgba(245,158,11,0.02)' }}>
        {/* Background gradients */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-500/8 rounded-full blur-[120px]" />
        </div>

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(rgba(245,158,11,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 space-y-10 max-w-md">
          {/* Floating feature cards */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 p-5 rounded-2xl"
              style={{ background: 'rgba(20,16,8,0.6)', border: '1px solid rgba(245,158,11,0.08)' }}
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Unified AI Chat</p>
                <p className="text-[11px] text-gray-500">7+ models in one interface</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 p-5 rounded-2xl ml-8"
              style={{ background: 'rgba(20,16,8,0.6)', border: '1px solid rgba(245,158,11,0.08)' }}
            >
              <div className="w-11 h-11 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                <Code2 className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Code Assistant</p>
                <p className="text-[11px] text-gray-500">Full-stack dev tools</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4 p-5 rounded-2xl ml-4"
              style={{ background: 'rgba(20,16,8,0.6)', border: '1px solid rgba(245,158,11,0.08)' }}
            >
              <div className="w-11 h-11 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Content Factory</p>
                <p className="text-[11px] text-gray-500">Blog & social generation</p>
              </div>
            </motion.div>
          </div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-2"
          >
            <h2 className="text-3xl font-black tracking-tight text-white">Free AI Chat.</h2>
            <h2 className="text-3xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent tracking-tight">Refine Your Narrative.</h2>
            <p className="text-gray-500 text-sm">Zero cost. Infinite possibilities.</p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        {/* Back to home */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 hover:text-amber-400 transition-colors">
            ← Back to Home
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
            <h1 className="text-2xl font-bold tracking-tight text-white text-center">
              {isLogin ? "Welcome back, Pilot" : "Create your Neural ID"}
            </h1>
            <p className="text-gray-500 text-sm mt-2 text-center">
              {isLogin ? "Access your unified AI workspace." : "Join the ultimate free AI arsenal."}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Auth Card */}
          <div className="p-8 rounded-2xl relative overflow-hidden" style={{ background: 'rgba(20,16,8,0.6)', border: '1px solid rgba(245,158,11,0.08)' }}>
            <form action={isLogin ? signInWithEmail : signUpWithEmail} onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input 
                      name="fullName"
                      type="text" 
                      placeholder="Enter your name" 
                      required
                      className="w-full rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 transition-all text-white placeholder:text-gray-600 text-sm"
                      style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)' }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    name="email"
                    type="email" 
                    placeholder="name@example.com" 
                    required
                    className="w-full rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 transition-all text-white placeholder:text-gray-600 text-sm"
                    style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)' }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    name="password"
                    type="password" 
                    placeholder="••••••••" 
                    required
                    className="w-full rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 transition-all text-white placeholder:text-gray-600 text-sm"
                    style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)' }}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-500 text-white font-bold py-4 rounded-xl hover:bg-amber-400 transition-all duration-300 flex items-center justify-center gap-2 group mt-6 disabled:opacity-50 disabled:pointer-events-none text-sm uppercase tracking-wider"
              >
                {isLoading ? "Synchronizing..." : isLogin ? "Launch Workspace" : "Generate Neural ID"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="relative my-8 z-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTop: '1px solid rgba(245,158,11,0.08)' }}></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="px-4 text-gray-600" style={{ background: 'rgba(20,16,8,0.6)' }}>or deploy via</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full border font-semibold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-amber-500/10 transition-all group relative z-10 text-sm text-gray-300"
              style={{ background: 'rgba(245,158,11,0.03)', borderColor: 'rgba(245,158,11,0.1)' }}
            >
              <Chrome className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              Continue with Google
            </button>
          </div>

          <p className="mt-8 text-center text-gray-500 text-sm">
            {isLogin ? "New to Xylos AI?" : "Already have an ID?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-amber-400 font-bold hover:underline"
            >
              {isLogin ? "Create an account" : "Sign in to workspace"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: '#141008' }}><div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" /></div>}>
       <LoginContent />
    </Suspense>
  );
}
