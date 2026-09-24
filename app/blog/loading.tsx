export default function BlogLoading() {
  return (
    <div className="editorial-page min-h-screen overflow-x-hidden bg-[#0d0e10] px-4 pb-16 pt-28 text-white sm:px-6 md:px-8 md:pt-32">
      <div className="mx-auto max-w-[1400px]">
        {/* Header skeleton */}
        <div className="mb-14 flex flex-col items-center gap-4">
          <div className="h-3 w-32 rounded animate-pulse" style={{ background: 'rgba(54,183,176,0.1)' }} />
          <div className="h-10 w-80 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.07)' }} />
        </div>

        {/* Blog grid skeleton */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(190,184,170,0.2)' }}>
              <div className="h-48 w-full animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', animationDelay: `${i * 100}ms` }} />
              <div className="space-y-3 p-6">
                <div className="h-3 w-1/4 rounded animate-pulse" style={{ background: 'rgba(54,183,176,0.08)' }} />
                <div className="h-4 w-full rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="h-4 w-2/3 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', animationDelay: '150ms' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
