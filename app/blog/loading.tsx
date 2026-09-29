/**
 * Loading skeleton for the blog archive.
 *
 * Previously this was a centred spinner on an otherwise empty page, which made
 * a route change feel like a full reload. The skeleton below mirrors the real
 * layout in app/blog/page.tsx (hero block -> "Latest stories" rule -> 3-up card
 * grid) so the transition into the loaded page is a fill-in rather than a jump.
 */

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#141518]/60">
      <div className="skeleton aspect-[16/11] rounded-none" />
      <div className="space-y-4 p-6 sm:p-7">
        <div className="skeleton h-3 w-28" />
        <div className="skeleton h-5 w-full" />
        <div className="skeleton h-5 w-3/5" />
        <div className="space-y-2.5">
          <div className="skeleton h-3.5 w-full" />
          <div className="skeleton h-3.5 w-11/12" />
          <div className="skeleton h-3.5 w-4/5" />
        </div>
        <div className="flex items-center justify-between border-t border-white/[0.08] pt-5">
          <div className="flex items-center gap-3">
            <div className="skeleton h-8 w-8 rounded-lg" />
            <div className="skeleton h-3 w-32" />
          </div>
          <div className="skeleton h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function BlogLoading() {
  return (
    <div className="editorial-page min-h-screen bg-[#0d0e10] px-4 pb-16 pt-28 text-white sm:px-6 md:px-8 md:pt-32">
      <div
        className="mx-auto max-w-7xl"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span className="sr-only">Loading articles…</span>

        {/* Hero block — matches the journal header in app/blog/page.tsx */}
        <section className="relative mb-12 overflow-hidden border-b border-white/[0.08] pb-10 md:mb-16 md:pb-14">
          <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <div className="skeleton mb-4 h-2.5 w-40" />
              <div className="skeleton h-12 w-full max-w-2xl md:h-16" />
              <div className="skeleton mt-2 h-12 w-4/5 max-w-xl md:h-16" />
              <div className="mt-5 max-w-2xl space-y-2.5">
                <div className="skeleton h-3.5 w-full" />
                <div className="skeleton h-3.5 w-10/12" />
              </div>
            </div>
            <div className="flex items-center gap-3 self-start border-l border-[#36b7b0]/30 pl-4 md:self-end">
              <div className="skeleton h-8 w-10" />
              <div className="skeleton h-8 w-12" />
            </div>
          </div>
        </section>

        {/* "Latest stories" rule */}
        <div className="mb-7 flex items-center gap-4" aria-hidden="true">
          <div className="skeleton h-2.5 w-28" />
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        {/* Card grid — same breakpoints as BlogGrid */}
        <div className="skeleton-stagger grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
