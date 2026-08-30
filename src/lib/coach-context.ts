import type { Analysis } from "./types";

/** Compact, human-readable projection of the analysis sent to the coach. */
export function buildCoachContext(analysis: Analysis | null): string | undefined {
  if (!analysis) return undefined;
  const l: string[] = [];
  l.push(`Overall career readiness: ${analysis.overallScore}/100. ${analysis.overallSummary}`);
  l.push(`Target role: ${analysis.targetRole}`);
  l.push(
    `Sources provided — resume: ${analysis.provided.resume}, portfolio: ${analysis.provided.portfolio}, github: ${analysis.provided.github}, job description: ${analysis.provided.job}`,
  );
  l.push("Category scores:");
  analysis.breakdown.forEach((b) => l.push(`- ${b.label}: ${b.score ?? "not available"} — ${b.explanation}`));
  l.push("Strengths:");
  analysis.strengths.forEach((s) => l.push(`- ${s.title} (${s.source}): ${s.detail}`));
  l.push("Weaknesses:");
  analysis.weaknesses.forEach((w) => l.push(`- [${w.severity}] ${w.problem} Why: ${w.whyItMatters} Fix: ${w.howToFix}`));
  if (analysis.resume.bulletReviews.length) {
    l.push("Resume bullets flagged:");
    analysis.resume.bulletReviews.forEach((b) => l.push(`- Current: "${b.current}" | Problem: ${b.problem} | Suggested: ${b.suggestion}`));
  }
  if (analysis.resume.keywordGaps.length) l.push(`Resume keyword gaps: ${analysis.resume.keywordGaps.join(", ")}`);
  l.push(`Portfolio summary: ${analysis.portfolio.summary}`);
  l.push(`GitHub summary: ${analysis.github.summary}`);
  l.push(`Job match: ${analysis.jobMatch.score ?? "not available"} — ${analysis.jobMatch.summary}`);
  if (analysis.jobMatch.evidence.length) {
    l.push("Skill evidence:");
    analysis.jobMatch.evidence.forEach((e) =>
      l.push(`- ${e.skill}: ${e.level}${e.sources.length ? ` (found in ${e.sources.join(" + ")})` : " (no source)"} — ${e.note}`),
    );
  }
  l.push("Skill gaps:");
  analysis.skillGaps.forEach((g) => l.push(`- ${g.skill} [${g.level}, ${g.priority}]: ${g.why} Action: ${g.action}`));
  l.push("Improvement plan:");
  analysis.improvementPlan.forEach((r) => l.push(`- (${r.horizon}, ${r.priority}) ${r.title} — effort ${r.effort}; impact ${r.impact}; ${r.action}`));
  return l.join("\n");
}
