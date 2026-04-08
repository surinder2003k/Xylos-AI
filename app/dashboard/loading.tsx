import { XylosLogo } from "@/components/premium/xylos-logo";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="relative">
        <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full animate-pulse" />
        <XylosLogo size={64} animated={true} />
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <p className="font-fustat font-black text-xs uppercase tracking-[0.4em] text-primary animate-pulse">Syncing Editorial Hub</p>
        <p className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-widest">Bridging Secure Gateway...</p>
      </div>

      <div className="w-12 h-0.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary/60 animate-loading-bar" />
      </div>
    </div>
  );
}
