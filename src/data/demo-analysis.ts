import type { Analysis } from "@/lib/types";

/**
 * Sample analysis used by Demo Mode only. Never mixed with a real user's
 * analysis — `isDemo` is surfaced in the UI as a visible banner.
 */
export const demoAnalysis: Analysis = {
  id: "demo",
  createdAt: new Date().toISOString(),
  isDemo: true,
  candidateName: "Sample Candidate",
  targetRole: "Backend Engineer (Python) — Sample Job",
  overallScore: 78,
  overallSummary:
    "Strong foundation with good technical evidence. Your biggest opportunities are measurable impact, project presentation and alignment with the target role.",
  breakdown: [
    {
      key: "resume",
      label: "Resume",
      score: 82,
      explanation:
        "Clear structure and relevant experience, but most bullets describe tasks rather than outcomes, so impact is hard for a recruiter to judge.",
    },
    {
      key: "portfolio",
      label: "Portfolio",
      score: 71,
      explanation:
        "Projects are real and varied, yet descriptions don't communicate the problem, your contribution and the result within a 20-second skim.",
    },
    {
      key: "github",
      label: "GitHub",
      score: 74,
      explanation:
        "Consistent public activity and relevant languages. READMEs and setup instructions are thin on two of the strongest repositories.",
    },
    {
      key: "jobMatch",
      label: "Job Match",
      score: 74,
      explanation:
        "Core language and API requirements are demonstrated. SQL depth and cloud exposure are the main unmet requirements for this role.",
    },
  ],
  strengths: [
    {
      id: "s1",
      title: "Strong technical project experience",
      detail:
        "Three projects show end-to-end ownership: data model, API layer and deployment. That is meaningful evidence for a backend role.",
      source: "Resume + Portfolio",
    },
    {
      id: "s2",
      title: "Good skill alignment with the target role",
      detail: "Python, REST API design and Git appear consistently across resume, projects and public repositories.",
      source: "Resume + GitHub",
    },
    {
      id: "s3",
      title: "Relevant public repositories",
      detail: "Recent commits in Python and SQL repositories signal current, active practice rather than dormant coursework.",
      source: "GitHub",
    },
    {
      id: "s4",
      title: "Clear education and timeline",
      detail: "No unexplained gaps, and the degree is stated plainly with graduation year — this reduces recruiter friction.",
      source: "Resume",
    },
  ],
  weaknesses: [
    {
      id: "w1",
      severity: "critical",
      area: "resume",
      problem: "Most resume bullets have no measurable outcome.",
      whyItMatters:
        "Recruiters compare candidates on results. Without numbers, strong work reads the same as routine work and gets skimmed past.",
      howToFix:
        "For your 4 strongest bullets, add a real metric you can defend: users served, records processed, latency, time saved, error rate. If you don't have the number, state scope instead (e.g. dataset size, team size) — do not invent a figure.",
    },
    {
      id: "w2",
      severity: "high",
      area: "portfolio",
      problem: "Project descriptions don't state the problem, your contribution or the result.",
      whyItMatters:
        "A reviewer spends well under a minute per project. Feature lists without context make it hard to tell what you actually decided and built.",
      howToFix: "Rewrite each project intro using the Problem → Your role → Stack → Result structure on the Portfolio page.",
    },
    {
      id: "w3",
      severity: "high",
      area: "skills",
      problem: "SQL is required by the target role but only weakly demonstrated.",
      whyItMatters: "It appears in your skills list with no project or repository evidence behind it, which is a common screening filter.",
      howToFix: "Add one project that shows real query work: schema design, joins, indexing, and a short note on a query you optimised.",
    },
    {
      id: "w4",
      severity: "recommended",
      area: "github",
      problem: "Two of your best repositories have minimal READMEs.",
      whyItMatters: "The README is often the only thing a reviewer reads. Weak documentation makes good code look unfinished.",
      howToFix: "Add a short README per repo: what it does, how to run it, architecture in 3 bullets, and a screenshot or sample output.",
    },
    {
      id: "w5",
      severity: "optional",
      area: "resume",
      problem: "Resume uses a few weak openers such as 'Responsible for' and 'Worked on'.",
      whyItMatters: "Passive phrasing dilutes ownership and wastes the highest-attention words in each line.",
      howToFix: "Start bullets with concrete verbs: built, designed, migrated, automated, reduced, shipped.",
    },
  ],
  resume: {
    score: 82,
    summary:
      "Well-structured and readable, with relevant experience for the target role. The dominant issue is impact: the resume explains what you did but rarely what changed as a result.",
    signals: [
      { label: "Structure", value: 88, note: "Clear sections, consistent dates, single column — parses reliably." },
      { label: "Relevance", value: 84, note: "Experience and projects map to the target role's core responsibilities." },
      { label: "Measurable impact", value: 52, note: "Only 2 of 14 bullets contain a quantified outcome." },
      { label: "Action verbs", value: 70, note: "Mostly strong, with a few passive openers." },
      { label: "Keyword alignment", value: 76, note: "Covers most required keywords; several preferred ones are absent." },
      { label: "ATS compatibility signals", value: 86, note: "No tables, images or multi-column layout detected in the text." },
    ],
    bulletReviews: [
      {
        id: "b1",
        current: "Responsible for building REST APIs for the internal dashboard.",
        problem: "Passive opener, no scale, no outcome. A reviewer can't tell whether this was one endpoint or twenty.",
        suggestion:
          "Built and documented N REST endpoints powering the internal dashboard used by <number> people — add the real endpoint count and audience size; leave the placeholder until you can confirm it.",
      },
      {
        id: "b2",
        current: "Worked on database queries to improve performance.",
        problem: "No baseline, no result, and no indication of what you actually changed.",
        suggestion:
          "Rewrite as: Rewrote the slowest reporting queries by adding composite indexes, reducing page load from <before> to <after>. Fill in the timings you measured — if you never measured, describe the change and the dataset size instead.",
      },
      {
        id: "b3",
        current: "Used Python scripts to automate manual tasks.",
        problem: "Generic. Doesn't name the task, the frequency or the time saved.",
        suggestion:
          "Automated the weekly <task> with a Python job, removing roughly <hours> of manual work per week. Only state the hours if you can defend the estimate.",
      },
      {
        id: "b4",
        current: "Team project using React and Node.js.",
        problem: "Lists technology without your contribution — reads as coursework.",
        suggestion: "Name your slice: 'Owned authentication and the API layer (Node.js) for a 4-person project'.",
      },
    ],
    keywordGaps: ["SQL (depth)", "AWS", "Docker", "CI/CD", "unit testing", "monitoring"],
    atsNotes: [
      "Single-column, text-based layout — generally parses well in common applicant tracking systems.",
      "Section headings use standard names (Experience, Projects, Education, Skills).",
      "No guarantee of screening outcomes: treat this as compatibility signals, not a pass/fail result.",
    ],
  },
  portfolio: {
    score: 71,
    summary:
      "Your portfolio contains real projects, but their descriptions do not clearly communicate the problem, your contribution, the technology used and the result.",
    signals: [
      { label: "Project quality", value: 78, note: "Projects go beyond tutorials and solve a stated problem." },
      { label: "Description clarity", value: 55, note: "Feature lists dominate; context and outcomes are missing." },
      { label: "Technical depth shown", value: 72, note: "Architecture decisions are implied but rarely explained." },
      { label: "Evidence (demo / code links)", value: 64, note: "Two projects lack a live demo or a linked repository." },
      { label: "Recruiter readability", value: 60, note: "Requires reading the full page to understand what you built." },
    ],
    projects: [
      {
        id: "p1",
        name: "Expense Insights API",
        detected: ["Problem statement", "Repository link", "Stack listed"],
        missing: ["Your specific contribution", "Result or usage evidence"],
        recommendation: "Add one line on what you owned and one line on the outcome (users, records processed, or latency).",
      },
      {
        id: "p2",
        name: "Campus Events Platform",
        detected: ["Live demo", "Screenshots"],
        missing: ["Architecture summary", "Repository link", "Role in the team"],
        recommendation: "Link the repository and add a 3-bullet architecture note so a reviewer can judge technical depth quickly.",
      },
      {
        id: "p3",
        name: "Data Cleaning Toolkit",
        detected: ["Repository link", "Clear scope"],
        missing: ["Demo or sample output", "Why it exists"],
        recommendation: "Show a before/after sample output — it makes the value obvious without running the code.",
      },
    ],
    descriptionTemplate: [
      "Problem — the real situation the project addresses, in one sentence.",
      "Your role — what you specifically designed, built or decided.",
      "Stack & key decisions — technologies plus one trade-off you made.",
      "Result — usage, measurable effect, or what you learned that changed your approach.",
      "Evidence — live demo, repository, and one screenshot or sample output.",
    ],
  },
  github: {
    score: 74,
    summary:
      "Public activity is consistent and the languages match the target role. Documentation quality is the weakest signal and the easiest to fix.",
    detected: [
      { label: "Public repositories", value: "14" },
      { label: "Primary languages", value: "Python, JavaScript, SQL" },
      { label: "Recent activity", value: "Commits in the last 30 days" },
      { label: "Pinned / highlighted repos", value: "3" },
    ],
    notAvailable: [
      "Private repository contents",
      "Contribution history inside private organisations",
      "Code review activity on repositories you don't own",
    ],
    languages: [
      { name: "Python", share: 46 },
      { name: "JavaScript", share: 27 },
      { name: "SQL", share: 14 },
      { name: "Shell", share: 8 },
      { name: "Other", share: 5 },
    ],
    highlights: [
      { name: "expense-insights-api", detail: "Cleanest structure of your public repos; tests present but partial." },
      { name: "data-cleaning-toolkit", detail: "Practical utility library — good evidence of reusable code habits." },
      { name: "campus-events", detail: "Largest project, but the README doesn't explain how to run it." },
    ],
    qualitySignals: [
      { label: "README present", status: "warn", note: "Present in 9 of 14 repos; thin in two of your strongest." },
      { label: "Setup instructions", status: "bad", note: "Missing on the two largest projects." },
      { label: "Commit consistency", status: "good", note: "Regular commits rather than a single bulk upload." },
      { label: "Tests visible", status: "warn", note: "Test files exist in one repository only." },
      { label: "Licence / metadata", status: "warn", note: "Most repositories have no licence or topics set." },
    ],
  },
  jobMatch: {
    score: 74,
    role: "Backend Engineer (Python) — Sample Job",
    summary:
      "You meet the core language, API and version-control requirements with real evidence. SQL depth and cloud exposure are the two requirements you cannot currently demonstrate.",
    requiredSkills: ["Python", "SQL", "REST APIs", "Git", "Testing"],
    preferredSkills: ["AWS", "Docker", "CI/CD", "React"],
    experienceRequirements: ["1–3 years of backend development or equivalent project experience"],
    educationRequirements: ["Bachelor's degree in Computer Science or related field, or equivalent practical experience"],
    responsibilities: [
      "Design and maintain REST APIs used by internal products",
      "Model and query relational data",
      "Write automated tests for backend services",
      "Collaborate on code review and deployment",
    ],
    evidence: [
      { skill: "Python", level: "strong", required: true, sources: ["Resume", "Projects", "GitHub"], note: "Primary language across recent work." },
      { skill: "REST APIs", level: "strong", required: true, sources: ["Resume", "Project: Expense Insights API"], note: "Endpoint design described and code is public." },
      { skill: "Git", level: "strong", required: true, sources: ["GitHub"], note: "Consistent commit history and branching." },
      { skill: "SQL", level: "partial", required: true, sources: ["Skills list"], note: "Listed as a skill, but no project or repository shows query or schema work." },
      { skill: "Testing", level: "partial", required: true, sources: ["GitHub"], note: "Test files in one repository only; not mentioned on the resume." },
      { skill: "AWS", level: "missing", required: false, sources: [], note: "No deployment or cloud evidence found in the provided sources." },
      { skill: "Docker", level: "missing", required: false, sources: [], note: "No Dockerfile or containerisation mention detected." },
      { skill: "CI/CD", level: "missing", required: false, sources: [], note: "No workflow configuration found in public repositories." },
      { skill: "React", level: "partial", required: false, sources: ["Project: Campus Events Platform"], note: "Used in a team project; your specific contribution is unclear." },
    ],
  },
  skillGaps: [
    {
      skill: "SQL",
      level: "developing",
      priority: "learn-first",
      why: "Required by the target role and currently not demonstrated strongly in your profile.",
      action: "Build one project with a real schema: 3+ related tables, joins, indexes. Write a short note on one query you optimised.",
    },
    {
      skill: "Automated testing",
      level: "developing",
      priority: "learn-first",
      why: "Listed in the job responsibilities and only visible in one repository.",
      action: "Add unit tests to your strongest API project and mention coverage of the critical paths on your resume.",
    },
    {
      skill: "Cloud fundamentals (AWS)",
      level: "missing",
      priority: "learn-next",
      why: "A preferred skill for this role and a common differentiator between similar candidates.",
      action: "Deploy one existing project to a managed service and document the setup in the README.",
    },
    {
      skill: "CI/CD",
      level: "missing",
      priority: "learn-next",
      why: "Signals professional workflow habits; cheap to demonstrate once tests exist.",
      action: "Add a CI workflow that runs your test suite on every push.",
    },
    { skill: "Docker", level: "missing", priority: "optional", why: "Preferred, not required. Useful once deployment is in place.", action: "Containerise one project and document the run command." },
    { skill: "Python", level: "strong", priority: "optional", why: "Already well evidenced across sources.", action: "Keep depth visible: highlight one non-trivial design decision on your resume." },
    { skill: "REST API design", level: "strong", priority: "optional", why: "Clearly demonstrated with public code.", action: "Add a short API design note to your best repository." },
  ],
  improvementPlan: [
    {
      id: "r1",
      title: "Add measurable outcomes to your 4 strongest resume bullets",
      horizon: "this-week",
      priority: "high",
      effort: "60–90 minutes",
      impact: "Highest single lift to recruiter perception",
      reason: "Impact is the weakest resume signal at 52/100 and the first thing screeners look for.",
      action: "Use the rewrite suggestions on the Resume page. Use real numbers only — if unavailable, state scope instead.",
    },
    {
      id: "r2",
      title: "Rewrite project descriptions using Problem → Role → Stack → Result",
      horizon: "this-week",
      priority: "high",
      effort: "2 hours",
      impact: "Makes technical depth visible in a 20-second skim",
      reason: "Portfolio description clarity scores 55/100 and hides otherwise solid work.",
      action: "Apply the template on the Portfolio page to all three projects.",
    },
    {
      id: "r3",
      title: "Add READMEs with setup instructions to your two largest repositories",
      horizon: "this-week",
      priority: "medium",
      effort: "45 minutes",
      impact: "Improves credibility of existing work",
      reason: "Setup instructions are missing where reviewers are most likely to look.",
      action: "What it does, how to run it, 3-bullet architecture, one screenshot.",
    },
    {
      id: "r4",
      title: "Ship one SQL-heavy project",
      horizon: "30-days",
      priority: "high",
      effort: "8–12 hours",
      impact: "Closes the most important unmet requirement",
      reason: "SQL is a required skill with no supporting evidence in your profile.",
      action: "Design a 3+ table schema, write analytical queries, document one optimisation with before/after timings.",
    },
    {
      id: "r5",
      title: "Add automated tests to your strongest API project",
      horizon: "30-days",
      priority: "medium",
      effort: "4–6 hours",
      impact: "Addresses a stated job responsibility",
      reason: "Testing is a required skill currently rated as a partial match.",
      action: "Cover the critical request paths, then add the test command to the README.",
    },
    {
      id: "r6",
      title: "Deploy a project and document the setup",
      horizon: "60-90-days",
      priority: "medium",
      effort: "6–10 hours",
      impact: "Turns a missing preferred skill into demonstrated evidence",
      reason: "No cloud or deployment evidence was found in the provided sources.",
      action: "Deploy to a managed service, add the live URL to your portfolio and describe the architecture.",
    },
    {
      id: "r7",
      title: "Add a CI pipeline and containerise one project",
      horizon: "60-90-days",
      priority: "low",
      effort: "3–5 hours",
      impact: "Professional workflow signals",
      reason: "CI/CD and Docker are preferred skills that differentiate similar candidates.",
      action: "Run tests on every push, then add a Dockerfile with a documented run command.",
    },
  ],
  provided: { resume: true, portfolio: true, github: true, job: true },
};
