import { XylosLogo } from "@/components/premium/xylos-logo";

function SkeletonCard() {
  return (
    <div className="p-6 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(190,184,170,0.2)' }}>
      <div className="h-4 w-1/3 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <div className="h-3 w-full rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', animationDelay: '120ms' }} />
      <div className="h-3 w-2/3 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', animationDelay: '240ms' }} />
      <div className="h-8 w-24 rounded-lg animate-pulse mt-4" style={{ background: 'rgba(54,183,176,0.08)', animationDelay: '360ms' }} />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-10 p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
      {/* Header skeleton */}
      <div className="flex flex-col gap-3">
        <div className="h-3 w-40 rounded animate-pulse" style={{ background: 'rgba(54,183,176,0.1)' }} />
        <div className="h-8 w-72 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(190,184,170,0.2)' }}>
            <div className="h-3 w-20 rounded animate-pulse mb-3" style={{ background: 'rgba(255,255,255,0.06)', animationDelay: `${i * 120}ms` }} />
            <div className="h-7 w-14 rounded animate-pulse" style={{ background: 'rgba(54,183,176,0.1)', animationDelay: `${i * 120 + 80}ms` }} />
          </div>
        ))}
      </div>

      {/* Content list skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      <div className="flex items-center justify-center gap-3 py-2">
        <XylosLogo size={28} animated={true} />
        <span className="text-[9px] font-black uppercase tracking-[0.4em] animate-pulse" style={{ color: '#5a6c6d' }}>
          Synchronizing
        </span>
      </div>
    </div>
  );
}
