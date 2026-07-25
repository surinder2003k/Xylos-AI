import Link from "next/link";
import { AnimatedLogo } from "@/components/premium/animated-logo";
import { ArrowLeft, Cpu } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-primary/30">
      {/* Background glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-secondary/15 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-10 max-w-xl">
        <AnimatedLogo className="scale-125" />

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
            <Cpu className="w-3 h-3" />
            Signal Lost — Error 404
          </div>

          <h1 className="text-[8rem] font-black font-fustat leading-none tracking-tighter">
            <span className="text-white">4</span>
            <span className="text-primary italic">0</span>
            <span className="text-white">4</span>
          </h1>

          <p className="text-xl text-white/50 font-medium leading-relaxed italic">
            "This neural pathway doesn't exist. The signal you were chasing has dissipated into the void."
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-none bg-primary text-black font-black text-xs uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(210,187,255,0.3)] transition-all w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Base
          </Link>
          <Link
            href="/chat"
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-none border border-primary/40 bg-primary/10 font-black text-xs uppercase tracking-[0.2em] hover:bg-primary/20 hover:border-primary transition-all w-full sm:w-auto text-primary"
          >
            Open Neural Chat
          </Link>
        </div>

        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">
          Xylos AI // Signal Intelligence Protocol
        </p>
      </div>
    </div>
  );
}
