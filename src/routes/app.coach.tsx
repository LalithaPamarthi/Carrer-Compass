import { createFileRoute } from "@tanstack/react-router";
import { CoachChat } from "@/components/careerlens/CoachChat";
import { NoAnalysis } from "@/components/careerlens/NoAnalysis";
import { SectionHeader } from "@/components/careerlens/SectionHeader";
import { useAnalysisStore } from "@/lib/analysis-store";

export const Route = createFileRoute("/app/coach")({ component: CoachPage });

function CoachPage() {
  const { analysis, ready } = useAnalysisStore();
  if (!ready) return <div className="h-64 animate-pulse rounded-xl bg-muted" />;
  if (!analysis) return <NoAnalysis />;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Career coach"
        description="Grounded in your analysis. The coach labels facts, inferences and recommendations so you always know what it actually knows."
      />
      <CoachChat />
    </div>
  );
}
