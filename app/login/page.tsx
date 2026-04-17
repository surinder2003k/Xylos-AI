"use client";

import { motion, AnimatePresence } from "framer-motion";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/app/auth/actions";
import { Suspense, useState } from "react";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Chrome,
  AlertCircle
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
    // The server actions handle the redirect
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">


      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <AnimatedLogo className="scale-125 mb-8" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground/90">
            {isLogin ? "Welcome back, Pilot" : "Create your Neural ID"}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {isLogin ? "Access your unified AI workspace." : "Join the ultimate free AI arsenal."}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        <div className="bg-card/50 backdrop-blur-3xl border border-border rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
          <form action={isLogin ? signInWithEmail : signUpWithEmail} onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                  <input 
                    name="fullName"
                    type="text" 
                    placeholder="Enter your name" 
                    required
                    className="w-full bg-background/50 border border-border rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground/30"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <input 
                  name="email"
                  type="email" 
                  placeholder="name@example.com" 
                  required
                  className="w-full bg-background/50 border border-border rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <input 
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  required
                  className="w-full bg-background/50 border border-border rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground/30"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-foreground text-background font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-6 disabled:opacity-50 disabled:pointer-events-none shadow-neon"
            >
              {isLoading ? "Synchronizing..." : isLogin ? "Launch Workspace" : "Generate Neural ID"}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="relative my-8 z-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-card px-4 text-muted-foreground/30">or deploy via</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => signInWithGoogle()}
            className="w-full bg-background/50 border border-border text-foreground font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-muted/50 transition-all group relative z-10"
          >
            <Chrome className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            Continue with Google
          </button>
        </div>

        <p className="mt-8 text-center text-muted-foreground text-sm">
          {isLogin ? "New to Xylos AI?" : "Already have an ID?"}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-primary font-bold hover:underline"
          >
            {isLogin ? "Create an account" : "Sign in to workspace"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>}>
       <LoginContent />
    </Suspense>
  );
}
