export default function BlogLoading() {
  return (
    <div className="editorial-page min-h-screen bg-[#0d0e10] px-4 pb-16 pt-28 text-white sm:px-6 md:px-8 md:pt-32">
      <div className="mx-auto flex min-h-[55vh] max-w-[1400px] flex-col items-center justify-center text-center" role="status" aria-live="polite">
        <span className="mb-5 h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-[#36b7b0]" aria-hidden="true" />
        <p className="text-sm font-medium text-gray-300">Loading the latest stories…</p>
      </div>
    </div>
  );
}
