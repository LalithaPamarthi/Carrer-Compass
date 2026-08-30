import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/careerlens/EmptyState";
import { NoAnalysis } from "@/components/careerlens/NoAnalysis";
import { SectionHeader } from "@/components/careerlens/SectionHeader";
import { LevelBadge } from "@/components/careerlens/SeverityBadge";
import { useAnalysisStore } from "@/lib/analysis-store";

export const Route = createFileRoute("/app/skill-gaps")({ component: SkillGapsPage });

const PRIORITY_LABEL = {
  "learn-first": "Learn first",
  "learn-next": "Learn next",
  optional: "Nice to have",
} as const;

const PRIORITY_CLASS = {
  "learn-first": "bg-critical/10 text-critical",
  "learn-next": "bg-warning/10 text-warning",
  optional: "bg-muted text-muted-foreground",
} as const;

const LEVEL_WIDTH = { strong: "w-full", developing: "w-1/2", missing: "w-[8%]" } as const;
const LEVEL_COLOR = { strong: "bg-success", developing: "bg-warning", missing: "bg-critical" } as const;

function SkillGapsPage() {
  const { analysis, ready } = useAnalysisStore();
  if (!ready) return <div className="h-64 animate-pulse rounded-xl bg-muted" />;
  if (!analysis) return <NoAnalysis />;

  const { skillGaps } = analysis;

  if (!skillGaps.length) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Skill gaps" />
        <EmptyState
          icon={BarChart3}
          title="No skill comparison yet"
          description="Skill gaps are calculated by comparing a target job description against the evidence in your profile."
          actionLabel="Add a job description"
          actionTo="/analyze"
        />
      </div>
    );
  }

  const order = ["learn-first", "learn-next", "optional"] as const;
  const sorted = [...skillGaps].sort((a, b) => order.indexOf(a.priority) - order.indexOf(b.priority));

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Skill gaps"
        description="Where your evidence is strong, developing, or missing for the role you are targeting."
      />

      <ul className="space-y-3">
        {sorted.map((gap) => (
          <li key={gap.skill} className="surface-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">{gap.skill}</span>
              <LevelBadge level={gap.level} />
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${PRIORITY_CLASS[gap.priority]}`}>
                {PRIORITY_LABEL[gap.priority]}
              </span>
            </div>
            <div
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
              role="img"
              aria-label={`${gap.skill}: ${gap.level}`}
            >
              <div className={`h-full rounded-full ${LEVEL_COLOR[gap.level]} ${LEVEL_WIDTH[gap.level]}`} />
            </div>
            <dl className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <div>
                <dt className="inline font-medium text-foreground">Why it matters: </dt>
                <dd className="inline">{gap.why}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-foreground">What to do: </dt>
                <dd className="inline">{gap.action}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
