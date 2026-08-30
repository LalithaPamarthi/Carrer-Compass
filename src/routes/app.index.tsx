import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  FileText,
  Github,
  Sparkle,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/careerlens/ScoreRing";
import { ScoreCard } from "@/components/careerlens/ScoreCard";
import { SectionHeader } from "@/components/careerlens/SectionHeader";
import { SeverityBadge } from "@/components/careerlens/SeverityBadge";
import { NoAnalysis } from "@/components/careerlens/NoAnalysis";
import { useAnalysisStore } from "@/lib/analysis-store";
import { scoreBand } from "@/lib/analysis-engine";

export const Route = createFileRoute("/app/")({ component: OverviewPage });

const ICONS = { resume: FileText, portfolio: Briefcase, github: Github, jobMatch: Target } as const;

function OverviewPage() {
  const { analysis, ready } = useAnalysisStore();
  if (!ready) return <div className="h-64 animate-pulse rounded-xl bg-muted" />;
  if (!analysis) return <NoAnalysis />;

  const severityOrder = ["critical", "high", "recommended", "optional"] as const;
  const weaknesses = [...analysis.weaknesses].sort(
    (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity),
  );
  const top = analysis.improvementPlan[0];

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Career readiness overview"
        description={`Analyzed ${new Date(analysis.createdAt).toLocaleDateString()} · ${analysis.targetRole}`}
      >
        <Button asChild variant="outline">
          <Link to="/app/plan">View improvement plan</Link>
        </Button>
      </SectionHeader>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="surface-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center lg:col-span-1">
          <ScoreRing value={analysis.overallScore} label={scoreBand(analysis.overallScore)} />
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Overall career readiness</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{analysis.overallSummary}</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {analysis.breakdown.map((b) => (
            <ScoreCard
              key={b.key}
              label={b.label}
              score={b.score}
              explanation={b.explanation}
              icon={ICONS[b.key]}
              emptyHint={`Add your ${b.label.toLowerCase()} information to unlock this score.`}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="size-4 text-success" aria-hidden="true" /> What's helping your profile
          </h2>
          <ul className="space-y-3">
            {analysis.strengths.map((s) => (
              <li key={s.id} className="surface-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium">{s.title}</p>
                  <span className="shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">{s.source}</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="size-4 text-critical" aria-hidden="true" /> What's hurting your profile
          </h2>
          <ul className="space-y-3">
            {weaknesses.map((w) => (
              <li key={w.id} className="surface-card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={w.severity} />
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{w.area}</span>
                </div>
                <p className="mt-2 text-sm font-medium">{w.problem}</p>
                <dl className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  <div>
                    <dt className="inline font-medium text-foreground">Why it matters: </dt>
                    <dd className="inline">{w.whyItMatters}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground">How to fix it: </dt>
                    <dd className="inline">{w.howToFix}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {top ? (
        <section className="surface-card flex flex-col gap-4 bg-accent/40 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sparkle className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Top priority</p>
              <p className="mt-0.5 font-medium">{top.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{top.reason}</p>
            </div>
          </div>
          <Button asChild className="shrink-0">
            <Link to="/app/plan">
              <TrendingUp className="size-4" /> See recommendations
            </Link>
          </Button>
        </section>
      ) : null}
    </div>
  );
}
