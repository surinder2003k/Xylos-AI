import { XylosLogo } from "@/components/premium/xylos-logo";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="relative">
        <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full animate-pulse" />
        <XylosLogo size={64} animated={true} />
      </div>
          </div>
  );
}
