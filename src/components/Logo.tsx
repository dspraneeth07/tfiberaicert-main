export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="h-9 w-9 rounded-xl bg-[var(--gradient-tricolor)] grid place-items-center shadow-md">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
            <path
              d="M4 13l4 4L20 5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="leading-tight">
        <div className="text-lg font-bold tracking-tight">
          <span className="text-tf-green">T</span>
          <span className="text-foreground">Fiber</span>
          <span className="text-tf-orange"> »</span>
        </div>
        <div className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          AI Certify
        </div>
      </div>
    </div>
  );
}
