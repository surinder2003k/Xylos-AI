export default function RootLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.5em] animate-pulse">
        Xylos AI // Synchronizing
      </p>
    </div>
  );
}
