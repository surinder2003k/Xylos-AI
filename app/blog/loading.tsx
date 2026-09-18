export default function BlogLoading() {
  return (
    <div className="min-h-screen py-16 px-6" style={{ background: '#0a0b0e' }}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header skeleton */}
        <div className="flex flex-col items-center gap-4 mb-14">
          <div className="h-3 w-32 rounded animate-pulse" style={{ background: 'rgba(0,240,255,0.1)' }} />
          <div className="h-10 w-80 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.07)' }} />
        </div>

        {/* Blog grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,73,75,0.2)' }}>
              <div className="h-48 w-full animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', animationDelay: `${i * 100}ms` }} />
              <div className="p-6 space-y-3">
                <div className="h-3 w-1/4 rounded animate-pulse" style={{ background: 'rgba(0,240,255,0.08)' }} />
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