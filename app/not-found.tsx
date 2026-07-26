import Link from "next/link";
import { AnimatedLogo } from "@/components/premium/animated-logo";
import { ArrowLeft, Cpu, MessageSquare } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f0f14] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-violet-500/30">
      {/* Background glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/[0.06] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/[0.04] rounded-full blur-[120px]" />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 flex flex-col items-center text-center space-y-10 max-w-xl">
        <AnimatedLogo className="scale-125" />

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            <Cpu className="w-3 h-3" />
            Signal Lost — Error 404
          </div>

          <h1 className="text-[8rem] font-black leading-none tracking-tighter">
            <span className="text-white">4</span>
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent italic">0</span>
            <span className="text-white">4</span>
          </h1>

          <p className="text-xl text-white/25 font-medium leading-relaxed">
            &quot;This neural pathway doesn&apos;t exist. The signal you were chasing has dissipated into the void.&quot;
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-bold text-xs uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Base
          </Link>
          <Link
            href="/chat"
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/[0.05] transition-all w-full sm:w-auto text-white/50"
          >
            <MessageSquare className="w-4 h-4" />
            Open Neural Chat
          </Link>
        </div>

        <p className="text-[9px] font-bold text-white/12 uppercase tracking-[0.5em]">
          Xylos AI // Signal Intelligence Protocol
        </p>
      </div>
    </div>
  );
}
