import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { loadState, saveState } from "@/lib/store";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Assessment · T-Fiber AI Certify" },
      {
        name: "description",
        content: "Complete your AI assessment to earn your certificate.",
      },
    ],
  }),
  component: AssessmentPage,
});

function AssessmentPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-answer all 4 MCQs with default answers
    const answers = {
      1: 0, // ChatGPT
      2: 1, // Summarising and analysing documents
      3: 0, // AI-powered search & research assistant
      4: 2, // Verify outputs and protect sensitive information
    };

    const state = loadState();
    saveState({ ...state, answers });

    // Navigate directly to details form
    navigate({ to: "/details" });
  }, [navigate]);

  return (
    <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
      Loading…
    </div>
  );
}
