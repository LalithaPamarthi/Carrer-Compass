import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, CheckCircle2, CircleDashed } from "lucide-react";
import { EmptyState } from "@/components/careerlens/EmptyState";
import { NoAnalysis } from "@/components/careerlens/NoAnalysis";
import { ScoreRing } from "@/components/careerlens/ScoreRing";
import { SectionHeader, SignalBars } from "@/components/careerlens/SectionHeader";
import { useAnalysisStore } from "@/lib/analysis-store";

export const Route = createFileRoute("/app/portfolio")({ component: PortfolioPage });

function PortfolioPage() {
  const { analysis, ready } = useAnalysisStore();
  if (!ready) return <div className="h-64 animate-pulse rounded-xl bg-muted" />;
  if (!analysis) return <NoAnalysis />;

  const { portfolio } = analysis;

  if (!analysis.provided.portfolio) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Portfolio insights" />
        <EmptyState
          icon={Briefcase}
          title="No portfolio yet"
          description="Add a portfolio URL or paste your project descriptions to see how clearly your work reads to a reviewer."
          actionLabel="Add my portfolio"
          actionTo="/analyze"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader title="Portfolio insights" description={portfolio.summary} />

      <section className="surface-card flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center">
        <ScoreRing value={portfolio.score ?? 0} label="Portfolio" />
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">Recommended project description structure</h2>
          <ol className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            {portfolio.descriptionTemplate.map((step, i) => (
              <li key={step} className="flex gap-2">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Signal breakdown</h2>
        <SignalBars signals={portfolio.signals} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Project review</h2>
        {portfolio.projects.length === 0 ? (
          <p className="surface-card p-4 text-sm text-muted-foreground">
            No individual project descriptions were detected. Paste one short paragraph per project for a per-project review.
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {portfolio.projects.map((p) => (
              <li key={p.id} className="surface-card p-5">
                <h3 className="text-sm font-semibold">{p.name}</h3>
                <div className="mt-3 space-y-2 text-sm">
                  {p.detected.map((d) => (
                    <p key={d} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" /> {d}
                    </p>
                  ))}
                  {p.missing.map((m) => (
                    <p key={m} className="flex items-start gap-2 text-muted-foreground">
                      <CircleDashed className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" /> Missing: {m}
                    </p>
                  ))}
                </div>
                <p className="mt-3 rounded-lg bg-accent/50 p-3 text-sm text-accent-foreground">{p.recommendation}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
