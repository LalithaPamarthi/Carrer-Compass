import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  FileText,
  Github,
  ListChecks,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/careerlens/Logo";
import { ScoreRing } from "@/components/careerlens/ScoreRing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerLens — Honest AI analysis of your career profile" },
      {
        name: "description",
        content:
          "CareerLens reviews your resume, portfolio, GitHub and a target job description, then shows your readiness score, real weaknesses and a prioritised plan.",
      },
      { property: "og:title", content: "CareerLens — Honest AI analysis of your career profile" },
      {
        property: "og:description",
        content: "Readiness scores, evidence-based job match, skill gaps and a prioritised improvement plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: FileText, title: "Resume review", body: "Bullet-by-bullet rewrites, ATS notes and the keywords you are missing." },
  { icon: Briefcase, title: "Portfolio critique", body: "What each project proves, what it fails to prove, and how to reframe it." },
  { icon: Github, title: "GitHub signals", body: "Evidence from your public work — clearly separated from what it cannot judge." },
  { icon: Target, title: "Job match", body: "Every requirement mapped to actual evidence: strong, partial or missing." },
  { icon: BarChart3, title: "Skill gaps", body: "What to learn first, what can wait, and why it matters for this role." },
  { icon: ListChecks, title: "Improvement plan", body: "A prioritised roadmap for this week, 30 days and 60–90 days." },
];

const SCORES = [
  { label: "Resume", value: 82 },
  { label: "Portfolio", value: 74 },
  { label: "GitHub", value: 70 },
  { label: "Job Match", value: 76 },
];

function Landing() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/app">View demo</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/analyze">Analyze my profile</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-gradient border-b border-border">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-card px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="size-3.5" /> Honest, evidence-based feedback
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
                See your career profile the way a recruiter actually does.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                CareerLens analyses your resume, portfolio, GitHub and a target job description together — then tells you your
                readiness score, the weaknesses that are costing you interviews, and exactly what to fix first.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link to="/analyze">
                    Analyze my profile <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/app">Explore the demo</Link>
                </Button>
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5" /> Your career information stays in your browser.
              </p>
            </div>

            <div className="surface-card p-6">
              <div className="flex items-center gap-5">
                <ScoreRing value={78} size={104} label="Overall readiness" />
                <div>
                  <p className="text-sm font-semibold">Overall career readiness</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Strong engineering fundamentals, but your impact is under-quantified and two required skills lack evidence.
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {SCORES.map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{s.label}</span>
                      <span className="tabular-nums text-muted-foreground">{s.value}/100</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${s.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-border bg-surface-muted p-3">
                <MessageSquare className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">Career coach:</span> Your score is 78 because 3 of 7 required
                  skills only have partial evidence. Fix the two resume bullets first — that is the fastest gain.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Eight views, one honest verdict</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Every section separates what CareerLens can verify from what it cannot — no invented praise, no fake certainty.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="surface-card p-5">
                <span className="grid size-9 place-items-center rounded-[10px] bg-accent text-primary">
                  <f.icon className="size-4.5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-sm font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-surface-muted">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How it works</h2>
            <ol className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                { n: "01", t: "Add your sources", d: "Paste your resume, portfolio projects, GitHub links and a target job description. Every field is optional." },
                { n: "02", t: "Get scored", d: "Readiness scores per area, with the reasoning behind every number and clear notes on missing inputs." },
                { n: "03", t: "Work the plan", d: "Follow a prioritised roadmap, then ask the coach anything — grounded in your own analysis." },
              ].map((s) => (
                <li key={s.n} className="surface-card p-5">
                  <span className="text-xs font-semibold tabular-nums text-primary">{s.n}</span>
                  <h3 className="mt-2 text-sm font-semibold">{s.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Find out what is really holding you back</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Two minutes of pasting, and you get the feedback most people never hear after a rejection.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/analyze">
                Analyze my profile <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/app">Explore the demo</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 sm:px-6">
          <Logo />
          <p className="text-xs text-muted-foreground">
            CareerLens gives guidance, not guarantees. Always apply your own judgement.
          </p>
        </div>
      </footer>
    </div>
  );
}
