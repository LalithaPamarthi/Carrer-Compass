import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/types";

const MAP: Record<Severity, { label: string; className: string }> = {
  critical: { label: "Critical", className: "bg-critical/10 text-critical border-critical/25" },
  high: { label: "High priority", className: "bg-warning/15 text-warning-foreground border-warning/35" },
  recommended: { label: "Recommended", className: "bg-accent text-accent-foreground border-primary/20" },
  optional: { label: "Optional", className: "bg-secondary text-secondary-foreground border-border" },
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  const item = MAP[severity];
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium", item.className, className)}>
      {item.label}
    </span>
  );
}

export function LevelBadge({ level }: { level: "strong" | "partial" | "missing" | "developing" }) {
  const map = {
    strong: "bg-success/12 text-success border-success/25",
    partial: "bg-warning/15 text-warning-foreground border-warning/35",
    developing: "bg-warning/15 text-warning-foreground border-warning/35",
    missing: "bg-critical/10 text-critical border-critical/25",
  } as const;
  const labels = { strong: "Strong", partial: "Partial", developing: "Developing", missing: "Missing" } as const;
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium", map[level])}>
      {labels[level]}
    </span>
  );
}
