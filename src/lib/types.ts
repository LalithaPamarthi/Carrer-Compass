/**
 * Core analysis domain types. The UI renders only these shapes, so the scoring
 * logic (local heuristics today, an AI model later) can be swapped freely.
 */

export type Severity = "critical" | "high" | "recommended" | "optional";
export type SkillLevel = "strong" | "developing" | "missing";
export type MatchLevel = "strong" | "partial" | "missing";
export type Priority = "high" | "medium" | "low";

export interface ScoreBreakdown {
  key: "resume" | "portfolio" | "github" | "jobMatch";
  label: string;
  score: number | null;
  explanation: string;
}

export interface Strength {
  id: string;
  title: string;
  detail: string;
  source: string;
}

export interface Weakness {
  id: string;
  severity: Severity;
  problem: string;
  whyItMatters: string;
  howToFix: string;
  area: "resume" | "portfolio" | "github" | "jobMatch" | "skills";
}

export interface BulletReview {
  id: string;
  current: string;
  problem: string;
  suggestion: string;
}

export interface ResumeAnalysis {
  score: number | null;
  summary: string;
  signals: { label: string; value: number; note: string }[];
  bulletReviews: BulletReview[];
  keywordGaps: string[];
  atsNotes: string[];
}

export interface PortfolioProjectReview {
  id: string;
  name: string;
  detected: string[];
  missing: string[];
  recommendation: string;
}

export interface PortfolioAnalysis {
  score: number | null;
  summary: string;
  signals: { label: string; value: number; note: string }[];
  projects: PortfolioProjectReview[];
  descriptionTemplate: string[];
}

export interface GithubAnalysis {
  score: number | null;
  summary: string;
  detected: { label: string; value: string }[];
  notAvailable: string[];
  languages: { name: string; share: number }[];
  highlights: { name: string; detail: string }[];
  qualitySignals: { label: string; status: "good" | "warn" | "bad"; note: string }[];
}

export interface SkillEvidence {
  skill: string;
  level: MatchLevel;
  required: boolean;
  sources: string[];
  note: string;
}

export interface JobMatchAnalysis {
  score: number | null;
  role: string;
  summary: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceRequirements: string[];
  educationRequirements: string[];
  responsibilities: string[];
  evidence: SkillEvidence[];
}

export interface SkillGap {
  skill: string;
  level: SkillLevel;
  priority: "learn-first" | "learn-next" | "optional";
  why: string;
  action: string;
}

export interface Recommendation {
  id: string;
  title: string;
  horizon: "this-week" | "30-days" | "60-90-days";
  priority: Priority;
  effort: string;
  impact: string;
  reason: string;
  action: string;
}

export interface AnalysisInputs {
  resumeText: string;
  resumeFileName: string | null;
  portfolioUrl: string;
  portfolioText: string;
  githubUrl: string;
  repoUrl: string;
  jobDescription: string;
  jobUrl: string;
}

export interface Analysis {
  id: string;
  createdAt: string;
  isDemo: boolean;
  candidateName: string;
  targetRole: string;
  overallScore: number;
  overallSummary: string;
  breakdown: ScoreBreakdown[];
  strengths: Strength[];
  weaknesses: Weakness[];
  resume: ResumeAnalysis;
  portfolio: PortfolioAnalysis;
  github: GithubAnalysis;
  jobMatch: JobMatchAnalysis;
  skillGaps: SkillGap[];
  improvementPlan: Recommendation[];
  provided: {
    resume: boolean;
    portfolio: boolean;
    github: boolean;
    job: boolean;
  };
}

export interface CoachMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}
