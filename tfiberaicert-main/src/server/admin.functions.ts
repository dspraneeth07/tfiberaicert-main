import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_PASSCODE = "tfiber2026";

export type AdminSubmission = {
  id: string;
  full_name: string;
  designation: string;
  workspace: string;
  mobile: string;
  email: string;
  answers: Record<string, number>;
  created_at: string;
};

export const listSubmissions = createServerFn({ method: "POST" })
  .inputValidator((input: { passcode: string }) => {
    if (typeof input?.passcode !== "string" || input.passcode.length > 100) {
      throw new Error("Invalid passcode");
    }
    return input;
  })
  .handler(async ({ data }) => {
    if (data.passcode !== ADMIN_PASSCODE) {
      return { ok: false as const, submissions: [] as AdminSubmission[] };
    }

    const { data: rows, error } = await supabaseAdmin
      .from("submissions")
      .select(
        "id, full_name, designation, workspace, mobile, email, answers, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      console.error("listSubmissions error:", error);
      throw new Error("Failed to load submissions");
    }
    return {
      ok: true as const,
      submissions: (rows ?? []) as AdminSubmission[],
    };
  });
