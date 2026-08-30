import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, ScanSearch } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/careerlens/Logo";
import { buildAnalysis } from "@/lib/analysis-engine";
import { emptyInputs, useAnalysisStore } from "@/lib/analysis-store";
import type { AnalysisInputs } from "@/lib/types";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze your career profile — CareerLens" },
      {
        name: "description",
        content:
          "Paste your resume, portfolio, GitHub and a target job description to get an honest, evidence-based career readiness analysis.",
      },
      { property: "og:title", content: "Analyze your career profile — CareerLens" },
      { property: "og:description", content: "Get an honest, evidence-based read on how recruiters see your profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const [inputs, setInputs] = useState<AnalysisInputs>(emptyInputs);
  const [busy, setBusy] = useState(false);
  const { setAnalysis, loadDemo } = useAnalysisStore();
  const navigate = useNavigate();

  const set = <K extends keyof AnalysisInputs>(key: K, value: AnalysisInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const hasSomething =
    inputs.resumeText.trim().length > 0 ||
    inputs.portfolioUrl.trim().length > 0 ||
    inputs.portfolioText.trim().length > 0 ||
    inputs.githubUrl.trim().length > 0 ||
    inputs.jobDescription.trim().length > 0;

  async function onFile(file: File | null) {
    if (!file) return;
    if (!/\.(txt|md)$/i.test(file.name)) {
      toast.error("Please paste your resume text", {
        description: "Plain text (.txt / .md) files can be read directly. For PDFs, copy the text and paste it below.",
      });
      return;
    }
    const text = await file.text();
    setInputs((prev) => ({ ...prev, resumeText: text, resumeFileName: file.name }));
    toast.success(`Loaded ${file.name}`);
  }

  function submit() {
    if (!hasSomething) {
      toast.error("Add at least one source so there is something to analyze.");
      return;
    }
    setBusy(true);
    // Local heuristic analysis — nothing leaves the browser.
    setTimeout(() => {
      setAnalysis(buildAnalysis(inputs));
      setBusy(false);
      navigate({ to: "/app" });
    }, 500);
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link to="/">
            <Logo />
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="size-4" /> Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Analyze your career profile</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Add whatever you have — every section is optional, and CareerLens is explicit about what it cannot judge. Your
          information stays in this browser.
        </p>

        <div className="mt-8 space-y-6">
          <section className="surface-card space-y-3 p-5">
            <div>
              <h2 className="text-sm font-semibold">Resume</h2>
              <p className="text-xs text-muted-foreground">Paste the full text, or upload a .txt / .md export.</p>
            </div>
            <Textarea
              value={inputs.resumeText}
              onChange={(e) => set("resumeText", e.target.value)}
              rows={10}
              placeholder="Paste your resume text here, including experience bullets, skills and education."
              aria-label="Resume text"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Input
                type="file"
                accept=".txt,.md"
                className="max-w-xs"
                aria-label="Upload resume text file"
                onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
              />
              {inputs.resumeFileName ? (
                <span className="text-xs text-muted-foreground">{inputs.resumeFileName}</span>
              ) : null}
            </div>
          </section>

          <section className="surface-card space-y-3 p-5">
            <div>
              <h2 className="text-sm font-semibold">Portfolio</h2>
              <p className="text-xs text-muted-foreground">
                CareerLens does not crawl your site — paste your project descriptions for a real review.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio-url">Portfolio URL</Label>
              <Input
                id="portfolio-url"
                value={inputs.portfolioUrl}
                onChange={(e) => set("portfolioUrl", e.target.value)}
                placeholder="https://yourname.dev"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio-text">Project descriptions</Label>
              <Textarea
                id="portfolio-text"
                value={inputs.portfolioText}
                onChange={(e) => set("portfolioText", e.target.value)}
                rows={6}
                placeholder="One project per paragraph: what it does, your role, the stack, the outcome."
              />
            </div>
          </section>

          <section className="surface-card space-y-3 p-5">
            <div>
              <h2 className="text-sm font-semibold">GitHub</h2>
              <p className="text-xs text-muted-foreground">Used as an evidence signal only, never as a code audit.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="github-url">Profile URL</Label>
                <Input
                  id="github-url"
                  value={inputs.githubUrl}
                  onChange={(e) => set("githubUrl", e.target.value)}
                  placeholder="https://github.com/yourname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repo-url">Best repository (optional)</Label>
                <Input
                  id="repo-url"
                  value={inputs.repoUrl}
                  onChange={(e) => set("repoUrl", e.target.value)}
                  placeholder="https://github.com/yourname/project"
                />
              </div>
            </div>
          </section>

          <section className="surface-card space-y-3 p-5">
            <div>
              <h2 className="text-sm font-semibold">Target job</h2>
              <p className="text-xs text-muted-foreground">Paste the job description to unlock job match and skill gaps.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-url">Job posting URL (optional)</Label>
              <Input
                id="job-url"
                value={inputs.jobUrl}
                onChange={(e) => set("jobUrl", e.target.value)}
                placeholder="https://company.com/careers/frontend-engineer"
              />
            </div>
            <Textarea
              value={inputs.jobDescription}
              onChange={(e) => set("jobDescription", e.target.value)}
              rows={8}
              placeholder="Paste the full job description: responsibilities, required skills, experience and education."
              aria-label="Job description"
            />
          </section>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button onClick={submit} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <ScanSearch className="size-4" />}
            {busy ? "Analyzing…" : "Run analysis"}
          </Button>
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() => {
              loadDemo();
              navigate({ to: "/app" });
            }}
          >
            Explore the demo instead
          </Button>
        </div>
      </main>
    </div>
  );
}
