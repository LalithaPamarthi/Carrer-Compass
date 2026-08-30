import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/careerlens/EmptyState";
import { NoAnalysis } from "@/components/careerlens/NoAnalysis";
import { ScoreRing } from "@/components/careerlens/ScoreRing";
import { SectionHeader, SignalBars } from "@/components/careerlens/SectionHeader";
import { useAnalysisStore } from "@/lib/analysis-store";

export const Route = createFileRoute("/app/resume")({ component: ResumePage });

function ResumePage() {
  const { analysis, ready } = useAnalysisStore();
  const [copied, setCopied] = useState<string | null>(null);

  if (!ready) return <div className="h-64 animate-pulse rounded-xl bg-muted" />;
  if (!analysis) return <NoAnalysis />;

  const { resume } = analysis;

  if (!analysis.provided.resume) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Resume insights" />
        <EmptyState
          icon={FileText}
          title="No resume yet"
          description="Add or paste your resume to see structure, clarity, impact and keyword-alignment signals."
          actionLabel="Add my resume"
          actionTo="/analyze"
        />
      </div>
    );
  }

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      toast.success("Suggestion copied");
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="Resume insights" description={resume.summary} />

      <section className="surface-card flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center">
        <ScoreRing value={resume.score ?? 0} label="Resume" />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">What this score reflects</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Structure, measurable impact, action verbs, keyword alignment with your target job, and overall density. These are
            compatibility signals — no tool can guarantee a screening outcome.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Signal breakdown</h2>
        <SignalBars signals={resume.signals} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Bullet-level review</h2>
        {resume.bulletReviews.length === 0 ? (
          <p className="surface-card p-4 text-sm text-muted-foreground">
            No weak bullets detected in the text provided. Keep each line focused on an action and its outcome.
          </p>
        ) : (
          <ul className="space-y-4">
            {resume.bulletReviews.map((b) => (
              <li key={b.id} className="surface-card overflow-hidden">
                <div className="border-b border-border bg-muted/40 p-4">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Current</p>
                  <p className="mt-1 text-sm">{b.current}</p>
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-critical">Problem</p>
                    <p className="mt-1 text-sm text-muted-foreground">{b.problem}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-success">Suggested direction</p>
                    <p className="mt-1 text-sm text-muted-foreground">{b.suggestion}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => void copy(b.suggestion, b.id)}>
                    {copied === b.id ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    Copy suggestion
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-muted-foreground">
          CareerLens never invents achievements or numbers. Where a metric is missing, add a real one you can defend.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-5">
          <h2 className="text-sm font-semibold">Keyword gaps vs the target job</h2>
          {resume.keywordGaps.length ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {resume.keywordGaps.map((k) => (
                <li key={k} className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium">
                  {k}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No missing keywords detected{analysis.provided.job ? "" : " — add a target job description to compare properly"}.
            </p>
          )}
        </div>
        <div className="surface-card p-5">
          <h2 className="text-sm font-semibold">ATS compatibility signals</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {resume.atsNotes.map((n) => (
              <li key={n} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {n}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
