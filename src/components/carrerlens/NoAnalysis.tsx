import { useNavigate } from "@tanstack/react-router";
import { ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./EmptyState";
import { useAnalysisStore } from "@/lib/analysis-store";

/** Shown on any dashboard page when no analysis exists yet. */
export function NoAnalysis() {
  const { loadDemo } = useAnalysisStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <EmptyState
        icon={ScanSearch}
        title="No analysis yet"
        description="Add your resume, portfolio, GitHub profile and a target job description to see how a recruiter would read your profile."
        actionLabel="Analyze my profile"
        actionTo="/analyze"
      />
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => {
            loadDemo();
            navigate({ to: "/app" });
          }}
        >
          Or explore the demo analysis
        </Button>
      </div>
    </div>
  );
}
