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
      </div>
    </div>
  );
}
