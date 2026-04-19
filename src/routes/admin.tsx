import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { QUESTIONS } from "@/lib/assessment";
import {
  listSubmissions,
  type AdminSubmission,
} from "@/server/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Submissions · T-Fiber AI Certify" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<AdminSubmission[] | null>(null);
  const [query, setQuery] = useState("");

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await listSubmissions({ data: { passcode } });
      if (!res.ok) {
        setError("Incorrect passcode");
        setRows(null);
      } else {
        setRows(res.submissions);
      }
    } catch (err) {
      console.error(err);
      setError("Could not load submissions. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function exportCSV() {
    if (!rows) return;
    const headers = [
      "Submitted At",
      "Full Name",
      "Designation",
      "Workspace",
      "Mobile",
      "Email",
      ...QUESTIONS.map((q) => `Q${q.id} Answer`),
    ];
    const escape = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [headers.join(",")];
    for (const r of rows) {
      const answersByQ = QUESTIONS.map((q) => {
        const idx = r.answers?.[q.id];
        if (idx === undefined || idx === null) return "";
        const opt = q.options[idx as number];
        return opt ? `${String.fromCharCode(65 + (idx as number))}. ${opt}` : "";
      });
      lines.push(
        [
          new Date(r.created_at).toISOString(),
          r.full_name,
          r.designation,
          r.workspace,
          r.mobile,
          r.email,
          ...answersByQ,
        ]
          .map(escape)
          .join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tfiber_submissions_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered =
    rows && query
      ? rows.filter((r) => {
          const q = query.toLowerCase();
          return (
            r.full_name.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q) ||
            r.designation.toLowerCase().includes(q) ||
            r.workspace.toLowerCase().includes(q) ||
            r.mobile.toLowerCase().includes(q)
          );
        })
      : rows;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="text-xs font-medium text-muted-foreground">
          Admin · Submissions
        </div>
      </header>

      {!rows ? (
        <section className="mx-auto max-w-md px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-3xl p-8"
          >
            <h1 className="text-2xl font-bold tracking-tight">
              Admin Access
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the admin passcode to view all certificate submissions.
            </p>
            <form onSubmit={unlock} className="mt-6 space-y-3">
              <div className="floating-label-input">
                <input
                  id="passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder=" "
                  autoFocus
                />
                <label htmlFor="passcode">Admin Passcode</label>
              </div>
              {error && (
                <p className="text-xs font-medium text-destructive">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading || !passcode}
                className="btn-glow w-full rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-60"
              >
                {loading ? "Verifying…" : "Unlock"}
              </button>
            </form>
            <p className="mt-6 text-[11px] text-muted-foreground">
              Default passcode:{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 font-mono">
                tfiber2026
              </code>
            </p>
          </motion.div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Submissions{" "}
                <span className="text-muted-foreground">({rows.length})</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Most recent first · including assessment answers
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, workspace…"
                className="rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm outline-none focus:border-tf-blue focus:ring-2 focus:ring-tf-blue/20"
              />
              <button
                onClick={exportCSV}
                className="btn-glow rounded-xl px-5 py-2.5 text-sm font-semibold"
              >
                ⬇ Export CSV
              </button>
            </div>
          </div>

          <div className="glass-card overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Submitted</th>
                    <th className="px-4 py-3 text-left">Full Name</th>
                    <th className="px-4 py-3 text-left">Designation</th>
                    <th className="px-4 py-3 text-left">Workspace</th>
                    <th className="px-4 py-3 text-left">Mobile</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    {QUESTIONS.map((q) => (
                      <th key={q.id} className="px-4 py-3 text-left">
                        Q{q.id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered && filtered.length > 0 ? (
                    filtered.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b border-border/60 last:border-0 hover:bg-secondary/30"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 font-medium">{r.full_name}</td>
                        <td className="px-4 py-3">{r.designation}</td>
                        <td className="px-4 py-3">{r.workspace}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
                          {r.mobile}
                        </td>
                        <td className="px-4 py-3 text-xs">{r.email}</td>
                        {QUESTIONS.map((q) => {
                          const idx = r.answers?.[q.id];
                          const correct = idx !== undefined;
                          return (
                            <td
                              key={q.id}
                              className="px-4 py-3 text-xs"
                              title={
                                correct
                                  ? q.options[idx as number]
                                  : "No answer"
                              }
                            >
                              {correct ? (
                                <span className="inline-flex items-center rounded-md bg-tf-blue-soft px-2 py-0.5 font-semibold text-tf-blue">
                                  {String.fromCharCode(
                                    65 + (idx as number),
                                  )}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6 + QUESTIONS.length}
                        className="px-4 py-10 text-center text-sm text-muted-foreground"
                      >
                        No submissions match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
