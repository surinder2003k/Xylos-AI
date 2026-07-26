import Link from "next/link";
import { AnimatedLogo } from "@/components/premium/animated-logo";
import { ArrowLeft, Cpu, MessageSquare, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#00ff41] flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-[#00ff41]/20 font-mono">
      {/* Background glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff41]/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#00d4ff]/[0.02] rounded-full blur-[120px]" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 cyber-grid-pattern opacity-20" />

      {/* Scanline overlay */}
      <div className="absolute inset-0 terminal-scanline pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-10 max-w-xl">
        <AnimatedLogo className="scale-125" />

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#00ff41]/10 border border-[#00ff41]/20 text-[#00ff41] text-[10px] font-bold uppercase tracking-[0.3em]">
            <Cpu className="w-3 h-3" />
            Signal Lost — Error 404
          </div>

          <h1 className="text-[8rem] font-black leading-none tracking-tighter">
            <span className="text-[#00ff41]">4</span>
            <span className="text-[#00d4ff] italic">0</span>
            <span className="text-[#00ff41]">4</span>
          </h1>

          <p className="text-xl text-[#00ff41]/25 font-medium leading-relaxed">
            &quot;This neural pathway doesn&apos;t exist. The signal you were chasing has dissipated into the void.&quot;
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-[#00ff41] text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#00d4ff] hover:shadow-[0_0_30px_rgba(0,255,65,0.3)] transition-all w-full sm:w-auto"
          >
            <Terminal className="w-4 h-4" />
            Return to Base
          </Link>
          <Link
            href="/chat"
            className="flex items-center justify-center gap-3 px-8 py-4 border border-[#00ff41]/10 bg-[#00ff41]/[0.02] font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#00ff41]/[0.06] transition-all w-full sm:w-auto text-[#00ff41]/50"
          >
            <MessageSquare className="w-4 h-4" />
            Open Neural Chat
          </Link>
        </div>

        <p className="text-[9px] font-bold text-[#00ff41]/12 uppercase tracking-[0.5em]">
          Xylos AI // Signal Intelligence Protocol
        </p>
      </div>
    </div>
  );
}
