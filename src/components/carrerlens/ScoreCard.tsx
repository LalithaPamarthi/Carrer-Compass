import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { scoreBand } from "@/lib/analysis-engine";
import type { LucideIcon } from "lucide-react";

interface ScoreCardProps {
  label: string;
  score: number | null;
  explanation: string;
  icon: LucideIcon;
  emptyHint?: string;
  className?: string;
}

export function ScoreCard({ label, score, explanation, icon: Icon, emptyHint, className }: ScoreCardProps) {
  return (
    <div className={cn("surface-card flex flex-col gap-3 p-5 transition-shadow hover:shadow-[var(--shadow-card)]", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <h3 className="truncate text-sm font-medium text-foreground">{label}</h3>
        </div>
        {score !== null ? (
          <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
            {scoreBand(score)}
          </span>
        ) : null}
      </div>

      {score === null ? (
        <p className="text-sm text-muted-foreground">{emptyHint ?? "Not enough information provided yet."}</p>
      ) : (
        <>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            {score}
            <span className="ml-1 text-base font-normal text-muted-foreground">/ 100</span>
          </p>
          <Progress value={score} aria-label={`${label} score`} />
        </>
      )}
      <p className="text-xs leading-relaxed text-muted-foreground">{explanation}</p>
    </div>
  );
}
