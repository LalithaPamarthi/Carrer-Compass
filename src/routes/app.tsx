import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart3,
  Briefcase,
  FileText,
  Github,
  LayoutGrid,
  ListChecks,
  Menu,
  MessageSquare,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  Target,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/careerlens/Logo";
import { CoachChat } from "@/components/careerlens/CoachChat";
import { useAnalysisStore } from "@/lib/analysis-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Career readiness dashboard — CareerLens" },
      { name: "description", content: "Your career-readiness scores, weaknesses, job match, skill gaps and improvement plan." },
      { property: "og:title", content: "Career readiness dashboard — CareerLens" },
      { property: "og:description", content: "Scores, weaknesses, job match, skill gaps and a prioritised improvement plan." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppLayout,
});

const NAV = [
  { to: "/app", label: "Overview", icon: LayoutGrid, exact: true },
  { to: "/app/resume", label: "Resume", icon: FileText },
  { to: "/app/portfolio", label: "Portfolio", icon: Briefcase },
  { to: "/app/github", label: "GitHub", icon: Github },
  { to: "/app/job-match", label: "Job Match", icon: Target },
  { to: "/app/skill-gaps", label: "Skill Gaps", icon: BarChart3 },
  { to: "/app/plan", label: "Improvement Plan", icon: ListChecks },
  { to: "/app/coach", label: "Career Coach", icon: MessageSquare },
] as const;

function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(true);
  const { analysis, clear } = useAnalysisStore();
  const navigate = useNavigate();

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Dashboard sections">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeOptions={{ exact: "exact" in item ? item.exact : false }}
          onClick={() => setMobileNavOpen(false)}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[status=active]:bg-accent data-[status=active]:text-accent-foreground"
        >
          <item.icon className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{item.label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-sidebar px-4 py-5 lg:flex">
        <Link to="/" className="mb-6 px-1">
          <Logo />
        </Link>
        {nav}
        <Button className="mt-5" onClick={() => navigate({ to: "/analyze" })}>
          <Plus className="size-4" /> New Analysis
        </Button>
        <div className="mt-auto space-y-3 pt-6">
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-xs font-medium">Privacy</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Your career information stays in this browser. CareerLens only sends the analysis summary to the AI coach when you
              ask it a question.
            </p>
          </div>
          {analysis ? (
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
              onClick={() => {
                clear();
                navigate({ to: "/analyze" });
              }}
            >
              <X className="size-4" /> Clear analysis
            </Button>
          ) : null}
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="New analysis" onClick={() => navigate({ to: "/analyze" })}>
            <Plus className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((v) => !v)}
          >
            {mobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </header>
      {mobileNavOpen ? (
        <div className="sticky top-[57px] z-30 border-b border-border bg-card px-4 py-3 lg:hidden">{nav}</div>
      ) : null}

      <div className="lg:pl-64">
        <div className={cn("flex", coachOpen && "xl:pr-[26rem]")}>
          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {analysis?.isDemo ? (
              <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-primary/25 bg-accent/60 px-4 py-2.5 text-sm">
                <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">DEMO</span>
                <span className="text-accent-foreground">
                  You're viewing a sample candidate profile and target job — not real analysis of your data.
                </span>
                <Link to="/analyze" className="font-medium text-primary underline-offset-4 hover:underline">
                  Analyze my profile
                </Link>
              </div>
            ) : null}
            <Outlet />
          </main>
        </div>
      </div>

      {/* Desktop coach panel */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-40 hidden xl:block">
        <Button
          className="pointer-events-auto shadow-[var(--shadow-card)]"
          variant={coachOpen ? "outline" : "default"}
          onClick={() => setCoachOpen((v) => !v)}
        >
          {coachOpen ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
          {coachOpen ? "Hide coach" : "Ask the coach"}
        </Button>
      </div>
      {coachOpen ? (
        <aside className="fixed inset-y-0 right-0 z-30 hidden w-[26rem] border-l border-border bg-card xl:flex xl:flex-col">
          <div className="min-h-0 flex-1 pb-20">
            <CoachChat variant="panel" />
          </div>
        </aside>
      ) : null}
    </div>
  );
}
