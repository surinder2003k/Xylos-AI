/**
 * Loading skeleton for an individual blog post.
 *
 * app/blog/[slug] has no loading.tsx of its own, so navigating into a post fell
 * back to app/loading.tsx — a centred spinner that replaced the entire viewport
 * with a min-h-screen block. On a page transition that reads as a crash: the
 * article you just clicked into never appeared, only a spinner.
 *
 * The skeleton below mirrors app/blog/[slug]/page.tsx instead: hero image,
 * category/meta row, title, author, article body, then the sticky sidebar.
 */

function BodyLines({ count = 6 }: { count?: number }) {
  // Varied widths so the block reads as paragraphs, not as one solid bar.
  const widths = ["w-full", "w-11/12", "w-full", "w-4/5", "w-full", "w-10/12", "w-full", "w-3/4"];
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton h-3.5 ${widths[i % widths.length]}`} />
      ))}
    </div>
  );
}

export default function BlogPostLoading() {
  return (
    <div className="editorial-page min-h-screen bg-[#0d0e10] text-white">
      {/* Sticky header strip */}
      <div
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(10, 11, 14, 0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-5 w-24" />
        <div className="skeleton h-8 w-8 rounded-lg" />
      </div>

      <main className="pt-20" role="status" aria-live="polite" aria-busy="true">
        <span className="sr-only">Loading article…</span>

        {/* Hero image */}
        <div className="relative w-full" style={{ height: "70vh", minHeight: "500px" }}>
          <div className="skeleton h-full w-full rounded-none" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(20,21,24,0.3) 0%, rgba(20,21,24,0.6) 50%, rgba(20,21,24,1) 100%)",
            }}
          />
        </div>

        <div className="mx-auto -mt-32 max-w-[1400px] px-6 lg:px-10">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
            {/* Article column */}
            <article className="max-w-4xl flex-1">
              {/* Category + meta */}
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <div className="skeleton h-6 w-28 rounded-full" />
                <div className="skeleton h-3 w-20" />
                <div className="skeleton h-3 w-14" />
              </div>

              {/* Title */}
              <div className="mb-8 space-y-3">
                <div className="skeleton h-10 w-full md:h-12" />
                <div className="skeleton h-10 w-4/5 md:h-12" />
              </div>

              {/* Author */}
              <div
                className="mb-12 flex items-center gap-4 pb-8"
                style={{ borderBottom: "1px solid rgba(190, 184, 170, 0.15)" }}
              >
                <div className="skeleton h-11 w-11 rounded-full" />
                <div className="space-y-2">
                  <div className="skeleton h-3.5 w-32" />
                  <div className="skeleton h-3 w-28" />
                </div>
              </div>

              {/* Body: a heading + paragraphs, then a second block */}
              <div className="space-y-9" style={{ fontFamily: "var(--font-sora), sans-serif" }}>
                <section className="space-y-4">
                  <div className="skeleton h-6 w-2/5" />
                  <BodyLines count={6} />
                </section>
                <section className="space-y-4">
                  <div className="skeleton h-6 w-1/2" />
                  <BodyLines count={7} />
                </section>
                <section className="space-y-4">
                  <div className="skeleton h-6 w-2/3" />
                  <div className="skeleton h-40 w-full rounded-xl" />
                  <BodyLines count={5} />
                </section>
              </div>

              {/* Newsletter CTA placeholder */}
              <div className="my-14">
                <div className="skeleton h-40 w-full rounded-2xl" />
              </div>
            </article>

            {/* Sidebar — hidden on mobile, matching the real sticky aside */}
            <aside className="hidden w-full shrink-0 lg:block lg:w-72 xl:w-80">
              <div className="space-y-8 lg:sticky lg:top-24">
                <div className="rounded-xl p-5" style={{ background: "rgba(26, 29, 35, 0.6)", border: "1px solid rgba(190, 184, 170, 0.15)" }}>
                  <div className="skeleton mb-3 h-3 w-32" />
                  <div className="space-y-2.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="skeleton h-3.5 w-full" />
                    ))}
                  </div>
                </div>
                <div className="rounded-xl p-5" style={{ background: "rgba(26, 29, 35, 0.6)", border: "1px solid rgba(190, 184, 170, 0.15)" }}>
                  <div className="skeleton mb-4 h-3 w-24" />
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="skeleton h-14 w-full rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
