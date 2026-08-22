import Link from "next/link";
import { XylosLogo } from "@/components/premium/xylos-logo";
import { ArrowLeft, Cpu, MessageSquare } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ background: '#0a0b0e', color: '#e2e2e8' }}>
      {/* Subtle ambient depth */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[90vw] max-w-[700px] h-[400px] md:h-[500px] rounded-full blur-[120px] md:blur-[160px]" style={{ background: 'radial-gradient(closest-side, rgba(0,240,255,0.05), transparent)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-10 max-w-xl">
        <XylosLogo size={48} className="text-[#00f0ff]" />

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-medium tracking-wide" style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}>
            <Cpu className="w-3 h-3" />
            Error 404
          </div>

          <h1 className="text-[7rem] sm:text-[8rem] font-bold leading-none tracking-[-0.04em]" style={{ fontFamily: 'Sora, sans-serif' }}>
            <span className="text-white">4</span>
            <span style={{ color: '#00f0ff' }}>0</span>
            <span className="text-white">4</span>
          </h1>

          <p className="text-lg text-gray-400 font-medium leading-relaxed">
            This page doesn&apos;t exist. The link you followed may be broken or the page may have moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl glass-cta font-semibold text-sm transition-all w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <Link
            href="/dashboard/chat"
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl glass-outline font-semibold text-sm transition-all w-full sm:w-auto"
          >
            <MessageSquare className="w-4 h-4" />
            Open chat
          </Link>
        </div>
      </div>
    </div>
  );
}
