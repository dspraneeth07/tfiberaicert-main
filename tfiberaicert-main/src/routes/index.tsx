import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "T-Fiber AI Certify — AI Certification Assessment Platform" },
      {
        name: "description",
        content:
          "Premium AI-powered certification assessment platform. Take a short assessment and instantly download your official certificate.",
      },
      { property: "og:title", content: "T-Fiber AI Certify" },
      {
        property: "og:description",
        content: "AI Certification Assessment Platform",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Decorative orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--tf-blue) 35%, transparent), transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--tf-orange) 30%, transparent), transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--tf-green) 25%, transparent), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-tf-green animate-pulse" />
          Government of Telangana · T-Fiber Initiative
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pt-16 pb-24 text-center sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground"
        >
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-tf-blue" />
          AI for Administrative Efficiency · Workshop Certification
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-balance text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl"
        >
          AI Certification
          <br />
          <span className="gradient-text">Assessment Platform</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg"
        >
          A premium, government-grade certification experience. Complete a short
          4-question assessment and instantly receive your personalised
          certificate from T-Fiber.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <Link
            to="/details"
            className="pulse-ring btn-glow inline-flex items-center gap-3 rounded-2xl px-8 py-5 text-base font-semibold sm:text-lg"
          >
            Get Certificate
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">
            Takes about 2 minutes · No login required
          </p>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {[
            {
              title: "4 Smart Questions",
              desc: "Quick AI-powered assessment",
              color: "var(--tf-blue)",
              icon: (
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              ),
            },
            {
              title: "Instant Certificate",
              desc: "Personalised, downloadable",
              color: "var(--tf-orange)",
              icon: (
                <>
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                </>
              ),
            },
            {
              title: "PDF & PNG Export",
              desc: "High-resolution downloads",
              color: "var(--tf-green)",
              icon: (
                <>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <path d="M7 10l5 5 5-5M12 15V3" />
                </>
              ),
            },
          ].map((f) => (
            <div
              key={f.title}
              className="glass-card rounded-2xl p-5 text-left transition hover:translate-y-[-2px]"
            >
              <div
                className="mb-3 grid h-10 w-10 place-items-center rounded-xl"
                style={{
                  background: `color-mix(in oklab, ${f.color} 14%, transparent)`,
                  color: f.color,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {f.icon}
                </svg>
              </div>
              <h3 className="text-sm font-semibold">{f.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-border/60 bg-card/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} T-Fiber · Connecting Future</p>
          <p>Powered by AI · Built for Administrative Excellence</p>
        </div>
      </footer>
    </main>
  );
}
