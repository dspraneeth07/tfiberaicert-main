import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { loadState, saveState, type FormData } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/details")({
  head: () => ({
    meta: [
      { title: "Your Details · T-Fiber AI Certify" },
      {
        name: "description",
        content: "Enter your details to generate your personalised certificate.",
      },
    ],
  }),
  component: DetailsPage,
});

const FIELDS: Array<{
  key: keyof FormData;
  label: string;
  type: string;
  pattern?: string;
  inputMode?: "text" | "tel" | "email";
  maxLength?: number;
}> = [
  { key: "fullName", label: "Full Name", type: "text", maxLength: 80 },
  { key: "designation", label: "Designation", type: "text", maxLength: 80 },
  { key: "workspace", label: "Workspace / Department", type: "text", maxLength: 100 },
  {
    key: "mobile",
    label: "Mobile Number",
    type: "tel",
    inputMode: "tel",
    pattern: "[0-9+\\s-]{7,15}",
    maxLength: 15,
  },
  {
    key: "email",
    label: "Email ID",
    type: "email",
    inputMode: "email",
    maxLength: 120,
  },
];

function validate(form: FormData): Partial<Record<keyof FormData, string>> {
  const errors: Partial<Record<keyof FormData, string>> = {};
  if (!form.fullName.trim() || form.fullName.trim().length < 2)
    errors.fullName = "Please enter your full name";
  if (!form.designation.trim()) errors.designation = "Designation is required";
  if (!form.workspace.trim()) errors.workspace = "Workspace is required";
  if (!/^[0-9+\s-]{7,15}$/.test(form.mobile.trim()))
    errors.mobile = "Enter a valid mobile number";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Enter a valid email address";
  return errors;
}

function DetailsPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    fullName: "",
    designation: "",
    workspace: "",
    mobile: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const s = loadState();
    if (s.form) setForm(s.form);
  }, []);

  function update<K extends keyof FormData>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const eobj = validate(form);
    if (Object.keys(eobj).length > 0) {
      setErrors(eobj);
      return;
    }
    setSubmitting(true);
    const state = loadState();
    
    // Ensure answers are set (in case user skipped assessment)
    const answers = state.answers ?? {
      1: 0, // ChatGPT
      2: 1, // Summarising and analysing documents
      3: 0, // AI-powered search & research assistant
      4: 2, // Verify outputs and protect sensitive information
    };
    
    saveState({ ...state, form, answers });

    // Persist to Lovable Cloud
    try {
      const { error } = await supabase.from("submissions").insert({
        full_name: form.fullName.trim(),
        designation: form.designation.trim(),
        workspace: form.workspace.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim().toLowerCase(),
        answers,
        user_agent:
          typeof navigator !== "undefined" ? navigator.userAgent : null,
      });
      if (error) console.error("Submission save failed:", error);
    } catch (err) {
      console.error("Submission save threw:", err);
    }

    // Small delay to ensure state is persisted
    setTimeout(() => {
      navigate({ to: "/certificate" });
    }, 100);
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="text-xs font-medium text-muted-foreground">
          Final Step · Your Details
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-tf-green-soft px-3 py-1 text-[11px] font-semibold text-tf-green">
            ✓ Assessment Complete
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Generate Your Certificate
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your details to personalise your certificate.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={onSubmit}
          className="glass-card space-y-4 rounded-3xl p-6 sm:p-8"
          noValidate
        >
          {FIELDS.map((f) => (
            <div key={f.key}>
              <div className="floating-label-input">
                <input
                  id={f.key}
                  type={f.type}
                  inputMode={f.inputMode}
                  maxLength={f.maxLength}
                  value={form[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                  placeholder=" "
                  aria-invalid={!!errors[f.key]}
                />
                <label htmlFor={f.key}>{f.label}</label>
              </div>
              {errors[f.key] && (
                <p className="mt-1.5 px-1 text-xs font-medium text-destructive">
                  {errors[f.key]}
                </p>
              )}
            </div>
          ))}

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-glow w-full rounded-xl px-6 py-4 text-base font-semibold disabled:opacity-60"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      opacity="0.25"
                    />
                    <path
                      d="M22 12a10 10 0 00-10-10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Generating Certificate…
                </span>
              ) : (
                "Submit & Generate Certificate"
              )}
            </button>
          </div>
        </motion.form>
      </section>
    </main>
  );
}
