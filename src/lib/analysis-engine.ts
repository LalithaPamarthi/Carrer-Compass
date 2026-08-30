import type {
  Analysis,
  AnalysisInputs,
  BulletReview,
  Recommendation,
  SkillEvidence,
  SkillGap,
  Strength,
  Weakness,
} from "./types";

/**
 * Heuristic, fully local analysis engine.
 *
 * It reads only what the user provided and never invents achievements or
 * metrics. Every score is derived from countable signals so the explanation
 * shown in the UI is always defensible. Swap `buildAnalysis` for a validated
 * AI response later without touching the UI.
 */

const SKILL_DICTIONARY = [
  "python","java","javascript","typescript","react","next.js","node.js","express","django","flask","fastapi",
  "sql","postgresql","mysql","mongodb","redis","graphql","rest apis","rest","api","git","github","docker",
  "kubernetes","aws","azure","gcp","ci/cd","jenkins","terraform","linux","html","css","tailwind","redux",
  "machine learning","deep learning","pandas","numpy","pytorch","tensorflow","nlp","data analysis","excel",
  "testing","unit testing","jest","pytest","cypress","agile","scrum","figma","ui/ux","microservices","kafka",
];

const ACTION_VERBS = [
  "built","designed","developed","implemented","led","migrated","automated","reduced","increased","shipped",
  "optimized","optimised","launched","created","architected","improved","delivered","scaled","refactored",
];

const WEAK_OPENERS = ["responsible for", "worked on", "helped with", "involved in", "assisted with", "tasked with"];

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function lines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-•*\u2022\s]+/, "").trim())
    .filter((l) => l.length > 0);
}

function bulletCandidates(text: string): string[] {
  return lines(text).filter((l) => l.length > 35 && l.split(/\s+/).length > 5 && !/^[A-Z\s]{4,}$/.test(l));
}

function findSkills(text: string): string[] {
  const lower = text.toLowerCase();
  return SKILL_DICTIONARY.filter((s) => lower.includes(s));
}

function titleCase(skill: string): string {
  const overrides: Record<string, string> = {
    sql: "SQL",
    "ci/cd": "CI/CD",
    aws: "AWS",
    gcp: "GCP",
    "rest apis": "REST APIs",
    rest: "REST",
    api: "APIs",
    "ui/ux": "UI/UX",
    nlp: "NLP",
    html: "HTML",
    css: "CSS",
  };
  return overrides[skill] ?? skill.replace(/\b\w/g, (c) => c.toUpperCase());
}

function hasMetric(line: string): boolean {
  return /\d+\s?(%|percent|x|k\b|ms\b|s\b|users|records|requests|hours|days|weeks|people|students|tests)/i.test(line) || /\$\d/.test(line);
}

