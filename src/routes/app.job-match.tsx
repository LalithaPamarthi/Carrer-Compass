import { createFileRoute } from "@tanstack/react-router";
import { Target } from "lucide-react";
import { EmptyState } from "@/components/careerlens/EmptyState";
import { NoAnalysis } from "@/components/careerlens/NoAnalysis";
import { ScoreRing } from "@/components/careerlens/ScoreRing";
import { SectionHeader } from "@/components/careerlens/SectionHeader";
import { LevelBadge } from "@/components/careerlens/SeverityBadge";
import { useAnalysisStore } from "@/lib/analysis-store";

export const Route = createFileRoute("/app/job-match")({ component: JobMatchPage });

function JobMatchPage() {
  const { analysis, ready } = useAnalysisStore();
  if (!ready) return <div className="h-64 animate-pulse rounded-xl bg-muted" />;
  if (!analysis) return <NoAnalysis />;

  const { jobMatch } = analysis;

  if (!analysis.provided.job) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Job match" />
        <EmptyState
          icon={Target}
          title="No target job yet"
          description="Paste a job description to see, requirement by requirement, where your profile has evidence and where it does not."
          actionLabel="Add a job description"
          actionTo="/analyze"
        />
      </div>
    );
  }

  const groups = [
    { level: "strong" as const, title: "Strong evidence" },
    { level: "partial" as const, title: "Partial evidence" },
    { level: "missing" as const, title: "No evidence found" },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader title="Job match" description={jobMatch.summary} />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="surface-card flex items-center gap-5 p-6">
          <ScoreRing value={jobMatch.score ?? 0} label="Match" size={112} />
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Target role</p>
            <p className="mt-0.5 font-medium">{jobMatch.role}</p>
          </div>
        </div>

        <div className="surface-card p-5">
          <h2 className="text-sm font-semibold">Required skills</h2>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {jobMatch.requiredSkills.length ? (
              jobMatch.requiredSkills.map((s) => (
                <li key={s} className="rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">
                  {s}
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">None detected in the posting.</li>
            )}
          </ul>
        </div>

        <div className="surface-card p-5">
          <h2 className="text-sm font-semibold">Preferred skills</h2>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {jobMatch.preferredSkills.length ? (
              jobMatch.preferredSkills.map((s) => (
                <li key={s} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  {s}
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">None detected in the posting.</li>
            )}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold">Requirement-by-requirement evidence</h2>
        {groups.map((group) => {
          const items = jobMatch.evidence.filter((e) => e.level === group.level);
          if (!items.length) return null;
          return (
            <div key={group.level} className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{group.title}</h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e.skill} className="surface-card p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <LevelBadge level={e.level} />
                      <span className="text-sm font-medium">{e.skill}</span>
                      {e.required ? (
                        <span className="rounded-full bg-critical/10 px-2 py-0.5 text-[11px] font-medium text-critical">
                          Required
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.note}</p>
                    {e.sources.length ? (
                      <p className="mt-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                        Evidence: {e.sources.join(", ")}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <InfoList title="Experience requirements" items={jobMatch.experienceRequirements} />
        <InfoList title="Education requirements" items={jobMatch.educationRequirements} />
        <InfoList title="Responsibilities" items={jobMatch.responsibilities} />
      </section>
    </div>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="surface-card p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      {items.length ? (
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
          {items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">Not stated in the posting.</p>
      )}
    </div>
  );
}
