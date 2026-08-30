import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Github, MinusCircle } from "lucide-react";
import { EmptyState } from "@/components/careerlens/EmptyState";
import { NoAnalysis } from "@/components/careerlens/NoAnalysis";
import { ScoreRing } from "@/components/careerlens/ScoreRing";
import { SectionHeader } from "@/components/careerlens/SectionHeader";
import { useAnalysisStore } from "@/lib/analysis-store";

export const Route = createFileRoute("/app/github")({ component: GithubPage });

const STATUS_ICON = { good: CheckCircle2, warn: AlertCircle, bad: MinusCircle } as const;
const STATUS_COLOR = { good: "text-success", warn: "text-warning", bad: "text-critical" } as const;

function GithubPage() {
  const { analysis, ready } = useAnalysisStore();
  if (!ready) return <div className="h-64 animate-pulse rounded-xl bg-muted" />;
  if (!analysis) return <NoAnalysis />;

  const { github } = analysis;

  if (!analysis.provided.github) {
    return (
      <div className="space-y-6">
        <SectionHeader title="GitHub insights" />
        <EmptyState
          icon={Github}
          title="No GitHub data yet"
          description="Add your GitHub profile to unlock developer insights."
          actionLabel="Add my GitHub"
          actionTo="/analyze"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader title="GitHub insights" description={github.summary} />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="surface-card flex items-center gap-5 p-6">
          <ScoreRing value={github.score ?? 0} label="GitHub" size={112} />
          <p className="text-sm leading-relaxed text-muted-foreground">
            An evidence-availability signal, not a code audit. CareerLens never analyses private information.
          </p>
        </div>

        <div className="surface-card p-5">
          <h2 className="text-sm font-semibold text-success">Detected</h2>
          {github.detected.length ? (
            <dl className="mt-3 space-y-2 text-sm">
              {github.detected.map((d) => (
                <div key={d.label} className="flex flex-wrap justify-between gap-2">
                  <dt className="text-muted-foreground">{d.label}</dt>
                  <dd className="max-w-full truncate font-medium">{d.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Nothing detected from the links provided.</p>
          )}
        </div>

        <div className="surface-card p-5">
          <h2 className="text-sm font-semibold text-muted-foreground">Not available</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {github.notAvailable.map((n) => (
              <li key={n} className="flex gap-2">
                <MinusCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {n}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {github.languages.length ? (
        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">Languages and technologies</h2>
          <ul className="mt-4 space-y-3">
            {github.languages.map((l) => (
              <li key={l.name}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{l.name}</span>
                  <span className="tabular-nums text-muted-foreground">{l.share}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${l.share}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-5">
          <h2 className="text-sm font-semibold">Repository highlights</h2>
          {github.highlights.length ? (
            <ul className="mt-3 space-y-3">
              {github.highlights.map((h) => (
                <li key={h.name}>
                  <p className="truncate text-sm font-medium">{h.name}</p>
                  <p className="text-sm text-muted-foreground">{h.detail}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Add one repository URL you want reviewers to open first, and CareerLens will highlight it here.
            </p>
          )}
        </div>
        <div className="surface-card p-5">
          <h2 className="text-sm font-semibold">Quality signals</h2>
          <ul className="mt-3 space-y-3">
            {github.qualitySignals.map((q) => {
              const Icon = STATUS_ICON[q.status];
              return (
                <li key={q.label} className="flex gap-2">
                  <Icon className={`mt-0.5 size-4 shrink-0 ${STATUS_COLOR[q.status]}`} aria-hidden="true" />
                  <span className="text-sm">
                    <span className="font-medium">{q.label}</span>{" "}
                    <span className="text-muted-foreground">— {q.note}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
