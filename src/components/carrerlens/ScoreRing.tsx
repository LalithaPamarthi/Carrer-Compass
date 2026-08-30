import { cn } from "@/lib/utils";

interface ScoreRingProps {
  value: number;
  size?: number;
  thickness?: number;
  label?: string;
  className?: string;
}

/** Accessible SVG score ring — no chart library needed for a single value. */
export function ScoreRing({ value, size = 132, thickness = 10, label, className }: ScoreRingProps) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      role="img"
      aria-label={`${label ?? "Score"}: ${clamped} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={thickness} className="stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-primary transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">{clamped}</span>
        {label ? <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span> : null}
      </div>
    </div>
  );
}
