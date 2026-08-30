import { cn } from "@/lib/utils";

export function Logo({ className, withWordmark = true }: { className?: string; withWordmark?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="10.5" cy="10.5" r="6" />
          <path d="M15.2 15.2 21 21" />
          <path d="M10.5 7.6v5.8" />
        </svg>
      </span>
      {withWordmark ? <span className="text-[17px] font-semibold tracking-tight">CareerLens</span> : null}
    </span>
  );
}
