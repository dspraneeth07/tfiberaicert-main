import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import { Logo } from "@/components/Logo";
import { clearState, loadState, type FormData } from "@/lib/store";
import certificateTemplate from "@/assets/certificate-template.jpeg";

export const Route = createFileRoute("/certificate")({
  head: () => ({
    meta: [
      { title: "Your Certificate · T-Fiber AI Certify" },
      {
        name: "description",
        content: "Download your personalised T-Fiber AI certification.",
      },
    ],
  }),
  component: CertificatePage,
});

const TEMPLATE_W = 1414;
const TEMPLATE_H = 2000;
// Calibrated so the name baseline sits on the gold line under "THIS IS TO CERTIFY THAT"
const NAME_LINE_BOTTOM_PCT = 41.7; // bottom edge of name box = position of the line
const NAME_BOX_LEFT_PCT = 14;
const NAME_BOX_WIDTH_PCT = 72;
const NAME_BOX_HEIGHT_PCT = 7; // generous so descenders never clip
const MAX_FONT_PX = 56;
const MIN_FONT_PX = 14;

function AutoFitName({ name }: { name: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(MAX_FONT_PX);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const text = textRef.current;
    if (!wrap || !text) return;

    const fit = () => {
      const maxW = wrap.clientWidth;
      const maxH = wrap.clientHeight;
      if (maxW === 0) return;
      // binary search for largest size that fits without wrapping/overflow
      let lo = MIN_FONT_PX;
      let hi = MAX_FONT_PX;
      let best = MIN_FONT_PX;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        text.style.fontSize = `${mid}px`;
        const fits =
          text.scrollWidth <= maxW + 0.5 && text.scrollHeight <= maxH + 0.5;
        if (fits) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      text.style.fontSize = `${best}px`;
      setFontSize(best);
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [name]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "absolute",
        left: `${NAME_BOX_LEFT_PCT}%`,
        width: `${NAME_BOX_WIDTH_PCT}%`,
        bottom: `${100 - NAME_LINE_BOTTOM_PCT}%`,
        height: `${NAME_BOX_HEIGHT_PCT}%`,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: "0.4%",
        background: "transparent",
        border: "0",
        outline: "0",
        boxShadow: "none",
      }}
    >
      <div
        ref={textRef}
        style={{
          fontFamily:
            "'Google Sans','Product Sans',system-ui,-apple-system,sans-serif",
          fontWeight: 700,
          color: "#111111",
          fontSize: `${fontSize}px`,
          lineHeight: 1,
          letterSpacing: "0.2px",
          whiteSpace: "nowrap",
          textAlign: "center",
          background: "transparent",
          border: "0",
          outline: "0",
          boxShadow: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {name}
      </div>
    </div>
  );
}

function CertificatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData | null>(null);
  const [busy, setBusy] = useState<"pdf" | "jpeg" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = loadState();
    if (!s.form) {
      navigate({ to: "/details" });
      return;
    }
    setForm(s.form);
  }, [navigate]);

  async function renderToJpeg(): Promise<{ dataUrl: string; w: number; h: number }> {
    const node = certRef.current!;
    const targetW = TEMPLATE_W;
    const targetH = TEMPLATE_H;
    const rect = node.getBoundingClientRect();
    const scale = targetW / rect.width;

    // Dynamic import — dom-to-image-more references `Node` at module load
    // and would crash during SSR if imported at the top level.
    const mod = await import("dom-to-image-more");
    const domtoimage: any = (mod as any).default ?? mod;

    const dataUrl: string = await domtoimage.toJpeg(node, {
      width: rect.width * scale,
      height: rect.height * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      },
      bgcolor: "#ffffff",
      cacheBust: true,
      quality: 0.95,
    });
    return { dataUrl, w: targetW, h: targetH };
  }

  async function downloadJPEG() {
    if (!certRef.current || !form) return;
    setBusy("jpeg");
    setError(null);
    try {
      const { dataUrl } = await renderToJpeg();
      const link = document.createElement("a");
      link.download = `${form.fullName.replace(/\s+/g, "_")}_TFiber_Certificate.jpeg`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("JPEG download failed", e);
      setError("Could not generate image. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  async function downloadPDF() {
    if (!certRef.current || !form) return;
    setBusy("pdf");
    setError(null);
    try {
      const { dataUrl, w, h } = await renderToJpeg();
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [w, h],
        compress: true,
      });
      pdf.addImage(dataUrl, "JPEG", 0, 0, w, h);
      pdf.save(`${form.fullName.replace(/\s+/g, "_")}_TFiber_Certificate.pdf`);
    } catch (e) {
      console.error("PDF download failed", e);
      setError("Could not generate PDF. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  function startOver() {
    clearState();
    navigate({ to: "/" });
  }

  if (!form) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <button
          onClick={startOver}
          className="rounded-xl border border-border bg-card/60 px-4 py-2 text-xs font-medium text-foreground transition hover:bg-card"
        >
          Start Over
        </button>
      </header>

      <section className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-tf-green-soft px-3 py-1 text-[11px] font-semibold text-tf-green">
            🎉 Certificate Ready
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Congratulations,{" "}
            <span className="gradient-text">{form.fullName.split(" ")[0]}</span>
            !
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your official certificate has been generated. Download below.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-3xl"
        >
          <div className="rounded-3xl bg-white p-3 shadow-[var(--shadow-elegant)] ring-1 ring-border">
            <div
              ref={certRef}
              className="relative w-full overflow-hidden rounded-xl bg-white"
              style={{ aspectRatio: `${TEMPLATE_W} / ${TEMPLATE_H}` }}
            >
              <img
                src={certificateTemplate}
                alt="Certificate template"
                className="absolute inset-0 h-full w-full select-none"
                draggable={false}
                crossOrigin="anonymous"
              />
              <AutoFitName name={form.fullName} />
            </div>
          </div>
        </motion.div>

        {error && (
          <p className="mt-6 text-center text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <button
            onClick={downloadPDF}
            disabled={busy !== null}
            className="btn-glow inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-4 text-sm font-semibold disabled:opacity-60 sm:w-auto"
          >
            {busy === "pdf" ? "Preparing PDF…" : "⬇ Download as PDF"}
          </button>
          <button
            onClick={downloadJPEG}
            disabled={busy !== null}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-4 text-sm font-semibold text-foreground transition hover:bg-secondary disabled:opacity-60 sm:w-auto"
          >
            {busy === "jpeg" ? "Preparing JPEG…" : "⬇ Download as Image (JPEG)"}
          </button>
        </motion.div>

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
