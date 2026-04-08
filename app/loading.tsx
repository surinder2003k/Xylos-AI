import { XylosLogo } from "@/components/premium/xylos-logo";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative flex flex-col items-center gap-10">
        <div className="relative group">
          {/* Outer Ring Effect */}
          <div className="absolute -inset-8 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <XylosLogo size={120} animated={true} />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4 text-primary">
            <div className="w-12 h-px bg-primary/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.8em] animate-pulse">Synthesizing Editorial Context</span>
            <div className="w-12 h-px bg-primary/20" />
          </div>
          <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.4em]">Aligning Narrative Intelligence v3.5</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-20 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-primary/40 animate-loading-bar" />
      </div>
    </div>
  );
}