export function buildAnalysis(inputs: AnalysisInputs): Analysis {
  const provided = {
    resume: Boolean(inputs.resumeText.trim()),
    portfolio: Boolean(inputs.portfolioUrl.trim() || inputs.portfolioText.trim()),
    github: Boolean(inputs.githubUrl.trim() || inputs.repoUrl.trim()),
    job: Boolean(inputs.jobDescription.trim()),
  };

  const resumeText = inputs.resumeText;
  const resumeBullets = bulletCandidates(resumeText);
  const resumeSkills = findSkills(resumeText);
  const portfolioSkills = findSkills(`${inputs.portfolioText} ${inputs.portfolioUrl}`);
  const repoSkills = findSkills(inputs.repoUrl);
  const jobSkills = findSkills(inputs.jobDescription);

  /* ---------------- resume ---------------- */
  const withMetric = resumeBullets.filter(hasMetric).length;
  const metricRatio = resumeBullets.length ? withMetric / resumeBullets.length : 0;
  const verbStarts = resumeBullets.filter((b) => ACTION_VERBS.some((v) => b.toLowerCase().startsWith(v))).length;
  const verbRatio = resumeBullets.length ? verbStarts / resumeBullets.length : 0;
  const weakOpeners = resumeBullets.filter((b) => WEAK_OPENERS.some((w) => b.toLowerCase().startsWith(w)));
  const sections = ["experience", "education", "skills", "project"].filter((s) => resumeText.toLowerCase().includes(s));
  const structureScore = clamp(40 + sections.length * 15);
  const keywordOverlap = jobSkills.length ? jobSkills.filter((s) => resumeSkills.includes(s)).length / jobSkills.length : resumeSkills.length ? 0.7 : 0;
  const wordCount = resumeText.trim().split(/\s+/).filter(Boolean).length;
  const lengthScore = clamp(wordCount < 120 ? 35 : wordCount < 250 ? 62 : wordCount > 1200 ? 72 : 88);

  const resumeScore = provided.resume
    ? clamp(structureScore * 0.2 + metricRatio * 100 * 0.25 + verbRatio * 100 * 0.15 + keywordOverlap * 100 * 0.2 + lengthScore * 0.2)
    : null;

  const bulletReviews: BulletReview[] = resumeBullets
    .filter((b) => !hasMetric(b) || WEAK_OPENERS.some((w) => b.toLowerCase().startsWith(w)))
    .slice(0, 5)
    .map((b, i) => {
      const weak = WEAK_OPENERS.find((w) => b.toLowerCase().startsWith(w));
      return {
        id: `b${i}`,
        current: b.length > 220 ? `${b.slice(0, 217)}…` : b,
        problem: weak
          ? `Starts with "${weak}", which describes a duty rather than ownership, and contains no measurable outcome.`
          : "Describes the activity but not the result, so a reviewer can't judge scale or impact.",
        suggestion:
          "Rewrite as: <strong verb> + what you built + for whom + the result. Insert a real metric you can defend (users, records, latency, time saved). If you don't have one, state the scope instead — do not invent a number.",
      };
    });

  /* ---------------- portfolio ---------------- */
  const portfolioText = inputs.portfolioText;
  const portfolioLines = lines(portfolioText);
  const mentionsResult = portfolioLines.filter(hasMetric).length;
  const hasLinks = /https?:\/\//.test(portfolioText) || Boolean(inputs.portfolioUrl.trim());
  const portfolioScore = provided.portfolio
    ? clamp(
        (hasLinks ? 24 : 8) +
          Math.min(portfolioLines.length * 3, 24) +
          Math.min(portfolioSkills.length * 4, 24) +
          (mentionsResult ? 20 : 6) +
          (portfolioText.length > 400 ? 12 : 6),
      )
    : null;

  /* ---------------- github ---------------- */
  const githubHandle = inputs.githubUrl.trim().replace(/\/+$/, "").split("/").pop() ?? "";
  const githubScore = provided.github ? clamp(52 + (inputs.repoUrl.trim() ? 14 : 0) + Math.min(repoSkills.length * 5, 15) + (githubHandle ? 8 : 0)) : null;

  /* ---------------- job match ---------------- */
  const evidence: SkillEvidence[] = jobSkills.map((skill) => {
    const sources: string[] = [];
    if (resumeSkills.includes(skill)) sources.push("Resume");
    if (portfolioSkills.includes(skill)) sources.push("Portfolio");
    if (repoSkills.includes(skill)) sources.push("GitHub");
    const strongEvidence = sources.length >= 2;
    const level = sources.length === 0 ? "missing" : strongEvidence ? "strong" : "partial";
    return {
      skill: titleCase(skill),
      level,
      required: true,
      sources,
      note:
        level === "strong"
          ? "Demonstrated in more than one source, which counts as real evidence."
          : level === "partial"
            ? "Mentioned in one source only — a reviewer may read this as a keyword rather than experience."
            : "Not found in any source you provided.",
    };
  });

  const strongCount = evidence.filter((e) => e.level === "strong").length;
  const partialCount = evidence.filter((e) => e.level === "partial").length;
  const jobMatchScore = provided.job && jobSkills.length ? clamp(((strongCount + partialCount * 0.5) / jobSkills.length) * 100) : null;

  const weights: Record<string, number> = { resume: 0.35, jobMatch: 0.3, portfolio: 0.2, github: 0.15 };
  const parts: [string, number | null][] = [
    ["resume", resumeScore],
    ["portfolio", portfolioScore],
    ["github", githubScore],
    ["jobMatch", jobMatchScore],
  ];
  const totalWeight = parts.filter(([, v]) => v !== null).reduce((sum, [k]) => sum + (weights[k] ?? 0), 0);
  const overallScore = totalWeight
    ? clamp(parts.filter(([, v]) => v !== null).reduce((sum, [k, v]) => sum + (v as number) * (weights[k] ?? 0), 0) / totalWeight)
    : 0;

  /* ---------------- narrative ---------------- */
  const strengths: Strength[] = [];
  if (metricRatio >= 0.35) strengths.push({ id: "s-metric", title: "Several bullets show measurable outcomes", detail: `${withMetric} of ${resumeBullets.length} bullets include a number, which makes your impact easy to judge.`, source: "Resume" });
  if (verbRatio >= 0.5) strengths.push({ id: "s-verbs", title: "Strong, ownership-led phrasing", detail: "Most bullets open with concrete action verbs rather than duties.", source: "Resume" });
  if (strongCount > 0) strengths.push({ id: "s-match", title: "Core role requirements are evidenced", detail: `${strongCount} required skill${strongCount === 1 ? "" : "s"} appear in more than one source: ${evidence.filter((e) => e.level === "strong").map((e) => e.skill).join(", ")}.`, source: "Multiple sources" });
  if (provided.github) strengths.push({ id: "s-github", title: "Public code is available for review", detail: "A public profile gives reviewers direct evidence beyond the resume.", source: "GitHub" });
  if (hasLinks && provided.portfolio) strengths.push({ id: "s-links", title: "Portfolio includes verifiable links", detail: "Live links let a reviewer confirm your work instead of taking it on trust.", source: "Portfolio" });
  if (!strengths.length) strengths.push({ id: "s-start", title: "You have a starting point to work from", detail: "Add more of your resume, portfolio and target job so the analysis can identify concrete strengths.", source: "Provided inputs" });

  const weaknesses: Weakness[] = [];
  if (provided.resume && metricRatio < 0.35)
    weaknesses.push({
      id: "w-metric",
      severity: "critical",
      area: "resume",
      problem: `Only ${withMetric} of ${resumeBullets.length} resume bullets contain a measurable outcome.`,
      whyItMatters: "Recruiters compare candidates on results. Without numbers, strong work reads the same as routine work.",
      howToFix: "Add a real metric to your strongest bullets — users, records, latency, time saved. If you don't have the figure, state the scope instead rather than inventing one.",
    });
  if (weakOpeners.length)
    weaknesses.push({
      id: "w-verbs",
      severity: "recommended",
      area: "resume",
      problem: `${weakOpeners.length} bullet${weakOpeners.length === 1 ? "" : "s"} start with passive phrasing such as "Responsible for".`,
      whyItMatters: "Passive openers spend the highest-attention words of a line on a duty rather than an achievement.",
      howToFix: "Replace with concrete verbs: built, designed, migrated, automated, reduced, shipped.",
    });
  const missingRequired = evidence.filter((e) => e.level === "missing");
  if (missingRequired.length)
    weaknesses.push({
      id: "w-missing",
      severity: "critical",
      area: "jobMatch",
      problem: `${missingRequired.length} requirement${missingRequired.length === 1 ? "" : "s"} from the target job are not evidenced: ${missingRequired.map((e) => e.skill).join(", ")}.`,
      whyItMatters: "Unmet required skills are the most common reason a profile is filtered out before a human conversation.",
      howToFix: "Pick the one closest to your current work and build a small, documented project that demonstrates it.",
    });
  const partials = evidence.filter((e) => e.level === "partial");
  if (partials.length)
    weaknesses.push({
      id: "w-partial",
      severity: "high",
      area: "skills",
      problem: `${partials.length} required skill${partials.length === 1 ? " appears" : "s appear"} in only one source: ${partials.map((e) => e.skill).join(", ")}.`,
      whyItMatters: "A skill listed without project or code evidence reads as a keyword rather than experience.",
      howToFix: "Back each one with a project bullet or repository so it appears in at least two places.",
    });
  if (provided.portfolio && !mentionsResult)
    weaknesses.push({
      id: "w-portfolio",
      severity: "high",
      area: "portfolio",
      problem: "Project descriptions don't state the problem, your contribution or the result.",
      whyItMatters: "A reviewer spends well under a minute per project, so feature lists hide your actual decisions.",
      howToFix: "Rewrite each intro with Problem → Your role → Stack → Result → Evidence.",
    });
  if (!provided.portfolio)
    weaknesses.push({ id: "w-noportfolio", severity: "recommended", area: "portfolio", problem: "No portfolio information provided.", whyItMatters: "Portfolio evidence is where a reviewer verifies what your resume claims.", howToFix: "Add a portfolio URL or paste your project descriptions and run the analysis again." });
  if (!provided.github)
    weaknesses.push({ id: "w-nogithub", severity: "optional", area: "github", problem: "No GitHub profile provided.", whyItMatters: "Public code is often the fastest credibility signal for technical roles.", howToFix: "Add your GitHub profile URL to unlock developer insights." });

  const skillGaps: SkillGap[] = [
    ...missingRequired.map<SkillGap>((e) => ({
      skill: e.skill,
      level: "missing",
      priority: "learn-first",
      why: "Required by the target role and not demonstrated anywhere in your profile.",
      action: `Build or document one piece of work that uses ${e.skill}, then reference it on your resume and portfolio.`,
    })),
    ...partials.map<SkillGap>((e) => ({
      skill: e.skill,
      level: "developing",
      priority: "learn-next",
      why: `Found in ${e.sources.join(", ")} only, so it currently reads as a claim rather than evidence.`,
      action: `Add a second source of evidence for ${e.skill} — a project write-up or a public repository.`,
    })),
    ...evidence
      .filter((e) => e.level === "strong")
      .map<SkillGap>((e) => ({
        skill: e.skill,
        level: "strong",
        priority: "optional",
        why: `Evidenced across ${e.sources.join(" + ")}.`,
        action: "Keep it visible: highlight one non-trivial decision you made with it.",
      })),
  ];

  const improvementPlan: Recommendation[] = [];
  if (provided.resume && metricRatio < 0.5)
    improvementPlan.push({ id: "p-metric", title: "Add measurable outcomes to your strongest resume bullets", horizon: "this-week", priority: "high", effort: "60–90 minutes", impact: "Largest single lift to recruiter perception", reason: `Measurable impact is your weakest resume signal (${Math.round(metricRatio * 100)}% of bullets).`, action: "Use the rewrite suggestions on the Resume page. Real numbers only — state scope if a metric doesn't exist." });
  if (weakOpeners.length)
    improvementPlan.push({ id: "p-verbs", title: "Replace passive bullet openers with action verbs", horizon: "this-week", priority: "medium", effort: "20 minutes", impact: "Improves readability and ownership", reason: `${weakOpeners.length} bullet(s) currently start with a duty phrase.`, action: "Rewrite each flagged bullet to start with built, designed, automated, reduced or shipped." });
  if (provided.portfolio)
    improvementPlan.push({ id: "p-portfolio", title: "Rewrite project descriptions with Problem → Role → Stack → Result", horizon: "this-week", priority: "high", effort: "1–2 hours", impact: "Makes technical depth visible in a short skim", reason: "Descriptions currently emphasise features over context and outcomes.", action: "Apply the template on the Portfolio page to each project." });
  if (provided.github)
    improvementPlan.push({ id: "p-readme", title: "Strengthen READMEs on your most relevant repositories", horizon: "this-week", priority: "medium", effort: "45 minutes", impact: "Improves credibility of existing work", reason: "The README is often the only thing a reviewer reads.", action: "What it does, how to run it, 3-bullet architecture, one screenshot or sample output." });
  missingRequired.slice(0, 2).forEach((e) =>
    improvementPlan.push({ id: `p-skill-${e.skill}`, title: `Build evidence for ${e.skill}`, horizon: "30-days", priority: "high", effort: "8–12 hours", impact: "Closes an unmet requirement for the target role", reason: `${e.skill} is required by the job description and has no supporting evidence.`, action: `Complete one small, documented project using ${e.skill} and link it from your portfolio.` }),
  );
  partials.slice(0, 2).forEach((e) =>
    improvementPlan.push({ id: `p-partial-${e.skill}`, title: `Add a second evidence source for ${e.skill}`, horizon: "30-days", priority: "medium", effort: "3–6 hours", impact: "Turns a keyword into demonstrated experience", reason: `Currently found in ${e.sources.join(", ")} only.`, action: `Publish or document work that shows ${e.skill} in practice.` }),
  );
  improvementPlan.push({ id: "p-longterm", title: "Deepen one differentiating skill and document it publicly", horizon: "60-90-days", priority: "medium", effort: "20+ hours", impact: "Separates you from similar candidates", reason: "Depth in one area is more persuasive than shallow coverage of many.", action: "Pick the highest-priority gap, build a substantial project, and write up the decisions you made." });
  if (!provided.job)
    improvementPlan.push({ id: "p-job", title: "Add a target job description", horizon: "this-week", priority: "high", effort: "5 minutes", impact: "Unlocks job matching and gap prioritisation", reason: "Without a target role, recommendations cannot be prioritised against real requirements.", action: "Paste the job description on the Analyze page and re-run the analysis." });

  const summaryBits: string[] = [];
  summaryBits.push(overallScore >= 75 ? "Solid foundation overall." : overallScore >= 55 ? "Reasonable foundation with clear gaps." : "Early-stage profile with meaningful room to improve.");
  if (provided.resume && metricRatio < 0.5) summaryBits.push("measurable impact on your resume");
  if (provided.portfolio && !mentionsResult) summaryBits.push("project presentation");
  if (missingRequired.length) summaryBits.push("alignment with the target role");
  const overallSummary =
    summaryBits.length > 1
      ? `${summaryBits[0]} Your biggest opportunities are ${summaryBits.slice(1).join(", ")}.`
      : `${summaryBits[0]} Add more sources for a more complete picture.`;

  return {
    id: `analysis-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isDemo: false,
    candidateName: "Your profile",
    targetRole: provided.job ? "Your target role" : "No target role provided",
    overallScore,
    overallSummary,
    breakdown: [
      { key: "resume", label: "Resume", score: resumeScore, explanation: provided.resume ? `Derived from structure (${sections.length} standard sections), measurable impact (${Math.round(metricRatio * 100)}% of bullets), action verbs and keyword alignment.` : "No resume provided." },
      { key: "portfolio", label: "Portfolio", score: portfolioScore, explanation: provided.portfolio ? `Based on ${portfolioLines.length} description line(s), ${hasLinks ? "verifiable links present" : "no verifiable links"} and ${mentionsResult ? "stated outcomes" : "no stated outcomes"}.` : "No portfolio information provided." },
      { key: "github", label: "GitHub", score: githubScore, explanation: provided.github ? "Based on the profile and repository links you provided. Public repository contents are not fetched, so this is an evidence-availability signal." : "No GitHub profile provided." },
      { key: "jobMatch", label: "Job Match", score: jobMatchScore, explanation: provided.job ? `${strongCount} strong, ${partialCount} partial and ${missingRequired.length} missing of ${jobSkills.length} detected requirements.` : "No job description provided." },
    ],
    strengths,
    weaknesses,
    resume: {
      score: resumeScore,
      summary: provided.resume
        ? `Detected ${resumeBullets.length} substantive bullet(s) and ${resumeSkills.length} recognised skill(s). ${metricRatio < 0.5 ? "The dominant issue is measurable impact." : "Impact is reasonably well evidenced."}`
        : "No resume provided yet.",
      signals: provided.resume
        ? [
            { label: "Structure", value: structureScore, note: `${sections.length} of 4 standard sections detected.` },
            { label: "Measurable impact", value: clamp(metricRatio * 100), note: `${withMetric} of ${resumeBullets.length} bullets contain a number.` },
            { label: "Action verbs", value: clamp(verbRatio * 100), note: `${verbStarts} bullet(s) open with a strong verb.` },
            { label: "Keyword alignment", value: clamp(keywordOverlap * 100), note: provided.job ? `${jobSkills.filter((s) => resumeSkills.includes(s)).length} of ${jobSkills.length} job keywords found.` : "No job description provided for comparison." },
            { label: "Length & density", value: lengthScore, note: `${wordCount} words detected.` },
          ]
        : [],
      bulletReviews,
      keywordGaps: jobSkills.filter((s) => !resumeSkills.includes(s)).map(titleCase),
      atsNotes: [
        "Pasted or extracted text parsed cleanly, which is a positive compatibility signal.",
        "Use standard section headings (Experience, Projects, Skills, Education) and avoid multi-column layouts.",
        "These are compatibility signals only — no tool can guarantee a screening outcome.",
      ],
    },
    portfolio: {
      score: portfolioScore,
      summary: provided.portfolio
        ? mentionsResult
          ? "Your portfolio states outcomes, which is unusual and good. Keep tightening the link between problem, contribution and result."
          : "Your portfolio contains projects, but their descriptions do not clearly communicate the problem, your contribution, the technology used and the result."
        : "No portfolio information provided yet.",
      signals: provided.portfolio
        ? [
            { label: "Verifiable links", value: hasLinks ? 85 : 30, note: hasLinks ? "Portfolio or project links provided." : "No live or repository links detected." },
            { label: "Description depth", value: clamp(Math.min(portfolioText.length / 12, 100)), note: `${portfolioLines.length} description line(s) detected.` },
            { label: "Stated outcomes", value: mentionsResult ? 80 : 30, note: mentionsResult ? "At least one project states a measurable result." : "No measurable results detected in descriptions." },
            { label: "Technical signals", value: clamp(portfolioSkills.length * 12), note: `${portfolioSkills.length} recognised technolog${portfolioSkills.length === 1 ? "y" : "ies"} mentioned.` },
          ]
        : [],
      projects: portfolioLines.slice(0, 4).map((line, i) => ({
        id: `pp${i}`,
        name: line.length > 60 ? `${line.slice(0, 57)}…` : line,
        detected: [hasLinks ? "Link available" : "Description text", ...(findSkills(line).length ? ["Technology mentioned"] : [])],
        missing: [...(hasMetric(line) ? [] : ["Measurable result"]), ...(/\bi\b|\bmy\b|owned|built/i.test(line) ? [] : ["Your specific contribution"])],
        recommendation: "State the problem in one line, what you owned, the stack, and the outcome.",
      })),
      descriptionTemplate: [
        "Problem — the real situation the project addresses, in one sentence.",
        "Your role — what you specifically designed, built or decided.",
        "Stack & key decisions — technologies plus one trade-off you made.",
        "Result — usage, measurable effect, or a concrete lesson that changed your approach.",
        "Evidence — live demo, repository, and one screenshot or sample output.",
      ],
    },
    github: {
      score: githubScore,
      summary: provided.github
        ? "CareerLens uses the links you provided. Repository contents are not fetched, so treat this as an evidence-availability review rather than a code audit."
        : "No GitHub information provided yet.",
      detected: provided.github
        ? [
            ...(githubHandle ? [{ label: "Profile", value: githubHandle }] : []),
            ...(inputs.repoUrl.trim() ? [{ label: "Highlighted repository", value: inputs.repoUrl.trim() }] : []),
            ...(repoSkills.length ? [{ label: "Technologies implied by links", value: repoSkills.map(titleCase).join(", ") }] : []),
          ]
        : [],
      notAvailable: [
        "Private repository contents",
        "Commit history and contribution graph",
        "README and documentation quality",
        "Language breakdown and repository count",
      ],
      languages: [],
      highlights: inputs.repoUrl.trim() ? [{ name: inputs.repoUrl.trim(), detail: "Provided as your highlighted repository — make sure its README explains what it does and how to run it." }] : [],
      qualitySignals: provided.github
        ? [
            { label: "Public profile link", status: "good", note: "A reviewer can reach your code directly." },
            { label: "Highlighted repository", status: inputs.repoUrl.trim() ? "good" : "warn", note: inputs.repoUrl.trim() ? "You pointed at a specific repository, which guides the reviewer." : "Add one repository you want reviewers to open first." },
            { label: "Repository documentation", status: "warn", note: "Not verifiable from the provided information — check that each highlighted repo has a real README." },
          ]
        : [],
    },
    jobMatch: {
      score: jobMatchScore,
      role: provided.job ? "Your target role" : "No target role provided",
      summary: provided.job
        ? `${strongCount} of ${jobSkills.length} detected requirements are evidenced in more than one source. ${missingRequired.length ? `Unmet: ${missingRequired.map((e) => e.skill).join(", ")}.` : "No unmet detected requirements."}`
        : "Add a target job to unlock personalized job matching.",
      requiredSkills: jobSkills.map(titleCase),
      preferredSkills: [],
      experienceRequirements: lines(inputs.jobDescription).filter((l) => /\byears?\b/i.test(l)).slice(0, 3),
      educationRequirements: lines(inputs.jobDescription).filter((l) => /degree|bachelor|master|b\.?tech|graduat/i.test(l)).slice(0, 3),
      responsibilities: lines(inputs.jobDescription).filter((l) => /^(design|build|develop|maintain|collaborate|write|own|work|support|implement)/i.test(l)).slice(0, 6),
      evidence,
    },
    skillGaps,
    improvementPlan,
    provided,
  };
}

export const scoreBand = (score: number) =>
  score >= 85 ? "Excellent" : score >= 70 ? "Strong" : score >= 55 ? "Good" : score >= 40 ? "Needs work" : "Early stage";
