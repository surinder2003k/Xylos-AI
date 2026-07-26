import Link from "next/link";
import { AnimatedLogo } from "@/components/premium/animated-logo";
import { ArrowLeft, Cpu, MessageSquare } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-blue-100">
      {/* Background glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-50 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-50 rounded-full blur-[120px]" />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 flex flex-col items-center text-center space-y-10 max-w-xl">
        <AnimatedLogo className="scale-125" />

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            <Cpu className="w-3 h-3" />
            Signal Lost — Error 404
          </div>

          <h1 className="text-[8rem] font-black leading-none tracking-tighter">
            <span className="text-gray-900">4</span>
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent italic">0</span>
            <span className="text-gray-900">4</span>
          </h1>

          <p className="text-xl text-gray-400 font-medium leading-relaxed">
            &quot;This neural pathway doesn&apos;t exist. The signal you were chasing has dissipated into the void.&quot;
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-blue-500 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Base
          </Link>
          <Link
            href="/chat"
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-gray-200 bg-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-gray-50 hover:border-gray-300 transition-all w-full sm:w-auto text-gray-500 shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Open Neural Chat
          </Link>
        </div>

        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.5em]">
          Xylos AI // Signal Intelligence Protocol
        </p>
      </div>
    </div>
  );
}
